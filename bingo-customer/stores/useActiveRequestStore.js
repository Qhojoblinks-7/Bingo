import { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { authClient } from '../services/api';
import { RequestStatus } from './useActiveRequestStore';

// Initial state
const initialState = {
  currentRequest: null, // { id, status, rider, eta, pickupAddress, destinationAddress, binSize, price, createdAt }
  requestHistory: [],
  isLoading: false,
  error: null,
};

// Action types
const ActionTypes = {
  SET_REQUEST: 'SET_REQUEST',
  UPDATE_REQUEST: 'UPDATE_REQUEST',
  CLEAR_REQUEST: 'CLEAR_REQUEST',
  SET_HISTORY: 'SET_HISTORY',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET: 'RESET',
};

// Reducer
function activeRequestReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_REQUEST:
      return { ...state, currentRequest: action.payload, isLoading: false };
    case ActionTypes.UPDATE_REQUEST:
      return {
        ...state,
        currentRequest: state.currentRequest
          ? { ...state.currentRequest, ...action.payload }
          : null,
        isLoading: false,
      };
    case ActionTypes.CLEAR_REQUEST:
      return { ...state, currentRequest: null };
    case ActionTypes.SET_HISTORY:
      return { ...state, requestHistory: action.payload };
    case ActionTypes.ADD_TO_HISTORY:
      return {
        ...state,
        requestHistory: [action.payload, ...state.requestHistory],
      };
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ActionTypes.RESET:
      return initialState;
    default:
      return state;
  }
}

// Create context
const ActiveRequestContext = createContext(null);

// Provider component
export function ActiveRequestProvider({ children }) {
  const [state, dispatch] = useReducer(activeRequestReducer, initialState);

  // Computed values
  const hasActiveRequest = state.currentRequest !== null;
  const isRequestInProgress = hasActiveRequest && [
    RequestStatus.PENDING,
    RequestStatus.ACCEPTED,
    RequestStatus.IN_TRANSIT,
    RequestStatus.ARRIVING,
  ].includes(state.currentRequest.status);

  // Actions
  const setRequest = (request) => {
    dispatch({ type: ActionTypes.SET_REQUEST, payload: request });
  };

  const updateRequest = (updates) => {
    dispatch({ type: ActionTypes.UPDATE_REQUEST, payload: updates });
  };

  const clearRequest = () => {
    dispatch({ type: ActionTypes.CLEAR_REQUEST });
  };

  const setHistory = (history) => {
    dispatch({ type: ActionTypes.SET_HISTORY, payload: history });
  };

  const addToHistory = (request) => {
    dispatch({ type: ActionTypes.ADD_TO_HISTORY, payload: request });
  };

  const setLoading = (isLoading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const reset = () => {
    dispatch({ type: ActionTypes.RESET });
  };

  const createRequest = async (requestData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('requests')
        .insert({
          ...requestData,
          customer_id: user.id,
          status: RequestStatus.PENDING,
        })
        .select()
        .single();

      if (error) throw error;

      const newRequest = {
        id: data.id,
        status: data.status,
        rider: data.rider_name || 'Assigned',
        eta: data.eta || 'Arriving soon',
        pickupAddress: data.address,
        binSize: data.bin_size,
        price: data.price,
        createdAt: data.created_at,
      };

      setRequest(newRequest);
      return newRequest;
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const cancelRequest = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !state.currentRequest) throw new Error('No authenticated user or active request');

      const { error } = await supabase
        .from('requests')
        .update({ status: RequestStatus.CANCELLED })
        .eq('id', state.currentRequest.id)
        .eq('customer_id', user.id);

      if (error) throw error;

      addToHistory({
        ...state.currentRequest,
        status: RequestStatus.CANCELLED,
        cancelledAt: new Date().toISOString(),
      });

      clearRequest();
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  // Fetch active request from Supabase
  const fetchActiveRequest = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('No authenticated user');
        return null;
      }

      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('customer_id', user.id)
        .in('status', [RequestStatus.PENDING, RequestStatus.ACCEPTED, RequestStatus.IN_TRANSIT, RequestStatus.ARRIVING])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        const request = {
          id: data.id,
          status: data.status,
          rider: data.rider_name || 'Assigned',
          eta: data.eta || 'Arriving soon',
          pickupAddress: data.address,
          binSize: data.bin_size,
          price: data.price,
          createdAt: data.created_at,
        };
        setRequest(request);
        return request;
      }
      return null;
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const fetchRequestHistory = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('No authenticated user');
        return [];
      }

      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
      return data || [];
    } catch (error) {
      setError(error.message);
      return [];
    }
  };

  const value = {
    ...state,
    hasActiveRequest,
    isRequestInProgress,
    setRequest,
    updateRequest,
    clearRequest,
    setHistory,
    addToHistory,
    setLoading,
    setError,
    createRequest,
    cancelRequest,
    fetchActiveRequest,
    fetchRequestHistory,
    reset,
  };

  return (
    <ActiveRequestContext.Provider value={value}>
      {children}
    </ActiveRequestContext.Provider>
  );
}

// Hook to use the store
export function useActiveRequestStore() {
  const context = useContext(ActiveRequestContext);
  if (!context) {
    throw new Error('useActiveRequestStore must be used within an ActiveRequestProvider');
  }
  return context;
}

export { ActionTypes };

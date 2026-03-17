import { createContext, useContext, useReducer } from 'react';

// Request status enum
export const RequestStatus = {
  NONE: 'none',
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_TRANSIT: 'in_transit',
  ARRIVING: 'arriving',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

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

  // Mock API calls - replace with actual API
  const createRequest = async (requestData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRequest = {
        id: Date.now().toString(),
        status: RequestStatus.PENDING,
        createdAt: new Date().toISOString(),
        ...requestData,
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (state.currentRequest) {
        addToHistory({
          ...state.currentRequest,
          status: RequestStatus.CANCELLED,
          cancelledAt: new Date().toISOString(),
        });
      }
      
      clearRequest();
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const fetchActiveRequest = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock active request or null
      // In real app, this would fetch from backend
      return state.currentRequest;
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const fetchRequestHistory = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock history
      return state.requestHistory;
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

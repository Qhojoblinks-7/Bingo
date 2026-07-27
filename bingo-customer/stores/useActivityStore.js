import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { authClient } from '../services/api';

// Activity status types - mapped to UI states
export const ActivityStatus = {
  AWAITING: 'awaiting',
  IN_TRANSIT: 'in_transit',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Activity types
export const ActivityType = {
  PICKUP: 'pickup',
  TOPUP: 'topup',
};

// Map raw Supabase request statuses to UI statuses
const mapRequestStatus = (rawStatus) => {
  switch (rawStatus) {
    case 'pending':
    case 'accepted':
      return ActivityStatus.AWAITING;
    case 'in_transit':
    case 'arriving':
      return ActivityStatus.IN_TRANSIT;
    case 'completed':
      return ActivityStatus.COMPLETED;
    case 'cancelled':
      return ActivityStatus.CANCELLED;
    default:
      return rawStatus;
  }
};

// Initial state
const initialState = {
  // Activity list
  activities: [],
  
  // Current activity details
  currentActivity: null,
  
  // UI state
  activeTab: 'active', // 'active' or 'history'
  isLoading: false,
  error: null,
  
  // Selected item for sheets
  selectedItem: null,
  showProofSheet: false,
  showTransactionSheet: false,
};

// Action types
const ActionTypes = {
  SET_ACTIVITIES: 'SET_ACTIVITIES',
  ADD_ACTIVITY: 'ADD_ACTIVITY',
  UPDATE_ACTIVITY: 'UPDATE_ACTIVITY',
  SET_CURRENT_ACTIVITY: 'SET_CURRENT_ACTIVITY',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SELECTED_ITEM: 'SET_SELECTED_ITEM',
  SET_SHOW_PROOF_SHEET: 'SET_SHOW_PROOF_SHEET',
  SET_SHOW_TRANSACTION_SHEET: 'SET_SHOW_TRANSACTION_SHEET',
  RESET: 'RESET',
};

// Reducer
function activityReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_ACTIVITIES:
      return { ...state, activities: action.payload, isLoading: false };
    case ActionTypes.ADD_ACTIVITY:
      return { ...state, activities: [action.payload, ...state.activities] };
    case ActionTypes.UPDATE_ACTIVITY:
      return {
        ...state,
        activities: state.activities.map(activity =>
          activity.id === action.payload.id
            ? { ...activity, ...action.payload }
            : activity
        ),
        currentActivity: state.currentActivity?.id === action.payload.id
          ? { ...state.currentActivity, ...action.payload }
          : state.currentActivity,
      };
    case ActionTypes.SET_CURRENT_ACTIVITY:
      return { ...state, currentActivity: action.payload, isLoading: false };
    case ActionTypes.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ActionTypes.SET_SELECTED_ITEM:
      return { ...state, selectedItem: action.payload };
    case ActionTypes.SET_SHOW_PROOF_SHEET:
      return { ...state, showProofSheet: action.payload };
    case ActionTypes.SET_SHOW_TRANSACTION_SHEET:
      return { ...state, showTransactionSheet: action.payload };
    case ActionTypes.RESET:
      return initialState;
    default:
      return state;
  }
}

// Create context
const ActivityContext = createContext(null);

// Provider component
export function ActivityProvider({ children }) {
  const [state, dispatch] = useReducer(activityReducer, initialState);

  // Computed values
  const activeActivities = useMemo(
    () =>
      state.activities.filter(
        activity => activity.status === ActivityStatus.AWAITING || activity.status === ActivityStatus.IN_TRANSIT
      ),
    [state.activities]
  );

  const completedActivities = useMemo(
    () =>
      state.activities.filter(
        activity =>
          activity.status === ActivityStatus.COMPLETED ||
          activity.status === ActivityStatus.CANCELLED ||
          activity.type === ActivityType.TOPUP
      ),
    [state.activities]
  );

  const filteredActivities = useMemo(
    () => (state.activeTab === 'active' ? activeActivities : completedActivities),
    [state.activeTab, activeActivities, completedActivities]
  );

  // Actions
  const setActivities = useCallback((activities) => {
    dispatch({ type: ActionTypes.SET_ACTIVITIES, payload: activities });
  }, []);

  const addActivity = useCallback((activity) => {
    dispatch({ type: ActionTypes.ADD_ACTIVITY, payload: activity });
  }, []);

  const updateActivity = useCallback((updates) => {
    dispatch({ type: ActionTypes.UPDATE_ACTIVITY, payload: updates });
  }, []);

  const setCurrentActivity = useCallback((activity) => {
    dispatch({ type: ActionTypes.SET_CURRENT_ACTIVITY, payload: activity });
  }, []);

  const setActiveTab = useCallback((tab) => {
    dispatch({ type: ActionTypes.SET_ACTIVE_TAB, payload: tab });
  }, []);

  const setLoading = useCallback((isLoading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  }, []);

  const setSelectedItem = useCallback((item) => {
    dispatch({ type: ActionTypes.SET_SELECTED_ITEM, payload: item });
  }, []);

  const setShowProofSheet = useCallback((show) => {
    dispatch({ type: ActionTypes.SET_SHOW_PROOF_SHEET, payload: show });
  }, []);

  const setShowTransactionSheet = useCallback((show) => {
    dispatch({ type: ActionTypes.SET_SHOW_TRANSACTION_SHEET, payload: show });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: ActionTypes.RESET });
  }, []);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('No authenticated user');
        return;
      }

      const { data: requests, error: requestsError } = await supabase
        .from('requests')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('customer_id', user.id)
        .eq('type', 'topup')
        .order('created_at', { ascending: false });

      if (txError) throw txError;

      const mappedActivities = [
        ...(requests || []).map(r => ({
          id: r.id,
          status: mapRequestStatus(r.status),
          date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
          address: r.address || 'N/A',
          price: r.price ? r.price.toString() : '0',
          type: ActivityType.PICKUP,
          eta: r.eta || null,
          binSize: r.bin_size || null,
          rider: r.rider_name || r.rider_phone ? {
            name: r.rider_name || 'Assigned',
            phone: r.rider_phone || 'N/A',
          } : null,
          completedAt: r.completed_at ? new Date(r.completed_at).toLocaleString() : null,
        })),
        ...(transactions || []).map(t => ({
          id: t.id,
          status: t.status || 'success',
          date: t.created_at ? new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
          amount: t.amount ? t.amount.toString() : '0',
          type: ActivityType.TOPUP,
          method: t.payment_method || 'momo',
        })),
      ];

      setActivities(mappedActivities);
    } catch (error) {
      setError(error.message);
    }
  }, [setLoading, setError, setActivities]);

  const fetchActivityById = useCallback(
    async id => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('No authenticated user');
          return null;
        }

        const { data: request } = await supabase
          .from('requests')
          .select('*')
          .eq('id', id)
          .eq('customer_id', user.id)
          .single();

        if (request) {
          const activity = {
            id: request.id,
            type: ActivityType.PICKUP,
            status: mapRequestStatus(request.status),
            statusText: request.status,
            date: request.created_at
              ? new Date(request.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'N/A',
            time: request.created_at
              ? new Date(request.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              : 'N/A',
            address: request.address || 'N/A',
            price: request.price ? request.price.toString() : '0',
            binSize: request.bin_size || 'N/A',
            eta: request.eta || null,
            rider: request.rider_name || request.rider_phone
              ? { name: request.rider_name || 'Assigned', phone: request.rider_phone || 'N/A' }
              : null,
            completedAt: request.completed_at ? new Date(request.completed_at).toLocaleString() : null,
          };
          setCurrentActivity(activity);
          return activity;
        }

        const { data: transaction } = await supabase
          .from('transactions')
          .select('*')
          .eq('id', id)
          .eq('customer_id', user.id)
          .single();

        if (transaction) {
          const activity = {
            id: transaction.id,
            type: ActivityType.TOPUP,
            status: transaction.status || 'success',
            statusText: transaction.status || 'success',
            date: transaction.created_at
              ? new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'N/A',
            time: transaction.created_at
              ? new Date(transaction.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              : 'N/A',
            amount: transaction.amount ? transaction.amount.toString() : '0',
            method: transaction.payment_method || 'momo',
          };
          setCurrentActivity(activity);
          return activity;
        }

        setError('Activity not found');
        return null;
      } catch (error) {
        setError(error.message);
        return null;
      }
    },
    [setLoading, setError, setCurrentActivity]
  );

  const value = {
    ...state,
    activeActivities,
    completedActivities,
    filteredActivities,
    setActivities,
    addActivity,
    updateActivity,
    setCurrentActivity,
    setActiveTab,
    setLoading,
    setError,
    setSelectedItem,
    setShowProofSheet,
    setShowTransactionSheet,
    fetchActivities,
    fetchActivityById,
    reset,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

// Hook to use the store
export function useActivityStore() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivityStore must be used within an ActivityProvider');
  }
  return context;
}

export { ActionTypes };

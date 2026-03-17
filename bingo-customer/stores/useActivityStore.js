import { createContext, useContext, useReducer } from 'react';

// Activity status types
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
  const activeActivities = state.activities.filter(
    activity => activity.status === ActivityStatus.AWAITING || 
                activity.status === ActivityStatus.IN_TRANSIT
  );
  
  const completedActivities = state.activities.filter(
    activity => activity.status === ActivityStatus.COMPLETED || 
                activity.status === ActivityStatus.CANCELLED ||
                activity.type === ActivityType.TOPUP
  );
  
  const filteredActivities = state.activeTab === 'active' 
    ? activeActivities 
    : completedActivities;

  // Actions
  const setActivities = (activities) => {
    dispatch({ type: ActionTypes.SET_ACTIVITIES, payload: activities });
  };

  const addActivity = (activity) => {
    dispatch({ type: ActionTypes.ADD_ACTIVITY, payload: activity });
  };

  const updateActivity = (updates) => {
    dispatch({ type: ActionTypes.UPDATE_ACTIVITY, payload: updates });
  };

  const setCurrentActivity = (activity) => {
    dispatch({ type: ActionTypes.SET_CURRENT_ACTIVITY, payload: activity });
  };

  const setActiveTab = (tab) => {
    dispatch({ type: ActionTypes.SET_ACTIVE_TAB, payload: tab });
  };

  const setLoading = (isLoading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const setSelectedItem = (item) => {
    dispatch({ type: ActionTypes.SET_SELECTED_ITEM, payload: item });
  };

  const setShowProofSheet = (show) => {
    dispatch({ type: ActionTypes.SET_SHOW_PROOF_SHEET, payload: show });
  };

  const setShowTransactionSheet = (show) => {
    dispatch({ type: ActionTypes.SET_SHOW_TRANSACTION_SHEET, payload: show });
  };

  const reset = () => {
    dispatch({ type: ActionTypes.RESET });
  };

  // Fetch activities
  const fetchActivities = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockActivities = [
        { id: '1', status: ActivityStatus.AWAITING, date: 'Today, 2:30 PM', address: 'GA-123-4567', price: '20', type: ActivityType.PICKUP },
        { id: '2', status: ActivityStatus.COMPLETED, date: 'Mar 14, 2026', address: 'GA-099-1234', price: '40', type: ActivityType.PICKUP },
        { id: '3', status: ActivityStatus.COMPLETED, date: 'Mar 10, 2026', address: 'GA-123-4567', price: '20', type: ActivityType.PICKUP },
        { id: 'TXN001', status: 'success', date: 'Mar 15, 2026', amount: '50', type: ActivityType.TOPUP, method: 'momo' },
        { id: 'TXN002', status: 'success', date: 'Mar 12, 2026', amount: '20', type: ActivityType.TOPUP, method: 'card' },
      ];
      
      setActivities(mockActivities);
    } catch (error) {
      setError(error.message);
    }
  };

  // Fetch single activity by ID
  const fetchActivityById = async (id) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In production, fetch from API
      const activity = state.activities.find(a => a.id === id);
      setCurrentActivity(activity);
      return activity;
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

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

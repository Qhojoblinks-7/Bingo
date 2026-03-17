import { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  // Notification state
  showNotifications: false,
  notifications: [],
  unreadCount: 0,
  
  // Header customization
  headerTitle: '',
  headerRightAction: null,
  
  // Loading state
  isLoading: false,
};

// Action types
const ActionTypes = {
  SET_SHOW_NOTIFICATIONS: 'SET_SHOW_NOTIFICATIONS',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
  SET_HEADER_TITLE: 'SET_HEADER_TITLE',
  SET_HEADER_RIGHT_ACTION: 'SET_HEADER_RIGHT_ACTION',
  SET_LOADING: 'SET_LOADING',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  RESET: 'RESET',
};

// Reducer
function headerReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_SHOW_NOTIFICATIONS:
      return { ...state, showNotifications: action.payload };
      
    case ActionTypes.SET_NOTIFICATIONS:
      return { ...state, notifications: action.payload };
      
    case ActionTypes.SET_UNREAD_COUNT:
      return { ...state, unreadCount: action.payload };
      
    case ActionTypes.SET_HEADER_TITLE:
      return { ...state, headerTitle: action.payload };
      
    case ActionTypes.SET_HEADER_RIGHT_ACTION:
      return { ...state, headerRightAction: action.payload };
      
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
      
    case ActionTypes.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map((notif, index) =>
          index === action.payload ? { ...notif, read: true } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
      
    case ActionTypes.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };
      
    case ActionTypes.RESET:
      return initialState;
      
    default:
      return state;
  }
}

// Create context
const HeaderContext = createContext(null);

// Provider component
export function HeaderProvider({ children }) {
  const [state, dispatch] = useReducer(headerReducer, initialState);

  // Actions
  const setShowNotifications = (show) => {
    dispatch({ type: ActionTypes.SET_SHOW_NOTIFICATIONS, payload: show });
  };

  const setNotifications = (notifications) => {
    dispatch({ type: ActionTypes.SET_NOTIFICATIONS, payload: notifications });
  };

  const setUnreadCount = (count) => {
    dispatch({ type: ActionTypes.SET_UNREAD_COUNT, payload: count });
  };

  const setHeaderTitle = (title) => {
    dispatch({ type: ActionTypes.SET_HEADER_TITLE, payload: title });
  };

  const setHeaderRightAction = (action) => {
    dispatch({ type: ActionTypes.SET_HEADER_RIGHT_ACTION, payload: action });
  };

  const setLoading = (isLoading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
  };

  const markNotificationRead = (index) => {
    dispatch({ type: ActionTypes.MARK_NOTIFICATION_READ, payload: index });
  };

  const clearNotifications = () => {
    dispatch({ type: ActionTypes.CLEAR_NOTIFICATIONS });
  };

  const reset = () => {
    dispatch({ type: ActionTypes.RESET });
  };

  // Fetch notifications (simulated)
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock notifications data
      const mockNotifications = [
        {
          id: '1',
          title: 'Pickup Confirmed',
          message: 'Your waste pickup has been confirmed for tomorrow at 9:00 AM',
          time: '2 hours ago',
          read: false,
          type: 'success',
        },
        {
          id: '2',
          title: 'Rider Arriving',
          message: 'Your rider John is 5 minutes away',
          time: '1 hour ago',
          read: false,
          type: 'info',
        },
        {
          id: '3',
          title: 'Payment Received',
          message: 'Payment of GH₵40 has been received',
          time: '1 day ago',
          read: true,
          type: 'success',
        },
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    ...state,
    setShowNotifications,
    setNotifications,
    setUnreadCount,
    setHeaderTitle,
    setHeaderRightAction,
    setLoading,
    markNotificationRead,
    clearNotifications,
    fetchNotifications,
    reset,
  };

  return (
    <HeaderContext.Provider value={value}>
      {children}
    </HeaderContext.Provider>
  );
}

// Hook to use the store
export function useHeaderStore() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeaderStore must be used within a HeaderProvider');
  }
  return context;
}

export { ActionTypes };

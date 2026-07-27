import { createContext, useContext, useReducer, useCallback } from 'react';
import { supabase } from '../lib/supabase';

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

  const setNotifications = useCallback((notifications) => {
    dispatch({ type: ActionTypes.SET_NOTIFICATIONS, payload: notifications });
  }, []);

  const setUnreadCount = useCallback((count) => {
    dispatch({ type: ActionTypes.SET_UNREAD_COUNT, payload: count });
  }, []);

  const setHeaderTitle = useCallback((title) => {
    dispatch({ type: ActionTypes.SET_HEADER_TITLE, payload: title });
  }, []);

  const setHeaderRightAction = useCallback((action) => {
    dispatch({ type: ActionTypes.SET_HEADER_RIGHT_ACTION, payload: action });
  }, []);

  const setLoading = useCallback((isLoading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
  }, []);

  const markNotificationRead = useCallback((index) => {
    dispatch({ type: ActionTypes.MARK_NOTIFICATION_READ, payload: index });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_NOTIFICATIONS });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: ActionTypes.RESET });
  }, []);

  const formatTimeAgo = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  // Fetch notifications from Supabase
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const notifications = [];

      // Fetch latest requests
      const { data: requests } = await supabase
        .from('requests')
        .select('id, status, created_at, address')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (requests) {
        requests.forEach((request) => {
          notifications.push({
            id: `req-${request.id}`,
            title: 'Pickup Request',
            message: `Your request for ${request.address || 'your location'} is ${request.status.replace('_', ' ')}`,
            time: formatTimeAgo(request.created_at),
            createdAt: request.created_at,
            read: request.status === 'completed' || request.status === 'cancelled',
            type: request.status === 'completed' ? 'success' : 'info',
            icon: request.status === 'completed' ? 'checkmark-circle' : 'time',
            color: request.status === 'completed' ? '#10B981' : '#F59E0B',
          });
        });
      }

      // Fetch latest transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('id, type, amount, status, created_at, payment_method')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (transactions) {
        transactions.forEach((transaction) => {
          const isTopUp = transaction.type === 'topup';
          notifications.push({
            id: `txn-${transaction.id}`,
            title: isTopUp ? 'Top-up Successful' : 'Payment',
            message: isTopUp
              ? `GH₵ ${parseFloat(transaction.amount).toFixed(2)} added to your wallet`
              : `GH₵ ${parseFloat(transaction.amount).toFixed(2)} payment processed`,
            time: formatTimeAgo(transaction.created_at),
            createdAt: transaction.created_at,
            read: transaction.status === 'completed' || transaction.status === 'failed',
            type: transaction.status === 'completed' ? 'success' : 'info',
            icon: isTopUp ? 'wallet' : 'card',
            color: '#3B82F6',
          });
        });
      }

      // Fetch latest support tickets
      const { data: tickets } = await supabase
        .from('support_tickets')
        .select('id, subject, status, created_at')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (tickets) {
        tickets.forEach((ticket) => {
          notifications.push({
            id: `ticket-${ticket.id}`,
            title: 'Support Update',
            message: ticket.subject,
            time: formatTimeAgo(ticket.created_at),
            createdAt: ticket.created_at,
            read: ticket.status === 'resolved' || ticket.status === 'closed',
            type: ticket.status === 'resolved' || ticket.status === 'closed' ? 'success' : 'info',
            icon: 'help-circle',
            color: '#8B5CF6',
          });
        });
      }

      // Sort by newest first using actual timestamp
      notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setNotifications(notifications);
      setUnreadCount(notifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setNotifications, setUnreadCount, formatTimeAgo]);

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

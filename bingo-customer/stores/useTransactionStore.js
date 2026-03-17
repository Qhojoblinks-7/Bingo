import { createContext, useContext, useReducer } from 'react';

// Transaction status
export const TransactionStatus = {
  SUCCESS: 'success',
  PENDING: 'pending',
  FAILED: 'failed',
};

// Transaction type
export const TransactionType = {
  TOPUP: 'topup',
  PAYMENT: 'payment',
};

// Initial state
const initialState = {
  // Current transaction details
  currentTransaction: null,
  
  // Transaction details
  transactionId: '',
  amount: '',
  date: '',
  time: '',
  method: '', // 'momo', 'card', 'wallet'
  status: '',
  type: '', // 'topup', 'payment'
  
  // UI state
  isLoading: false,
  error: null,
};

// Action types
const ActionTypes = {
  SET_TRANSACTION: 'SET_TRANSACTION',
  SET_TRANSACTION_DETAILS: 'SET_TRANSACTION_DETAILS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET: 'RESET',
};

// Reducer
function transactionReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_TRANSACTION:
      return { ...state, ...action.payload, isLoading: false };
    case ActionTypes.SET_TRANSACTION_DETAILS:
      return { 
        ...state, 
        transactionId: action.payload.transactionId || '',
        amount: action.payload.amount || '',
        date: action.payload.date || '',
        time: action.payload.time || '',
        method: action.payload.method || '',
        status: action.payload.status || '',
        type: action.payload.type || '',
        isLoading: false,
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
const TransactionContext = createContext(null);

// Provider component
export function TransactionProvider({ children }) {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Computed values
  const isTopUp = state.type === TransactionType.TOPUP;
  
  const getStatusColor = () => {
    switch (state.status) {
      case TransactionStatus.SUCCESS:
        return '#10B981'; // Green
      case TransactionStatus.PENDING:
        return '#F59E0B'; // Amber
      case TransactionStatus.FAILED:
        return '#EF4444'; // Red
      default:
        return '#6B7280';
    }
  };
  
  const getStatusIcon = () => {
    switch (state.status) {
      case TransactionStatus.SUCCESS:
        return 'checkmark-circle';
      case TransactionStatus.PENDING:
        return 'time';
      case TransactionStatus.FAILED:
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const getMethodName = () => {
    switch (state.method) {
      case 'momo':
        return 'Mobile Money';
      case 'card':
        return 'Debit Card';
      case 'wallet':
        return 'BinGo Wallet';
      default:
        return 'Unknown';
    }
  };

  // Actions
  const setTransaction = (transaction) => {
    dispatch({ type: ActionTypes.SET_TRANSACTION, payload: transaction });
  };

  const setTransactionDetails = (details) => {
    dispatch({ type: ActionTypes.SET_TRANSACTION_DETAILS, payload: details });
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

  // Load from activity item
  const loadFromActivity = (item) => {
    if (!item) return;

    setTransactionDetails({
      transactionId: item.id,
      amount: item.price || item.amount || '',
      date: item.date || '',
      time: item.time || '',
      method: item.method || 'momo',
      status: item.status === 'active' ? TransactionStatus.PENDING : (item.status || TransactionStatus.SUCCESS),
      type: item.type === TransactionType.TOPUP || item.type === 'topup' ? TransactionType.TOPUP : TransactionType.PAYMENT,
    });
  };

  const value = {
    ...state,
    isTopUp,
    getStatusColor,
    getStatusIcon,
    getMethodName,
    setTransaction,
    setTransactionDetails,
    setLoading,
    setError,
    loadFromActivity,
    reset,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

// Hook to use the store
export function useTransactionStore() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionStore must be used within a TransactionProvider');
  }
  return context;
}

export { ActionTypes };

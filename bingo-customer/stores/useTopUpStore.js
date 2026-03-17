import { createContext, useContext, useReducer } from 'react';

// TopUp method types
export const TopUpMethods = {
  MOBILE_MONEY: 'momo',
  CARD: 'card',
};

// Quick amount options
export const QuickAmounts = [10, 20, 50, 100];

// Initial state
const initialState = {
  amount: '',
  method: TopUpMethods.MOBILE_MONEY,
  isProcessing: false,
  error: null,
  transactionDetails: null,
};

// Action types
const ActionTypes = {
  SET_AMOUNT: 'SET_AMOUNT',
  SET_METHOD: 'SET_METHOD',
  SET_PROCESSING: 'SET_PROCESSING',
  SET_ERROR: 'SET_ERROR',
  SET_TRANSACTION_DETAILS: 'SET_TRANSACTION_DETAILS',
  RESET: 'RESET',
};

// Reducer
function topUpReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_AMOUNT:
      return { ...state, amount: action.payload };
    case ActionTypes.SET_METHOD:
      return { ...state, method: action.payload };
    case ActionTypes.SET_PROCESSING:
      return { ...state, isProcessing: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isProcessing: false };
    case ActionTypes.SET_TRANSACTION_DETAILS:
      return { ...state, transactionDetails: action.payload, isProcessing: false };
    case ActionTypes.RESET:
      return initialState;
    default:
      return state;
  }
}

// Create context
const TopUpContext = createContext(null);

// Provider component
export function TopUpProvider({ children }) {
  const [state, dispatch] = useReducer(topUpReducer, initialState);

  // Computed values
  const amount = parseFloat(state.amount) || 0;
  const isValidAmount = amount > 0;

  const getMethodName = () => {
    switch (state.method) {
      case TopUpMethods.MOBILE_MONEY:
        return 'Mobile Money';
      case TopUpMethods.CARD:
        return 'Debit Card';
      default:
        return 'Mobile Money';
    }
  };

  const getMethodSubtitle = () => {
    switch (state.method) {
      case TopUpMethods.MOBILE_MONEY:
        return 'MTN, Telecel, AirtelTigo';
      case TopUpMethods.CARD:
        return 'Visa, Mastercard';
      default:
        return 'MTN, Telecel, AirtelTigo';
    }
  };

  // Actions
  const setAmount = (amount) => {
    // Only allow numeric input
    const numericValue = amount.replace(/[^0-9]/g, '');
    dispatch({ type: ActionTypes.SET_AMOUNT, payload: numericValue });
  };

  const setMethod = (method) => {
    dispatch({ type: ActionTypes.SET_METHOD, payload: method });
  };

  const setProcessing = (isProcessing) => {
    dispatch({ type: ActionTypes.SET_PROCESSING, payload: isProcessing });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const setTransactionDetails = (details) => {
    dispatch({ type: ActionTypes.SET_TRANSACTION_DETAILS, payload: details });
  };

  const reset = () => {
    dispatch({ type: ActionTypes.RESET });
  };

  // Process top-up
  const processTopUp = async () => {
    if (!isValidAmount) {
      setError('Please enter a valid amount');
      return false;
    }

    setProcessing(true);
    setError(null);

    try {
      // Simulate API call to payment provider (Paystack, etc.)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create transaction details
      const transactionDetails = {
        id: `TXN${Date.now()}`,
        amount: amount,
        method: state.method,
        methodName: getMethodName(),
        status: 'success',
        createdAt: new Date().toISOString(),
      };

      setTransactionDetails(transactionDetails);
      return transactionDetails;
    } catch (error) {
      setError(error.message || 'Failed to process top-up. Please try again.');
      return null;
    }
  };

  const value = {
    ...state,
    amount,
    isValidAmount,
    getMethodName,
    getMethodSubtitle,
    setAmount,
    setMethod,
    setProcessing,
    setError,
    setTransactionDetails,
    processTopUp,
    reset,
  };

  return (
    <TopUpContext.Provider value={value}>
      {children}
    </TopUpContext.Provider>
  );
}

// Hook to use the store
export function useTopUpStore() {
  const context = useContext(TopUpContext);
  if (!context) {
    throw new Error('useTopUpStore must be used within a TopUpProvider');
  }
  return context;
}

export { ActionTypes };

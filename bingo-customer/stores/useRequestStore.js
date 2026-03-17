import { createContext, useContext, useReducer } from 'react';

// Bin size options
export const BinSizes = {
  STANDARD: { id: 'standard', label: 'Standard', price: 20, capacity: '60L', description: 'Perfect for small households' },
  LARGE: { id: 'large', label: 'Large', price: 40, capacity: '120L', description: 'Ideal for medium households' },
  EXTRA_LARGE: { id: 'extra-large', label: 'Extra Large', price: 60, capacity: '240L', description: 'Best for large households' },
};

// Payment methods
export const PaymentMethods = {
  MOBILE_MONEY: 'momo',
  WALLET: 'wallet',
  CARD: 'card',
};

// Initial state
const initialState = {
  // Pickup details
  address: '',
  binSize: BinSizes.STANDARD.id,
  notes: '',
  
  // Payment details
  paymentMethod: PaymentMethods.MOBILE_MONEY,
  
  // UI state
  isProcessing: false,
  error: null,
  requestDetails: null, // Created request details
};

// Action types
const ActionTypes = {
  SET_ADDRESS: 'SET_ADDRESS',
  SET_BIN_SIZE: 'SET_BIN_SIZE',
  SET_NOTES: 'SET_NOTES',
  SET_PAYMENT_METHOD: 'SET_PAYMENT_METHOD',
  SET_PROCESSING: 'SET_PROCESSING',
  SET_ERROR: 'SET_ERROR',
  SET_REQUEST_DETAILS: 'SET_REQUEST_DETAILS',
  RESET: 'RESET',
};

// Reducer
function requestReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_ADDRESS:
      return { ...state, address: action.payload };
    case ActionTypes.SET_BIN_SIZE:
      return { ...state, binSize: action.payload };
    case ActionTypes.SET_NOTES:
      return { ...state, notes: action.payload };
    case ActionTypes.SET_PAYMENT_METHOD:
      return { ...state, paymentMethod: action.payload };
    case ActionTypes.SET_PROCESSING:
      return { ...state, isProcessing: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isProcessing: false };
    case ActionTypes.SET_REQUEST_DETAILS:
      return { ...state, requestDetails: action.payload, isProcessing: false };
    case ActionTypes.RESET:
      return initialState;
    default:
      return state;
  }
}

// Create context
const RequestContext = createContext(null);

// Provider component
export function RequestProvider({ children }) {
  const [state, dispatch] = useReducer(requestReducer, initialState);

  // Computed values
  const selectedBin = Object.values(BinSizes).find(bin => bin.id === state.binSize) || BinSizes.STANDARD;
  const totalPrice = selectedBin.price;

  // Actions
  const setAddress = (address) => {
    dispatch({ type: ActionTypes.SET_ADDRESS, payload: address });
  };

  const setBinSize = (binSize) => {
    dispatch({ type: ActionTypes.SET_BIN_SIZE, payload: binSize });
  };

  const setNotes = (notes) => {
    dispatch({ type: ActionTypes.SET_NOTES, payload: notes });
  };

  const setPaymentMethod = (paymentMethod) => {
    dispatch({ type: ActionTypes.SET_PAYMENT_METHOD, payload: paymentMethod });
  };

  const setProcessing = (isProcessing) => {
    dispatch({ type: ActionTypes.SET_PROCESSING, payload: isProcessing });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const setRequestDetails = (details) => {
    dispatch({ type: ActionTypes.SET_REQUEST_DETAILS, payload: details });
  };

  const reset = () => {
    dispatch({ type: ActionTypes.RESET });
  };

  // Submit pickup request
  const submitRequest = async (walletBalance) => {
    setProcessing(true);
    setError(null);

    try {
      // Check wallet balance if using wallet
      if (state.paymentMethod === PaymentMethods.WALLET) {
        const balance = parseFloat(walletBalance || '0');
        if (balance < totalPrice) {
          throw new Error('Insufficient balance. Please top up your wallet.');
        }
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create request details
      const requestDetails = {
        id: Date.now().toString(),
        address: state.address,
        binSize: selectedBin,
        notes: state.notes,
        paymentMethod: state.paymentMethod,
        price: totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      setRequestDetails(requestDetails);
      return requestDetails;
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const value = {
    ...state,
    selectedBin,
    totalPrice,
    setAddress,
    setBinSize,
    setNotes,
    setPaymentMethod,
    setProcessing,
    setError,
    setRequestDetails,
    submitRequest,
    reset,
  };

  return (
    <RequestContext.Provider value={value}>
      {children}
    </RequestContext.Provider>
  );
}

// Hook to use the store
export function useRequestStore() {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequestStore must be used within a RequestProvider');
  }
  return context;
}

export { ActionTypes };

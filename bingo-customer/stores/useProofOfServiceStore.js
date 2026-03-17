import { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  // Current proof of service data
  currentProof: null,
  
  // Rider info
  riderName: '',
  riderPhone: '',
  
  // Proof details
  proofImage: null,
  completedAt: null,
  
  // UI state
  isLoading: false,
  error: null,
};

// Action types
const ActionTypes = {
  SET_PROOF: 'SET_PROOF',
  SET_RIDER_INFO: 'SET_RIDER_INFO',
  SET_PROOF_IMAGE: 'SET_PROOF_IMAGE',
  SET_COMPLETED_AT: 'SET_COMPLETED_AT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET: 'RESET',
};

// Reducer
function proofOfServiceReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_PROOF:
      return { ...state, ...action.payload, isLoading: false };
    case ActionTypes.SET_RIDER_INFO:
      return { ...state, riderName: action.payload.name, riderPhone: action.payload.phone };
    case ActionTypes.SET_PROOF_IMAGE:
      return { ...state, proofImage: action.payload };
    case ActionTypes.SET_COMPLETED_AT:
      return { ...state, completedAt: action.payload };
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
const ProofOfServiceContext = createContext(null);

// Provider component
export function ProofOfServiceProvider({ children }) {
  const [state, dispatch] = useReducer(proofOfServiceReducer, initialState);

  // Actions
  const setProof = (proof) => {
    dispatch({ type: ActionTypes.SET_PROOF, payload: proof });
  };

  const setRiderInfo = (name, phone) => {
    dispatch({ type: ActionTypes.SET_RIDER_INFO, payload: { name, phone } });
  };

  const setProofImage = (image) => {
    dispatch({ type: ActionTypes.SET_PROOF_IMAGE, payload: image });
  };

  const setCompletedAt = (completedAt) => {
    dispatch({ type: ActionTypes.SET_COMPLETED_AT, payload: completedAt });
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

  // Load proof from activity
  const loadFromActivity = (activity) => {
    if (!activity) return;

    setProof({
      id: activity.id,
      riderName: activity.rider?.name || 'Assigned Rider',
      riderPhone: activity.rider?.phone || '',
      proofImage: activity.proofImage,
      completedAt: activity.completedAt || activity.date,
      status: activity.status,
      address: activity.address,
      price: activity.price,
      binSize: activity.binSize,
    });
  };

  const value = {
    ...state,
    setProof,
    setRiderInfo,
    setProofImage,
    setCompletedAt,
    setLoading,
    setError,
    loadFromActivity,
    reset,
  };

  return (
    <ProofOfServiceContext.Provider value={value}>
      {children}
    </ProofOfServiceContext.Provider>
  );
}

// Hook to use the store
export function useProofOfServiceStore() {
  const context = useContext(ProofOfServiceContext);
  if (!context) {
    throw new Error('useProofOfServiceStore must be used within a ProofOfServiceProvider');
  }
  return context;
}

export { ActionTypes };

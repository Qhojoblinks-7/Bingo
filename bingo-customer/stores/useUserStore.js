import { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  id: null,
  name: 'Immanuel',
  email: 'immanuel@bingo.com.gh',
  phone: '',
  avatar: null,
  lastPickup: '2 days ago',
  isLoading: false,
  error: null,
};

// Action types
const ActionTypes = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  SET_LAST_PICKUP: 'SET_LAST_PICKUP',
  RESET: 'RESET',
};

// Reducer
function userReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return { ...state, ...action.payload, isLoading: false };
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ActionTypes.UPDATE_PROFILE:
      return { ...state, ...action.payload };
    case ActionTypes.SET_LAST_PICKUP:
      return { ...state, lastPickup: action.payload };
    case ActionTypes.RESET:
      return initialState;
    default:
      return state;
  }
}

// Create context
const UserContext = createContext(null);

// Provider component
export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Actions
  const setUser = (userData) => {
    dispatch({ type: ActionTypes.SET_USER, payload: userData });
  };

  const setLoading = (isLoading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const updateProfile = (profileData) => {
    dispatch({ type: ActionTypes.UPDATE_PROFILE, payload: profileData });
  };

  const setLastPickup = (lastPickup) => {
    dispatch({ type: ActionTypes.SET_LAST_PICKUP, payload: lastPickup });
  };

  const reset = () => {
    dispatch({ type: ActionTypes.RESET });
  };

  // Mock API call - replace with actual API
  const fetchUser = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser({
        id: '1',
        name: 'Immanuel',
        email: 'immanuel@bingo.com.gh',
        phone: '+233123456789',
        lastPickup: '2 days ago',
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const value = {
    ...state,
    setUser,
    setLoading,
    setError,
    updateProfile,
    setLastPickup,
    fetchUser,
    reset,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Hook to use the store
export function useUserStore() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserStore must be used within a UserProvider');
  }
  return context;
}

export { ActionTypes };

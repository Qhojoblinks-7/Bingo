import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { authClient } from '../services/api';
import { STORAGE_KEYS } from '../constants/Config';

const initialState = {
  id: null,
  name: '',
  email: '',
  phone: '',
  avatar: null,
  lastPickup: null,
  totalPickups: 0,
  isLoading: false,
  error: null,
};

const ActionTypes = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  SET_LAST_PICKUP: 'SET_LAST_PICKUP',
  SET_TOTAL_PICKUPS: 'SET_TOTAL_PICKUPS',
  RESET: 'RESET',
};

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
    case ActionTypes.SET_TOTAL_PICKUPS:
      return { ...state, totalPickups: action.payload };
    case ActionTypes.RESET:
      return initialState;
    default:
      return state;
  }
}

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const setUser = (userData) => {
    dispatch({ type: ActionTypes.SET_USER, payload: userData });
  };

  const setLoading = (isLoading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const updateProfile = async (profileData) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('customers')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: ActionTypes.SET_USER, payload: { ...data, id: data.id } });
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      return { success: true };
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      dispatch({ type: ActionTypes.SET_USER, payload: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || data.user.email,
        phone: data.user.phone || '',
      }});
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      return { success: true };
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, fullName) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }}});
      if (error) throw error;

      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      return { success: true, user: data.user };
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: ActionTypes.LOGOUT });
    }
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('No authenticated user');
        return;
      }

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setUser({
        id: data.id,
        name: data.full_name || data.email,
        email: data.email,
        phone: data.phone || '',
        avatar: data.avatar_url || null,
        lastPickup: data.last_pickup_at ? new Date(data.last_pickup_at).toLocaleDateString() : null,
        totalPickups: data.total_pickups || 0,
      });
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser();
      } else {
        reset();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: ActionTypes.RESET });
  }, []);

  const value = {
    ...state,
    setUser,
    setLoading,
    setError,
    updateProfile,
    login,
    register,
    logout,
    fetchUser,
    reset,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserStore() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserStore must be used within a UserProvider');
  }
  return context;
}

export { ActionTypes };
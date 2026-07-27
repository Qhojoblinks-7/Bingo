import { createContext, useContext, useReducer, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Initial state
const initialState = {
  // User profile data
  user: {
    id: null,
    name: '',
    email: '',
    phone: '',
    avatar: null,
    memberSince: '',
    totalPickups: 0,
  },
  
  // Settings
  notificationsEnabled: true,
  themeMode: 'device', // 'light', 'dark', 'device'
  
  // Navigation state for screens
  currentScreen: null,
  
  // Sheet states
  showProfileSheet: false,
  
  // Loading states
  isLoading: false,
  isUpdating: false,
  
  // Error state
  error: null,
};

// Action types
const ActionTypes = {
  SET_USER: 'SET_USER',
  SET_NOTIFICATIONS_ENABLED: 'SET_NOTIFICATIONS_ENABLED',
  SET_THEME_MODE: 'SET_THEME_MODE',
  SET_CURRENT_SCREEN: 'SET_CURRENT_SCREEN',
  SET_SHOW_PROFILE_SHEET: 'SET_SHOW_PROFILE_SHEET',
  SET_LOADING: 'SET_LOADING',
  SET_UPDATING: 'SET_UPDATING',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT',
  RESET: 'RESET',
};

// Reducer
function profileReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return { ...state, user: { ...state.user, ...action.payload } };
      
    case ActionTypes.SET_NOTIFICATIONS_ENABLED:
      return { ...state, notificationsEnabled: action.payload };
      
    case ActionTypes.SET_THEME_MODE:
      return { ...state, themeMode: action.payload };
      
    case ActionTypes.SET_CURRENT_SCREEN:
      return { ...state, currentScreen: action.payload };
      
    case ActionTypes.SET_SHOW_PROFILE_SHEET:
      return { ...state, showProfileSheet: action.payload };
      
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
      
    case ActionTypes.SET_UPDATING:
      return { ...state, isUpdating: action.payload };
      
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false, isUpdating: false };
      
    case ActionTypes.LOGOUT:
      return { ...initialState };
      
    case ActionTypes.RESET:
      return initialState;
      
    default:
      return state;
  }
}

// Create context
const ProfileContext = createContext(null);

// Provider component
export function ProfileProvider({ children }) {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  // User actions
  const setUser = useCallback((userData) => {
    dispatch({ type: ActionTypes.SET_USER, payload: userData });
  }, []);

  const updateUser = useCallback(async (updates) => {
    dispatch({ type: ActionTypes.SET_UPDATING, payload: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: ActionTypes.SET_USER, payload: { ...data, id: data.id } });
      dispatch({ type: ActionTypes.SET_UPDATING, payload: false });
      return { success: true };
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  }, []);

  // Notification settings
  const setNotificationsEnabled = useCallback((enabled) => {
    dispatch({ type: ActionTypes.SET_NOTIFICATIONS_ENABLED, payload: enabled });
    // In production, save to backend/async storage
    console.log('Notifications enabled:', enabled);
  }, []);

  const toggleNotifications = useCallback(() => {
    const newValue = !state.notificationsEnabled;
    dispatch({ type: ActionTypes.SET_NOTIFICATIONS_ENABLED, payload: newValue });
    return newValue;
  }, [state.notificationsEnabled]);

  // Theme settings
  const setThemeMode = useCallback((mode) => {
    dispatch({ type: ActionTypes.SET_THEME_MODE, payload: mode });
    // In production, save to backend/async storage
    console.log('Theme mode:', mode);
  }, []);

  const cycleThemeMode = useCallback(() => {
    const modes = ['device', 'light', 'dark'];
    const currentIndex = modes.indexOf(state.themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    dispatch({ type: ActionTypes.SET_THEME_MODE, payload: nextMode });
    return nextMode;
  }, [state.themeMode]);

  const getThemeModeLabel = useCallback(() => {
    switch (state.themeMode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'device':
      default:
        return 'System';
    }
  }, [state.themeMode]);

  // Navigation
  const setCurrentScreen = useCallback((screen) => {
    dispatch({ type: ActionTypes.SET_CURRENT_SCREEN, payload: screen });
  }, []);

  // Sheet controls
  const setShowProfileSheet = useCallback((show) => {
    dispatch({ type: ActionTypes.SET_SHOW_PROFILE_SHEET, payload: show });
  }, []);

  // Loading states
  const setLoading = useCallback((loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  }, []);

  const setUpdating = useCallback((updating) => {
    dispatch({ type: ActionTypes.SET_UPDATING, payload: updating });
  }, []);

  // Error handling
  const setError = useCallback((error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: null });
  }, []);

  // Logout
  const logout = useCallback(() => {
    dispatch({ type: ActionTypes.LOGOUT });
  }, []);

  // Reset
  const reset = useCallback(() => {
    dispatch({ type: ActionTypes.RESET });
  }, []);

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        return { success: false };
      }

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const userData = {
        id: data.id,
        name: data.full_name || data.email,
        email: data.email,
        phone: data.phone || '',
        avatar: data.avatar_url || null,
        memberSince: data.created_at ? new Date(data.created_at).toLocaleDateString() : '',
        totalPickups: data.total_pickups || 0,
      };

      dispatch({ type: ActionTypes.SET_USER, payload: userData });
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      return { success: true, user: userData };
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  }, []);

  const value = {
    ...state,
    // User actions
    setUser,
    updateUser,
    fetchProfile,
    
    // Notification settings
    notificationsEnabled: state.notificationsEnabled,
    setNotificationsEnabled,
    toggleNotifications,
    
    // Theme settings
    themeMode: state.themeMode,
    setThemeMode,
    cycleThemeMode,
    getThemeModeLabel,
    
    // Navigation
    currentScreen: state.currentScreen,
    setCurrentScreen,
    
    // Sheet controls
    showProfileSheet: state.showProfileSheet,
    setShowProfileSheet,
    
    // Loading states
    isLoading: state.isLoading,
    isUpdating: state.isUpdating,
    setLoading,
    setUpdating,
    
    // Error handling
    error: state.error,
    setError,
    clearError,
    
    // Auth
    logout,
    reset,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

// Hook to use the store
export function useProfileStore() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileStore must be used within a ProfileProvider');
  }
  return context;
}

export { ActionTypes };

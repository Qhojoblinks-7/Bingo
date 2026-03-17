/**
 * Theme Mode Hook
 * Detects device color scheme and allows user override
 * Persists user preference in storage
 */

import { useState, useEffect, useCallback } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const THEME_PREFERENCE_KEY = 'user_theme_preference';
const THEME_MODE_KEY = 'theme_mode'; // 'device', 'light', 'dark'

export const ThemeMode = 'device' | 'light' | 'dark';
export const ColorScheme = 'light' | 'dark';

export function useThemeMode() {
  const deviceColorScheme = useDeviceColorScheme();
  const [themeState, setThemeState] = useState({
    mode: 'device',
    resolvedScheme: 'light',
    isLoading: true,
  });

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Update resolved scheme when device theme or mode changes
  useEffect(() => {
    const resolved = resolveColorScheme(themeState.mode, deviceColorScheme);
    setThemeState(prev => ({ ...prev, resolvedScheme: resolved }));
  }, [themeState.mode, deviceColorScheme]);

  const resolveColorScheme = (mode, device) => {
    if (mode === 'device') {
      return device === 'dark' ? 'dark' : 'light';
    }
    return mode;
  };

  const loadThemePreference = async () => {
    try {
      const savedMode = await SecureStore.getItemAsync(THEME_MODE_KEY);
      const mode = savedMode || 'device';
      const resolved = resolveColorScheme(mode, deviceColorScheme);
      
      setThemeState({
        mode,
        resolvedScheme: resolved,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading theme preference:', error);
      setThemeState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const setThemeMode = useCallback(async (newMode) => {
    try {
      await SecureStore.setItemAsync(THEME_MODE_KEY, newMode);
      const resolved = resolveColorScheme(newMode, deviceColorScheme);
      
      setThemeState({
        mode: newMode,
        resolvedScheme: resolved,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, [deviceColorScheme]);

  const toggleTheme = useCallback(async () => {
    const nextMode = 
      themeState.mode === 'light' ? 'dark' : 
      themeState.mode === 'dark' ? 'device' : 
      deviceColorScheme === 'dark' ? 'light' : 'dark';
    
    await setThemeMode(nextMode);
  }, [themeState.mode, deviceColorScheme, setThemeMode]);

  return {
    mode: themeState.mode,
    resolvedScheme: themeState.resolvedScheme,
    isLoading: themeState.isLoading,
    setThemeMode,
    toggleTheme,
    isDark: themeState.resolvedScheme === 'dark',
  };
}

export default useThemeMode;

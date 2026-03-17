/**
 * Theme Context
 * Provides theme state and functions throughout the app
 */

import React, { createContext, useContext } from 'react';
import { useThemeMode } from './useThemeMode';

const AppThemeContext = createContext(undefined);

export function AppThemeProvider({ children }) {
  const theme = useThemeMode();

  return (
    <AppThemeContext.Provider value={theme}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within an AppThemeProvider');
  }
  return context;
}

export default AppThemeProvider;

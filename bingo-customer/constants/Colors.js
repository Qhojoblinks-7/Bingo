/**
 * BinGo App Color Constants
 * Centralized color definitions for the application
 */

export const COLORS = {
  // Primary colors
  white: '#FFFFFF',
  text: '#11181C',
  
  // BinGo Brand Colors
  primary: '#10B981',  // BinGo Green - Active state
  muted: '#6B7280',    // Muted Dark Gray - Inactive state
  error: '#EF4444',     // Error red for logout/actions
  
  // Background colors
  background: '#F9FAFB',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  // Additional UI colors
  icon: '#687076',
  
  // Light mode variants (default)
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    border: '#E5E7EB',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    inputBg: '#F9FAFB',
  },
  
  // Dark mode variants
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    border: '#2D2D2D',
    surface: '#1E1E1E',
    card: '#252525',
    inputBg: '#2A2A2A',
  },
};

// Helper function to get theme-aware colors
export function getThemeColors(isDark) {
  return isDark ? COLORS.dark : COLORS.light;
}

export default COLORS;

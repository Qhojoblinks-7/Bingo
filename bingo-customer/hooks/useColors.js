/**
 * Theme-aware Colors Hook
 * Provides dynamic colors based on current theme
 */

import { useAppTheme } from './useThemeContext';
import { COLORS } from '@/constants/Colors';

export function useColors() {
  const { isDark } = useAppTheme();
  
  return {
    ...COLORS,
    // Override the static colors with theme-aware ones
    background: isDark ? COLORS.dark.background : COLORS.light.background,
    text: isDark ? COLORS.dark.text : COLORS.light.text,
    border: isDark ? COLORS.dark.border : COLORS.light.border,
    surface: isDark ? COLORS.dark.surface : COLORS.light.surface,
    card: isDark ? COLORS.dark.card : COLORS.light.card,
    inputBg: isDark ? COLORS.dark.inputBg : COLORS.light.inputBg,
    
    // Keep static colors
    white: COLORS.white,
    primary: COLORS.primary,
    muted: COLORS.muted,
    error: COLORS.error,
    borderLight: COLORS.borderLight,
    icon: COLORS.icon,
  };
}

export default useColors;

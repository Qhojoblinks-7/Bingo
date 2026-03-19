// BinGo Pilot - Reusable Button Component
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants';

/**
 * @param {Object} props
 * @param {string} props.title - Button text
 * @param {Function} props.onPress - Press handler
 * @param {'primary' | 'secondary' | 'ghost' | 'danger'} props.variant - Button style
 * @param {'sm' | 'md' | 'lg'} props.size - Button size
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.fullWidth - Full width button
 * @param {React.ReactNode} props.icon - Icon element
 * @param {string} props.iconPosition - 'left' or 'right'
 */
const BinGoButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
}) => {
  // Button size styles
  const sizeStyles = {
    sm: {
      paddingVertical: SPACING.xs,
      paddingHorizontal: SPACING.md,
      minHeight: 36,
    },
    md: {
      paddingVertical: SPACING.sm + 2,
      paddingHorizontal: SPACING.lg,
      minHeight: 48,
    },
    lg: {
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.xl,
      minHeight: 56,
    },
  };

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: COLORS.primary,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: COLORS.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    danger: {
      backgroundColor: COLORS.error,
      borderWidth: 0,
    },
  };

  // Text color based on variant
  const textColor = {
    primary: COLORS.white,
    secondary: COLORS.primary,
    ghost: COLORS.primary,
    danger: COLORS.white,
  };

  // Font size based on size
  const fontSize = {
    sm: TYPOGRAPHY.fontSize.sm,
    md: TYPOGRAPHY.fontSize.md,
    lg: TYPOGRAPHY.fontSize.lg,
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: BORDER_RADIUS.md,
        },
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && { width: '100%' },
        isDisabled && { opacity: 0.5 },
        variant === 'primary' && !isDisabled && SHADOWS.card,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor[variant]} size="small" />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon && iconPosition === 'left' && (
            <View style={{ marginRight: SPACING.sm }}>{icon}</View>
          )}
          <Text
            style={{
              color: textColor[variant],
              fontSize: fontSize[size],
              fontWeight: TYPOGRAPHY.fontWeight.semibold,
            }}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={{ marginLeft: SPACING.sm }}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default BinGoButton;

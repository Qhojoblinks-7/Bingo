// BinGo Pilot - Status Badge Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../constants';

// Status configuration mapping
const getStatusConfig = (status, label) => {
  const statusMap = {
    online: {
      backgroundColor: COLORS.success + '20',
      textColor: COLORS.success,
      label: label || 'Online',
      dotColor: COLORS.success,
    },
    offline: {
      backgroundColor: COLORS.muted + '20',
      textColor: COLORS.muted,
      label: label || 'Offline',
      dotColor: COLORS.muted,
    },
    busy: {
      backgroundColor: COLORS.warning + '20',
      textColor: COLORS.warning,
      label: label || 'Busy',
      dotColor: COLORS.warning,
    },
    available: {
      backgroundColor: COLORS.primary + '20',
      textColor: COLORS.primary,
      label: label || 'Available',
      dotColor: COLORS.primary,
    },
    pending: {
      backgroundColor: COLORS.warning + '20',
      textColor: COLORS.warning,
      label: label || 'Pending',
      dotColor: COLORS.warning,
    },
    accepted: {
      backgroundColor: COLORS.accent + '20',
      textColor: COLORS.accent,
      label: label || 'Accepted',
      dotColor: COLORS.accent,
    },
    en_route: {
      backgroundColor: COLORS.accent + '20',
      textColor: COLORS.accent,
      label: label || 'En Route',
      dotColor: COLORS.accent,
    },
    arrived: {
      backgroundColor: COLORS.primary + '20',
      textColor: COLORS.primary,
      label: label || 'Arrived',
      dotColor: COLORS.primary,
    },
    completed: {
      backgroundColor: COLORS.success + '20',
      textColor: COLORS.success,
      label: label || 'Completed',
      dotColor: COLORS.success,
    },
    cancelled: {
      backgroundColor: COLORS.error + '20',
      textColor: COLORS.error,
      label: label || 'Cancelled',
      dotColor: COLORS.error,
    },
  };
  
  return statusMap[status] || {
    backgroundColor: COLORS.muted + '20',
    textColor: COLORS.muted,
    label: label || status,
    dotColor: COLORS.muted,
  };
};

/**
 * @param {Object} props
 * @param {'online' | 'offline' | 'busy' | 'available' | 'pending' | 'completed' | 'cancelled' | 'en_route' | 'arrived'} props.status - Status type
 * @param {string} props.label - Custom label (optional)
 * @param {boolean} props.small - Small badge variant
 */
const StatusBadge = ({ status, label, small = false }) => {
  const config = getStatusConfig(status, label);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.backgroundColor },
        small && styles.small,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.dotColor }]} />
      <Text
        style={[
          styles.label,
          { color: config.textColor },
          small && styles.smallLabel,
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  small: {
    paddingVertical: 2,
    paddingHorizontal: SPACING.xs + 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.xs,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  smallLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
  },
});

export default StatusBadge;

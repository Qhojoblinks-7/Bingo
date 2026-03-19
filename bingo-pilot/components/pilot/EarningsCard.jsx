// Layer 3: Contextual Widgets - Earnings Card
// Glassmorphism design for seeing map through UI

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants';
import { DollarSign, TrendingUp, Clock } from 'lucide-react-native';

export const EarningsCard = ({ 
  todayEarnings = 0, 
  weekEarnings = 0, 
  missionsCompleted = 0,
  isOnline = false 
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <DollarSign size={16} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Earnings</Text>
      </View>

      {/* Main Earnings Display */}
      <View style={styles.earningsRow}>
        <View style={styles.earningsMain}>
          <Text style={styles.currency}>₵</Text>
          <Text style={styles.amount}>{todayEarnings.toFixed(2)}</Text>
        </View>
        <View style={styles.trendBadge}>
          <TrendingUp size={12} color={COLORS.success} />
          <Text style={styles.trendText}>+12%</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Clock size={14} color={COLORS.muted} />
          <Text style={styles.statValue}>{missionsCompleted}</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>₵{weekEarnings.toFixed(0)}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
      </View>

      {/* Online Status Indicator */}
      {!isOnline && (
        <View style={styles.offlineNotice}>
          <Text style={styles.offlineText}>Go online to start earning</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(30, 41, 59, 0.85)', // Glassmorphism surface
    backdropFilter: 'blur(10px)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  earningsMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currency: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginRight: 2,
    marginTop: 2,
  },
  amount: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.muted,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: SPACING.md,
  },
  offlineNotice: {
    position: 'absolute',
    bottom: -24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  offlineText: {
    fontSize: 10,
    color: COLORS.muted,
    fontStyle: 'italic',
  },
});

export default EarningsCard;

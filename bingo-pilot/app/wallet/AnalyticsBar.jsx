import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const AnalyticsBar = ({ value, maxValue, label, subLabel, active, onPress, barWidth = 50 }) => {
  // Handle negative values (for fees/deductions)
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  
  // Bar only rises if there's activity (value != 0)
  // If value is 0, bar is flat but still visible (minimum 3px height)
  const hasActivity = value !== 0;
  const barHeight = hasActivity ? (absValue / maxValue) * 80 : 3;

  return (
    <Pressable style={styles.barWrapper} onPress={onPress}>
      <View style={styles.barContainer}>
        {/* GHS amount just above the bar - shows for all bars with activity */}
        {hasActivity && (
          <Text style={[
            styles.barValueText, 
            active && styles.barValueTextActive,
            isNegative && styles.barValueTextNegative
          ]}>
            {isNegative ? '-GHS ' : 'GHS '}{absValue}
          </Text>
        )}
        <View style={[
          styles.actualBar, 
          { height: `${barHeight}%`, width: barWidth },
          active ? { backgroundColor: '#10B981' } : { backgroundColor: hasActivity ? (isNegative ? '#EF4444' : '#475569') : '#475569' }
        ]} />
      </View>
      <Text style={[styles.label, active && { color: '#10B981' }]}>{label}</Text>
      {subLabel && <Text style={[styles.subLabel, active && { color: '#10B981' }]}>{subLabel}</Text>}
    </Pressable>
  );
};

export default AnalyticsBar;

const styles = StyleSheet.create({
  barWrapper: {
    alignItems: 'center',
    paddingVertical: 4,
    minWidth: 44,
  },
  barContainer: {
    height: 30,
    width: 10,
    justifyContent: 'flex-end',
  },
  actualBar: {
    width: 50,
    backgroundColor: '#3B82F6',
    borderRadius: 5,
  },
  barValueText: {
    color: '#8E8E93',
    fontSize: 8,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
    width: 44,
  },
  barValueTextActive: {
    color: '#10B981',
  },
  barValueTextNegative: {
    color: '#EF4444',
  },
  label: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
    width: 44,
  },
  subLabel: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
    width: 44,
  },
});
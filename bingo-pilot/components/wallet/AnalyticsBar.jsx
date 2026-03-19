import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../../constants';

// ============================================
// REUSABLE HORIZONTAL ANALYTICS COMPONENT
// Designed to match the main wallet page style
// ============================================
const AnalyticsBar = ({ type, data, selectedIndex, onSelect }) => {
  // Transform data based on type for display
  const getDisplayData = () => {
    if (type === 'day') {
      // Daily: Show day numbers (5, 6, 7, etc.)
      return data.map((item, index) => ({
        ...item,
        displayLabel: item.label,
        isActive: item.isCurrent || selectedIndex === index,
      }));
    } else if (type === 'week') {
      // Weekly: Show week ranges (5-11 Jan, 12-18 Jan, etc.)
      return data.map((item, index) => ({
        ...item,
        displayLabel: item.label,
        isActive: selectedIndex === index,
      }));
    } else {
      // Monthly: Show month names (Sep, Oct, Nov, etc.)
      return data.map((item, index) => ({
        ...item,
        displayLabel: item.label,
        isActive: selectedIndex === index,
      }));
    }
  };

  const displayData = getDisplayData();
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <View style={barStyles.container}>
      {displayData.map((item, index) => {
        const isSelected = selectedIndex === index;
        const barHeight = Math.max((item.value / maxValue) * 50, 4);

        return (
          <Pressable
            key={index}
            onPress={() => onSelect(index)}
            style={barStyles.dayCol}
          >
            {/* Bar indicator */}
            <View 
              style={[
                barStyles.barBase, 
                isSelected && barStyles.barActive,
                item.value > 0 && barStyles.barFilled
              ]} 
            />
            
            {/* Day/Week/Month number or label */}
            <Text style={[barStyles.dayNum, isSelected && barStyles.dayNumActive]}>
              {item.displayLabel}
            </Text>
            
            {/* Current indicator dot */}
            {item.isCurrent && <View style={barStyles.currentDot} />}
          </Pressable>
        );
      })}
    </View>
  );
};

// ============================================
// EXPORT
// ============================================
export default AnalyticsBar;

// ============================================
// ANALYTICS BAR STYLES - Match wallet page
// ============================================
const barStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dayCol: {
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  barBase: {
    width: 35,
    height: 2,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 1,
    marginBottom: 4,
  },
  barActive: {
    backgroundColor: COLORS.white,
  },
  barFilled: {
    backgroundColor: COLORS.primary,
  },
  dayNum: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  dayNumActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  currentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 2,
  },
});

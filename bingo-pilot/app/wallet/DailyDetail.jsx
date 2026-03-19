import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import AnalyticsBar from './AnalyticsBar';

const DailyDetail = ({ data = [] }) => {
  // Calculate the highest value in the set to scale others down
  const maxEarnings = Math.max(...data.map(d => d.amount), 100);

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {['Day', 'Week', 'Month'].map(tab => (
          <Pressable key={tab} style={[styles.tab, tab === 'Day' && styles.activeTab]}>
            <Text style={styles.tabText}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroAmount}>GHS 241.09</Text>
        <Text style={styles.heroSub}>5 trips</Text>
      </View>

      {/* The Chart - Bars shrink relative to maxEarnings */}
      <View style={styles.chartRow}>
        {data.map((item, i) => (
          <AnalyticsBar 
            key={i}
            value={item.amount}
            maxValue={maxEarnings}
            label={item.label}
            active={item.active}
          />
        ))}
      </View>
    </View>
  );
};

export default DailyDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  heroAmount: {
    color: '#FFF',
    fontSize: 44,
    fontWeight: '700',
  },
  heroSub: {
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 4,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import COLORS from '../../constants/Colors';

export default function Activity() {
  const activities = [
    { id: 1, type: 'completed', address: '123 Main Street', amount: '$15.00', time: '2 hours ago' },
    { id: 2, type: 'completed', address: '456 Oak Avenue', amount: '$22.00', time: '3 hours ago' },
    { id: 3, type: 'completed', address: '789 Pine Road', amount: '$18.50', time: '5 hours ago' },
    { id: 4, type: 'cancelled', address: '321 Elm Street', amount: '-', time: 'Yesterday' },
    { id: 5, type: 'completed', address: '654 Maple Drive', amount: '$25.00', time: 'Yesterday' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Activity</Text>
          <View style={styles.filterContainer}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, styles.filterButtonInactive]}>
              <Text style={[styles.filterText, styles.filterTextInactive]}>Week</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, styles.filterButtonInactive]}>
              <Text style={[styles.filterText, styles.filterTextInactive]}>Month</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>24</Text>
            <Text style={styles.summaryLabel}>Total Missions</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>$186</Text>
            <Text style={styles.summaryLabel}>Total Earnings</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>4.8</Text>
            <Text style={styles.summaryLabel}>Rating</Text>
          </View>
        </View>

        {/* Activity List */}
        <View style={styles.activityList}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {activities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>
                  {activity.type === 'completed' ? '✓' : '✗'}
                </Text>
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityAddress}>{activity.address}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <Text style={[
                styles.activityAmount,
                activity.type === 'cancelled' && styles.activityAmountCancelled
              ]}>
                {activity.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  filterTextInactive: {
    color: COLORS.muted,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
    textAlign: 'center',
  },
  activityList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityIconText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityInfo: {
    flex: 1,
  },
  activityAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  activityAmountCancelled: {
    color: COLORS.error,
  },
});

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { MessageCircle, ChevronRight, Car } from 'lucide-react-native';
import { COLORS } from '../../constants';
import AnalyticsBar from '../wallet/AnalyticsBar';

const WalletMain = ({ balance = 63.49 }) => {
  const navigation = useNavigation();
  
  // Mock data - First 7 days with current day (Mar 18) highlighted
  const weekDays = [
    { label: '12', subLabel: 'Th', value: 0 },
    { label: '13', subLabel: 'Fr', value: 45 },
    { label: '14', subLabel: 'Sa', value: 120 },
    { label: '15', subLabel: 'Su', value: 80 },
    { label: '16', subLabel: 'Mo', value: 65 },
    { label: '17', subLabel: 'Tu', value: 95 },
    { label: '18', subLabel: 'We', value: 0, active: true },
  ];

  // Calculate max value for bar scaling
  const maxValue = Math.max(...weekDays.map(d => d.value), 100);

  // Calculate today's earnings
  const todayEarnings = weekDays[6]?.value || 0;
  const hasWeekActivity = weekDays.some(d => d.value > 0);
  const hasTodayActivity = todayEarnings > 0;
  const weekEarnings = weekDays.reduce((sum, d) => sum + d.value, 0);
  const weekTrips = weekDays.filter(d => d.value > 0).length;

  // Mock today's transactions - only show if there's week activity
  const todayTransactions = hasWeekActivity && hasTodayActivity ? [
    { time: '2:30 PM', location: '123 Main St → East Legon', payout: '45.00' },
    { time: '11:15 AM', location: '45 Oxford St → Airport', payout: '32.50' },
  ] : [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wallet</Text>
        <MessageCircle color="#FFF" size={24} />
      </View>

      {/* Week Earnings or No Activity Message - shows before analytics */}
      <View style={styles.analyticsContainer}>
        {hasWeekActivity ? (
          <View style={styles.weekSummaryContainer}>
            <Text style={styles.weekEarningsText}>GHS {weekEarnings}</Text>
            <Text style={styles.weekTripsText}>{weekTrips} trips</Text>
          </View>
        ) : (
          <Text style={styles.noActivityText}>No activities about earnings for the week</Text>
        )}
        <View style={styles.weekRow}>
          {weekDays.map((d, i) => (
            <AnalyticsBar
              key={i}
              value={d.value}
              maxValue={maxValue}
              label={d.label}
              subLabel={d.subLabel}
              active={d.active}
              barWidth={40}
            />
          ))}
        </View>
      </View>
      
      

      {/* Today Card - Click to navigate to Earnings */}
      <Pressable 
        style={styles.todayCard} 
        onPress={() => navigation.navigate('wallet/earnings')}
      >
        <View style={styles.todayCardContent}>
          <Text style={styles.todayLabel}>Today</Text>
          <View style={styles.todayRow}>
            <Text style={styles.todayAmount}>GHS {todayEarnings}</Text>
            <ChevronRight color="#8E8E93" size={20} />
          </View>
        </View>
      </Pressable>

      {/* Balance Card - Click to navigate to Balance Details */}
      <Pressable 
        style={styles.balanceCard} 
        onPress={() => navigation.navigate('wallet/BalanceDetails')}
      >
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <ChevronRight color="#8E8E93" size={18} />
        </View>
        <Text style={styles.balanceAmount}>GHS {balance}</Text>
        <Text style={styles.partnerLabel}>Service partner</Text>
        <Text style={styles.partnerName}>Clean Rhema Services</Text>
      </Pressable>

      {/* Today's Transactions - only show if there's week activity */}
      {hasWeekActivity && hasTodayActivity && (
        <View style={styles.transactionsContainer}>
          <Text style={styles.transactionsTitle}>Today's Transactions</Text>
          {todayTransactions.map((trip, index) => (
            <View key={index} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Car size={16} color={COLORS.background} />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTime}>{trip.time}</Text>
                <Text style={styles.transactionLocation} numberOfLines={1}>
                  {trip.location}
                </Text>
              </View>
              <Text style={styles.transactionAmount}>GHS {trip.payout}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default WalletMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  analyticsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    gap: 12,
  },
  todayCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  todayCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todayLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  todayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  todayAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  noActivityText: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
    marginBottom: 16,
  },
  weekSummaryContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  weekEarningsText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
  },
  weekTripsText: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 4,
  },
  transactionsContainer: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
    paddingHorizontal: 10,
  },
  transactionTime: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionLocation: {
    color: COLORS.muted,
    fontSize: 11,
  },
  transactionAmount: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  balanceCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: COLORS.muted,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  partnerLabel: {
    fontSize: 12,
    color: COLORS.muted,
  },
  partnerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.muted,
  },
});
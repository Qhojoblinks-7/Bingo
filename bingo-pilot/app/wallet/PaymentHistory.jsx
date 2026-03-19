import React from 'react';
import { View, Text, StyleSheet, SectionList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, ArrowDownRight, ArrowUpRight, ChevronRight } from 'lucide-react-native';

// ============================================
// PAYMENT HISTORY SCREEN
// Shows all past payments grouped by day
// ============================================
export default function PaymentHistoryScreen() {
  const router = useRouter();

  // Mock payment history data grouped by day
  const payments = [
    { 
      title: 'Today',
      data: [
        { id: '1', date: 'Mar 19, 2026', time: '2:30 PM', type: 'payout', amount: '-400.00', status: 'completed', method: 'MTN Mobile Money', transactionId: 'TXN-001' },
      ]
    },
    { 
      title: 'Yesterday',
      data: [
        { id: '2', date: 'Mar 18, 2026', time: '10:15 AM', type: 'topup', amount: '+100.00', status: 'completed', method: 'Bank Transfer', transactionId: 'TXN-002' },
      ]
    },
    { 
      title: 'Mar 15, 2026',
      data: [
        { id: '3', date: 'Mar 15, 2026', time: '4:45 PM', type: 'payout', amount: '-250.00', status: 'completed', method: 'MTN Mobile Money', transactionId: 'TXN-003' },
        { id: '4', date: 'Mar 15, 2026', time: '11:20 AM', type: 'topup', amount: '+50.00', status: 'completed', method: 'Bank Transfer', transactionId: 'TXN-004' },
      ]
    },
    { 
      title: 'Mar 12, 2026',
      data: [
        { id: '5', date: 'Mar 12, 2026', time: '3:00 PM', type: 'payout', amount: '-300.00', status: 'completed', method: 'Access Bank', transactionId: 'TXN-005' },
      ]
    },
    { 
      title: 'Mar 10, 2026',
      data: [
        { id: '6', date: 'Mar 10, 2026', time: '9:30 AM', type: 'topup', amount: '+75.00', status: 'completed', method: 'Bank Transfer', transactionId: 'TXN-006' },
        { id: '7', date: 'Mar 10, 2026', time: '1:15 PM', type: 'payout', amount: '-150.00', status: 'completed', method: 'MTN Mobile Money', transactionId: 'TXN-007' },
      ]
    },
    { 
      title: 'Mar 8, 2026',
      data: [
        { id: '8', date: 'Mar 8, 2026', time: '5:00 PM', type: 'topup', amount: '+200.00', status: 'completed', method: 'Bank Transfer', transactionId: 'TXN-008' },
      ]
    },
  ];

  const handleTransactionPress = (transaction) => {
    router.push({
      pathname: '/wallet/PaymentDetail',
      params: { 
        id: transaction.id,
        type: transaction.type,
        date: transaction.date,
        time: transaction.time,
        amount: transaction.amount,
        status: transaction.status,
        method: transaction.method,
        transactionId: transaction.transactionId
      }
    });
  };

  const renderPaymentItem = ({ item }) => (
    <Pressable 
      style={styles.paymentItem}
      onPress={() => handleTransactionPress(item)}
    >
      <View style={styles.paymentIcon}>
        {item.type === 'payout' ? (
          <ArrowUpRight color="#FFF" size={18} />
        ) : (
          <ArrowDownRight color="#FFF" size={18} />
        )}
      </View>
      
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentType}>
          {item.type === 'payout' ? 'Payout' : 'Top up'}
        </Text>
        <View style={styles.paymentMeta}>
          <Text style={styles.paymentTime}>{item.time}</Text>
        </View>
      </View>

      <View style={styles.paymentRight}>
        <Text style={[
          styles.paymentAmount,
          item.type === 'payout' ? styles.amountNegative : styles.amountPositive
        ]}>
          GHS {item.amount}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <ChevronRight color="#333" size={20} />
    </Pressable>
  );

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.title}>Payment History</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Calendar color="#8E8E93" size={20} />
          <Text style={styles.summaryLabel}>This Month</Text>
          <Text style={styles.summaryValue}>GHS 650.00</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Clock color="#8E8E93" size={20} />
          <Text style={styles.summaryLabel}>Pending</Text>
          <Text style={styles.summaryValuePending}>GHS 0.00</Text>
        </View>
      </View>

      {/* Payment List Grouped by Day */}
      <SectionList
        sections={payments}
        keyExtractor={item => item.id}
        renderItem={renderPaymentItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#334155',
    marginHorizontal: 16,
  },
  summaryLabel: {
    color: '#8E8E93',
    fontSize: 12,
  },
  summaryValue: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  summaryValuePending: {
    color: '#F59E0B',
    fontSize: 20,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  paymentType: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentMeta: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  paymentTime: {
    color: '#8E8E93',
    fontSize: 12,
  },
  paymentRight: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  amountNegative: {
    color: '#FFF',
  },
  amountPositive: {
    color: '#22C55E',
  },
  statusBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  statusText: {
    color: '#22C55E',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

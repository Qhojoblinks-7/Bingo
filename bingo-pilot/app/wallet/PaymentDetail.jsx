import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ArrowDownRight, ArrowUpRight, Clock, CheckCircle, Copy, Wallet, Calendar } from 'lucide-react-native';

// ============================================
// PAYMENT DETAIL SCREEN
// Shows detailed information about a single transaction
// ============================================
export default function PaymentDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { 
    id, 
    type = 'payout', 
    date = '', 
    time = '', 
    amount = '0.00', 
    status = 'completed',
    method = 'MTN Mobile Money',
    transactionId = 'TXN-000'
  } = params;

  const isPayout = type === 'payout';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.title}>Transaction Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Transaction Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.typeIcon}>
          {isPayout ? (
            <ArrowUpRight color="#FFF" size={28} />
          ) : (
            <ArrowDownRight color="#FFF" size={28} />
          )}
        </View>
        
        <Text style={styles.transactionType}>
          {isPayout ? 'Payout' : 'Top up'}
        </Text>
        
        <Text style={styles.amount}>
          GHS {amount}
        </Text>
        
        <View style={styles.dateTimeRow}>
          <Calendar color="#8E8E93" size={14} />
          <Text style={styles.dateTimeText}>{date}</Text>
          <Clock color="#8E8E93" size={14} style={{ marginLeft: 12 }} />
          <Text style={styles.dateTimeText}>{time}</Text>
        </View>

        <View style={styles.statusBadge}>
          <CheckCircle color="#22C55E" size={12} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      {/* Payment Details Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction Type</Text>
          <Text style={styles.detailValue}>{isPayout ? 'Payout' : 'Top up'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{date}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time</Text>
          <Text style={styles.detailValue}>{time}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount</Text>
          <Text style={styles.detailValue}>GHS {amount}</Text>
        </View>
        
        <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.detailLabel}>Status</Text>
          <View style={styles.statusBadgeInline}>
            <CheckCircle color="#22C55E" size={12} />
            <Text style={styles.statusTextInline}>{status}</Text>
          </View>
        </View>
      </View>

      {/* Payment Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment Info</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction ID</Text>
          <View style={styles.copyRow}>
            <Text style={styles.detailValue}>{transactionId}</Text>
            <Copy color="#8E8E93" size={14} />
          </View>
        </View>
        
        <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.detailLabel}>Payment Method</Text>
          <View style={styles.methodRow}>
            <Wallet color="#3B82F6" size={16} />
            <Text style={styles.methodText}>{method}</Text>
          </View>
        </View>
      </View>

      {/* Help Section */}
      <View style={styles.helpSection}>
        <Text style={styles.helpText}>Need help with this transaction?</Text>
        <Pressable style={styles.helpButton}>
          <Text style={styles.helpButtonText}>Contact Support</Text>
        </Pressable>
      </View>
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
  headerCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  typeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionType: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  amount: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 12,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  dateTimeText: {
    color: '#8E8E93',
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  card: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#334155',
  },
  detailLabel: {
    color: '#8E8E93',
    fontSize: 14,
  },
  detailValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadgeInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusTextInline: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  methodText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  helpSection: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  helpText: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 12,
  },
  helpButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  helpButtonText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
});

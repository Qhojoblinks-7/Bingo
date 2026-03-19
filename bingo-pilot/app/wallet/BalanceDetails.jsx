import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, ArrowUp, MoreHorizontal, Car, ArrowDownRight, ArrowUpRight } from 'lucide-react-native';
import MoreBottomSheet from '../../components/wallet/MoreBottomSheet';

export default function BalanceDetails({ balance = "63.49", transactions }) {
  const router = useRouter();
  const [showMoreSheet, setShowMoreSheet] = useState(false);

  // Dummy transaction history
  const defaultTransactions = [
    { id: '1', date: 'Today', time: '2:30 PM', description: 'Trip Earnings - Airport Run', type: 'trip', amount: '45.00' },
    { id: '2', date: 'Today', time: '11:15 AM', description: 'Trip Earnings - Mall Route', type: 'trip', amount: '32.50' },
    { id: '3', date: 'Yesterday', time: '6:45 PM', description: 'Trip Earnings - East Legon', type: 'trip', amount: '28.00' },
    { id: '4', date: 'Yesterday', time: '3:20 PM', description: 'Withdrawal', type: 'withdrawal', amount: '-100.00' },
    { id: '5', date: 'Mar 17', time: '10:00 AM', description: 'Top Up', type: 'topup', amount: '200.00' },
    { id: '6', date: 'Mar 16', time: '5:30 PM', description: 'Trip Earnings - Airport Run', type: 'trip', amount: '55.00' },
    { id: '7', date: 'Mar 15', time: '2:15 PM', description: 'Trip Earnings - Mall Route', type: 'trip', amount: '38.75' },
    { id: '8', date: 'Mar 14', time: '4:45 PM', description: 'Withdrawal', type: 'withdrawal', amount: '-150.00' },
  ];

  const displayTransactions = transactions || defaultTransactions;
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Balance</Text>
      <Text style={styles.mainBalance}>GHS {balance}</Text>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <View style={styles.actionItem}>
          <Pressable 
            style={styles.iconCircle}
            onPress={() => router.push('/wallet/TopUp')}
          >
            <Plus color="#FFF" />
          </Pressable>
          <Text style={styles.actionText}>Top up</Text>
        </View>
        <View style={styles.actionItem}>
          <Pressable 
            style={styles.iconCircle}
            onPress={() => router.push('/wallet/Withdraw')}
          >
            <ArrowUp color="#FFF" />
          </Pressable>
          <Text style={styles.actionText}>Withdraw</Text>
        </View>
        <View style={styles.actionItem}>
          <Pressable 
            style={styles.iconCircle}
            onPress={() => setShowMoreSheet(true)}
          >
            <MoreHorizontal color="#FFF" />
          </Pressable>
          <Text style={styles.actionText}>More</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Transaction history</Text>
      
      {/* Transaction List */}
      <FlatList
        data={displayTransactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.txItem}>
            <View style={styles.txIcon}>
              {item.type === 'trip' ? (
                <Car size={16} color="#8E8E93" />
              ) : item.type === 'withdrawal' ? (
                <ArrowUpRight size={16} color="#8E8E93" />
              ) : (
                <ArrowDownRight size={16} color="#8E8E93" />
              )}
            </View>
            <View style={styles.txInfo}>
              <Text style={styles.txDate}>{item.date}, {item.time}</Text>
              <Text style={styles.txDesc}>{item.description}</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>{item.type}</Text></View>
            </View>
            <Text style={[styles.txAmount, item.amount < 0 && styles.negative]}>
              {item.amount > 0 ? '' : ''}GHS {item.amount}
            </Text>
          </View>
        )}
      />

      {/* More Bottom Sheet */}
      <MoreBottomSheet 
        visible={showMoreSheet} 
        onClose={() => setShowMoreSheet(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  mainBalance: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  actionItem: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  txDesc: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '500',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#8E8E93',
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  negative: {
    color: '#EF4444',
  },
});
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BinGoHeader } from '@/components/BinGoHeader';
import { ProofOfServiceSheet } from '@/components/ProofOfServiceSheet';
import { TransactionDetailsSheet } from '@/components/TransactionDetailsSheet';
import { useColors } from '@/hooks/useColors';

export default function Activity() {
  const router = useRouter();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState('active');
  const [showProofSheet, setShowProofSheet] = useState(false);
  const [showTransactionSheet, setShowTransactionSheet] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock data for your Django backend integration later
  const pickups = [
    { id: '1', status: 'active', date: 'Today, 2:30 PM', address: 'GA-123-4567', price: '20', type: 'payment' },
    { id: '2', status: 'completed', date: 'Mar 14, 2026', address: 'GA-099-1234', price: '40', type: 'payment', proofImage: null },
    { id: '3', status: 'completed', date: 'Mar 10, 2026', address: 'GA-123-4567', price: '20', type: 'payment', proofImage: null },
  ];

  const topups = [
    { id: 'TXN001', status: 'success', date: 'Mar 15, 2026', amount: '50', type: 'topup', method: 'momo' },
    { id: 'TXN002', status: 'success', date: 'Mar 12, 2026', amount: '20', type: 'topup', method: 'card' },
  ];

  const filteredPickups = activeTab === 'active' 
    ? pickups.filter(p => p.status === 'active')
    : [...pickups.filter(p => p.status === 'completed'), ...topups];

  const handleItemPress = (item) => {
    // Navigate to Activity Details screen
    router.push(`/activity/${item.id}`);
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tabItem: {
      paddingVertical: 15,
      marginRight: 25,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTabItem: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.muted,
    },
    activeTabText: {
      color: colors.primary,
    },
    listContent: {
      padding: 20,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    priceText: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },
    dateText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
      marginBottom: 12,
    },
    addressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    addressText: {
      fontSize: 13,
      color: colors.muted,
    },
    emptyState: {
      marginTop: 100,
      alignItems: 'center',
    },
    emptyText: {
      color: colors.muted,
      fontSize: 14,
    }
  }), [colors]);

  const renderItem = ({ item }) => (
    <Pressable style={styles.card} onPress={() => handleItemPress(item)}>
      <View style={styles.cardHeader}>
        <View style={styles.statusRow}>
          {item.status === 'active' ? (
            <Ionicons name="time" size={16} color="#F59E0B" />
          ) : (
            <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
          )}
          <Text style={[
            styles.statusText, 
            { color: item.status === 'active' ? '#F59E0B' : colors.primary }
          ]}>
            {item.status === 'active' ? 'Rider Assigned' : 'Completed'}
          </Text>
        </View>
        <Text style={styles.priceText}>GH₵ {item.price || item.amount}</Text>
      </View>

      <Text style={styles.dateText}>{item.date}</Text>
      
      <View style={styles.addressRow}>
        <Ionicons name={item.type === 'topup' ? 'wallet' : 'location'} size={14} color={colors.muted} />
        <Text style={styles.addressText}>
          {item.type === 'topup' ? `Top-up via ${item.method}` : item.address}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <BinGoHeader title="My Activity" />

      {/* Internal Tabs */}
      <View style={styles.tabBar}>
        <Pressable 
          onPress={() => setActiveTab('active')}
          style={[styles.tabItem, activeTab === 'active' && styles.activeTabItem]}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active</Text>
        </Pressable>
        <Pressable 
          onPress={() => setActiveTab('completed')}
          style={[styles.tabItem, activeTab === 'completed' && styles.activeTabItem]}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>History</Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredPickups}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No {activeTab} pickups found.</Text>
          </View>
        }
      />

      {/* Proof of Service Sheet */}
      <ProofOfServiceSheet
        visible={showProofSheet}
        onClose={() => setShowProofSheet(false)}
        riderName="John Doe"
        riderPhone="+233 55 123 4567"
      />

      {/* Transaction Details Sheet */}
      <TransactionDetailsSheet
        visible={showTransactionSheet}
        onClose={() => setShowTransactionSheet(false)}
        transactionId={selectedItem?.id}
        amount={selectedItem?.price || selectedItem?.amount}
        date={selectedItem?.date}
        time="2:30 PM"
        method={selectedItem?.method || 'momo'}
        status={selectedItem?.status}
        transactionType={selectedItem?.type}
      />
    </View>
  );
}

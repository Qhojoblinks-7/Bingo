import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BinGoHeader } from '@/components/BinGoHeader';
import { EmptyState } from '@/components/EmptyState';
import { ActivitySkeleton } from '@/components/Skeleton';
import { ProofOfServiceSheet } from '@/components/ProofOfServiceSheet';
import { TransactionDetailsSheet } from '@/components/TransactionDetailsSheet';
import { useColors } from '@/hooks/useColors';
import { useActivityStore, useProofOfServiceStore, useTransactionStore, ActivityStatus, ActivityType } from '@/stores';

export default function Activity() {
  const router = useRouter();
  const colors = useColors();
  
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    activities,
    activeTab, selectedItem,
    setActiveTab, setSelectedItem, fetchActivities,
    isLoading: storeLoading,
  } = useActivityStore();
  const { loadFromActivity: loadProof } = useProofOfServiceStore();
  const { loadFromActivity: loadTransaction } = useTransactionStore();
  
  const [showProofSheet, setShowProofSheet] = React.useState(false);
  const [showTransactionSheet, setShowTransactionSheet] = React.useState(false);
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchActivities();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchActivities]);
  
  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchActivities();
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchActivities]);

  const activePickups = activities.filter(a => a.status === ActivityStatus.AWAITING || a.status === ActivityStatus.IN_TRANSIT);
  const completedPickups = activities.filter(a => a.status === ActivityStatus.COMPLETED || a.status === ActivityStatus.CANCELLED || a.type === ActivityType.TOPUP);
  
  const filteredPickups = activeTab === 'active' ? activePickups : completedPickups;

  const handleItemPress = (item) => {
    setSelectedItem(item);
    
    if (item.type === ActivityType.PICKUP && item.status === ActivityStatus.COMPLETED) {
      // Load proof data and show sheet
      loadProof(item);
      setShowProofSheet(true);
    } else if (item.type === ActivityType.TOPUP) {
      // Load transaction data and show sheet
      loadTransaction(item);
      setShowTransactionSheet(true);
    } else {
      // Navigate to Activity Details screen
      router.push(`/activity/${item.id}`);
    }
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
    },
    loadingContainer: {
      paddingTop: 20,
    },
  }), [colors]);

  const renderItem = ({ item }) => (
    <Pressable style={styles.card} onPress={() => handleItemPress(item)}>
      <View style={styles.cardHeader}>
        <View style={styles.statusRow}>
          {item.status === ActivityStatus.AWAITING || item.status === ActivityStatus.IN_TRANSIT ? (
            <Ionicons name="time" size={16} color="#F59E0B" />
          ) : (
            <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
          )}
          <Text style={[
            styles.statusText, 
            { color: item.status === ActivityStatus.AWAITING || item.status === ActivityStatus.IN_TRANSIT ? '#F59E0B' : colors.primary }
          ]}>
            {item.status === ActivityStatus.AWAITING || item.status === ActivityStatus.IN_TRANSIT ? 'Rider Assigned' : 'Completed'}
          </Text>
        </View>
        <Text style={styles.priceText}>GH₵ {item.price || item.amount}</Text>
      </View>

      <Text style={styles.dateText}>{item.date}</Text>
      
      <View style={styles.addressRow}>
        <Ionicons name={item.type === ActivityType.TOPUP ? 'wallet' : 'location'} size={14} color={colors.muted} />
        <Text style={styles.addressText}>
          {item.type === ActivityType.TOPUP ? `Top-up via ${item.method}` : item.address}
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          storeLoading || isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivitySkeleton />
              <ActivitySkeleton style={{ marginTop: 12 }} />
            </View>
          ) : (
            <EmptyState
              icon={activeTab === 'active' ? 'bicycle' : 'receipt'}
              title={activeTab === 'active' ? 'No Active Pickups' : 'No History Yet'}
              message={activeTab === 'active' 
                ? 'You don\'t have any active pickups. Make a request to get started.' 
                : 'Your completed pickups will appear here.'}
              actionLabel={activeTab === 'active' ? 'Request Pickup' : undefined}
              onAction={activeTab === 'active' ? () => router.push('/request') : undefined}
            />
          )
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

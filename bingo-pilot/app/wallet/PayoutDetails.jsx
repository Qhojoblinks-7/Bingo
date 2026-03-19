import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, CheckCircle, Clock, Wallet, Building, Plus } from 'lucide-react-native';

// ============================================
// PAYOUT DETAILS SCREEN
// Shows all payout methods and account details
// ============================================
export default function PayoutDetailsScreen() {
  const router = useRouter();

  // All payout methods used by the app in Ghana
  const payoutMethods = [
    {
      id: '1',
      type: 'mtn_momo',
      name: 'MTN Mobile Money',
      number: '****4892',
      isDefault: true,
      icon: Wallet,
      color: '#FFCD00',
    },
    {
      id: '2',
      type: 'airteltigo_momo',
      name: 'AirtelTigo Money',
      number: '****7621',
      isDefault: false,
      icon: Wallet,
      color: '#E60000',
    },
    {
      id: '3',
      type: 'vodafone_momo',
      name: 'Vodafone Cash',
      number: '****3456',
      isDefault: false,
      icon: Wallet,
      color: '#E60000',
    },
    {
      id: '4',
      type: 'access_bank',
      name: 'Access Bank',
      number: '****8812',
      isDefault: false,
      icon: Building,
      color: '#0047AB',
    },
    {
      id: '5',
      type: 'ecobank',
      name: 'Ecobank',
      number: '****2219',
      isDefault: false,
      icon: Building,
      color: '#E31837',
    },
    {
      id: '6',
      type: 'stanbic_bank',
      name: 'Stanbic Bank',
      number: '****9934',
      isDefault: false,
      icon: Building,
      color: '#00A3E0',
    },
    {
      id: '7',
      type: 'gic_ghana',
      name: 'GIC Ghana',
      number: '****7621',
      isDefault: false,
      icon: Building,
      color: '#1E3A5F',
    },
    {
      id: '8',
      type: 'zenith_bank',
      name: 'Zenith Bank',
      number: '****5521',
      isDefault: false,
      icon: Building,
      color: '#003366',
    },
  ];

  // Mock payout schedule
  const payoutSchedule = [
    { id: '1', day: 'Monday', status: 'available' },
    { id: '2', day: 'Tuesday', status: 'available' },
    { id: '3', day: 'Wednesday', status: 'available' },
    { id: '4', day: 'Thursday', status: 'available' },
    { id: '5', day: 'Friday', status: 'available' },
    { id: '6', day: 'Saturday', status: 'unavailable' },
    { id: '7', day: 'Sunday', status: 'unavailable' },
  ];

  // Mock recent payouts
  const recentPayouts = [
    { id: '1', date: 'Mar 18, 2026', amount: 'GHS 400.00', status: 'completed', method: 'MTN Mobile Money' },
    { id: '2', date: 'Mar 12, 2026', amount: 'GHS 250.00', status: 'completed', method: 'MTN Mobile Money' },
    { id: '3', date: 'Mar 8, 2026', amount: 'GHS 300.00', status: 'completed', method: 'Access Bank' },
  ];

  const renderMethodItem = ({ item }) => {
    const IconComponent = item.icon;
    return (
      <View style={styles.methodCard}>
        <View style={[styles.methodIcon, { backgroundColor: item.color }]}>
          <IconComponent color="#FFF" size={20} />
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodName}>{item.name}</Text>
          <Text style={styles.methodNumber}>{item.number}</Text>
        </View>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
        <Pressable style={styles.editBtn}>
          <Text style={styles.editText}>{item.isDefault ? 'Edit' : 'Set Default'}</Text>
        </Pressable>
      </View>
    );
  };

  const renderPayoutItem = ({ item }) => (
    <View style={styles.payoutItem}>
      <View style={styles.payoutInfo}>
        <Text style={styles.payoutDate}>{item.date}</Text>
        <Text style={styles.payoutMethod}>{item.method}</Text>
      </View>
      <View style={styles.payoutRight}>
        <Text style={styles.payoutAmount}>{item.amount}</Text>
        <View style={styles.statusRow}>
          <CheckCircle color="#22C55E" size={12} />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.title}>Payout Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={recentPayouts}
        keyExtractor={item => item.id}
        renderItem={renderPayoutItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Payment Methods Section */}
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <Text style={styles.sectionSubtitle}>All methods used for payouts</Text>
            
            {payoutMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <View key={method.id} style={styles.methodCard}>
                  <View style={[styles.methodIcon, { backgroundColor: method.color }]}>
                    <IconComponent color="#FFF" size={20} />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodName}>{method.name}</Text>
                    <Text style={styles.methodNumber}>{method.number}</Text>
                  </View>
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                  <Pressable style={styles.editBtn}>
                    <Text style={styles.editText}>{method.isDefault ? 'Edit' : 'Set'}</Text>
                  </Pressable>
                </View>
              );
            })}

            <Pressable style={styles.addMethodBtn}>
              <Plus color="#3B82F6" size={20} />
              <Text style={styles.addMethodText}>Add new payout method</Text>
            </Pressable>

            {/* Payout Schedule */}
            <Text style={styles.sectionTitle}>Payout Schedule</Text>
            <View style={styles.scheduleCard}>
              <View style={styles.scheduleGrid}>
                {payoutSchedule.map((day) => (
                  <View 
                    key={day.id} 
                    style={[
                      styles.scheduleDay,
                      day.status === 'unavailable' && styles.dayUnavailable
                    ]}
                  >
                    <Text style={[
                      styles.dayText,
                      day.status === 'unavailable' && styles.dayTextUnavailable
                    ]}>
                      {day.day.substring(0, 3)}
                    </Text>
                    {day.status === 'available' ? (
                      <Clock color="#22C55E" size={12} />
                    ) : (
                      <Clock color="#8E8E93" size={12} />
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Quick Stats */}
            <Text style={styles.sectionTitle}>Quick Stats</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Min Payout</Text>
                <Text style={styles.statValue}>GHS 10</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Max Payout</Text>
                <Text style={styles.statValue}>GHS 2000</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Recent Payouts</Text>
          </>
        }
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 24,
  },
  sectionSubtitle: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 16,
  },
  methodCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  methodName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  methodNumber: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  defaultText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  editBtn: {
    padding: 8,
  },
  editText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  addMethodBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  addMethodText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  scheduleCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
  },
  scheduleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleDay: {
    alignItems: 'center',
    gap: 4,
  },
  dayUnavailable: {
    opacity: 0.5,
  },
  dayText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  dayTextUnavailable: {
    color: '#8E8E93',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    color: '#8E8E93',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  payoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1E293B',
  },
  payoutInfo: {
    flex: 1,
  },
  payoutDate: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  payoutMethod: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 2,
  },
  payoutRight: {
    alignItems: 'flex-end',
  },
  payoutAmount: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  statusText: {
    color: '#22C55E',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

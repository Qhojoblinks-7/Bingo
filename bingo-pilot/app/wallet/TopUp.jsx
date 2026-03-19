import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Wallet, Building, Smartphone, CheckCircle, ChevronRight } from 'lucide-react-native';

// ============================================
// TOP UP SCREEN
// Add funds to pilot wallet
// ============================================
export default function TopUpScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);

  // Top up methods
  const topUpMethods = [
    {
      id: 'mtn_momo',
      name: 'MTN Mobile Money',
      icon: Smartphone,
      color: '#FFCD00',
    },
    {
      id: 'airteltigo_momo',
      name: 'AirtelTigo Money',
      icon: Smartphone,
      color: '#E60000',
    },
    {
      id: 'vodafone_momo',
      name: 'Vodafone Cash',
      icon: Smartphone,
      color: '#E60000',
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: Building,
      color: '#0047AB',
    },
  ];

  // Quick amount buttons
  const quickAmounts = ['50', '100', '200', '500'];

  const handleTopUp = () => {
    // Handle top up logic
    if (amount && selectedMethod) {
      // Navigate to success or processing
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.title}>Top Up</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>GHS 63.49</Text>
        </View>

        {/* Amount Input */}
        <Text style={styles.sectionTitle}>Enter Amount</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>GHS</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0"
            placeholderTextColor="#8E8E93"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Quick Amounts */}
        <View style={styles.quickAmounts}>
          {quickAmounts.map((quickAmount) => (
            <Pressable
              key={quickAmount}
              style={[
                styles.quickAmountBtn,
                amount === quickAmount && styles.quickAmountBtnActive
              ]}
              onPress={() => setAmount(quickAmount)}
            >
              <Text style={[
                styles.quickAmountText,
                amount === quickAmount && styles.quickAmountTextActive
              ]}>
                GHS {quickAmount}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        <View style={styles.methodsContainer}>
          {topUpMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <Pressable
                key={method.id}
                style={[
                  styles.methodCard,
                  selectedMethod === method.id && styles.methodCardSelected
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View style={[styles.methodIcon, { backgroundColor: method.color }]}>
                  <IconComponent color="#FFF" size={20} />
                </View>
                <Text style={styles.methodName}>{method.name}</Text>
                {selectedMethod === method.id && (
                  <CheckCircle color="#22C55E" size={20} />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works</Text>
          <Text style={styles.infoText}>1. Select payment method</Text>
          <Text style={styles.infoText}>2. Enter amount to top up</Text>
          <Text style={styles.infoText}>3. Confirm payment</Text>
          <Text style={styles.infoText}>4. Balance updated instantly</Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Pressable 
          style={[
            styles.topUpBtn,
            (!amount || !selectedMethod) && styles.topUpBtnDisabled
          ]}
          onPress={handleTopUp}
          disabled={!amount || !selectedMethod}
        >
          <Text style={styles.topUpBtnText}>
            Top Up GHS {amount || '0'}
          </Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  balanceCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceLabel: {
    color: '#8E8E93',
    fontSize: 14,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '700',
    marginTop: 4,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  amountInputContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  currencySymbol: {
    color: '#8E8E93',
    fontSize: 24,
    fontWeight: '600',
    marginRight: 8,
  },
  amountInput: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: '700',
    minWidth: 100,
    textAlign: 'center',
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  quickAmountBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickAmountBtnActive: {
    backgroundColor: '#3B82F6',
  },
  quickAmountText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
  },
  quickAmountTextActive: {
    color: '#FFF',
  },
  methodsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  methodCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodCardSelected: {
    borderColor: '#22C55E',
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodName: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 100,
  },
  infoTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    color: '#8E8E93',
    fontSize: 13,
    marginBottom: 4,
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#0F172A',
  },
  topUpBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  topUpBtnDisabled: {
    backgroundColor: '#334155',
  },
  topUpBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

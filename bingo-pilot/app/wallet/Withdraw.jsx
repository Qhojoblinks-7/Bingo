import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Wallet, Building, Smartphone, CheckCircle, Clock, Info } from 'lucide-react-native';

// ============================================
// WITHDRAW SCREEN
// Withdraw funds from pilot wallet
// ============================================
export default function WithdrawScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('mtn_momo');

  const currentBalance = 63.49;
  const minWithdraw = 10;
  const maxWithdraw = 2000;

  // Withdrawal methods (payout methods)
  const withdrawMethods = [
    {
      id: 'mtn_momo',
      name: 'MTN Mobile Money',
      number: '****4892',
      icon: Smartphone,
      color: '#FFCD00',
    },
    {
      id: 'airteltigo_momo',
      name: 'AirtelTigo Money',
      number: '****7621',
      icon: Smartphone,
      color: '#E60000',
    },
    {
      id: 'vodafone_momo',
      name: 'Vodafone Cash',
      number: '****3456',
      icon: Smartphone,
      color: '#E60000',
    },
    {
      id: 'access_bank',
      name: 'Access Bank',
      number: '****8812',
      icon: Building,
      color: '#0047AB',
    },
  ];

  // Quick amount buttons
  const quickAmounts = [
    { label: 'Min', value: minWithdraw },
    { label: 'Half', value: Math.floor(currentBalance / 2) },
    { label: 'Max', value: currentBalance },
  ];

  const handleWithdraw = () => {
    // Handle withdraw logic
  };

  const isValidAmount = () => {
    const numAmount = parseFloat(amount);
    return numAmount >= minWithdraw && numAmount <= currentBalance;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.title}>Withdraw</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>GHS {currentBalance.toFixed(2)}</Text>
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
          {quickAmounts.map((item) => (
            <Pressable
              key={item.label}
              style={[
                styles.quickAmountBtn,
                amount === item.value.toString() && styles.quickAmountBtnActive
              ]}
              onPress={() => setAmount(item.value.toString())}
            >
              <Text style={[
                styles.quickAmountText,
                amount === item.value.toString() && styles.quickAmountTextActive
              ]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Validation Message */}
        {amount && !isValidAmount() && (
          <View style={styles.errorCard}>
            <Info color="#EF4444" size={16} />
            <Text style={styles.errorText}>
              {parseFloat(amount) > currentBalance 
                ? 'Insufficient balance' 
                : `Minimum withdrawal is GHS ${minWithdraw}`}
            </Text>
          </View>
        )}

        {/* Withdrawal Method */}
        <Text style={styles.sectionTitle}>Withdraw To</Text>
        <View style={styles.methodsContainer}>
          {withdrawMethods.map((method) => {
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
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodNumber}>{method.number}</Text>
                </View>
                {selectedMethod === method.id && (
                  <CheckCircle color="#22C55E" size={20} />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Summary Card */}
        {amount && isValidAmount() && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Withdrawal Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount</Text>
              <Text style={styles.summaryValue}>GHS {amount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Fee (1.5%)</Text>
              <Text style={styles.summaryValue}>-GHS {(parseFloat(amount) * 0.015).toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.summaryLabelTotal}>You Receive</Text>
              <Text style={styles.summaryValueTotal}>
                GHS {(parseFloat(amount) - (parseFloat(amount) * 0.015)).toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Important</Text>
          <View style={styles.infoRow}>
            <Clock color="#8E8E93" size={14} />
            <Text style={styles.infoText}>Processing time: 1-2 business days</Text>
          </View>
          <View style={styles.infoRow}>
            <Info color="#8E8E93" size={14} />
            <Text style={styles.infoText}>Minimum: GHS {minWithdraw}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Pressable 
          style={[
            styles.withdrawBtn,
            (!amount || !isValidAmount()) && styles.withdrawBtnDisabled
          ]}
          onPress={handleWithdraw}
          disabled={!amount || !isValidAmount()}
        >
          <Text style={styles.withdrawBtnText}>
            Withdraw GHS {amount || '0'}
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
    marginBottom: 16,
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
  errorCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
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
  methodInfo: {
    flex: 1,
  },
  methodName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  methodNumber: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#334155',
  },
  summaryLabel: {
    color: '#8E8E93',
    fontSize: 14,
  },
  summaryValue: {
    color: '#FFF',
    fontSize: 14,
  },
  summaryLabelTotal: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryValueTotal: {
    color: '#22C55E',
    fontSize: 16,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 100,
    gap: 8,
  },
  infoTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    color: '#8E8E93',
    fontSize: 13,
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#0F172A',
  },
  withdrawBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  withdrawBtnDisabled: {
    backgroundColor: '#334155',
  },
  withdrawBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

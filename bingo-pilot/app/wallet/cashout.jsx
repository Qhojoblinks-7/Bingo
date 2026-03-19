import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants';

export default function CashoutScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('63.49');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState(1); // 1: Amount, 2: Confirm, 3: Success

  const balance = 63.49;
  const currentAmount = parseFloat(amount) || 0;

  const handleAmountChange = (value) => {
    // Only allow numbers and decimal point
    const filtered = value.replace(/[^0-9.]/g, '');
    setAmount(filtered);
  };

  const handleMaxAmount = () => {
    setAmount(balance.toString());
  };

  const handleContinue = () => {
    if (currentAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    if (currentAmount > balance) {
      Alert.alert('Insufficient Balance', 'You do not have enough balance');
      return;
    }
    if (!phone || phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid Mobile Money number');
      return;
    }
    setStep(2);
  };

  const handleConfirm = () => {
    setStep(3);
    // Simulate processing
    setTimeout(() => {
      Alert.alert(
        'Success',
        `GHS ${currentAmount.toFixed(2)} has been sent to ${phone}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cash Out</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress Steps */}
        <View style={styles.steps}>
          <View style={[styles.stepItem, step >= 1 && styles.stepActive]}>
            <View style={[styles.stepCircle, step >= 1 && styles.stepCircleActive]}>
              <Text style={styles.stepNum}>1</Text>
            </View>
            <Text style={styles.stepLabel}>Amount</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={[styles.stepItem, step >= 2 && styles.stepActive]}>
            <View style={[styles.stepCircle, step >= 2 && styles.stepCircleActive]}>
              <Text style={styles.stepNum}>2</Text>
            </View>
            <Text style={styles.stepLabel}>Confirm</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={[styles.stepItem, step >= 3 && styles.stepActive]}>
            <View style={[styles.stepCircle, step >= 3 && styles.stepCircleActive]}>
              <Text style={styles.stepNum}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Done</Text>
          </View>
        </View>

        {step === 1 && (
          <>
            {/* Available Balance */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>GHS {balance.toFixed(2)}</Text>
            </View>

            {/* Amount Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Amount to withdraw</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>GHS</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={handleAmountChange}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={COLORS.muted}
                />
              </View>
              <TouchableOpacity style={styles.maxBtn} onPress={handleMaxAmount}>
                <Text style={styles.maxBtnText}>MAX</Text>
              </TouchableOpacity>
            </View>

            {/* Phone Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Mobile Money Number</Text>
              <View style={styles.phoneInputContainer}>
                <Text style={styles.phonePrefix}>+233</Text>
                <TextInput
                  style={styles.phoneInput}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="50 123 4567"
                  placeholderTextColor={COLORS.muted}
                  maxLength={9}
                />
              </View>
            </View>

            {/* Continue Button */}
            <TouchableOpacity 
              style={[styles.continueBtn, currentAmount <= 0 && styles.continueBtnDisabled]} 
              onPress={handleContinue}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            {/* Confirmation Card */}
            <View style={styles.confirmCard}>
              <Text style={styles.confirmTitle}>Confirm Withdrawal</Text>
              
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Amount</Text>
                <Text style={styles.confirmValue}>GHS {currentAmount.toFixed(2)}</Text>
              </View>
              
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Fee</Text>
                <Text style={styles.confirmValue}>GHS 0.00</Text>
              </View>
              
              <View style={styles.confirmDivider} />
              
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Total</Text>
                <Text style={[styles.confirmValue, styles.confirmTotal]}>GHS {currentAmount.toFixed(2)}</Text>
              </View>
              
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>To</Text>
                <Text style={styles.confirmValue}>+233 {phone}</Text>
              </View>
            </View>

            {/* Info Notice */}
            <View style={styles.notice}>
              <AlertCircle size={16} color={COLORS.muted} />
              <Text style={styles.noticeText}>
                A GHS 0.50 fee applies for withdrawals below GHS 50
              </Text>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <CheckCircle size={20} color={COLORS.background} />
              <Text style={styles.confirmBtnText}>Confirm & Send</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepActive: {},
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
  },
  stepNum: {
    color: COLORS.muted,
    fontWeight: '700',
  },
  stepLabel: {
    color: COLORS.muted,
    fontSize: 12,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.surface,
    marginHorizontal: 8,
    marginBottom: 24,
  },
  balanceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceLabel: {
    color: COLORS.muted,
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: COLORS.text,
    fontSize: 36,
    fontWeight: '800',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    color: COLORS.muted,
    fontSize: 24,
    fontWeight: '600',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '800',
    paddingVertical: 16,
  },
  maxBtn: {
    position: 'absolute',
    right: 16,
    top: 44,
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  maxBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  phonePrefix: {
    color: COLORS.muted,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 16,
  },
  continueBtn: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  continueBtnDisabled: {
    backgroundColor: COLORS.muted,
    opacity: 0.5,
  },
  continueBtnText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '800',
  },
  confirmCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  confirmTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmLabel: {
    color: COLORS.muted,
    fontSize: 14,
  },
  confirmValue: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmTotal: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  confirmDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  noticeText: {
    color: COLORS.muted,
    fontSize: 13,
    flex: 1,
  },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  confirmBtnText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '800',
  },
});

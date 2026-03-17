import React from "react";
import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import { BinGoButton } from "./BinGoButton";
import { useAppTheme } from "../hooks/useThemeContext";

export const PaymentSelectionSheet = ({
  visible,
  onClose,
  selectedMethod,
  onSelectMethod,
  walletBalance,
  totalAmount,
  onConfirm,
}) => {
  const { isDark } = useAppTheme();
  const theme = isDark ? COLORS.dark : COLORS.light;

  const methods = [
    {
      id: 'momo',
      name: 'Mobile Money',
      icon: 'phone-portrait',
      subtitle: 'MTN, Telecel, AirtelTigo',
    },
    {
      id: 'wallet',
      name: 'BinGo Wallet',
      icon: 'wallet',
      subtitle: `Balance: GH₵ ${walletBalance || '0.00'}`,
    },
  ];

  const canUseWallet = parseFloat(walletBalance || '0') >= parseFloat(totalAmount || '0');

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={[styles.sheetContainer, { backgroundColor: theme.surface }]}>
          {/* Handle Bar */}
          <View style={styles.handleBar} />
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Select Payment Method</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.muted} />
            </Pressable>
          </View>

          {/* Payment Methods */}
          <View style={styles.methodsSection}>
            {methods.map((method) => {
              const isSelected = selectedMethod === method.id;
              const isDisabled = method.id === 'wallet' && !canUseWallet;
              
              return (
                <Pressable
                  key={method.id}
                  onPress={() => !isDisabled && onSelectMethod(method.id)}
                  style={[
                    styles.methodCard,
                    isSelected && styles.selectedMethod,
                    isDisabled && styles.disabledMethod,
                    { backgroundColor: theme.surface, borderColor: isSelected ? COLORS.primary : theme.border },
                  ]}
                  disabled={isDisabled}
                >
                  <View style={[
                    styles.iconCircle,
                    isSelected && styles.selectedIconCircle
                  ]}>
                    <Ionicons 
                      name={method.icon} 
                      size={24} 
                      color={isSelected ? COLORS.white : COLORS.primary} 
                    />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={[
                      styles.methodTitle,
                      { color: isDisabled ? COLORS.muted : theme.text }
                    ]}>
                      {method.name}
                    </Text>
                    <Text style={[
                      styles.methodSub,
                      { color: isDisabled ? COLORS.muted : COLORS.muted }
                    ]}>
                      {method.subtitle}
                    </Text>
                  </View>
                  <View style={[
                    styles.radio,
                    isSelected && styles.radioActive,
                    isDisabled && styles.radioDisabled,
                  ]}>
                    {isSelected && (
                      <Ionicons name="checkmark" size={12} color={COLORS.white} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Total Display */}
          <View style={[styles.totalSection, { backgroundColor: theme.background }]}>
            <Text style={[styles.totalLabel, { color: COLORS.muted }]}>Total Amount</Text>
            <Text style={[styles.totalAmount, { color: theme.text }]}>GH₵ {totalAmount}</Text>
          </View>

          {/* Notice */}
          <Text style={[styles.notice, { color: COLORS.muted }]}>
            {selectedMethod === 'momo' 
              ? 'You will be redirected to a secure Mobile Money portal.'
              : 'Your wallet balance will be used for this payment.'
            }
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <BinGoButton
              title={`Pay GH₵ ${totalAmount}`}
              onPress={onConfirm}
            />
            <Pressable 
              onPress={onClose} 
              style={styles.cancelButton}
            >
              <Text style={[styles.cancelText, { color: COLORS.muted }]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  closeBtn: {
    padding: 4,
  },
  methodsSection: {
    marginBottom: 24,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  selectedMethod: {
    borderColor: COLORS.primary,
    backgroundColor: "#F0FDF4",
  },
  disabledMethod: {
    opacity: 0.5,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  selectedIconCircle: {
    backgroundColor: COLORS.primary,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  methodSub: {
    fontSize: 12,
    marginTop: 2,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  radioActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  radioDisabled: {
    borderColor: "#D1D5DB",
    backgroundColor: "#E5E7EB",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "800",
  },
  notice: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
  },
  actionsSection: {
    gap: 12,
  },
  cancelButton: {
    padding: 14,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default PaymentSelectionSheet;

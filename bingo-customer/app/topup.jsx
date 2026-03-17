import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BinGoHeader } from "../components/BinGoHeader";
import { BinGoInput } from "../components/BinGoInput";
import { BinGoButton } from "../components/BinGoButton";
import { SuccessModal } from "../components/SuccessModal";
import { useColors } from "../hooks/useColors";
import { useTopUpStore, useWalletStore, TopUpMethods, QuickAmounts } from "../stores";

export default function TopUp() {
  const router = useRouter();
  const colors = useColors();
  
  // Use stores
  const { amount, method, isProcessing, isValidAmount, setAmount, setMethod, processTopUp, reset } = useTopUpStore();
  const { addBalance } = useWalletStore();
  
  // Local UI state
  const [showSuccess, setShowSuccess] = React.useState(false);

  const quickAmounts = QuickAmounts.map(String);

  const handleTopUp = async () => {
    // Process top-up
    const result = await processTopUp();
    
    if (result) {
      // Add to wallet
      addBalance(parseFloat(amount));
      setShowSuccess(true);
    }
  };

  const handleCloseModal = () => {
    setShowSuccess(false);
    reset(); // Reset top-up store
    router.replace("/(tabs)"); // Go back home after success
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
    },
    section: {
      marginBottom: 32,
    },
    label: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 10,
    },
    quickAmountRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 12,
    },
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    chipText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.muted,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },
    methodCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
    },
    selectedMethod: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '15',
    },
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary + '15',
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    methodInfo: {
      flex: 1,
    },
    methodTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    methodSub: {
      fontSize: 12,
      color: colors.muted,
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.border,
    },
    radioActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    footer: {
      marginTop: 40,
    },
    notice: {
      textAlign: "center",
      fontSize: 12,
      color: colors.muted,
      marginBottom: 16,
      lineHeight: 18,
    },
  }), [colors]);

  return (
    <View style={styles.container}>
      <BinGoHeader
        title="Top Up Wallet"
        showBack={true}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Enter Amount (GH₵)</Text>
          <BinGoInput
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <View style={styles.quickAmountRow}>
            {quickAmounts.map((amt) => (
              <Pressable
                key={amt}
                style={styles.chip}
                onPress={() => setAmount(amt)}
              >
                <Text style={styles.chipText}>+ GH₵{amt}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        <Pressable
          style={[
            styles.methodCard,
            method === "momo" && styles.selectedMethod,
          ]}
          onPress={() => setMethod("momo")}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="phone-portrait" size={24} color={colors.primary} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Mobile Money</Text>
            <Text style={styles.methodSub}>MTN, Telecel, AT</Text>
          </View>
          <View
            style={[styles.radio, method === "momo" && styles.radioActive]}
          />
        </Pressable>

        <Pressable
          style={[
            styles.methodCard,
            method === "card" && styles.selectedMethod,
          ]}
          onPress={() => setMethod("card")}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="card" size={24} color={colors.primary} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Debit Card</Text>
            <Text style={styles.methodSub}>Visa, Mastercard</Text>
          </View>
          <View
            style={[styles.radio, method === "card" && styles.radioActive]}
          />
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.notice}>
            You will be redirected to a secure Paystack portal to complete this
            transaction.
          </Text>
          <BinGoButton
            title={`Top Up GH₵${amount || "0"}`}
            onPress={handleTopUp}
            disabled={!isValidAmount || isProcessing}
            loading={isProcessing}
          />
        </View>
      </ScrollView>

      <SuccessModal
        visible={showSuccess}
        onClose={handleCloseModal}
        title="Top-up Successful"
        message={`GH₵ ${amount} has been added to your BinGo wallet. You're all set for your next pickup!`}
      />
    </View>
  );
}

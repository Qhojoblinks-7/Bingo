import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BinGoHeader } from "@/components/BinGoHeader";
import { BinGoInput } from "@/components/BinGoInput";
import { BinGoButton } from "@/components/BinGoButton";
import { useAppTheme } from "@/hooks/useThemeContext";

// Mock data for payment methods
const INITIAL_PAYMENTS = [
  {
    id: "1",
    type: "momo",
    name: "MTN Mobile Money",
    number: "****4567",
    isDefault: true,
  },
  {
    id: "2",
    type: "momo",
    name: "Vodafone Cash",
    number: "****8901",
    isDefault: false,
  },
];

export default function PaymentMethods() {
  const { isDark } = useAppTheme();

  const colors = isDark
    ? {
        background: "#121212",
        card: "#1E1E1E",
        text: "#FFFFFF",
        muted: "#A0A0A0",
        primary: "#10B981",
        white: "#FFFFFF",
        border: "#333333",
        inputBg: "#2A2A2A",
      }
    : {
        background: "#F9FAFB",
        card: "#FFFFFF",
        text: "#111827",
        muted: "#6B7280",
        primary: "#10B981",
        white: "#FFFFFF",
        border: "#E5E7EB",
        inputBg: "#F3F4F6",
      };

  const [paymentMethods, setPaymentMethods] = useState(INITIAL_PAYMENTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPayment, setNewPayment] = useState({ name: "", number: "" });
  const [selectedProvider, setSelectedProvider] = useState("mtn");

  const providers = [
    { id: "mtn", name: "MTN Mobile Money", icon: "phone-portrait" },
    { id: "vodafone", name: "Vodafone Cash", icon: "call" },
    { id: "airteltigo", name: "AirtelTigo Money", icon: "globe" },
  ];

  const handleSetDefault = (id) => {
    setPaymentMethods(
      paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      })),
    );
  };

  const handleDelete = (id, name) => {
    Alert.alert(
      "Remove Payment Method",
      `Are you sure you want to remove ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
          },
        },
      ],
    );
  };

  const handleAddPayment = () => {
    if (!newPayment.number || newPayment.number.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    const provider = providers.find((p) => p.id === selectedProvider);
    const newMethod = {
      id: Date.now().toString(),
      type: "momo",
      name: provider.name,
      number: "****" + newPayment.number.slice(-4),
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddModal(false);
    setNewPayment({ name: "", number: "" });
    Alert.alert("Success", "Payment method added successfully");
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        content: {
          padding: 20,
          paddingBottom: 40,
        },
        infoCard: {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: isDark ? "#1A3A2A" : "#F0FDF4",
          padding: 14,
          borderRadius: 12,
          marginBottom: 24,
        },
        infoText: {
          flex: 1,
          fontSize: 13,
          color: colors.text,
        },
        section: {
          marginBottom: 24,
        },
        sectionLabel: {
          fontSize: 14,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 12,
        },
        paymentCard: {
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: colors.border,
        },
        cardHeader: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        },
        methodIcon: {
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: isDark ? "#1A3A2A" : "#F0FDF4",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        },
        methodInfo: {
          flex: 1,
        },
        methodName: {
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
        },
        methodNumber: {
          fontSize: 14,
          color: colors.muted,
          marginTop: 2,
        },
        defaultBadge: {
          backgroundColor: colors.primary,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 8,
        },
        defaultText: {
          fontSize: 11,
          fontWeight: "700",
          color: colors.white,
        },
        cardActions: {
          flexDirection: "row",
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 12,
          gap: 20,
        },
        actionBtn: {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        },
        actionText: {
          fontSize: 13,
          color: colors.primary,
          fontWeight: "600",
        },
        addPaymentBtn: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor: colors.card,
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.primary,
          borderStyle: "dashed",
          marginBottom: 24,
        },
        addPaymentText: {
          fontSize: 16,
          fontWeight: "600",
          color: colors.primary,
        },
        networksSection: {
          backgroundColor: colors.card,
          padding: 16,
          borderRadius: 12,
        },
        networksTitle: {
          fontSize: 14,
          fontWeight: "700",
          color: colors.text,
          marginBottom: 12,
        },
        networksRow: {
          flexDirection: "row",
          gap: 10,
        },
        networkBadge: {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          backgroundColor: colors.inputBg,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.border,
        },
        networkName: {
          fontSize: 12,
          fontWeight: "600",
          color: colors.text,
        },
        // Modal Styles
        modalOverlay: {
          flex: 1,
          justifyContent: "flex-end",
        },
        modalBackdrop: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        modalContent: {
          backgroundColor: colors.card,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 20,
          paddingBottom: 40,
        },
        modalHandle: {
          width: 40,
          height: 4,
          backgroundColor: colors.border,
          borderRadius: 2,
          alignSelf: "center",
          marginBottom: 20,
        },
        modalTitle: {
          fontSize: 20,
          fontWeight: "800",
          color: colors.text,
          marginBottom: 8,
        },
        modalSubtitle: {
          fontSize: 14,
          color: colors.muted,
          marginBottom: 24,
        },
        inputLabel: {
          fontSize: 14,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 8,
          marginTop: 16,
        },
        providerGrid: {
          flexDirection: "row",
          gap: 12,
          marginBottom: 8,
        },
        providerCard: {
          flex: 1,
          alignItems: "center",
          padding: 16,
          backgroundColor: colors.inputBg,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: "transparent",
        },
        providerCardSelected: {
          borderColor: colors.primary,
          backgroundColor: isDark ? "#1A3A2A" : "#F0FDF4",
        },
        providerName: {
          fontSize: 11,
          fontWeight: "600",
          color: colors.muted,
          marginTop: 8,
          textAlign: "center",
        },
        providerNameSelected: {
          color: colors.primary,
        },
        modalActions: {
          marginTop: 24,
          gap: 12,
        },
      }),
    [colors, isDark],
  );

  return (
    <View style={styles.container}>
      <BinGoHeader title="Payment Methods" showBack />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Your payment information is encrypted and secure
          </Text>
        </View>

        {/* Payment Methods List */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Saved Payment Methods</Text>

          {paymentMethods.map((method) => (
            <Pressable key={method.id} style={styles.paymentCard}>
              <View style={styles.cardHeader}>
                <View style={styles.methodIcon}>
                  <Ionicons
                    name={method.type === "momo" ? "phone-portrait" : "card"}
                    size={20}
                    color={colors.primary}
                  />
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
              </View>

              <View style={styles.cardActions}>
                {!method.isDefault && (
                  <Pressable
                    onPress={() => handleSetDefault(method.id)}
                    style={styles.actionBtn}
                  >
                    <Ionicons
                      name="star-outline"
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={styles.actionText}>Set Default</Text>
                  </Pressable>
                )}
                <Pressable
                  onPress={() => handleDelete(method.id, method.name)}
                  style={styles.actionBtn}
                >
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  <Text style={[styles.actionText, { color: "#EF4444" }]}>
                    Remove
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Add New Payment */}
        <Pressable
          style={styles.addPaymentBtn}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add-circle" size={24} color={colors.primary} />
          <Text style={styles.addPaymentText}>Add New Payment Method</Text>
        </Pressable>

        {/* Supported Networks */}
        <View style={styles.networksSection}>
          <Text style={styles.networksTitle}>Supported Networks</Text>
          <View style={styles.networksRow}>
            {providers.map((provider) => (
              <View key={provider.id} style={styles.networkBadge}>
                <Ionicons name={provider.icon} size={16} color={colors.text} />
                <Text style={styles.networkName}>
                  {provider.name.split(" ")[0]}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Add Payment Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowAddModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>Add Payment Method</Text>
            <Text style={styles.modalSubtitle}>
              Connect your Mobile Money account for faster payments
            </Text>

            {/* Provider Selection */}
            <Text style={styles.inputLabel}>Select Network</Text>
            <View style={styles.providerGrid}>
              {providers.map((provider) => (
                <Pressable
                  key={provider.id}
                  style={[
                    styles.providerCard,
                    selectedProvider === provider.id &&
                      styles.providerCardSelected,
                  ]}
                  onPress={() => setSelectedProvider(provider.id)}
                >
                  <Ionicons
                    name={provider.icon}
                    size={24}
                    color={
                      selectedProvider === provider.id
                        ? colors.primary
                        : colors.muted
                    }
                  />
                  <Text
                    style={[
                      styles.providerName,
                      selectedProvider === provider.id &&
                        styles.providerNameSelected,
                    ]}
                  >
                    {provider.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Phone Number Input */}
            <Text style={styles.inputLabel}>Phone Number</Text>
            <BinGoInput
              value={newPayment.number}
              onChangeText={(text) =>
                setNewPayment({ ...newPayment, number: text })
              }
              placeholder="Enter your MoMo number"
              keyboardType="phone-pad"
            />

            {/* Actions */}
            <View style={styles.modalActions}>
              <BinGoButton
                title="Add Payment Method"
                onPress={handleAddPayment}
              />
              <BinGoButton
                title="Cancel"
                onPress={() => setShowAddModal(false)}
                variant="outline"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

import React from "react";
import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import { BinGoButton } from "./BinGoButton";
import { useAppTheme } from "../hooks/useThemeContext";

export const TransactionDetailsSheet = ({
  visible,
  onClose,
  transactionId,
  amount,
  date,
  time,
  method,
  status,
  transactionType, // 'topup' or 'payment'
}) => {
  const { isDark } = useAppTheme();
  const theme = isDark ? COLORS.dark : COLORS.light;

  const isTopUp = transactionType === "topup";

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return COLORS.primary;
      case "pending":
        return "#F59E0B";
      case "failed":
        return COLORS.error;
      default:
        return COLORS.muted;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return "checkmark-circle";
      case "pending":
        return "time";
      case "failed":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

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
            <Text style={[styles.title, { color: theme.text }]}>Transaction Details</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.muted} />
            </Pressable>
          </View>

          {/* Amount Display */}
          <View style={styles.amountSection}>
            <Text
              style={[
                styles.amount,
                { color: isTopUp ? COLORS.primary : theme.text },
              ]}
            >
              {isTopUp ? "+" : "-"}GH₵ {amount}
            </Text>
            <View style={styles.statusRow}>
              <Ionicons
                name={getStatusIcon()}
                size={16}
                color={getStatusColor()}
              />
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {status === "success"
                  ? "Successful"
                  : (status || "pending").charAt(0).toUpperCase() + (status || "pending").slice(1)}
              </Text>
            </View>
          </View>

          {/* Transaction Details */}
          <View style={[styles.detailsSection, { backgroundColor: theme.background }]}>
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: COLORS.muted }]}>Transaction ID</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{transactionId || "N/A"}</Text>
            </View>

            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: COLORS.muted }]}>Date</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{date || "N/A"}</Text>
            </View>

            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: COLORS.muted }]}>Time</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{time || "N/A"}</Text>
            </View>

            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: COLORS.muted }]}>Payment Method</Text>
              <View style={styles.methodBadge}>
                <Ionicons
                  name={method === "momo" ? "phone-portrait" : "card"}
                  size={14}
                  color={COLORS.primary}
                />
                <Text style={[styles.methodText, { color: COLORS.primary }]}>
                  {method === "momo" ? "Mobile Money" : "Debit Card"}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: COLORS.muted }]}>Type</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {isTopUp ? "Wallet Top-up" : "Pickup Payment"}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <Pressable style={styles.downloadButton}>
              <Ionicons
                name="download-outline"
                size={20}
                color={COLORS.primary}
              />
              <Text style={[styles.downloadText, { color: COLORS.primary }]}>Download Receipt</Text>
            </Pressable>
          </View>

          {/* Close Button */}
          <BinGoButton
            title="Close"
            onPress={onClose}
            variant="outline"
            style={styles.closeButton}
          />
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
    position: "absolute",
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
  amountSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  amount: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  detailsSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  methodBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  methodText: {
    fontSize: 12,
    fontWeight: "600",
  },
  actionsSection: {
    marginBottom: 20,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
  },
  downloadText: {
    fontSize: 14,
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 8,
  },
});

export default TransactionDetailsSheet;

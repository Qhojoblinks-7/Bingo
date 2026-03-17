import React from "react";
import { View, Text, StyleSheet, Modal, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import { BinGoButton } from "./BinGoButton";
import { useAppTheme } from "../hooks/useThemeContext";

export const ProofOfServiceSheet = ({
  visible,
  onClose,
  proofImage,
  riderName = "Rider Name",
  riderPhone = "+233 00 000 0000",
  completedAt = "Recently",
}) => {
  const { isDark } = useAppTheme();
  const theme = isDark ? COLORS.dark : COLORS.light;

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
            <Text style={[styles.title, { color: theme.text }]}>Proof of Service</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.muted} />
            </Pressable>
          </View>

          {/* Proof Image */}
          <View style={styles.imageContainer}>
            {proofImage ? (
              <Image source={{ uri: proofImage }} style={styles.proofImage} />
            ) : (
              <View style={[styles.placeholderImage, { backgroundColor: theme.background }]}>
                <Ionicons name="camera" size={40} color={COLORS.muted} />
                <Text style={[styles.placeholderText, { color: COLORS.muted }]}>No photo available</Text>
              </View>
            )}
            <View style={[styles.completedBadge, { backgroundColor: theme.surface }]}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
              <Text style={[styles.completedText, { color: COLORS.primary }]}>Completed {completedAt}</Text>
            </View>
          </View>

          {/* Rider Info */}
          <View style={styles.riderSection}>
            <Text style={[styles.sectionTitle, { color: COLORS.muted }]}>Your Rider</Text>
            <View style={[styles.riderCard, { backgroundColor: theme.background }]}>
              <View style={styles.riderAvatar}>
                <Ionicons name="person" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.riderInfo}>
                <Text style={[styles.riderName, { color: theme.text }]}>{riderName}</Text>
                <Text style={[styles.riderPhone, { color: COLORS.muted }]}>{riderPhone}</Text>
              </View>
            </View>
          </View>

          {/* Support Options */}
          <View style={styles.supportSection}>
            <Text style={[styles.sectionTitle, { color: COLORS.muted }]}>Need Help?</Text>
            <View style={styles.supportButtons}>
              <Pressable style={styles.supportButton}>
                <Ionicons name="call" size={20} color={COLORS.primary} />
                <Text style={[styles.supportText, { color: COLORS.primary }]}>Call Support</Text>
              </Pressable>
              <Pressable style={styles.supportButton}>
                <Ionicons name="chatbubble" size={20} color={COLORS.primary} />
                <Text style={[styles.supportText, { color: COLORS.primary }]}>Chat</Text>
              </Pressable>
            </View>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  closeBtn: {
    padding: 4,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  proofImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
  },
  placeholderImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
  },
  completedBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedText: {
    fontSize: 12,
    fontWeight: "600",
  },
  riderSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  riderCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  riderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontSize: 16,
    fontWeight: "700",
  },
  riderPhone: {
    fontSize: 13,
    marginTop: 2,
  },
  supportSection: {
    marginBottom: 24,
  },
  supportButtons: {
    flexDirection: "row",
    gap: 12,
  },
  supportButton: {
    flex: 1,
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
  supportText: {
    fontSize: 14,
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 8,
  },
});

export default ProofOfServiceSheet;

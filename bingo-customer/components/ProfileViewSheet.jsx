import React from "react";
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import { BinGoButton } from "./BinGoButton";
import { useAppTheme } from "../hooks/useThemeContext";

export const ProfileViewSheet = ({
  visible,
  onClose,
  // User profile data
  name = "User",
  email = "user@example.com",
  phone = "",
  avatar = null,
  memberSince = "2024",
  totalPickups = 0,
  onEditPress,
}) => {
  const { isDark } = useAppTheme();
  const theme = isDark ? COLORS.dark : COLORS.light;

  // Get initials from name
  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const names = fullName.trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
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
            <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.muted} />
            </Pressable>
          </View>

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: COLORS.primary }]}>
              {avatar ? (
                <View style={styles.avatarImage}>
                  {/* Add Image component here if needed */}
                  <Text style={styles.avatarText}>{getInitials(name)}</Text>
                </View>
              ) : (
                <Text style={styles.avatarText}>{getInitials(name)}</Text>
              )}
            </View>
            <Text style={[styles.userName, { color: theme.text }]}>{name}</Text>
            <Text style={[styles.userEmail, { color: COLORS.muted }]}>{email}</Text>
          </View>

          {/* Stats */}
          <View style={[styles.statsRow, { backgroundColor: theme.background }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>{totalPickups}</Text>
              <Text style={[styles.statLabel, { color: COLORS.muted }]}>Pickups</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>{memberSince}</Text>
              <Text style={[styles.statLabel, { color: COLORS.muted }]}>Member Since</Text>
            </View>
          </View>

          {/* Profile Details */}
          <ScrollView style={styles.detailsSection} showsVerticalScrollIndicator={false}>
            {phone && (
              <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
                <View style={styles.detailIcon}>
                  <Ionicons name="call-outline" size={18} color={COLORS.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: COLORS.muted }]}>Phone</Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>{phone}</Text>
                </View>
              </View>
            )}

            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <View style={styles.detailIcon}>
                <Ionicons name="mail-outline" size={18} color={COLORS.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: COLORS.muted }]}>Email</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>{email}</Text>
              </View>
            </View>

            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <View style={styles.detailIcon}>
                <Ionicons name="wallet-outline" size={18} color={COLORS.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: COLORS.muted }]}>Payment</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>Mobile Money, Cards</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: COLORS.muted }]}>Account Status</Text>
                <Text style={[styles.detailValue, { color: COLORS.primary }]}>Verified</Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Button */}
          <View style={styles.actionSection}>
            <BinGoButton
              title="Edit Profile"
              onPress={onEditPress || onClose}
            />
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
    maxHeight: '80%',
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
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "800",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  detailsSection: {
    maxHeight: 200,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primary + '15',
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  actionSection: {
    marginTop: 8,
  },
});

export default ProfileViewSheet;

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import { BinGoButton } from "./BinGoButton";
import { useAppTheme } from "../hooks/useThemeContext";

export const DataRightsSheet = ({
  visible,
  onClose,
}) => {
  const { isDark } = useAppTheme();
  const theme = isDark ? COLORS.dark : COLORS.light;
  
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDownloadData = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      Alert.alert(
        "Request Submitted",
        "Your data will be sent to your email within 48 hours."
      );
    }, 2000);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all associated data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setDeleting(true);
            setTimeout(() => {
              setDeleting(false);
              Alert.alert(
                "Account Deletion Scheduled",
                "Your account will be deleted within 30 days."
              );
            }, 2000);
          },
        },
      ]
    );
  };

  const handleRequestCorrection = () => {
    Alert.alert(
      "Request Data Correction",
      "This will open a form to specify which data needs to be corrected.",
      [{ text: "OK" }]
    );
  };

  const handleRevokeConsent = () => {
    Alert.alert(
      "Revoke Consent",
      "This will revoke your consent for data processing.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Revoke",
          style: "destructive",
          onPress: () => {
            Alert.alert("Success", "Your consent has been revoked.");
          },
        },
      ]
    );
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
            <Text style={[styles.title, { color: theme.text }]}>Your Data Rights</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.muted} />
            </Pressable>
          </View>

          {/* Info */}
          <View style={[styles.infoBox, { backgroundColor: isDark ? '#052e16' : '#F0FDF4' }]}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
            <Text style={[styles.infoText, { color: theme.text }]}>
              Under Ghana's Data Protection Act, you have rights over your personal data.
            </Text>
          </View>

          {/* Options */}
          <View style={styles.optionsSection}>
            <Pressable style={[styles.optionCard, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={handleDownloadData}>
              <View style={styles.optionIcon}>
                <Ionicons name="download" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={[styles.optionTitle, { color: theme.text }]}>Download My Data</Text>
                <Text style={[styles.optionSubtitle, { color: COLORS.muted }]}>Get a copy of all your data</Text>
              </View>
            </Pressable>

            <Pressable style={[styles.optionCard, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={handleRequestCorrection}>
              <View style={styles.optionIcon}>
                <Ionicons name="create" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={[styles.optionTitle, { color: theme.text }]}>Request Correction</Text>
                <Text style={[styles.optionSubtitle, { color: COLORS.muted }]}>Correct inaccurate data</Text>
              </View>
            </Pressable>

            <Pressable style={[styles.optionCard, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={handleRevokeConsent}>
              <View style={styles.optionIcon}>
                <Ionicons name="hand-left" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={[styles.optionTitle, { color: theme.text }]}>Revoke Consent</Text>
                <Text style={[styles.optionSubtitle, { color: COLORS.muted }]}>Withdraw data processing consent</Text>
              </View>
            </Pressable>
          </View>

          {/* Danger Zone */}
          <View style={styles.dangerSection}>
            <Text style={[styles.dangerTitle, { color: COLORS.error }]}>Danger Zone</Text>
            <Pressable style={styles.dangerBtn} onPress={handleDeleteAccount}>
              <Ionicons name="trash" size={18} color={COLORS.error} />
              <Text style={[styles.dangerBtnText, { color: COLORS.error }]}>Delete My Account</Text>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  closeBtn: {
    padding: 4,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
  },
  optionsSection: {
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  optionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  dangerSection: {
    marginBottom: 20,
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },
  dangerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  dangerBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 8,
  },
});

export default DataRightsSheet;

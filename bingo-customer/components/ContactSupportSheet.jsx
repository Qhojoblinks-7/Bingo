import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/Colors";
import { BinGoButton } from "./BinGoButton";
import { useAppTheme } from "../hooks/useThemeContext";

export const ContactSupportSheet = ({
  visible,
  onClose,
  title = "Contact Support",
  subtitle = "How can we help you today?",
}) => {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const theme = isDark ? COLORS.dark : COLORS.light;

  const supportOptions = [
    {
      id: "call",
      title: "Call Us",
      subtitle: "Mon-Fri, 8am-6pm",
      icon: "call",
      action: () => {
        Linking.openURL("tel:+233500000000");
      },
    },
    {
      id: "chat",
      title: "Live Chat",
      subtitle: "Available 24/7",
      icon: "chatbubble-ellipses",
      action: () => {
        router.push("/chat");
      },
    },
    {
      id: "whatsapp",
      title: "WhatsApp",
      subtitle: "Quick responses",
      icon: "logo-whatsapp",
      action: () => {
        Linking.openURL("whatsapp://send?text=Hello&phone=+233500000000");
      },
    },
    {
      id: "email",
      title: "Email Support",
      subtitle: "support@bingo.com.gh",
      icon: "mail",
      action: () => {
        Linking.openURL("mailto:support@bingo.com.gh");
      },
    },
  ];

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
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.muted} />
            </Pressable>
          </View>

          <Text style={[styles.subtitle, { color: COLORS.muted }]}>{subtitle}</Text>

          {/* Support Options */}
          <View style={styles.optionsSection}>
            {supportOptions.map((option) => (
              <Pressable
                key={option.id}
                style={[styles.optionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => {
                  option.action();
                  onClose();
                }}
              >
                <View style={styles.optionIcon}>
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={COLORS.primary}
                  />
                </View>
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionTitle, { color: theme.text }]}>{option.title}</Text>
                  <Text style={[styles.optionSubtitle, { color: COLORS.muted }]}>{option.subtitle}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={COLORS.muted}
                />
              </Pressable>
            ))}
          </View>

          {/* Emergency Notice */}
          <View style={styles.emergencyBox}>
            <Ionicons name="warning" size={20} color="#F59E0B" />
            <Text style={styles.emergencyText}>
              For urgent waste collection emergencies, call our emergency line
              at +233 55 000 0000
            </Text>
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
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  closeBtn: {
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  optionsSection: {
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  optionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  emergencyBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#FFFBEB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  emergencyText: {
    flex: 1,
    fontSize: 12,
    color: "#B45309",
    lineHeight: 18,
  },
  closeButton: {
    marginTop: 8,
  },
});

export default ContactSupportSheet;

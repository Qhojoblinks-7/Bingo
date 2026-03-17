import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BinGoHeader } from "@/components/BinGoHeader";
import { BinGoButton } from "@/components/BinGoButton";
import { useAppTheme } from "@/hooks/useThemeContext";

const SUPPORT_OPTIONS = [
  {
    id: "chat",
    title: "Live Chat",
    subtitle: "Chat with our support team",
    icon: "chatbubble-ellipses",
    color: "#10B981",
    action: () => {},
  },
  {
    id: "call",
    title: "Call Support",
    subtitle: "Speak to our team directly",
    icon: "call",
    color: "#3B82F6",
    action: () => {
      Linking.openURL("tel:+233300000000").catch(() => {
        Alert.alert("Error", "Unable to make phone call");
      });
    },
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    subtitle: "Quick help via WhatsApp",
    icon: "logo-whatsapp",
    color: "#25D366",
    action: () => {
      Linking.openURL("whatsapp://send?text=Hello BinGo Support").catch(() => {
        Alert.alert("Error", "WhatsApp is not installed");
      });
    },
  },
  {
    id: "email",
    title: "Email Support",
    subtitle: "support@bingo.com.gh",
    icon: "mail",
    color: "#F59E0B",
    action: () => {
      Linking.openURL("mailto:support@bingo.com.gh").catch(() => {
        Alert.alert("Error", "Unable to open email");
      });
    },
  },
];

const FAQ_ITEMS = [
  {
    question: "How do I schedule a pickup?",
    answer:
      "Go to Home > Request Pickup, select bin size, enter address, and confirm payment.",
  },
  {
    question: "What are the bin sizes?",
    answer:
      "Small (120L), Medium (240L), Large (660L), and Skip (1200L) bins available.",
  },
  {
    question: "How do I top up my wallet?",
    answer:
      "Go to Wallet > Top Up, enter amount, and pay via Mobile Money or Card.",
  },
  {
    question: "Can I cancel a pickup?",
    answer:
      'Yes, go to Activity > select pickup > Cancel (only if status is "awaiting").',
  },
];

export default function Support() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const [expandedFaq, setExpandedFaq] = useState(null);

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

  const handleOptionPress = (option) => {
    if (option.id === "chat") {
      router.push("/chat");
    } else {
      option.action();
    }
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
        },
        sectionTitle: {
          fontSize: 16,
          fontWeight: "700",
          color: colors.text,
          marginBottom: 16,
          marginTop: 8,
        },
        optionsGrid: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        },
        optionCard: {
          width: "47%",
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 16,
          alignItems: "center",
          borderWidth: 1,
          borderColor: colors.border,
        },
        optionIcon: {
          width: 56,
          height: 56,
          borderRadius: 16,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 12,
        },
        optionTitle: {
          fontSize: 14,
          fontWeight: "700",
          color: colors.text,
          marginBottom: 4,
        },
        optionSubtitle: {
          fontSize: 11,
          color: colors.muted,
          textAlign: "center",
        },
        faqSection: {
          backgroundColor: colors.card,
          borderRadius: 16,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: 24,
        },
        faqItem: {
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        faqHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        faqQuestion: {
          flex: 1,
          fontSize: 14,
          fontWeight: "600",
          color: colors.text,
          marginRight: 12,
        },
        faqAnswer: {
          fontSize: 13,
          color: colors.muted,
          marginTop: 12,
          lineHeight: 18,
        },
        appInfo: {
          alignItems: "center",
          paddingVertical: 20,
        },
        appInfoTitle: {
          fontSize: 16,
          fontWeight: "700",
          color: colors.text,
          marginBottom: 8,
        },
        appInfoText: {
          fontSize: 12,
          color: colors.muted,
          marginBottom: 4,
        },
        socialLinks: {
          flexDirection: "row",
          gap: 16,
          marginTop: 16,
        },
        socialIcon: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.inputBg,
          justifyContent: "center",
          alignItems: "center",
        },
      }),
    [colors],
  );

  return (
    <View style={styles.container}>
      <BinGoHeader title="Contact Support" showBack />

      <View style={styles.content}>
        {/* Quick Contact Options */}
        <Text style={styles.sectionTitle}>How can we help?</Text>
        <View style={styles.optionsGrid}>
          {SUPPORT_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleOptionPress(option)}
            >
              <View
                style={[
                  styles.optionIcon,
                  { backgroundColor: option.color + "20" },
                ]}
              >
                <Ionicons name={option.icon} size={24} color={option.color} />
              </View>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
            </Pressable>
          ))}
        </View>

        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.faqSection}>
          {FAQ_ITEMS.map((item, index) => (
            <Pressable
              key={index}
              style={styles.faqItem}
              onPress={() =>
                setExpandedFaq(expandedFaq === index ? null : index)
              }
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Ionicons
                  name={expandedFaq === index ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.muted}
                />
              </View>
              {expandedFaq === index && (
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              )}
            </Pressable>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>BinGo Customer</Text>
          <Text style={styles.appInfoText}>Version 1.0.0 (SDK 54)</Text>
          <Text style={styles.appInfoText}>User ID: USR-2024-001</Text>
          <View style={styles.socialLinks}>
            <Pressable style={styles.socialIcon}>
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
            </Pressable>
            <Pressable style={styles.socialIcon}>
              <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
            </Pressable>
            <Pressable style={styles.socialIcon}>
              <Ionicons name="logo-instagram" size={20} color="#E4405F" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

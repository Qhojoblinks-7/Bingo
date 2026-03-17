import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BinGoHeader } from "@/components/BinGoHeader";
import { BinGoInput } from "@/components/BinGoInput";
import { BinGoButton } from "@/components/BinGoButton";
import { useAppTheme } from "@/hooks/useThemeContext";

export default function EditProfile() {
  const router = useRouter();
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
      }
    : {
        background: "#F9FAFB",
        card: "#FFFFFF",
        text: "#111827",
        muted: "#6B7280",
        primary: "#10B981",
        white: "#FFFFFF",
        border: "#E5E7EB",
      };

  const [formData, setFormData] = useState({
    fullName: "Immanuel Appiah",
    phone: "+233 50 123 4567",
    email: "immanuel@bingo.com.gh",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      Alert.alert("Success", "Your profile has been updated.");
    }, 1000);
  };

  const handleCancel = () => {
    if (isEditing) {
      Alert.alert(
        "Discard Changes?",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              setIsEditing(false);
              router.back();
            },
          },
        ],
      );
    } else {
      router.back();
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
          paddingBottom: 40,
        },
        avatarSection: {
          alignItems: "center",
          marginBottom: 32,
        },
        avatar: {
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: colors.primary,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 12,
        },
        avatarText: {
          color: colors.white,
          fontSize: 36,
          fontWeight: "800",
        },
        changePhotoBtn: {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingVertical: 8,
          paddingHorizontal: 16,
        },
        changePhotoText: {
          color: colors.primary,
          fontSize: 14,
          fontWeight: "600",
        },
        formSection: {
          marginBottom: 24,
        },
        sectionLabel: {
          fontSize: 14,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 8,
          marginTop: 16,
        },
        verificationSection: {
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: colors.border,
        },
        verificationBadge: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        },
        verificationText: {
          fontSize: 16,
          fontWeight: "600",
          color: colors.primary,
        },
        verificationNote: {
          fontSize: 12,
          color: colors.muted,
          marginLeft: 28,
        },
        buttonSection: {
          gap: 12,
        },
        cancelButton: {
          marginTop: 0,
        },
      }),
    [colors],
  );

  return (
    <View style={styles.container}>
      <BinGoHeader
        title="Personal Information"
        showBack
        onBack={handleCancel}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>IA</Text>
          </View>
          <Pressable style={styles.changePhotoBtn}>
            <Ionicons name="camera" size={16} color={colors.primary} />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </Pressable>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Full Name</Text>
          <BinGoInput
            value={formData.fullName}
            onChangeText={(text) => {
              setFormData({ ...formData, fullName: text });
              setIsEditing(true);
            }}
            placeholder="Enter your full name"
            editable={true}
          />

          <Text style={styles.sectionLabel}>Phone Number</Text>
          <BinGoInput
            value={formData.phone}
            onChangeText={(text) => {
              setFormData({ ...formData, phone: text });
              setIsEditing(true);
            }}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            editable={true}
          />

          <Text style={styles.sectionLabel}>Email Address</Text>
          <BinGoInput
            value={formData.email}
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              setIsEditing(true);
            }}
            placeholder="Enter email address"
            keyboardType="email-address"
            editable={true}
          />
        </View>

        {/* Verification Badge */}
        <View style={styles.verificationSection}>
          <View style={styles.verificationBadge}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.verificationText}>Verified Account</Text>
          </View>
          <Text style={styles.verificationNote}>
            Your identity has been verified via MoMo
          </Text>
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.buttonSection}>
            <BinGoButton
              title="Save Changes"
              onPress={handleSave}
              loading={isSaving}
            />
            <BinGoButton
              title="Cancel"
              onPress={handleCancel}
              variant="outline"
              style={styles.cancelButton}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

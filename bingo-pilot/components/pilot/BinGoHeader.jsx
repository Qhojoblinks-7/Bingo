import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Platform,
} from "react-native";
import { Signal, ShieldCheck, Zap } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { COLORS } from "../../constants/Colors";
import { TEXT_STYLES, SHADOWS } from "../../constants/Styles";

export const BinGoHeader = ({ isOnline, onToggle, pilotName, rank }) => {
  const handleToggle = () => {
    // Provide tactile feedback for the physical action of "Starting Work"
    Haptics.notificationAsync(
      isOnline
        ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Success,
    );
    onToggle();
  };

  return (
    <View style={[styles.container, SHADOWS.card]}>
      {/* LEFT: PILOT PROFILE & RANK */}
      <View style={styles.profileGroup}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
            }}
            style={[
              styles.avatar,
              { borderColor: isOnline ? COLORS.primary : COLORS.surface },
            ]}
          />
          {isOnline && <View style={styles.onlineBadge} />}
        </View>

        <View>
          <Text style={TEXT_STYLES.body}>{pilotName || "Pilot"}</Text>
          <View style={styles.rankRow}>
            <ShieldCheck size={12} color={COLORS.primary} />
            <Text style={TEXT_STYLES.caption}>
              {rank || "Level 4 Operator"}
            </Text>
          </View>
        </View>
      </View>

      {/* RIGHT: THE DUTY TOGGLE */}
      <Pressable
        onPress={handleToggle}
        style={({ pressed }) => [
          styles.toggleBtn,
          isOnline ? styles.btnOnline : styles.btnOffline,
          pressed && { opacity: 0.8 },
        ]}
      >
        <Zap
          size={16}
          color={COLORS.text}
          fill={isOnline ? COLORS.text : "transparent"}
        />
        <Text style={styles.toggleText}>
          {isOnline ? "ON DUTY" : "GO ONLINE"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: Platform.OS === "ios" ? 0 : 10,
  },
  profileGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
  },
  onlineBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  btnOnline: {
    backgroundColor: COLORS.primary,
  },
  btnOffline: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  toggleText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});

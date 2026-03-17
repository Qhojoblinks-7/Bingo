import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { NotificationSheet } from "./NotificationSheet";

export const BinGoHeader = ({
  title,
  showBack = false,
  onBack,
  rightAction,
  showNotification = true,
  onNotificationPress,
  onHelpPress,
}) => {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      // Default: show notification sheet
      setShowNotifications(true);
    }
  };

  const handleHelpPress = () => {
    if (onHelpPress) {
      onHelpPress();
    }
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    content: {
      height: 60,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
    },
    sideColumn: {
      flex: 1,
      alignItems: "flex-start",
      justifyContent: "center",
    },
    centerColumn: {
      flex: 4,
      alignItems: "center",
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    iconBtn: {
      padding: 8,
    },
    rightIcons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
  }), [colors]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Left Column */}
        <View style={styles.sideColumn}>
          {showBack && (
            <Pressable
              onPress={handleBackPress}
              style={styles.iconBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </Pressable>
          )}
        </View>

        {/* Center Column */}
        <View style={styles.centerColumn}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Right Column */}
        <View style={styles.sideColumn}>
          {rightAction ? (
            rightAction
          ) : (
            <View style={styles.rightIcons}>
              {onHelpPress && (
                <Pressable
                  onPress={handleHelpPress}
                  style={styles.iconBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={22}
                    color={colors.text}
                  />
                </Pressable>
              )}
              {showNotification && (
                <Pressable
                  onPress={handleNotificationPress}
                  style={styles.iconBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={22}
                    color={colors.text}
                  />
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Notification Sheet */}
      <NotificationSheet
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </View>
  );
};

export default BinGoHeader;

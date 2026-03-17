import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../constants/Colors";
import { useAppTheme } from "../hooks/useThemeContext";

export const BinGoButton = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
}) => {
  const { isDark } = useAppTheme();
  const theme = isDark ? COLORS.dark : COLORS.light;

  const getBackgroundColor = () => {
    if (disabled) return COLORS.muted;
    switch (variant) {
      case "primary":
        return COLORS.primary;
      case "secondary":
        return theme.background;
      case "outline":
        return "transparent";
      case "danger":
        return "#EF4444";
      default:
        return COLORS.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.white;
    switch (variant) {
      case "primary":
        return COLORS.white;
      case "secondary":
        return theme.text;
      case "outline":
        return COLORS.primary;
      case "danger":
        return COLORS.white;
      default:
        return COLORS.white;
    }
  };

  const getBorderColor = () => {
    if (variant === "outline") {
      return COLORS.primary;
    }
    return "transparent";
  };

  const getPadding = () => {
    switch (size) {
      case "small":
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case "large":
        return { paddingVertical: 18, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 14, paddingHorizontal: 24 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "small":
        return 14;
      case "large":
        return 18;
      default:
        return 16;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          ...getPadding(),
          opacity: pressed ? 0.8 : 1,
        },
        variant === "outline" && styles.outline,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: getFontSize(),
            },
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 0,
  },
  outline: {
    borderWidth: 2,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
});

export default BinGoButton;

import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import { COLORS } from "../constants/Colors";
import { useAppTheme } from "../hooks/useThemeContext";

export const BinGoInput = ({ label, error, style, ...props }) => {
  const { isDark } = useAppTheme();
  const theme = isDark ? COLORS.dark : COLORS.light;

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: theme.inputBg, 
            borderColor: error ? '#EF4444' : theme.border,
            color: theme.text 
          },
          props.multiline && styles.multilineInput,
          style,
        ]}
        placeholderTextColor={COLORS.muted}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
});

export default BinGoInput;

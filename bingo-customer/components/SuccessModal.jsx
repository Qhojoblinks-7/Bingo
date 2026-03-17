import React from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "../hooks/useColors";
import { BinGoButton } from "./BinGoButton";

export const SuccessModal = ({ visible, onClose, title, message }) => {
  const colors = useColors();

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalContainer: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 30,
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    iconCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary + '15',
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 10,
    },
    message: {
      fontSize: 15,
      color: colors.muted,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 24,
    },
    button: {
      marginTop: 10,
      width: "100%",
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="checkmark-circle"
              size={50}
              color={colors.primary}
            />
          </View>

          <Text style={styles.title}>{title || "Success!"}</Text>
          <Text style={styles.message}>{message}</Text>

          <BinGoButton
            title="Continue"
            onPress={onClose}
            style={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;

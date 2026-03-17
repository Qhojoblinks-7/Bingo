import React from "react";
import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import { BinGoButton } from "./BinGoButton";
import { useAppTheme } from "../hooks/useThemeContext";

export const BinSizePicker = ({
  visible,
  onClose,
  selectedSize,
  onSelectSize,
}) => {
  const { isDark } = useAppTheme();
  const theme = isDark ? COLORS.dark : COLORS.light;

  const binOptions = [
    {
      id: 'standard',
      label: 'Standard',
      price: '20',
      dimensions: '60L capacity',
      description: 'Perfect for small households',
      icon: 'cube-outline',
    },
    {
      id: 'large',
      label: 'Large',
      price: '40',
      dimensions: '120L capacity',
      description: 'Ideal for medium households',
      icon: 'cube',
    },
    {
      id: 'extra-large',
      label: 'Extra Large',
      price: '60',
      dimensions: '240L capacity',
      description: 'Best for large households',
      icon: 'server',
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
            <Text style={[styles.title, { color: theme.text }]}>Bin Sizes</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.muted} />
            </Pressable>
          </View>

          <Text style={[styles.subtitle, { color: COLORS.muted }]}>
            Tap a bin to see dimensions and pricing
          </Text>

          {/* Bin Options */}
          <View style={styles.optionsSection}>
            {binOptions.map((bin) => {
              const isSelected = selectedSize === bin.id;
              
              return (
                <Pressable
                  key={bin.id}
                  onPress={() => onSelectSize(bin.id)}
                  style={[
                    styles.binCard,
                    isSelected && styles.selectedBin,
                    { backgroundColor: theme.surface, borderColor: isSelected ? COLORS.primary : theme.border },
                  ]}
                >
                  <View style={[
                    styles.binIconContainer,
                    isSelected && styles.selectedBinIcon
                  ]}>
                    <Ionicons 
                      name={bin.icon} 
                      size={28} 
                      color={isSelected ? COLORS.white : COLORS.primary} 
                    />
                  </View>
                  
                  <View style={styles.binInfo}>
                    <View style={styles.binHeader}>
                      <Text style={[
                        styles.binLabel,
                        { color: isSelected ? COLORS.primary : theme.text }
                      ]}>
                        {bin.label}
                      </Text>
                      <Text style={[
                        styles.binPrice,
                        { color: isSelected ? COLORS.primary : theme.text }
                      ]}>
                        GH₵ {bin.price}
                      </Text>
                    </View>
                    
                    <Text style={[
                      styles.binDimensions,
                      { color: isSelected ? COLORS.primary : COLORS.muted }
                    ]}>
                      {bin.dimensions}
                    </Text>
                    
                    <Text style={[styles.binDescription, { color: COLORS.muted }]}>
                      {bin.description}
                    </Text>
                  </View>

                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Info Note */}
          <View style={[styles.infoNote, { backgroundColor: isDark ? '#052e16' : '#ECFDF5' }]}>
            <Ionicons name="information-circle" size={16} color={COLORS.primary} />
            <Text style={[styles.infoText, { color: COLORS.primary }]}>
              All bins are collected within 24 hours of request
            </Text>
          </View>

          {/* Action Button */}
          <BinGoButton
            title="Confirm Size"
            onPress={onClose}
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
  binCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  selectedBin: {
    backgroundColor: "#F0FDF4",
  },
  binIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  selectedBinIcon: {
    backgroundColor: COLORS.primary,
  },
  binInfo: {
    flex: 1,
  },
  binHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  binLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  binPrice: {
    fontSize: 16,
    fontWeight: "800",
  },
  binDimensions: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 2,
  },
  binDescription: {
    fontSize: 12,
  },
  checkmark: {
    marginLeft: 8,
  },
  infoNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default BinSizePicker;

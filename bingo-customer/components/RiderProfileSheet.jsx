import React from "react";
import { View, Text, StyleSheet, Modal, Pressable, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import { BinGoButton } from "./BinGoButton";
import { useAppTheme } from "../hooks/useThemeContext";

export const RiderProfileSheet = ({
  visible,
  onClose,
  // Rider data
  riderName = "Rider",
  riderPhone = "+233 00 000 0000",
  riderPhoto = null,
  riderRating = 0,
  totalTrips = 0,
  memberSince = "2024",
  // Vehicle info
  vehicleType = "",
  vehiclePlate = "",
  onCallPress,
  onMessagePress,
}) => {
  const { isDark } = useAppTheme();
  const theme = isDark ? COLORS.dark : COLORS.light;

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "R";
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={14} color="#F59E0B" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={14} color="#F59E0B" />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={14} color="#F59E0B" />
        );
      }
    }
    return stars;
  };

  const handleCall = () => {
    if (onCallPress) {
      onCallPress();
    } else {
      Linking.openURL(`tel:${riderPhone}`);
    }
  };

  const handleMessage = () => {
    if (onMessagePress) {
      onMessagePress();
    } else {
      Linking.openURL(`sms:${riderPhone}`);
    }
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
            <Text style={[styles.title, { color: theme.text }]}>Rider Profile</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.muted} />
            </Pressable>
          </View>

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: COLORS.primary }]}>
              {riderPhoto ? (
                <View style={styles.avatarImage}>
                  {/* Add Image component here */}
                  <Text style={styles.avatarText}>{getInitials(riderName)}</Text>
                </View>
              ) : (
                <Text style={styles.avatarText}>{getInitials(riderName)}</Text>
              )}
            </View>
            <Text style={[styles.riderName, { color: theme.text }]}>{riderName}</Text>
            
            {/* Rating */}
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {renderStars(riderRating || 4.5)}
              </View>
              <Text style={[styles.ratingText, { color: COLORS.muted }]}>
                {riderRating || 4.5} ({totalTrips || 0} trips)
              </Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={[styles.statsRow, { backgroundColor: theme.background }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>{totalTrips || 0}</Text>
              <Text style={[styles.statLabel, { color: COLORS.muted }]}>Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>{memberSince}</Text>
              <Text style={[styles.statLabel, { color: COLORS.muted }]}>Member Since</Text>
            </View>
          </View>

          {/* Rider Details */}
          <View style={[styles.detailsSection, { backgroundColor: theme.background }]}>
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: COLORS.muted }]}>Phone</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{riderPhone}</Text>
            </View>
            
            {vehicleType && (
              <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
                <Text style={[styles.detailLabel, { color: COLORS.muted }]}>Vehicle</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>{vehicleType}</Text>
              </View>
            )}
            
            {vehiclePlate && (
              <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
                <Text style={[styles.detailLabel, { color: COLORS.muted }]}>Plate Number</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>{vehiclePlate}</Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: COLORS.muted }]}>Status</Text>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, { backgroundColor: COLORS.primary }]} />
                <Text style={[styles.statusText, { color: COLORS.primary }]}>Online</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Pressable 
              style={[styles.callButton, { backgroundColor: COLORS.primary }]}
              onPress={handleCall}
            >
              <Ionicons name="call" size={20} color={COLORS.white} />
              <Text style={styles.callButtonText}>Call</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.messageButton, { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '15' }]}
              onPress={handleMessage}
            >
              <Ionicons name="chatbubble" size={20} color={COLORS.primary} />
              <Text style={[styles.messageButtonText, { color: COLORS.primary }]}>Message</Text>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  closeBtn: {
    padding: 4,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "800",
  },
  riderName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  ratingContainer: {
    alignItems: "center",
  },
  stars: {
    flexDirection: "row",
    gap: 2,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  statsRow: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  detailsSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  callButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  callButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
  messageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  closeButton: {
    marginTop: 8,
  },
});

export default RiderProfileSheet;

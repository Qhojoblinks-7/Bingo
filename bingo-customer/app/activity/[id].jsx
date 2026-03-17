import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BinGoHeader } from '../../components/BinGoHeader';
import { ContactSupportSheet } from '../../components/ContactSupportSheet';
import { COLORS } from '../../constants/Colors';
import { useAppTheme } from '../../hooks/useThemeContext';

export default function ActivityDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isDark } = useAppTheme();
  const theme = isDark ? COLORS.dark : COLORS.light;
  const [showSupport, setShowSupport] = useState(false);

  // Mock data - in production, fetch based on id
  // Status options: 'awaiting', 'in_transit', 'completed'
  const activityData = {
    id: id || '1',
    type: 'pickup',
    status: 'completed', // Change to test different states: 'awaiting', 'in_transit', 'completed'
    statusText: 'Completed',
    date: 'Mar 14, 2026',
    time: '2:30 PM',
    eta: '5 mins away',
    address: 'GA-123-4567',
    price: '40',
    binSize: 'Large',
    rider: {
      name: 'John Doe',
      phone: '+233 55 123 4567',
      photo: null,
    },
    proofImage: null,
    completedAt: 'Mar 14, 2026 at 3:15 PM',
  };

  // Status-based visual states
  const isAwaiting = activityData.status === 'awaiting';
  const isInTransit = activityData.status === 'in_transit';
  const isCompleted = activityData.status === 'completed';

  const getStatusColor = () => {
    if (isAwaiting) return '#F59E0B'; // Amber
    if (isInTransit) return '#3B82F6'; // Blue
    return COLORS.primary; // Green
  };

  const getStatusBackground = () => {
    if (isAwaiting) return '#FEF3C7';
    if (isInTransit) return '#DBEAFE';
    return '#ECFDF5';
  };

  const getStatusIcon = () => {
    if (isAwaiting) return 'time';
    if (isInTransit) return 'car-sport';
    return 'checkmark-circle';
  };

  const getActionButton = () => {
    if (isAwaiting) {
      return (
        <View style={[styles.actionButton, { backgroundColor: isDark ? '#1F2937' : '#F3F4F6' }]}>
          <Ionicons name="call" size={18} color={COLORS.muted} />
          <Text style={[styles.actionDisabledText, { color: COLORS.muted }]}>Call Rider</Text>
        </View>
      );
    }
    if (isInTransit) {
      return (
        <Pressable style={[styles.actionButton, { backgroundColor: COLORS.primary }]}>
          <Ionicons name="navigate" size={18} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Track Rider</Text>
        </Pressable>
      );
    }
    // Completed
    return (
      <Pressable style={[styles.actionButton, { backgroundColor: COLORS.primary }]} onPress={() => {}}>
        <Ionicons name="camera" size={18} color={COLORS.white} />
        <Text style={styles.actionButtonText}>View Proof</Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <BinGoHeader 
        title="Activity Details" 
        showBack={true} 
        onBack={() => router.back()} 
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status Banner */}
        <View style={[
          styles.statusBanner,
          { backgroundColor: getStatusBackground() }
        ]}>
          <Ionicons 
            name={getStatusIcon()} 
            size={24} 
            color={getStatusColor()} 
          />
          <Text style={[
            styles.statusText,
            { color: getStatusColor() }
          ]}>
            {isAwaiting ? 'Awaiting Rider' : isInTransit ? 'In Transit' : 'Completed'}
          </Text>
        </View>

        {/* Pickup Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.muted }]}>Pickup Information</Text>
          <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.infoLabel, { color: COLORS.muted }]}>Date</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{activityData.date}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.infoLabel, { color: COLORS.muted }]}>Time</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{activityData.time}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.infoLabel, { color: COLORS.muted }]}>Address</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{activityData.address}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.infoLabel, { color: COLORS.muted }]}>Bin Size</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{activityData.binSize}</Text>
            </View>
            <View style={[styles.infoRow, styles.noBorder]}>
              <Text style={[styles.infoLabel, { color: COLORS.muted }]}>Total Paid</Text>
              <Text style={[styles.infoValue, styles.priceValue, { color: COLORS.primary }]}>
                GH₵ {activityData.price}
              </Text>
            </View>
          </View>
        </View>

        {/* Rider Info with Action Button */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.muted }]}>Your Rider</Text>
          <View style={[styles.riderCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.riderAvatar}>
              <Ionicons name="person" size={28} color={COLORS.primary} />
            </View>
            <View style={styles.riderInfo}>
              <Text style={[styles.riderName, { color: theme.text }]}>{activityData.rider.name}</Text>
              <Text style={[styles.riderPhone, { color: COLORS.muted }]}>{activityData.rider.phone}</Text>
              {isInTransit && (
                <Text style={[styles.etaText, { color: '#3B82F6' }]}>ETA: {activityData.eta}</Text>
              )}
            </View>
          </View>
          
          {/* Action Button based on status */}
          <View style={styles.actionContainer}>
            {getActionButton()}
          </View>
        </View>

        {/* Proof of Service */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.muted }]}>Proof of Service</Text>
          {activityData.proofImage ? (
            <Image 
              source={{ uri: activityData.proofImage }} 
              style={styles.proofImage}
            />
          ) : (
            <View style={[styles.proofPlaceholder, { backgroundColor: isDark ? '#1F2937' : '#F3F4F6' }]}>
              <Ionicons name="camera" size={40} color={COLORS.muted} />
              <Text style={[styles.proofPlaceholderText, { color: COLORS.muted }]}>No photo available</Text>
            </View>
          )}
          {activityData.completedAt && (
            <Text style={[styles.completedAt, { color: COLORS.muted }]}>
              Completed on {activityData.completedAt}
            </Text>
          )}
        </View>

        {/* Support Button */}
        <View style={styles.supportSection}>
          <Pressable 
            style={[styles.supportButton, { borderColor: COLORS.primary + '30' }]}
            onPress={() => setShowSupport(true)}
          >
            <Ionicons name="help-circle-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.supportText, { color: COLORS.primary }]}>Need help with this pickup?</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Contact Support Sheet */}
      <ContactSupportSheet
        visible={showSupport}
        onClose={() => setShowSupport(false)}
        title="Get Help"
        subtitle="How can we assist you with this pickup?"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  riderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  riderAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontSize: 16,
    fontWeight: '700',
  },
  riderPhone: {
    fontSize: 13,
    marginTop: 2,
  },
  etaText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  actionContainer: {
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  actionDisabledText: {
    fontSize: 14,
    fontWeight: '600',
  },
  proofImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  proofPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proofPlaceholderText: {
    marginTop: 8,
    fontSize: 14,
  },
  completedAt: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  supportSection: {
    marginTop: 8,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderWidth: 1,
  },
  supportText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

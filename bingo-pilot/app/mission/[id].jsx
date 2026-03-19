// BinGo Pilot - Mission Detail Screen
// Dynamic route for specific mission details
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';
import useMissionStore from '../../stores/useMissionStore';
import BinGoButton from '../../components/shared/BinGoButton';
import StatusBadge from '../../components/shared/StatusBadge';

const { width } = Dimensions.get('window');

// ============================================
// MISSION STATUS STEPS
// ============================================
const MissionSteps = ({ currentStatus }) => {
  const steps = [
    { key: 'accepted', label: 'Accepted', icon: '✓' },
    { key: 'en_route', label: 'En Route', icon: '🚗' },
    { key: 'arrived', label: 'Arrived', icon: '📍' },
    { key: 'picked_up', label: 'Picked Up', icon: '📦' },
    { key: 'completed', label: 'Completed', icon: '✅' },
  ];

  const currentIndex = steps.findIndex(s => s.key === currentStatus);

  return (
    <View style={styles.stepsContainer}>
      {steps.map((step, index) => (
        <View key={step.key} style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            index <= currentIndex && styles.stepCircleActive,
            index < currentIndex && styles.stepCircleCompleted,
          ]}>
            {index < currentIndex ? (
              <Text style={styles.stepCheck}>✓</Text>
            ) : (
              <Text style={[styles.stepIcon, index <= currentIndex && styles.stepIconActive]}>
                {step.icon}
              </Text>
            )}
          </View>
          <Text style={[styles.stepLabel, index <= currentIndex && styles.stepLabelActive]}>
            {step.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

// ============================================
// MISSION DETAIL SCREEN
// ============================================
export default function MissionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { 
    activeMission, 
    missionStatus, 
    acceptMission, 
    rejectMission, 
    updateMissionStatus,
    completeMission,
  } = useMissionStore();

  const [isLoading, setIsLoading] = useState(false);

  // Sample mission data (in real app, fetch from API)
  const mission = {
    id: id || 'MN-001',
    status: missionStatus || 'accepted',
    pickup: {
      address: '123 Main Street, Downtown',
      instructions: 'Wait at the lobby entrance',
      contact: '+1 555 123 4567',
    },
    dropoff: {
      address: '456 Oak Avenue, Midtown',
      instructions: 'Deliver to reception desk',
      contact: '+1 555 987 6543',
    },
    earnings: '15.50',
    distance: '2.3 miles',
    estimatedTime: '12 mins',
    customer: {
      name: 'Michael S.',
      rating: 4.8,
    },
    createdAt: new Date().toISOString(),
  };

  // Handle mission action based on current status
  const handleMissionAction = async () => {
    setIsLoading(true);
    
    try {
      switch (mission.status) {
        case 'available':
          await acceptMission(mission);
          Alert.alert('Mission Accepted', 'You have accepted this mission!');
          break;
        case 'accepted':
          await updateMissionStatus('en_route');
          Alert.alert('Heading to Pickup', 'Navigate to the pickup location.');
          break;
        case 'en_route':
          await updateMissionStatus('arrived');
          Alert.alert('Arrived', 'You have arrived at the pickup location.');
          break;
        case 'arrived':
          await updateMissionStatus('picked_up');
          Alert.alert('Package Picked Up', 'Package has been collected.');
          break;
        case 'picked_up':
          await updateMissionStatus('completed');
          await completeMission({ photo: null, notes: '' });
          Alert.alert(
            'Mission Completed!',
            `Great job! You earned $${mission.earnings}`,
            [{ text: 'OK', onPress: () => router.back() }]
          );
          break;
        default:
          break;
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reject/cancel mission
  const handleRejectMission = () => {
    Alert.alert(
      'Reject Mission',
      'Are you sure you want to reject this mission?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            rejectMission();
            router.back();
          },
        },
      ]
    );
  };

  // Get button text based on status
  const getButtonText = () => {
    switch (mission.status) {
      case 'available':
        return 'Accept Mission';
      case 'accepted':
        return 'Start Navigation';
      case 'en_route':
        return 'Arrived at Pickup';
      case 'arrived':
        return 'Confirm Pickup';
      case 'picked_up':
        return 'Complete Delivery';
      default:
        return 'Accept Mission';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mission #{mission.id}</Text>
          <StatusBadge status={mission.status} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mission Progress */}
        {mission.status !== 'available' && (
          <View style={styles.progressSection}>
            <MissionSteps currentStatus={mission.status} />
          </View>
        )}

        {/* Earnings Card */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsMain}>
            <Text style={styles.earningsLabel}>Earnings</Text>
            <Text style={styles.earningsAmount}>${mission.earnings}</Text>
          </View>
          <View style={styles.earningsDetails}>
            <View style={styles.earningsDetail}>
              <Text style={styles.detailIcon}>📏</Text>
              <Text style={styles.detailText}>{mission.distance}</Text>
            </View>
            <View style={styles.earningsDetail}>
              <Text style={styles.detailIcon}>⏱️</Text>
              <Text style={styles.detailText}>{mission.estimatedTime}</Text>
            </View>
          </View>
        </View>

        {/* Pickup Location */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <View style={[styles.locationDot, { backgroundColor: COLORS.primary }]} />
            <Text style={styles.locationTitle}>Pickup</Text>
          </View>
          <Text style={styles.locationAddress}>{mission.pickup.address}</Text>
          {mission.pickup.instructions && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsLabel}>Instructions:</Text>
              <Text style={styles.instructionsText}>{mission.pickup.instructions}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonIcon}>📞</Text>
            <Text style={styles.contactButtonText}>Call {mission.pickup.contact}</Text>
          </TouchableOpacity>
        </View>

        {/* Dropoff Location */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <View style={[styles.locationDot, { backgroundColor: COLORS.secondary }]} />
            <Text style={styles.locationTitle}>Dropoff</Text>
          </View>
          <Text style={styles.locationAddress}>{mission.dropoff.address}</Text>
          {mission.dropoff.instructions && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsLabel}>Instructions:</Text>
              <Text style={styles.instructionsText}>{mission.dropoff.instructions}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonIcon}>📞</Text>
            <Text style={styles.contactButtonText}>Call {mission.dropoff.contact}</Text>
          </TouchableOpacity>
        </View>

        {/* Customer Info */}
        <View style={styles.customerCard}>
          <Text style={styles.customerTitle}>Customer</Text>
          <View style={styles.customerInfo}>
            <View style={styles.customerAvatar}>
              <Text style={styles.customerAvatarText}>
                {mission.customer.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>{mission.customer.name}</Text>
              <View style={styles.customerRating}>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.ratingText}>{mission.customer.rating}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mission Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mission ID</Text>
            <Text style={styles.infoValue}>#{mission.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created At</Text>
            <Text style={styles.infoValue}>{formatDate(mission.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {mission.status === 'available' ? (
          <View style={styles.actionRow}>
            <BinGoButton
              title="Reject"
              variant="secondary"
              onPress={handleRejectMission}
              style={styles.rejectButton}
            />
            <BinGoButton
              title="Accept"
              onPress={handleMissionAction}
              loading={isLoading}
              style={styles.acceptButton}
            />
          </View>
        ) : (
          <BinGoButton
            title={getButtonText()}
            onPress={handleMissionAction}
            loading={isLoading}
            fullWidth
            size="lg"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl + 10,
    paddingBottom: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.white,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  progressSection: {
    marginBottom: SPACING.lg,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary + '30',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  stepCircleCompleted: {
    backgroundColor: COLORS.primary,
  },
  stepCheck: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  stepIcon: {
    fontSize: 16,
  },
  stepIconActive: {},
  stepLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.muted,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  earningsCard: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  earningsMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  earningsLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.white,
    opacity: 0.8,
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  earningsDetails: {
    flexDirection: 'row',
  },
  earningsDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },
  detailText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.white,
  },
  locationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  locationTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.white,
  },
  locationAddress: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  instructionsContainer: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  instructionsLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.muted,
    marginBottom: 2,
  },
  instructionsText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
  },
  contactButtonIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  contactButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  customerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  customerTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  customerAvatarText: {
    fontSize: 20,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.white,
  },
  customerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.muted,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.muted,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  bottomPadding: {
    height: 100,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  rejectButton: {
    flex: 1,
  },
  acceptButton: {
    flex: 2,
  },
});

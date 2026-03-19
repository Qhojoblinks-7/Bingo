// ============================================
// BinGo Pilot - Mission Controller
// State Machine Approach for Dynamic Sheets
// States: OFFER → EN_ROUTE → ARRIVED
// ============================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Platform,
  Vibration,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants';
import { MapPin, Navigation, Camera, CheckCircle, XCircle, Clock, Radar } from 'lucide-react-native';
import useMissionStore from '../../stores/useMissionStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const COUNTDOWN_DURATION = 30; // 30 seconds to accept mission

// ============================================
// MISSION STATUS MAPPING
// ============================================
// Map store statuses to UI states
// OFFER: New mission available (nearbyMissions has items)
// EN_ROUTE: Mission accepted and navigating (accepted, en_route)
// ARRIVED: At location, ready for verification (arrived)

const getUiState = (missionStatus, activeMission, nearbyMissions) => {
  if (!activeMission && nearbyMissions.length > 0) return 'OFFER';
  if (activeMission) {
    if (missionStatus === 'accepted' || missionStatus === 'en_route') return 'EN_ROUTE';
    if (missionStatus === 'arrived') return 'ARRIVED';
  }
  return null;
};

// ============================================
// COUNTDOWN TIMER CIRCLE (Reused from MissionRadar)
// ============================================
const CountdownCircle = ({ timeRemaining, totalTime = COUNTDOWN_DURATION }) => {
  const progress = timeRemaining / totalTime;
  
  const getColor = () => {
    if (progress > 0.5) return COLORS.primary;
    if (progress > 0.25) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <View style={countdownStyles.container}>
      <View style={countdownStyles.svgContainer}>
        <View style={[countdownStyles.circle, { borderColor: COLORS.border }]} />
        <Animated.View
          style={[
            countdownStyles.progressCircle,
            {
              borderColor: getColor(),
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
              transform: [{ rotate: `${progress * 360}deg` }],
            },
          ]}
        />
      </View>
      <Text style={[countdownStyles.timeText, { color: getColor() }]}>
        {timeRemaining}
      </Text>
    </View>
  );
};

const countdownStyles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
  },
  progressCircle: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
  },
  timeText: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
});

// ============================================
// 1. OFFER SHEET - The Mission Radar
// Features: 30-second countdown, urgency creation
// ============================================
const OfferSheet = ({ data, onAccept, onDecline }) => {
  const [timeRemaining, setTimeRemaining] = useState(COUNTDOWN_DURATION);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    // Slide up animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulsing glow animation
    pulseRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulseRef.current.start();

    // Haptic feedback on mount
    const triggerHaptic = async () => {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setTimeout(async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, 500);
      } catch (e) {
        Vibration.vibrate([0, 200, 100, 200]);
      }
    };
    triggerHaptic();

    return () => {
      isMounted.current = false;
      if (pulseRef.current) {
        pulseRef.current.stop();
      }
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            if (isMounted.current) {
              onDecline?.();
            }
          }, 100);
          return 0;
        }
        // Haptic tick in last 10 seconds
        if (prev <= 10) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onDecline]);

  const distanceText = data?.distance || '0.8 km';
  const earningsText = data?.earnings || 'GH₵ 25.00';

  return (
    <Animated.View
      style={[styles.sheetContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      pointerEvents="box-none"
    >
      <View style={styles.innerSheet}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.priorityTag}>
            <Radar size={12} color={COLORS.white} />
            <Text style={styles.priorityText}>NEW MISSION</Text>
          </View>
          <TouchableOpacity onPress={onDecline}>
            <XCircle size={24} color={COLORS.muted} />
          </TouchableOpacity>
        </View>

        {/* Timer */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }], alignItems: 'center' }}>
          <CountdownCircle timeRemaining={timeRemaining} />
        </Animated.View>
        
        <Text style={styles.timerLabel}>
          {timeRemaining > 0 ? 'Tap to Accept' : 'Mission Expired'}
        </Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MapPin size={18} color={COLORS.primary} />
            <Text style={styles.statText}>{distanceText} away</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statText, { color: COLORS.primary, fontWeight: '900' }]}>
              {earningsText}
            </Text>
          </View>
        </View>

        {/* Location */}
        {data?.pickup && (
          <View style={styles.locationRow}>
            <Navigation size={14} color={COLORS.accent} />
            <Text style={styles.locationText} numberOfLines={1}>
              {data.pickup}
            </Text>
          </View>
        )}

        {/* Button Group */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.declineBtn} onPress={onDecline}>
            <XCircle size={20} color={COLORS.muted} />
            <Text style={styles.declineText}>Ignore</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.acceptBtn, timeRemaining === 0 && styles.acceptBtnDisabled]} 
            onPress={onAccept}
            disabled={timeRemaining === 0}
          >
            <Text style={styles.acceptText}>ACCEPT MISSION</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// ============================================
// 2. NAVIGATION SHEET - Active Navigation
// Focused purely on the immediate next step
// ============================================
const NavigationSheet = ({ data, onStartNavigation, onCancel }) => {
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const customerName = data?.customerName || 'Customer';
  const address = data?.pickup || 'Loading location...';
  const eta = data?.estimatedTime || 'Calculating...';

  return (
    <Animated.View style={[styles.sheetContainer, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.innerSheet}>
        {/* Navigation Header */}
        <View style={styles.navHeader}>
          <View style={styles.navIconContainer}>
            <Navigation size={24} color={COLORS.accent} />
          </View>
          <View style={styles.navInfo}>
            <Text style={styles.navLabel}>PICKUP</Text>
            <Text style={styles.customerName}>{customerName}</Text>
            <Text style={styles.address} numberOfLines={1}>{address}</Text>
          </View>
        </View>

        {/* ETA Display */}
        <View style={styles.etaContainer}>
          <Clock size={16} color={COLORS.primary} />
          <Text style={styles.etaText}>ETA: {eta}</Text>
        </View>

        {/* Instruction Box */}
        <View style={styles.instructionBox}>
          <Text style={styles.instructionText}>Follow the blue line on the map</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.navButtonGroup}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.approachBtn} onPress={onStartNavigation}>
            <Text style={styles.approachText}>I'M APPROACHING</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// ============================================
// 3. VERIFICATION SHEET - Proof of Collection
// Triggered when geofence detects pilot within 50m
// ============================================
const VerificationSheet = ({ onTakePhoto, onComplete, onCancel }) => {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1.05,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Success haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  return (
    <Animated.View 
      style={[styles.sheetContainer, { transform: [{ translateY: slideAnim }] }]}
    >
      <View style={styles.innerSheet}>
        <Text style={styles.verifyTitle}>Verify Collection</Text>
        <Text style={styles.verifySubtitle}>
          Take a photo of the cleared bin to receive payment.
        </Text>

        {/* Camera Button */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity style={styles.cameraBtn} onPress={onTakePhoto}>
            <Camera size={32} color={COLORS.primary} />
            <Text style={styles.cameraText}>OPEN CAMERA</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Complete Button */}
        <TouchableOpacity style={styles.completeBtn} onPress={onComplete}>
          <CheckCircle size={20} color={COLORS.white} />
          <Text style={styles.completeText}>COMPLETE & PAY</Text>
        </TouchableOpacity>

        {/* Cancel Link */}
        <TouchableOpacity style={styles.cancelLink} onPress={onCancel}>
          <Text style={styles.cancelLinkText}>Issue with pickup?</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// ============================================
// MAIN MISSION CONTROLLER
// State Machine that manages which sheet to show
// ============================================
export const MissionController = ({ 
  // Props from parent or use internally from store
  mission: externalMission,
  onAccept: externalOnAccept,
  onDecline: externalOnDecline,
  onComplete: externalOnComplete,
}) => {
  // Connect to mission store
  const {
    activeMission,
    missionStatus,
    nearbyMissions,
    isOnline,
    acceptMission,
    rejectMission,
    updateMissionStatus,
    completeMission,
  } = useMissionStore();

  // Determine current UI state
  const currentMission = externalMission || activeMission;
  const uiState = getUiState(missionStatus, currentMission, nearbyMissions);

  // Handler: Accept mission (OFFER -> EN_ROUTE)
  const handleAccept = useCallback(async () => {
    try {
      // Accept the first nearby mission
      const missionToAccept = nearbyMissions[0] || currentMission;
      if (missionToAccept) {
        await acceptMission(missionToAccept);
        await updateMissionStatus('en_route');
        externalOnAccept?.(missionToAccept);
        
        // Haptic feedback
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
    } catch (error) {
      console.error('Failed to accept mission:', error);
      Alert.alert('Error', 'Failed to accept mission. Please try again.');
    }
  }, [nearbyMissions, currentMission, acceptMission, updateMissionStatus, externalOnAccept]);

  // Handler: Decline mission
  const handleDecline = useCallback(() => {
    rejectMission();
    externalOnDecline?.();
  }, [rejectMission, externalOnDecline]);

  // Handler: Start navigation (EN_ROUTE -> ARRIVED trigger)
  const handleApproaching = useCallback(async () => {
    // This would typically be triggered by the geofence hook
    // For manual trigger, we can set status to arrived
    await updateMissionStatus('arrived');
  }, [updateMissionStatus]);

  // Handler: Cancel navigation
  const handleCancelNavigation = useCallback(() => {
    Alert.alert(
      'Cancel Mission',
      'Are you sure you want to cancel this mission?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: () => {
            rejectMission();
          }
        },
      ]
    );
  }, [rejectMission]);

  // Handler: Take photo (for verification)
  const handleTakePhoto = useCallback(() => {
    // This would open the camera
    // Implementation depends on camera library
    externalOnComplete?.({ photo: 'placeholder', notes: '' });
  }, [externalOnComplete]);

  // Handler: Complete mission (ARRIVED -> idle)
  const handleComplete = useCallback(async () => {
    try {
      await completeMission({ photo: null, notes: '' });
      externalOnComplete?.();
      Alert.alert('Mission Completed!', 'Great job! Payment has been processed.');
    } catch (error) {
      console.error('Failed to complete mission:', error);
      Alert.alert('Error', 'Failed to complete mission. Please try again.');
    }
  }, [completeMission, externalOnComplete]);

  // Handler: Cancel verification
  const handleCancelVerification = useCallback(() => {
    Alert.alert(
      'Issue with Pickup',
      'What would you like to do?',
      [
        { text: 'Continue', style: 'cancel' },
        { 
          text: 'Report Problem', 
          onPress: () => {
            // Handle problem reporting
            rejectMission();
          }
        },
      ]
    );
  }, [rejectMission]);

  // Don't render anything if not online or no mission
  if (!isOnline || !uiState) {
    return null;
  }

  // Prepare mission data for sheets
  const missionData = currentMission || nearbyMissions[0];

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      {/* State Machine: Render appropriate sheet based on status */}
      {uiState === 'OFFER' && (
        <OfferSheet 
          data={missionData}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}

      {uiState === 'EN_ROUTE' && (
        <NavigationSheet 
          data={missionData}
          onStartNavigation={handleApproaching}
          onCancel={handleCancelNavigation}
        />
      )}

      {uiState === 'ARRIVED' && (
        <VerificationSheet 
          onTakePhoto={handleTakePhoto}
          onComplete={handleComplete}
          onCancel={handleCancelVerification}
        />
      )}
    </View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.lg,
    ...SHADOWS.heavy,
  },
  innerSheet: {
    gap: SPACING.md,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  priorityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
  },
  priorityText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
    letterSpacing: 1,
  },
  timerLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.muted,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: -SPACING.sm,
    marginBottom: SPACING.sm,
  },
  
  // Stats row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  statText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  
  // Location row
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  locationText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.muted,
  },
  
  // Button group
  buttonGroup: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  acceptBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  acceptBtnDisabled: {
    backgroundColor: COLORS.muted,
    opacity: 0.5,
  },
  acceptText: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.md,
    letterSpacing: 1,
  },
  declineBtn: {
    flex: 1,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  declineText: {
    color: COLORS.muted,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  
  // Navigation sheet styles
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  navIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navInfo: {
    flex: 1,
  },
  navLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.accent,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    letterSpacing: 1,
  },
  customerName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  address: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.muted,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary + '20',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  etaText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  instructionBox: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  instructionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
  },
  navButtonGroup: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cancelText: {
    color: COLORS.muted,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  approachBtn: {
    flex: 2,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    ...SHADOWS.medium,
  },
  approachText: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    letterSpacing: 1,
  },
  
  // Verification sheet styles
  verifyTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    textAlign: 'center',
  },
  verifySubtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.muted,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  cameraBtn: {
    height: 120,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  cameraText: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    letterSpacing: 1,
  },
  completeBtn: {
    flexDirection: 'row',
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    gap: SPACING.sm,
    ...SHADOWS.medium,
    marginTop: SPACING.md,
  },
  completeText: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.md,
    letterSpacing: 1,
  },
  cancelLink: {
    alignItems: 'center',
    padding: SPACING.sm,
  },
  cancelLinkText: {
    color: COLORS.muted,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
});

export default MissionController;

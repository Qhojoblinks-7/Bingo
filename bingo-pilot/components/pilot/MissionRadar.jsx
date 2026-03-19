// ============================================
// BinGo Pilot - Mission Radar Component
// High-Fidelity Tactical Overlay - Mission Alert System
// ============================================
// Features:
// - 30-second "Accept" countdown timer
// - High-intensity haptic pulse on new mission
// - Slide-up mission alert sheet
// - Distance/time and payload display

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
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants';
import { Radar, MapPin, Navigation, Trash2, Clock, X } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const COUNTDOWN_DURATION = 30; // 30 seconds to accept mission

// ============================================
// COUNTDOWN TIMER CIRCLE COMPONENT
// ============================================
const CountdownCircle = ({ timeRemaining, totalTime = COUNTDOWN_DURATION }) => {
  const progress = timeRemaining / totalTime;

  // Color transitions: Green -> Yellow -> Red
  const getColor = () => {
    if (progress > 0.5) return COLORS.primary;
    if (progress > 0.25) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <View style={countdownStyles.container}>
      {/* Background Circle */}
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
      {/* Timer Text */}
      <Text style={[countdownStyles.timeText, { color: getColor() }]}>
        {timeRemaining}
      </Text>
    </View>
  );
};

const countdownStyles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 6,
  },
  progressCircle: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 6,
  },
  timeText: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
});

// ============================================
// MISSION ALERT SHEET COMPONENT
// ============================================
const MissionAlertSheet = ({ mission, onAccept, onDecline, visible }) => {
  const [timeRemaining, setTimeRemaining] = useState(COUNTDOWN_DURATION);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isMounted = useRef(true);
  const pulseRef = useRef(null);

  // Trigger haptic feedback and animations on visible
  useEffect(() => {
    if (visible) {
      // High-intensity haptic pulse
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
    }

    return () => {
      if (pulseRef.current) {
        pulseRef.current.stop();
      }
    };
  }, [visible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (pulseRef.current) {
        pulseRef.current.stop();
      }
      slideAnim.setValue(SCREEN_HEIGHT);
      fadeAnim.setValue(0);
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!visible) {
      setTimeRemaining(COUNTDOWN_DURATION);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Defer the callback to avoid setState during render
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
  }, [visible, onDecline]);

  if (!visible || !mission) return null;

  // Calculate distance and time
  const distanceText = mission.distance || '0.8 km';
  const timeText = mission.estimatedTime || '4 mins';
  const payloadText = mission.payload || '3 Standard Bins (Organic Waste)';
  const earningsText = mission.earnings || 'GH₵ 25.00';

  return (
    <Animated.View
      style={[
        alertSheetStyles.overlay,
        { opacity: fadeAnim },
      ]}
      pointerEvents="box-none"
    >
      {/* Tap outside to decline */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={onDecline}
      />

      {/* Mission Alert Card */}
      <Animated.View
        style={[
          alertSheetStyles.sheet,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Handle Bar */}
        <View style={alertSheetStyles.handleBar} />

        {/* Header */}
        <View style={alertSheetStyles.header}>
          <View style={alertSheetStyles.priorityTag}>
            <Radar size={12} color={COLORS.white} />
            <Text style={alertSheetStyles.priorityText}>NEW MISSION</Text>
          </View>
          <TouchableOpacity onPress={onDecline} style={alertSheetStyles.closeButton}>
            <X size={20} color={COLORS.muted} />
          </TouchableOpacity>
        </View>

        {/* Mission Details */}
        <View style={alertSheetStyles.missionDetails}>
          {/* Location */}
          <View style={alertSheetStyles.locationRow}>
            <MapPin size={18} color={COLORS.primary} />
            <Text style={alertSheetStyles.locationText} numberOfLines={1}>
              {mission.pickup || '123 Main Street, Downtown'}
            </Text>
          </View>

          {/* Distance & Time */}
          <View style={alertSheetStyles.statsRow}>
            <View style={alertSheetStyles.statItem}>
              <Navigation size={14} color={COLORS.accent} />
              <Text style={alertSheetStyles.statValue}>{distanceText}</Text>
              <Text style={alertSheetStyles.statLabel}>away</Text>
            </View>
            <View style={alertSheetStyles.statDivider} />
            <View style={alertSheetStyles.statItem}>
              <Clock size={14} color={COLORS.accent} />
              <Text style={alertSheetStyles.statValue}>{timeText}</Text>
              <Text style={alertSheetStyles.statLabel}>ETA</Text>
            </View>
          </View>

          {/* Payload Info */}
          <View style={alertSheetStyles.payloadCard}>
            <Trash2 size={16} color={COLORS.primary} />
            <Text style={alertSheetStyles.payloadText}>{payloadText}</Text>
          </View>
        </View>

        {/* Action Area */}
        <View style={alertSheetStyles.actionArea}>
          {/* Countdown Timer */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <CountdownCircle timeRemaining={timeRemaining} />
          </Animated.View>

          <Text style={alertSheetStyles.actionLabel}>
            {timeRemaining > 0 ? 'Tap to Accept' : 'Mission Expired'}
          </Text>

          {/* Accept Button */}
          <TouchableOpacity
            style={[
              alertSheetStyles.acceptButton,
              timeRemaining === 0 && alertSheetStyles.acceptButtonDisabled,
            ]}
            onPress={onAccept}
            disabled={timeRemaining === 0}
          >
            <Text style={alertSheetStyles.acceptButtonText}>ACCEPT MISSION</Text>
          </TouchableOpacity>

          {/* Earnings Preview */}
          <View style={alertSheetStyles.earningsPreview}>
            <Text style={alertSheetStyles.earningsLabel}>Potential Earnings</Text>
            <Text style={alertSheetStyles.earningsValue}>{earningsText}</Text>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const alertSheetStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.lg,
    ...SHADOWS.heavy,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
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
  closeButton: {
    padding: SPACING.xs,
  },
  missionDetails: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  locationText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.muted,
  },
  payloadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  payloadText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
  },
  actionArea: {
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.muted,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.medium,
    marginBottom: SPACING.md,
  },
  acceptButtonDisabled: {
    backgroundColor: COLORS.muted,
    opacity: 0.5,
  },
  acceptButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
    letterSpacing: 1,
  },
  earningsPreview: {
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.muted,
  },
  earningsValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
});

// ============================================
// MAIN MISSION RADAR COMPONENT
// ============================================
export const MissionRadar = ({
  nearbyMissions = [],
  isOnline = false,
  onMissionPress,
  onMissionAccept,
  onMissionDecline,
  activeMission = null,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Pulsing animation for radar sweep
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Rotation animation for radar line
  useEffect(() => {
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );
    rotate.start();
    return () => rotate.stop();
  }, []);

  // Handle accepting a mission
  const handleAccept = useCallback(() => {
    if (currentMission) {
      onMissionAccept?.(currentMission);
      setShowAlert(false);
      setCurrentMission(null);
    }
  }, [currentMission, onMissionAccept]);

  // Handle declining a mission
  const handleDecline = useCallback(() => {
    onMissionDecline?.(currentMission);
    setShowAlert(false);
    setCurrentMission(null);
  }, [currentMission, onMissionDecline]);

  // Auto-show alert when new mission arrives
  useEffect(() => {
    if (isOnline && nearbyMissions.length > 0 && !showAlert && !activeMission) {
      setCurrentMission(nearbyMissions[0]);
      setShowAlert(true);
    }
  }, [isOnline, nearbyMissions, showAlert, activeMission]);

  // Only show radar when online
  if (!isOnline) {
    return null;
  }

  const missionCount = nearbyMissions.length + (activeMission ? 1 : 0);

  return (
    <View style={styles.container}>
      {/* Mission Alert Sheet */}
      <MissionAlertSheet
        mission={currentMission}
        visible={showAlert}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />

      {/* Radar Animation */}
      <View style={styles.radarContainer}>
        <Animated.View
          style={[
            styles.radarSweep,
            {
              transform: [
                { scale: pulseAnim },
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
        <View style={styles.radarCenter}>
          <Radar size={20} color={COLORS.primary} />
        </View>
      </View>

      {/* Mission Count Badge */}
      {missionCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{missionCount}</Text>
        </View>
      )}

      {/* Active Mission Indicator */}
      {activeMission && (
        <TouchableOpacity
          style={styles.activeMissionCard}
          onPress={() => onMissionPress?.(activeMission.id)}
        >
          <View style={styles.activeMissionHeader}>
            <Navigation size={14} color={COLORS.accent} />
            <Text style={styles.activeMissionLabel}>ACTIVE</Text>
          </View>
          <Text style={styles.activeMissionId}>#{activeMission.id}</Text>
          <Text style={styles.activeMissionDest} numberOfLines={1}>
            → {activeMission.dropoff || 'Navigating...'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Nearby Missions Count */}
      {nearbyMissions.length > 0 && !showAlert && (
        <TouchableOpacity
          style={styles.nearbyCount}
          onPress={() => {
            setCurrentMission(nearbyMissions[0]);
            setShowAlert(true);
          }}
        >
          <MapPin size={12} color={COLORS.muted} />
          <Text style={styles.nearbyText}>{nearbyMissions.length} missions nearby</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  radarSweep: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  radarCenter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.white,
  },
  activeMissionCard: {
    position: 'absolute',
    bottom: -60,
    left: -20,
    right: -20,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.accent,
    minWidth: 140,
  },
  activeMissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  activeMissionLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.accent,
    letterSpacing: 0.5,
  },
  activeMissionId: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 2,
  },
  activeMissionDest: {
    fontSize: 10,
    color: COLORS.muted,
  },
  nearbyCount: {
    position: 'absolute',
    bottom: -30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nearbyText: {
    fontSize: 10,
    color: COLORS.muted,
  },
});

export default MissionRadar;

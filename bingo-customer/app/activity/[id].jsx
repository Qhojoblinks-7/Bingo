import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Linking, Alert, Animated, Platform, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BinGoHeader } from '../../components/BinGoHeader';
import { ContactSupportSheet } from '../../components/ContactSupportSheet';
import { RiderProfileSheet } from '../../components/RiderProfileSheet';
import { ProofOfServiceSheet } from '../../components/ProofOfServiceSheet';
import { COLORS } from '../../constants/Colors';
import { useAppTheme } from '../../hooks/useThemeContext';
import { useActivityStore, useSupportStore, useActiveRequestStore, ActivityStatus } from '../../stores';
import * as Notifications from 'expo-notifications';

export default function ActivityDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isDark } = useAppTheme();
  const theme = isDark ? COLORS.dark : COLORS.light;
  
  // Use stores
  const { currentActivity, fetchActivityById } = useActivityStore();
  const { showSupportSheet } = useSupportStore();
  const { cancelRequest, isLoading: isCancelling } = useActiveRequestStore();
  
  // Local UI state
  const [showSupport, setShowSupport] = React.useState(false);
  const [showRiderProfile, setShowRiderProfile] = React.useState(false);
  const [showProofSheet, setShowProofSheet] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  // Fetch activity on mount
  React.useEffect(() => {
    if (id) {
      fetchActivityById(id);
    }
  }, [id]);

  // Handle pull-to-refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Re-fetch activity data
    if (id) {
      await fetchActivityById(id);
    }
    // Re-run animations
    step1Anim.setValue(0);
    step2Anim.setValue(0);
    step3Anim.setValue(0);
    connector1Anim.setValue(0);
    connector2Anim.setValue(0);
    
    setTimeout(() => {
      Animated.sequence([
        Animated.timing(step1Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
      
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(connector1Anim, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.timing(step2Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();
      }, 200);
      
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(connector2Anim, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.timing(step3Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();
      }, 500);
    }, 100);
    
    setRefreshing(false);
  }, [id, fetchActivityById, step1Anim, step2Anim, step3Anim, connector1Anim, connector2Anim]);

  // Mock data - in production, fetch based on id
  // Use store data if available, otherwise fall back to mock
  const activityData = currentActivity || {
    id: id || '1',
    type: 'pickup',
    status: ActivityStatus.COMPLETED,
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

  // ============================================
  // FUNCTIONS IMPLEMENTATION
  // ============================================

  // 1. Call Rider Function - Opens phone dialer with rider's number
  const handleCallRider = React.useCallback(async () => {
    if (!activityData?.rider?.phone) {
      Alert.alert('Error', 'Rider phone number not available');
      return;
    }
    
    const phoneNumber = activityData.rider.phone.replace(/\s/g, '');
    const telUrl = `tel:${phoneNumber}`;
    
    try {
      const canOpen = await Linking.canOpenURL(telUrl);
      if (canOpen) {
        await Linking.openURL(telUrl);
      } else {
        Alert.alert('Error', 'Unable to make phone calls on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open phone dialer');
      console.error('Call error:', error);
    }
  }, [activityData?.rider?.phone]);

  // 2. Track Rider Function - Show status timeline (no longer opens maps)
  // This function is kept for compatibility but now shows the status timeline
  const handleTrackRider = React.useCallback(() => {
    // The status timeline is now shown inline in the UI
    // This function can be used for future enhancements
    console.log('Showing status timeline...');
  }, []);

  // 2b. Schedule notification when rider is 30 meters away
  const schedule30MeterNotification = React.useCallback(async () => {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        Alert.alert('Permissions Required', 'Please enable notifications to receive alerts when your rider is nearby.');
        return;
      }

      // Show immediate notification (in production, this would be triggered by backend when rider is 30m away)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚛 Rider is Nearby!',
          body: `Your rider ${activityData.rider?.name || 'is'} approximately 30 meters away from your pickup location at ${activityData.address}. Please get ready!`,
          data: { activityId: id, type: 'rider_nearby' },
          sound: 'default',
        },
        trigger: null, // Immediate delivery
      });
      
      Alert.alert('Notification Set', 'You will be notified when your rider is 30 meters away.');
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'Failed to set notification');
    }
  }, [activityData.rider?.name, activityData.address, id]);

  // 3. View Proof Function - Opens proof of service sheet
  const handleViewProof = React.useCallback(() => {
    setShowProofSheet(true);
  }, []);

  // 4. Message Rider Function - Opens SMS
  const handleMessageRider = React.useCallback(async () => {
    if (!activityData?.rider?.phone) {
      Alert.alert('Error', 'Rider phone number not available');
      return;
    }
    
    const phoneNumber = activityData.rider.phone.replace(/\s/g, '');
    const smsUrl = `sms:${phoneNumber}`;
    
    try {
      await Linking.openURL(smsUrl);
    } catch (error) {
      Alert.alert('Error', 'Failed to open messages');
      console.error('SMS error:', error);
    }
  }, [activityData?.rider?.phone]);

  // 5. Support Function - Opens support sheet
  const handleSupport = React.useCallback(() => {
    showSupportSheet({ 
      context: { activityId: id },
      title: 'Get Help',
      subtitle: 'How can we assist you with this pickup?'
    });
  }, [id, showSupportSheet]);

  // 6. Cancel Request Function
  const handleCancelRequest = React.useCallback(async () => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this pickup request? This action cannot be undone.',
      [
        { text: 'No, Keep It', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await cancelRequest();
              if (success) {
                Alert.alert('Request Cancelled', 'Your pickup request has been cancelled.', [
                  { text: 'OK', onPress: () => router.replace('/(tabs)/activity') }
                ]);
              } else {
                Alert.alert('Error', 'Failed to cancel request. Please try again.');
              }
            } catch (error) {
              Alert.alert('Error', 'An error occurred while cancelling your request.');
            }
          }
        },
      ]
    );
  }, [cancelRequest, router]);

  // Status-based visual states
  const isAwaiting = activityData.status === ActivityStatus.AWAITING;
  const isInTransit = activityData.status === ActivityStatus.IN_TRANSIT;
  const isCompleted = activityData.status === ActivityStatus.COMPLETED;

  // Animation refs for timeline steps
  const step1Anim = useRef(new Animated.Value(0)).current;
  const step2Anim = useRef(new Animated.Value(0)).current;
  const step3Anim = useRef(new Animated.Value(0)).current;
  const connector1Anim = useRef(new Animated.Value(0)).current;
  const connector2Anim = useRef(new Animated.Value(0)).current;

  // Run staggered animation on mount
  useEffect(() => {
    // Step 1 animation
    Animated.sequence([
      Animated.timing(step1Anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Step 2 animation (delayed)
    setTimeout(() => {
      Animated.sequence([
        Animated.timing(connector1Anim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(step2Anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);

    // Step 3 animation (delayed more)
    setTimeout(() => {
      Animated.sequence([
        Animated.timing(connector2Anim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(step3Anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);
  }, []);

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
    // If no rider assigned yet, show disabled button
    if (!activityData.rider?.phone) {
      return (
        <View style={[styles.actionButton, { backgroundColor: isDark ? '#1F2937' : '#F3F4F6' }]}>
          <Ionicons name="call" size={18} color={COLORS.muted} />
          <Text style={[styles.actionDisabledText, { color: COLORS.muted }]}>Call Rider</Text>
        </View>
      );
    }
    
    if (isAwaiting) {
      return (
        <Pressable 
          style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
          onPress={handleCallRider}
        >
          <Ionicons name="call" size={18} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Call Rider</Text>
        </Pressable>
      );
    }
    if (isInTransit) {
      return (
        <View style={styles.actionButtonsRow}>
          <Pressable 
            style={[styles.halfActionButton, { backgroundColor: COLORS.primary }]}
            onPress={handleCallRider}
          >
            <Ionicons name="call" size={18} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Call</Text>
          </Pressable>
          <Pressable 
            style={[styles.halfActionButton, { backgroundColor: '#3B82F6' }]}
            onPress={schedule30MeterNotification}
          >
            <Ionicons name="notifications" size={18} color={COLORS.white} />
            <Text style={styles.actionButtonText}>30m Alert</Text>
          </Pressable>
        </View>
      );
    }
    // Completed
    return (
      <Pressable 
        style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
        onPress={handleViewProof}
      >
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

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
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
          <Pressable 
            style={[styles.riderCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => setShowRiderProfile(true)}
          >
            <View style={styles.riderAvatar}>
              <Ionicons name="person" size={28} color={COLORS.primary} />
            </View>
            <View style={styles.riderInfo}>
              <Text style={[styles.riderName, { color: theme.text }]}>{activityData.rider?.name || 'Assigning rider...'}</Text>
              <Text style={[styles.riderPhone, { color: COLORS.muted }]}>{activityData.rider?.phone || 'Waiting for assignment'}</Text>
              {isInTransit && (
                <Text style={[styles.etaText, { color: '#3B82F6' }]}>ETA: {activityData.eta}</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
          </Pressable>
          
          {/* Action Button based on status */}
          <View style={styles.actionContainer}>
            {getActionButton()}
          </View>
        </View>

        {/* Status Timeline */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.muted }]}>Pickup Status</Text>
          <View style={[styles.timelineCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {/* Step 1: Request Submitted */}
            <Animated.View 
              style={[
                styles.timelineStep,
                {
                  opacity: step1Anim,
                  transform: [{
                    translateY: step1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    })
                  }]
                }
              ]}
            >
              <View style={[styles.timelineIconContainer, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, { color: theme.text }]}>Request Submitted</Text>
                <Text style={[styles.timelineTime, { color: COLORS.muted }]}>{activityData.date} at {activityData.time}</Text>
              </View>
            </Animated.View>
            
            {/* Timeline connector */}
            <Animated.View 
              style={[
                styles.timelineConnector, 
                { 
                  backgroundColor: COLORS.primary,
                  opacity: connector1Anim,
                  transform: [{
                    scaleY: connector1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    })
                  }]
                }
              ]} 
            />
            
            {/* Step 2: Rider Assigned or In Transit */}
            <Animated.View 
              style={[
                styles.timelineStep,
                {
                  opacity: step2Anim,
                  transform: [{
                    translateY: step2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    })
                  }]
                }
              ]}
            >
              <View style={[
                styles.timelineIconContainer, 
                { backgroundColor: (isAwaiting || isInTransit || isCompleted) ? '#ECFDF5' : (isDark ? '#1F2937' : '#F3F4F6') }
              ]}>
                <Ionicons 
                  name={isAwaiting ? 'time' : (isInTransit || isCompleted) ? 'car-sport' : 'ellipse-outline'} 
                  size={20} 
                  color={(isAwaiting || isInTransit || isCompleted) ? COLORS.primary : COLORS.muted} 
                />
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, { color: (isAwaiting || isInTransit || isCompleted) ? theme.text : COLORS.muted }]}>
                  {isAwaiting ? 'Rider Assigned' : isInTransit ? 'Rider En Route' : isCompleted ? 'Rider En Route' : 'Waiting for Rider'}
                </Text>
                <Text style={[styles.timelineTime, { color: COLORS.muted }]}>
                  {isAwaiting ? 'Rider is on the way' : isInTransit ? activityData.eta || 'Arriving soon' : isCompleted ? 'Rider arrived' : 'Pending'}
                </Text>
              </View>
            </Animated.View>
            
            {/* Timeline connector */}
            <Animated.View 
              style={[
                styles.timelineConnector, 
                { 
                  backgroundColor: (isInTransit || isCompleted) ? COLORS.primary : COLORS.border,
                  opacity: connector2Anim,
                  transform: [{
                    scaleY: connector2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    })
                  }]
                }
              ]} 
            />
            
            {/* Step 3: Completed */}
            <Animated.View 
              style={[
                styles.timelineStep,
                {
                  opacity: step3Anim,
                  transform: [{
                    translateY: step3Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    })
                  }]
                }
              ]}
            >
              <View style={[
                styles.timelineIconContainer, 
                { backgroundColor: isCompleted ? '#ECFDF5' : (isDark ? '#1F2937' : '#F3F4F6') }
              ]}>
                <Ionicons 
                  name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'} 
                  size={20} 
                  color={isCompleted ? COLORS.primary : COLORS.muted} 
                />
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, { color: isCompleted ? theme.text : COLORS.muted }]}>
                  {isCompleted ? 'Pickup Complete' : 'Pending Pickup'}
                </Text>
                <Text style={[styles.timelineTime, { color: COLORS.muted }]}>
                  {isCompleted ? activityData.completedAt || 'Completed' : 'Waiting for pickup'}
                </Text>
              </View>
            </Animated.View>
          </View>
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

        {/* Cancel Button - Only show for Awaiting and In Transit */}
        {(isAwaiting || isInTransit) && (
          <View style={styles.cancelSection}>
            <Pressable 
              style={[styles.cancelButton, { borderColor: COLORS.error + '30' }]}
              onPress={handleCancelRequest}
              disabled={isCancelling}
            >
              <Ionicons name="close-circle-outline" size={20} color={COLORS.error} />
              <Text style={[styles.cancelText, { color: COLORS.error }]}>
                {isCancelling ? 'Cancelling...' : 'Cancel This Request'}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Contact Support Sheet */}
      <ContactSupportSheet
        visible={showSupport}
        onClose={() => setShowSupport(false)}
        title="Get Help"
        subtitle="How can we assist you with this pickup?"
      />

      {/* Rider Profile Sheet */}
      <RiderProfileSheet
        visible={showRiderProfile}
        onClose={() => setShowRiderProfile(false)}
        riderName={activityData.rider?.name || 'Unknown'}
        riderPhone={activityData.rider?.phone || 'N/A'}
        riderRating={4.8}
        totalTrips={1250}
        memberSince="2023"
        vehicleType="Motorbike"
        vehiclePlate="GT 1234-A"
        onCallPress={handleCallRider}
        onMessagePress={handleMessageRider}
      />

      {/* Proof of Service Sheet */}
      <ProofOfServiceSheet
        visible={showProofSheet}
        onClose={() => setShowProofSheet(false)}
        proofImage={activityData.proofImage}
        riderName={activityData.rider?.name || 'Unknown'}
        riderPhone={activityData.rider?.phone || 'N/A'}
        completedAt={activityData.completedAt}
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
  // Timeline Styles
  timelineCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 8,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  timelineTime: {
    fontSize: 12,
    marginTop: 2,
  },
  timelineConnector: {
    width: 2,
    height: 16,
    marginLeft: 15,
    marginVertical: 4,
  },
  actionContainer: {
    marginTop: 12,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
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
  proofPressable: {
    borderRadius: 16,
    overflow: 'hidden',
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
  cancelSection: {
    marginTop: 12,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

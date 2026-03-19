import React, { useRef } from 'react';
import { Pressable, StyleSheet, View, Text, Alert, Platform } from 'react-native';
import { Siren } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/Colors';
import { SHADOWS } from '../../constants/Styles';

export const SOSButton = ({ location }) => {
  const pressTimeoutRef = useRef(null);

  const handlePressIn = () => {
    // Start the timer - 3 seconds hold to trigger
    pressTimeoutRef.current = setTimeout(() => {
      triggerSOS();
    }, 3000);
    
    // Provide haptic feedback on press
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const handlePressOut = () => {
    // Cancel the SOS if released before 3 seconds
    if (pressTimeoutRef.current) {
      clearTimeout(pressTimeoutRef.current);
      pressTimeoutRef.current = null;
    }
  };

  const triggerSOS = () => {
    // Cancel any pending timeout
    if (pressTimeoutRef.current) {
      clearTimeout(pressTimeoutRef.current);
      pressTimeoutRef.current = null;
    }

    // Haptic feedback for SOS trigger
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    // Show confirmation alert
    Alert.alert(
      '🚨 EMERGENCY ALERT',
      `Your GPS coordinates will be sent to emergency services.\n\n${location ? `Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Location unavailable'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'SEND SOS', 
          style: 'destructive',
          onPress: () => {
            // TODO: Send SOS to Django backend
            console.log('SOS Triggered - Sending to backend');
            Alert.alert('SOS Sent', 'Help is on the way. Stay calm.');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.sosBtn,
          SHADOWS.heavy,
          pressed && styles.sosBtnPressed
        ]}
      >
        <Siren size={28} color={COLORS.white} />
        <Text style={styles.sosText}>HOLD 3s</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    bottom: 140,
  },
  sosBtn: {
    backgroundColor: '#DC2626', // Red-600
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  sosBtnPressed: {
    backgroundColor: '#B91C1C', // Red-700
    transform: [{ scale: 0.95 }],
  },
  sosText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: '800',
    marginTop: 2,
  }
});

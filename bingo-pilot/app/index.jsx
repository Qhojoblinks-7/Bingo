// BinGo Pilot - Initial Entry Point
// Splash Screen - checks auth before navigating
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../stores/useAuthStore';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants';

const { height } = Dimensions.get('window');

// ============================================
// SPLASH SCREEN COMPONENT
// ============================================
export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Run entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Wait for auth check, then navigate
    const navigateTimer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }, 2000);

    return () => clearTimeout(navigateTimer);
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.backgroundOverlay} />
      
      {/* Logo Container */}
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* App Logo */}
        <View style={styles.logoWrapper}>
          <Text style={styles.logoIcon}>🚛</Text>
        </View>
        
        {/* App Name */}
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.appName}>BinGo</Text>
          <Text style={styles.tagline}>Pilot</Text>
        </Animated.View>
      </Animated.View>

      {/* Loading Indicator */}
      <Animated.View 
        style={[styles.loadingContainer, { opacity: fadeAnim }]}
      >
        <View style={styles.loadingDot} />
        <View style={[styles.loadingDot, { marginLeft: 8 }]} />
        <View style={[styles.loadingDot, { marginLeft: 8 }]} />
      </Animated.View>

      {/* Version Info */}
      <Animated.View style={[styles.versionContainer, { opacity: fadeAnim }]}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.background,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  logoIcon: {
    fontSize: 60,
  },
  appName: {
    fontSize: 48,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 24,
    fontWeight: TYPOGRAPHY.fontWeight.light,
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 8,
    marginTop: SPACING.xs,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: height * 0.2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    opacity: 0.4,
  },
  versionContainer: {
    position: 'absolute',
    bottom: 50,
  },
  versionText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.muted,
  },
});

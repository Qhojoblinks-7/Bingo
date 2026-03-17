import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as SecureStore from 'expo-secure-store';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { COLORS } from '../constants/Colors';
import { useAppTheme } from '../hooks/useThemeContext';

// Prevent auto-hide to keep splash visible while app loads
ExpoSplashScreen.preventAutoHideAsync();

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const router = useRouter();
  const { isDark } = useAppTheme();
  
  const theme = isDark ? COLORS.dark : COLORS.light;

  useEffect(() => {
    // Trigger haptic feedback when splash screen mounts
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Animate Logo - Fade in and scale up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Background initialization tasks
    const initializeApp = async () => {
      try {
        // Check if this is first launch
        const isFirstLaunch = await SecureStore.getItemAsync('isFirstLaunch');
        
        // Simulate background tasks
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Navigate based on first launch status
        if (isFirstLaunch === null) {
          // First time user - go to onboarding
          router.replace('/onboarding');
        } else {
          // Returning user - go to login
          router.replace('/login');
        }
      } catch (error) {
        console.error('Initialization error:', error);
        router.replace('/login');
      }
    };

    // Start navigation after animation completes
    const timer = setTimeout(async () => {
      // Hide the native splash screen
      await ExpoSplashScreen.hideAsync();
      initializeApp();
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, fadeAnim, scaleAnim]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* BinGo Logo - Using Text with brand color */}
        <View style={[styles.logoWrapper, { backgroundColor: COLORS.primary }]}>
          <Text style={styles.logoIcon}>🗑️</Text>
        </View>
        
        {/* BinGo Brand Text */}
        <Text style={[styles.brandText, { color: theme.text }]}>BinGo</Text>
        
        {/* Tagline */}
        <Text style={[styles.tagline, { color: COLORS.muted }]}>Waste management, simplified.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    // Android shadow
    elevation: 8,
  },
  logoIcon: {
    fontSize: 56,
  },
  brandText: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

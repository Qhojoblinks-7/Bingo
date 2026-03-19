import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/Colors';

export default function Splash() {
  const router = useRouter();
  
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 600,
          easing: Easing.back(1.5),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Text animation
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Tagline animation
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after animation - skip auth and go directly to main app
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Logo */}
      <Animated.Image 
        source={require('../assets/images/logo2.png')}
        style={[
          styles.logoImage,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          }
        ]}
        resizeMode="contain"
      />
      
      {/* Tagline */}
      <Animated.Text 
        style={[
          styles.tagline,
          { opacity: taglineOpacity }
        ]}
      >
        Waste Collection Made Easy
      </Animated.Text>

      {/* Loading indicator */}
      <Animated.View style={[styles.loadingContainer, { opacity: taglineOpacity }]}>
        <View style={styles.loadingDot} />
        <View style={[styles.loadingDot, styles.loadingDotMiddle]} />
        <View style={styles.loadingDot} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primary,
    opacity: 0.9,
  },
  logoImage: {
    width: 400,
    height: 400,
  },
  
  tagline: {
    fontSize: 16,
    color: COLORS.white + '80',
    fontWeight: '500',
    letterSpacing: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    marginTop: 48,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  loadingDotMiddle: {
    opacity: 1,
  },
});

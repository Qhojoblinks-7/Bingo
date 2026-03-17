import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { COLORS } from '../constants/Colors';
import { useAppTheme } from '../hooks/useThemeContext';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Request a Pickup in Seconds',
    description: 'No more waiting for the truck. Simply enter your Ghana Post GPS and choose your bin size.',
    icon: '📍',
    backgroundColor: '#E8F5E9',
  },
  {
    id: '2',
    title: 'Pay Securely via MoMo',
    description: 'Transparent pricing with no hidden fees. Pay instantly from your BinGo wallet using Mobile Money.',
    icon: '💳',
    backgroundColor: '#E3F2FD',
  },
  {
    id: '3',
    title: 'Verified Cleanliness',
    description: 'Track your pickup status and view "Proof of Service" photos once the job is done.',
    icon: '✅',
    backgroundColor: '#FFF3E0',
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const flatListRef = useRef(null);
  const colorScheme = useColorScheme();
  const { isDark } = useAppTheme();
  
  const theme = isDark ? COLORS.dark : COLORS.light;

  const handleSkip = async () => {
    await SecureStore.setItemAsync('isFirstLaunch', 'false');
    router.replace('/login');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleGetStarted = async () => {
    await SecureStore.setItemAsync('isFirstLaunch', 'false');
    router.replace('/login');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      {/* Visual Illustration */}
      <View style={[styles.illustrationContainer, { backgroundColor: item.backgroundColor }]}>
        <Text style={styles.illustrationIcon}>{item.icon}</Text>
      </View>

      {/* Text Content */}
      <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
      <Text style={[styles.description, { color: COLORS.muted }]}>{item.description}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipButtonText, { color: COLORS.muted }]}>Skip</Text>
      </TouchableOpacity>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Footer with Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            currentIndex === SLIDES.length - 1 && { backgroundColor: COLORS.primary },
          ]}
          onPress={currentIndex === SLIDES.length - 1 ? handleGetStarted : handleNext}
        >
          <Text
            style={[
              styles.buttonText,
              currentIndex === SLIDES.length - 1 && styles.getStartedButtonText,
            ]}
          >
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  slide: {
    width: width,
    paddingHorizontal: 40,
    paddingTop: 100,
    paddingBottom: 40,
    alignItems: 'center',
  },
  illustrationContainer: {
    width: 220,
    height: 220,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    // Android shadow
    elevation: 8,
  },
  illustrationIcon: {
    fontSize: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.muted,
    marginHorizontal: 6,
    opacity: 0.3,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    opacity: 1,
    width: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: COLORS.border,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  getStartedButtonText: {
    color: '#FFFFFF',
  },
});

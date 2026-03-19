import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';
import { Radar, ClipboardList, Wallet, UserCircle, Navigation } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/Colors';
import useMissionStore from '../../stores/useMissionStore';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function TabLayout() {
  const { activeMission, missionStatus } = useMissionStore();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isJobActive = activeMission !== null && missionStatus !== 'idle';

  // Pulsing animation for active mission indicator
  useEffect(() => {
    if (isJobActive) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isJobActive]);

  const handleTabPress = () => {
    Haptics.selectionAsync(); // Subtle "tick" feel on switch
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.label,
        tabBarIconStyle: styles.icon,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Radar',
          tabBarIcon: ({ color, focused }) => (
            <Radar 
              size={24} 
              color={color} 
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
        listeners={{ tabPress: handleTabPress }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: 'Missions',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.centerContainer}>
              {isJobActive ? (
                <Animated.View
                  style={[
                    styles.activeJobIndicator,
                    { transform: [{ scale: pulseAnim }] }
                  ]}
                >
                  <Navigation size={28} color={COLORS.accent} />
                </Animated.View>
              ) : (
                <ClipboardList 
                  size={24} 
                  color={color}
                  fill={focused ? color : 'transparent'}
                />
              )}
            </View>
          ),
        }}
        listeners={{ tabPress: handleTabPress }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, focused }) => (
            <Wallet 
              size={24} 
              color={color}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
        listeners={{ tabPress: handleTabPress }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <UserCircle 
              size={24} 
              color={color}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
        listeners={{ tabPress: handleTabPress }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 25,
    backgroundColor: 'rgba(30, 41, 59, 0.95)', // Pilot Slate with transparency
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  icon: {
    marginTop: -2,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeJobIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
});
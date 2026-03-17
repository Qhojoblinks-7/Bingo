import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colors = useColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 85,
          paddingBottom: Platform.OS === 'ios' ? 20 : 20,
          paddingTop: 10,
          paddingHorizontal: 20,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "clipboard" : "clipboard-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}

import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/Colors';

// Simple icon components (in production, use lucide-react-native)
const MapIcon = ({ color, size }) => (
  <View style={[styles.iconPlaceholder, { backgroundColor: color }]}>
    <Text style={{ color: COLORS.background, fontSize: 10 }}>M</Text>
  </View>
);

const ActivityIcon = ({ color, size }) => (
  <View style={[styles.iconPlaceholder, { backgroundColor: color }]}>
    <Text style={{ color: COLORS.background, fontSize: 10 }}>A</Text>
  </View>
);

const ProfileIcon = ({ color, size }) => (
  <View style={[styles.iconPlaceholder, { backgroundColor: color }]}>
    <Text style={{ color: COLORS.background, fontSize: 10 }}>P</Text>
  </View>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.tabBarBackground,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.tabBarActive,
        tabBarInactiveTintColor: COLORS.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <MapIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <ActivityIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

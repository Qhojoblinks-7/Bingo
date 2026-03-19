// BinGo Pilot - Profile Screen
// Pilot settings and account management
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';
import useAuthStore from '../../stores/useAuthStore';
import useMissionStore from '../../stores/useMissionStore';

// ============================================
// MENU ITEM COMPONENT
// ============================================
const MenuItem = ({ icon, title, subtitle, onPress, showArrow = true, danger = false }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIcon}>
      <Text style={styles.menuIconText}>{icon}</Text>
    </View>
    <View style={styles.menuContent}>
      <Text style={[styles.menuTitle, danger && styles.menuTitleDanger]}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    {showArrow && <Text style={styles.menuArrow}>›</Text>}
  </TouchableOpacity>
);

// ============================================
// PROFILE SCREEN
// ============================================
export default function ProfileScreen() {
  const router = useRouter();
  const { pilot, logout } = useAuthStore();
  const { isOnline, setOnline } = useMissionStore();

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  // Handle menu navigation
  const handleMenuPress = (screen) => {
    // TODO: Implement navigation to settings screens
    Alert.alert('Coming Soon', `The ${screen} screen will be available soon.`);
  };

  // Sample pilot data
  const pilotData = pilot || {
    first_name: 'John',
    last_name: 'Doe',
    email: 'pilot@bingo.com',
    phone: '+1 234 567 8900',
    vehicle_type: 'car',
    rating: 4.9,
    total_missions: 156,
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {pilotData.first_name[0]}{pilotData.last_name[0]}
            </Text>
          </View>
          <View style={styles.onlineIndicator}>
            <View style={[styles.onlineDot, { backgroundColor: isOnline ? COLORS.success : COLORS.muted }]} />
          </View>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {pilotData.first_name} {pilotData.last_name}
          </Text>
          <Text style={styles.profileEmail}>{pilotData.email}</Text>
          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>⭐ {pilotData.rating}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>📋 {pilotData.total_missions}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.quickAction, isOnline && styles.quickActionActive]}
          onPress={() => setOnline(!isOnline)}
        >
          <Text style={styles.quickActionIcon}>{isOnline ? '🟢' : '⚪'}</Text>
          <Text style={styles.quickActionText}>
            {isOnline ? 'Go Offline' : 'Go Online'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => handleMenuPress('Documents')}
        >
          <Text style={styles.quickActionIcon}>📄</Text>
          <Text style={styles.quickActionText}>Documents</Text>
        </TouchableOpacity>
      </View>

      {/* Vehicle Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VEHICLE INFO</Text>
        <View style={styles.sectionContent}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Registration</Text>
            <Text style={styles.settingValue}>GW-2034-26</Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Type</Text>
            <Text style={styles.settingValue}>Electric Tricycle</Text>
          </View>
          <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
            <Text style={styles.settingLabel}>Insurance</Text>
            <Text style={[styles.settingValue, { color: COLORS.success }]}>Valid until Dec 2026</Text>
          </View>
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.sectionContent}>
          <MenuItem
            icon="👤"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() => handleMenuPress('Edit Profile')}
          />
          <MenuItem
            icon="🚗"
            title="Vehicle"
            subtitle={pilotData.vehicle_type || 'Not set'}
            onPress={() => handleMenuPress('Vehicle')}
          />
          <MenuItem
            icon="📱"
            title="Phone Number"
            subtitle={pilotData.phone || 'Not verified'}
            onPress={() => handleMenuPress('Phone')}
          />
          <MenuItem
            icon="📧"
            title="Email"
            subtitle={pilotData.email || 'Not verified'}
            onPress={() => handleMenuPress('Email')}
          />
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.sectionContent}>
          <MenuItem
            icon="🔔"
            title="Notifications"
            subtitle="Push notifications & alerts"
            onPress={() => handleMenuPress('Notifications')}
          />
          <MenuItem
            icon="🌍"
            title="Language"
            subtitle="English"
            onPress={() => handleMenuPress('Language')}
          />
          <MenuItem
            icon="📍"
            title="Location"
            subtitle="Manage location services"
            onPress={() => handleMenuPress('Location')}
          />
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.sectionContent}>
          <MenuItem
            icon="❓"
            title="Help Center"
            subtitle="FAQs and support articles"
            onPress={() => handleMenuPress('Help Center')}
          />
          <MenuItem
            icon="💬"
            title="Chat Support"
            subtitle="Talk to our support team"
            onPress={() => handleMenuPress('Chat Support')}
          />
          <MenuItem
            icon="📋"
            title="Terms & Conditions"
            onPress={() => handleMenuPress('Terms')}
          />
          <MenuItem
            icon="🔒"
            title="Privacy Policy"
            onPress={() => handleMenuPress('Privacy')}
          />
        </View>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>BinGo Pilot v1.0.0</Text>
      </View>

      {/* SOS Settings - High contrast, tucked away */}
      <TouchableOpacity style={styles.sosToggle}>
        <Text style={styles.sosText}>🚨 EMERGENCY SOS SETTINGS</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl + 20,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  profileCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 2,
  },
  onlineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  profileName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  profileEmail: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.muted,
    marginTop: 2,
  },
  profileStats: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  statItem: {
    paddingRight: SPACING.md,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginRight: SPACING.md,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  quickAction: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickActionActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  quickActionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  section: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.muted,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionContent: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuIconText: {
    fontSize: 18,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  menuTitleDanger: {
    color: COLORS.error,
  },
  menuSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.muted,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 24,
    color: COLORS.muted,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  settingValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.muted,
  },
  sosToggle: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.error + '15',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },
  sosText: {
    color: COLORS.error,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  appVersion: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.muted,
  },
  logoutButton: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.error + '20',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.error,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  bottomPadding: {
    height: SPACING.xl * 2,
  },
});

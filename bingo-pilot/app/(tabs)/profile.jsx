// BinGo Pilot - Profile Screen (Redesigned)
// Pilot settings and account management with industrial aesthetic
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';
import useAuthStore from '../../stores/useAuthStore';
import useMissionStore from '../../stores/useMissionStore';

// ============================================
// PILOT LEVEL SYSTEM
// ============================================

const getPilotLevel = (totalMissions) => {
  if (totalMissions >= 201) return { level: 'Platinum', color: '#E5E4E2', gradient: ['#E5E4E2', '#C0C0C0'] };
  if (totalMissions >= 51) return { level: 'Gold', color: '#FFD700', gradient: ['#FFD700', '#FFA500'] };
  return { level: 'Silver', color: '#C0C0C0', gradient: ['#C0C0C0', '#A8A8A8'] };
};

// ============================================
// STAT CARD COMPONENT (For Performance Dashboard)
// ============================================

const StatCard = ({ icon, label, value, color = COLORS.primary }) => (
  <View style={styles.statCard}>
    <Text style={styles.statCardIcon}>{icon}</Text>
    <Text style={[styles.statCardValue, { color }]}>{value}</Text>
    <Text style={styles.statCardLabel}>{label}</Text>
  </View>
);

// ============================================
// IDENTITY CARD COMPONENT (Header)
// ============================================

const IdentityCard = ({ pilotData, pilotLevel, isOnline }) => (
  <View style={styles.identityCard}>
    {/* Avatar with Gradient Border based on level */}
    <View style={[styles.avatarWrapper, { borderColor: pilotLevel.color }]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {pilotData.first_name?.[0] || 'P'}{pilotData.last_name?.[0] || 'ilot'}
        </Text>
      </View>
      {/* Verification Badge */}
      <View style={styles.verifiedBadge}>
        <Text style={styles.verifiedIcon}>✓</Text>
      </View>
    </View>

    {/* Pilot Info */}
    <View style={styles.identityInfo}>
      <View style={styles.nameRow}>
        <Text style={styles.pilotName}>
          {pilotData.first_name || 'Pilot'} {pilotData.last_name || 'Name'}
        </Text>
        <View style={[styles.levelBadge, { backgroundColor: pilotLevel.color + '20', borderColor: pilotLevel.color }]}>
          <Text style={[styles.levelBadgeText, { color: pilotLevel.color }]}>
            {pilotLevel.level}
          </Text>
        </View>
      </View>
      
      <Text style={styles.memberSince}>Member since {pilotData.member_since || 'Jan 2024'}</Text>

      {/* Rating */}
      <View style={styles.ratingRow}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingValue}>★ {pilotData.rating || '4.9'}</Text>
          <TouchableOpacity>
            <Text style={styles.viewFeedback}>View feedback</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.statusDot, { backgroundColor: isOnline ? COLORS.success : COLORS.muted }]}>
          <Text style={styles.statusText}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
        </View>
      </View>
    </View>
  </View>
);

// ============================================
// MENU ITEM COMPONENT
// ============================================

const MenuItem = ({ icon, title, subtitle, onPress, showArrow = true, danger = false, rightElement }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIcon}>
      <Text style={styles.menuIconText}>{icon}</Text>
    </View>
    <View style={styles.menuContent}>
      <Text style={[styles.menuTitle, danger && styles.menuTitleDanger]}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    {rightElement || (showArrow && <Text style={styles.menuArrow}>›</Text>)}
  </TouchableOpacity>
);

// ============================================
// SECTION CARD COMPONENT
// ============================================

const SectionCard = ({ title, icon, children }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>{icon}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

// ============================================
// MAIN PROFILE SCREEN
// ============================================

export default function ProfileScreen() {
  const router = useRouter();
  const { pilot, logout } = useAuthStore();
  const { isOnline, setOnline } = useMissionStore();

  // Local state for toggles
  const [darkMode, setDarkMode] = useState(true);
  const [biometricLogin, setBiometricLogin] = useState(true);

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
    Alert.alert('Coming Soon', `The ${screen} screen will be available soon.`);
  };

  // Sample pilot data with extended info
  const pilotData = pilot || {
    first_name: 'John',
    last_name: 'Doe',
    email: 'pilot@bingo.com',
    phone: '+233 20 123 4567',
    vehicle_type: 'Electric Tricycle',
    vehicle_id: 'GW-2034-26',
    rating: 4.9,
    total_missions: 156,
    accuracy: 94,
    safety_score: 98,
    member_since: 'January 2024',
    license_status: 'Valid',
    insurance_status: 'Valid',
    atu_id: 'ATU-2024-7829',
  };

  // Calculate pilot level
  const pilotLevel = getPilotLevel(pilotData.total_missions || 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* IDENTITY CARD (Pilot Identity) */}
      <IdentityCard 
        pilotData={pilotData} 
        pilotLevel={pilotLevel}
        isOnline={isOnline}
      />

      {/* PERFORMANCE DASHBOARD (Mini-Analytics) */}
      <View style={styles.performanceDashboard}>
        <Text style={styles.dashboardTitle}>PERFORMANCE</Text>
        <View style={styles.statsGrid}>
          <StatCard 
            icon="🗑️" 
            label="Missions" 
            value={pilotData.total_missions || 0} 
            color={COLORS.primary}
          />
          <StatCard 
            icon="📍" 
            label="Accuracy" 
            value={`${pilotData.accuracy || 94}%`} 
            color={COLORS.accent}
          />
          <StatCard 
            icon="🛡️" 
            label="Safety" 
            value={`${pilotData.safety_score || 98}%`} 
            color={COLORS.success}
          />
        </View>
      </View>

      {/* SECTION A: Personal & Vehicle Information */}
      <View style={styles.sectionsContainer}>
        <SectionCard title="PERSONAL & VEHICLE" icon="🚛">
          <MenuItem
            icon="👤"
            title="Full Name"
            subtitle={`${pilotData.first_name || ''} ${pilotData.last_name || ''}`}
            onPress={() => handleMenuPress('Edit Profile')}
          />
          <MenuItem
            icon="📱"
            title="Phone"
            subtitle={pilotData.phone || 'Not verified'}
            onPress={() => handleMenuPress('Phone')}
          />
          <MenuItem
            icon="📧"
            title="Email"
            subtitle={pilotData.email || 'Not verified'}
            onPress={() => handleMenuPress('Email')}
          />
          <MenuItem
            icon="🛵"
            title="Vehicle"
            subtitle={`${pilotData.vehicle_type} • ${pilotData.vehicle_id}`}
            onPress={() => handleMenuPress('Vehicle')}
          />
          <MenuItem
            icon="📄"
            title="License"
            subtitle={pilotData.license_status || 'Not uploaded'}
            onPress={() => handleMenuPress('License')}
            rightElement={
              <View style={[styles.statusPill, { backgroundColor: COLORS.success + '20' }]}>
                <Text style={[styles.statusPillText, { color: COLORS.success }]}>
                  {pilotData.license_status || 'Valid'}
                </Text>
              </View>
            }
          />
          <MenuItem
            icon="🛡️"
            title="Insurance"
            subtitle="Valid until Dec 2026"
            onPress={() => handleMenuPress('Insurance')}
            rightElement={
              <View style={[styles.statusPill, { backgroundColor: COLORS.success + '20' }]}>
                <Text style={[styles.statusPillText, { color: COLORS.success }]}>Valid</Text>
              </View>
            }
          />
          <MenuItem
            icon="🎓"
            title="ATU Student ID"
            subtitle={pilotData.atu_id || 'Not linked'}
            onPress={() => handleMenuPress('ATU ID')}
            showArrow={false}
          />
        </SectionCard>
      </View>

      {/* SECTION B: Security & Preferences */}
      <View style={styles.sectionsContainer}>
        <SectionCard title="SECURITY & PREFERENCES" icon="⚙️">
          <MenuItem
            icon="🔐"
            title="Change Password"
            subtitle="Update your account password"
            onPress={() => handleMenuPress('Change Password')}
          />
          <MenuItem
            icon="👆"
            title="Biometric Login"
            subtitle="FaceID / Fingerprint"
            onPress={() => setBiometricLogin(!biometricLogin)}
            rightElement={
              <Switch
                value={biometricLogin}
                onValueChange={setBiometricLogin}
                trackColor={{ false: COLORS.muted, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            }
            showArrow={false}
          />
          <MenuItem
            icon="🌙"
            title="Dark Mode"
            subtitle="App theme preference"
            onPress={() => setDarkMode(!darkMode)}
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: COLORS.muted, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            }
            showArrow={false}
          />
          <MenuItem
            icon="🌍"
            title="Language"
            subtitle="English"
            onPress={() => handleMenuPress('Language')}
          />
          <MenuItem
            icon="🗺️"
            title="Navigation"
            subtitle="In-App Map"
            onPress={() => handleMenuPress('Navigation')}
          />
        </SectionCard>
      </View>

      {/* SECTION C: Support & Legal */}
      <View style={styles.sectionsContainer}>
        <SectionCard title="SUPPORT & LEGAL" icon="❓">
          <MenuItem
            icon="💬"
            title="Help Center"
            subtitle="FAQs and support articles"
            onPress={() => handleMenuPress('Help Center')}
          />
          <MenuItem
            icon="📞"
            title="Contact Support"
            subtitle="Talk to our support team"
            onPress={() => handleMenuPress('Contact Support')}
          />
          <MenuItem
            icon="📋"
            title="Terms of Service"
            onPress={() => handleMenuPress('Terms')}
          />
          <MenuItem
            icon="🔒"
            title="Privacy Policy"
            onPress={() => handleMenuPress('Privacy')}
          />
        </SectionCard>
      </View>

      {/* EMERGENCY SOS */}
      <TouchableOpacity style={styles.sosButton}>
        <Text style={styles.sosIcon}>🚨</Text>
        <Text style={styles.sosText}>EMERGENCY SOS SETTINGS</Text>
      </TouchableOpacity>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* APP VERSION */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>BinGo Pilot v1.0.0</Text>
      </View>

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

  // ============================================
  // IDENTITY CARD STYLES
  // ============================================
  identityCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    padding: 3,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  verifiedIcon: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  identityInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  pilotName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  levelBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  memberSince: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.muted,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFD700', // Gold color for stars
  },
  viewFeedback: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.accent,
    textDecorationLine: 'underline',
  },
  statusDot: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },

  // ============================================
  // PERFORMANCE DASHBOARD STYLES
  // ============================================
  performanceDashboard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  dashboardTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.muted,
    marginBottom: SPACING.sm,
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statCardIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '800',
  },
  statCardLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.muted,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ============================================
  // SECTION STYLES
  // ============================================
  sectionsContainer: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  sectionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.muted,
    letterSpacing: 1,
  },
  sectionContent: {
    backgroundColor: COLORS.surface,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuIconText: {
    fontSize: 16,
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
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  // ============================================
  // SOS & LOGOUT STYLES
  // ============================================
  sosButton: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.error + '15',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.error + '30',
    gap: 8,
  },
  sosIcon: {
    fontSize: 18,
  },
  sosText: {
    color: COLORS.error,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  logoutButton: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    backgroundColor: COLORS.error + '20',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.error,
    gap: 8,
  },
  logoutIcon: {
    fontSize: 18,
  },
  logoutText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.error,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },

  // ============================================
  // FOOTER STYLES
  // ============================================
  appInfo: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  appVersion: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.muted,
  },
  bottomPadding: {
    height: SPACING.xl * 2,
  },
});

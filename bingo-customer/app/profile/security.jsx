import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BinGoHeader } from '@/components/BinGoHeader';
import { useAppTheme } from '@/hooks/useThemeContext';

export default function Security() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  
  const colors = isDark ? {
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    muted: '#A0A0A0',
    primary: '#10B981',
    white: '#FFFFFF',
    border: '#333333',
    inputBg: '#2A2A2A',
    error: '#EF4444',
  } : {
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#111827',
    muted: '#6B7280',
    primary: '#10B981',
    white: '#FFFFFF',
    border: '#E5E7EB',
    inputBg: '#F3F4F6',
    error: '#EF4444',
  };

  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handleBiometricToggle = (value) => {
    setBiometricEnabled(value);
    Alert.alert(
      value ? 'Biometric Enabled' : 'Biometric Disabled',
      value 
        ? 'You can now use fingerprint or face recognition to log in.'
        : 'You will need to use your password to log in.',
      [{ text: 'OK' }]
    );
  };

  const handleTwoFactorToggle = (value) => {
    setTwoFactorEnabled(value);
    Alert.alert(
      value ? '2FA Enabled' : '2FA Disabled',
      value 
        ? 'Two-factor authentication is now enabled for your account.'
        : 'Two-factor authentication has been disabled.',
      [{ text: 'OK' }]
    );
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    statusCard: {
      backgroundColor: isDark ? '#1A3A2A' : '#F0FDF4',
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    statusIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    statusTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    statusSubtitle: {
      fontSize: 13,
      color: colors.muted,
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.muted,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 12,
      marginTop: 8,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 20,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    noBorder: {
      borderBottomWidth: 0,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: isDark ? '#1A3A2A' : '#F0FDF4',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    menuItemText: {
      flex: 1,
    },
    menuItemTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    menuItemSubtitle: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 2,
    },
    badge: {
      backgroundColor: colors.inputBg,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text,
    },
    tipsCard: {
      backgroundColor: isDark ? '#3A2A1A' : '#FFFBEB',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? '#5D4037' : '#FCD34D',
    },
    tipsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    tipsTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    tipsText: {
      fontSize: 13,
      color: colors.muted,
      lineHeight: 22,
    },
  }), [colors, isDark]);

  return (
    <View style={styles.container}>
      <BinGoHeader 
        title="Security" 
        showBack 
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Security Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
          </View>
          <Text style={styles.statusTitle}>Your Account is Secure</Text>
          <Text style={styles.statusSubtitle}>
            We use industry-standard encryption to protect your data
          </Text>
        </View>

        {/* Login Security Section */}
        <Text style={styles.sectionTitle}>Login Security</Text>
        <View style={styles.card}>
          <Pressable 
            style={styles.menuItem}
            onPress={() => router.push('/profile/change-password')}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="key" size={20} color={colors.primary} />
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Change Password</Text>
                <Text style={styles.menuItemSubtitle}>Last changed 30 days ago</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </Pressable>

          <View style={[styles.menuItem, styles.noBorder]}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="finger-print" size={20} color={colors.primary} />
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Biometric Login</Text>
                <Text style={styles.menuItemSubtitle}>Use fingerprint or face to log in</Text>
              </View>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Two-Factor Authentication */}
        <Text style={styles.sectionTitle}>Two-Factor Authentication</Text>
        <View style={styles.card}>
          <View style={[styles.menuItem, styles.noBorder]}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="shield" size={20} color={colors.primary} />
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Enable 2FA</Text>
                <Text style={styles.menuItemSubtitle}>Add an extra layer of security</Text>
              </View>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={handleTwoFactorToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Active Sessions */}
        <Text style={styles.sectionTitle}>Active Sessions</Text>
        <View style={styles.card}>
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="phone-portrait" size={20} color={colors.primary} />
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Logged-in Devices</Text>
                <Text style={styles.menuItemSubtitle}>Manage devices logged into your account</Text>
              </View>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2 devices</Text>
            </View>
          </Pressable>

          <Pressable style={[styles.menuItem, styles.noBorder]}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="log-out" size={20} color={colors.error} />
              </View>
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemTitle, { color: colors.error }]}>
                  Sign Out Everywhere
                </Text>
                <Text style={styles.menuItemSubtitle}>Log out from all devices</Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Security Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={20} color="#F59E0B" />
            <Text style={styles.tipsTitle}>Security Tips</Text>
          </View>
          <Text style={styles.tipsText}>
            • Use a strong, unique password{'\n'}
            • Enable two-factor authentication{'\n'}
            • Never share your OTP with anyone{'\n'}
            • Report suspicious activity immediately
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

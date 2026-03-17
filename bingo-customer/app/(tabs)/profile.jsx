import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BinGoHeader } from '@/components/BinGoHeader';
import { useAppTheme } from '@/hooks/useThemeContext';
import { useColors } from '@/hooks/useColors';
import { sendTestNotification } from '@/hooks/usePushNotifications';

export default function Profile() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { isDark, mode, setThemeMode } = useAppTheme();
  const colors = useColors();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            router.replace('/login');
          }
        },
      ]
    );
  };

  const handleNotificationToggle = (value) => {
    setNotificationsEnabled(value);
    console.log('Notification preference updated:', value);
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification();
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  const getThemeModeLabel = () => {
    switch (mode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'device':
        return 'System';
      default:
        return 'System';
    }
  };

  const cycleThemeMode = async () => {
    const modes = ['device', 'light', 'dark'];
    const currentIndex = modes.indexOf(mode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    await setThemeMode(nextMode);
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
    userSection: {
      alignItems: 'center',
      marginBottom: 30,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    avatarText: {
      color: colors.white,
      fontSize: 28,
      fontWeight: '800',
    },
    userName: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    userEmail: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 2,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.muted,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
      marginLeft: 4,
    },
    menuCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.card,
    },
    itemPressed: {
      backgroundColor: colors.inputBg,
    },
    borderBottom: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    itemContent: {
      flex: 1,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    itemSubtitle: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 2,
    },
    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 10,
      padding: 16,
    },
    logoutText: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.error,
    },
    versionText: {
      textAlign: 'center',
      color: colors.muted,
      fontSize: 12,
      marginTop: 20,
    }
  }), [colors]);

  const ProfileItem = ({ icon, title, subtitle, onPress, isLast = false }) => (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.item,
        pressed && styles.itemPressed,
        !isLast && styles.borderBottom
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <BinGoHeader title="Profile" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Header */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>IA</Text>
          </View>
          <Text style={styles.userName}>Immanuel Appiah</Text>
          <Text style={styles.userEmail}>immanuel@bingo.com.gh</Text>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionLabel}>Account Settings</Text>
        <View style={styles.menuCard}>
          <ProfileItem 
            icon="person" 
            title="Personal Information" 
            subtitle="Name, Phone, Email" 
            onPress={() => router.push('/profile/edit')} 
          />
          <ProfileItem 
            icon="location" 
            title="Saved Locations" 
            subtitle="Home, Office addresses" 
            onPress={() => router.push('/profile/locations')} 
          />
          <ProfileItem 
            icon="card" 
            title="Payment Methods" 
            subtitle="Mobile Money, Cards" 
            onPress={() => router.push('/profile/payments')} 
            isLast={true}
          />
        </View>

        {/* App Section */}
        <Text style={styles.sectionLabel}>Preferences</Text>
        <View style={styles.menuCard}>
          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Ionicons name="notifications" size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Push Notifications</Text>
            </View>
            <Switch 
              value={notificationsEnabled} 
              onValueChange={handleNotificationToggle}
              trackColor={{ false: colors.border, true: colors.primary }} 
              thumbColor={colors.white}
            />
          </View>
          <Pressable 
            onPress={handleTestNotification}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.itemPressed,
              styles.borderBottom
            ]}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Test Notification</Text>
              <Text style={styles.itemSubtitle}>Tap to send a test</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Pressable>
          <Pressable 
            onPress={cycleThemeMode}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.itemPressed,
              styles.borderBottom
            ]}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Theme</Text>
              <Text style={styles.itemSubtitle}>{getThemeModeLabel()}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Pressable>
          <ProfileItem 
            icon="shield-checkmark" 
            title="Privacy & Safety" 
            onPress={() => router.push('/profile/privacy')} 
            isLast={true}
          />
        </View>

        {/* Support Section */}
        <Text style={styles.sectionLabel}>Support</Text>
        <View style={styles.menuCard}>
          <ProfileItem 
            icon="help-circle" 
            title="Contact Support" 
            subtitle="Chat or call for help"
            onPress={() => router.push('/profile/support')} 
            isLast={true}
          />
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Text style={styles.versionText}>BinGo Customer v1.0.0 (SDK 54)</Text>
      </ScrollView>
    </View>
  );
}

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BinGoHeader } from '@/components/BinGoHeader';
import { DataRightsSheet } from '@/components/DataRightsSheet';
import { useAppTheme } from '@/hooks/useThemeContext';

// Privacy settings data
const PRIVACY_SETTINGS = [
  {
    id: 'location',
    title: 'Location Services',
    subtitle: 'Allow app to access your location',
    icon: 'location',
    type: 'toggle',
    defaultValue: true,
  },
  {
    id: 'camera',
    title: 'Camera Access',
    subtitle: 'Take photos for waste verification',
    icon: 'camera',
    type: 'toggle',
    defaultValue: true,
  },
  {
    id: 'notifications',
    title: 'Push Notifications',
    subtitle: 'Receive pickup reminders and updates',
    icon: 'notifications',
    type: 'toggle',
    defaultValue: true,
  },
  {
    id: 'sms',
    title: 'SMS Notifications',
    subtitle: 'Receive SMS alerts for transactions',
    icon: 'chatbubble',
    type: 'toggle',
    defaultValue: false,
  },
];

// Data usage options
const DATA_OPTIONS = [
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Help improve the app with anonymous usage data',
    icon: 'bar-chart',
    defaultValue: true,
  },
  {
    id: 'personalization',
    title: 'Personalization',
    description: 'Get recommendations based on your usage',
    icon: 'heart',
    defaultValue: false,
  },
];

export default function Privacy() {
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

  const [privacySettings, setPrivacySettings] = useState(
    PRIVACY_SETTINGS.reduce((acc, item) => {
      acc[item.id] = item.defaultValue;
      return acc;
    }, {})
  );

  const [dataSettings, setDataSettings] = useState(
    DATA_OPTIONS.reduce((acc, item) => {
      acc[item.id] = item.defaultValue;
      return acc;
    }, {})
  );
  const [showDataRights, setShowDataRights] = useState(false);

  const handleToggle = (id, isDataSetting = false) => {
    if (isDataSetting) {
      setDataSettings({ ...dataSettings, [id]: !dataSettings[id] });
    } else {
      setPrivacySettings({ ...privacySettings, [id]: !privacySettings[id] });
    }
    // In production: Silent API call to update preferences
    console.log('Setting updated:', id);
  };

  const handleOpenPolicy = (type) => {
    const urls = {
      privacy: 'https://bingo.com.gh/privacy',
      terms: 'https://bingo.com.gh/terms',
      cookies: 'https://bingo.com.gh/cookies',
    };
    
    Linking.openURL(urls[type]).catch(() => {
      Alert.alert('Error', 'Unable to open link');
    });
  };

  const handleDownloadData = () => {
    Alert.alert(
      'Request Data Download',
      'We will send your data to your registered email within 48 hours.',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deletion', 'Your account deletion request has been submitted.');
          },
        },
      ]
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
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 14,
    },
    borderBottom: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 12,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: isDark ? '#1A3A2A' : '#F0FDF4',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    settingText: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    settingSubtitle: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 2,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 14,
    },
    menuItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    menuItemText: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.text,
    },
    statusBadge: {
      backgroundColor: isDark ? '#1A3A2A' : '#F0FDF4',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
    },
    dangerItem: {
      backgroundColor: isDark ? '#2A1A1A' : '#FEF2F2',
    },
    dangerText: {
      color: colors.error,
    },
    footerText: {
      textAlign: 'center',
      color: colors.muted,
      fontSize: 12,
      marginTop: 20,
    },
  }), [colors, isDark]);

  return (
    <View style={styles.container}>
      <BinGoHeader 
        title="Privacy & Safety" 
        showBack 
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Privacy Settings */}
        <Text style={styles.sectionTitle}>App Permissions</Text>
        <View style={styles.card}>
          {PRIVACY_SETTINGS.map((setting, index) => (
            <View 
              key={setting.id} 
              style={[
                styles.settingRow,
                index < PRIVACY_SETTINGS.length - 1 && styles.borderBottom
              ]}
            >
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Ionicons name={setting.icon} size={18} color={colors.primary} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                </View>
              </View>
              <Switch
                value={privacySettings[setting.id]}
                onValueChange={() => handleToggle(setting.id)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          ))}
        </View>

        {/* Data & Analytics */}
        <Text style={styles.sectionTitle}>Data & Analytics</Text>
        <View style={styles.card}>
          {DATA_OPTIONS.map((option, index) => (
            <View 
              key={option.id} 
              style={[
                styles.settingRow,
                index < DATA_OPTIONS.length - 1 && styles.borderBottom
              ]}
            >
              <View style={styles.settingInfo}>
                <View style={styles.iconContainer}>
                  <Ionicons name={option.icon} size={18} color={colors.primary} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>{option.title}</Text>
                  <Text style={styles.settingSubtitle}>{option.description}</Text>
                </View>
              </View>
              <Switch
                value={dataSettings[option.id]}
                onValueChange={() => handleToggle(option.id, true)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          ))}
        </View>

        {/* Security */}
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.card}>
          <Pressable style={styles.menuItem} onPress={() => router.push('/profile/security')}>
            <View style={styles.menuItemContent}>
              <Ionicons name="finger-print" size={20} color={colors.primary} />
              <Text style={styles.menuItemText}>Biometric Login</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={() => router.push('/profile/change-password')}>
            <View style={styles.menuItemContent}>
              <Ionicons name="lock-closed" size={20} color={colors.primary} />
              <Text style={styles.menuItemText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Pressable>

          <Pressable style={[styles.menuItem, styles.borderBottom]} onPress={() => router.push('/profile/security')}>
            <View style={styles.menuItemContent}>
              <Ionicons name="key" size={20} color={colors.primary} />
              <Text style={styles.menuItemText}>Two-Factor Authentication</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Enabled</Text>
            </View>
          </Pressable>
        </View>

        {/* Legal */}
        <Text style={styles.sectionTitle}>Legal</Text>
        <View style={styles.card}>
          <Pressable style={styles.menuItem} onPress={() => handleOpenPolicy('privacy')}>
            <View style={styles.menuItemContent}>
              <Ionicons name="shield-checkmark" size={20} color={colors.text} />
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
            <Ionicons name="open-outline" size={18} color={colors.muted} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => handleOpenPolicy('terms')}>
            <View style={styles.menuItemContent}>
              <Ionicons name="document-text" size={20} color={colors.text} />
              <Text style={styles.menuItemText}>Terms of Service</Text>
            </View>
            <Ionicons name="open-outline" size={18} color={colors.muted} />
          </Pressable>

          <Pressable style={[styles.menuItem, styles.borderBottom]} onPress={() => handleOpenPolicy('cookies')}>
            <View style={styles.menuItemContent}>
              <Ionicons name="file-tray" size={20} color={colors.text} />
              <Text style={styles.menuItemText}>Cookie Policy</Text>
            </View>
            <Ionicons name="open-outline" size={18} color={colors.muted} />
          </Pressable>
        </View>

        {/* Data Rights */}
        <Text style={styles.sectionTitle}>Your Data Rights</Text>
        <View style={styles.card}>
          <Pressable style={styles.menuItem} onPress={() => setShowDataRights(true)}>
            <View style={styles.menuItemContent}>
              <Ionicons name="document-text" size={20} color={colors.primary} />
              <Text style={styles.menuItemText}>Manage My Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Pressable>

          <Pressable style={[styles.menuItem, styles.dangerItem]} onPress={handleDeleteAccount}>
            <View style={styles.menuItemContent}>
              <Ionicons name="trash" size={20} color={colors.error} />
              <Text style={[styles.menuItemText, styles.dangerText]}>Delete Account</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Pressable>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          BinGo Customer v1.0.0 • Last updated: March 2024
        </Text>
      </ScrollView>

      {/* Data Rights Sheet */}
      <DataRightsSheet
        visible={showDataRights}
        onClose={() => setShowDataRights(false)}
      />
    </View>
  );
}

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BinGoHeader } from '@/components/BinGoHeader';
import { useAppTheme } from '@/hooks/useThemeContext';

export default function DataRights() {
  const router = useRouter();
  const { isDark } = useAppTheme();

  const colors = useMemo(() => isDark
    ? { background: '#121212', card: '#1E1E1E', text: '#FFFFFF', muted: '#A0A0A0', primary: '#10B981', border: '#333333', error: '#EF4444' }
    : { background: '#F9FAFB', card: '#FFFFFF', text: '#111827', muted: '#6B7280', primary: '#10B981', border: '#E5E7EB', error: '#EF4444' }, [isDark]);

  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        content: { padding: 20, paddingBottom: 40 },
        sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
        infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: isDark ? '#052e16' : '#F0FDF4', padding: 14, borderRadius: 12, marginBottom: 24 },
        infoText: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 18 },
        card: { backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
        menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
        menuItemLast: { borderBottomWidth: 0 },
        menuItemContent: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
        iconContainer: { width: 36, height: 36, borderRadius: 10, backgroundColor: isDark ? '#1A3A2A' : '#F0FDF4', justifyContent: 'center', alignItems: 'center' },
        menuItemText: { flex: 1 },
        menuItemTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
        menuItemSubtitle: { fontSize: 12, color: colors.muted, marginTop: 2 },
        statusBadge: { backgroundColor: isDark ? '#1A3A2A' : '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
        statusText: { fontSize: 12, fontWeight: '600', color: colors.primary },
        dangerItem: { backgroundColor: isDark ? '#2A1A1A' : '#FEF2F2' },
        dangerText: { color: colors.error },
        actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, backgroundColor: '#F0FDF4', borderRadius: 12, borderWidth: 1, borderColor: colors.primary + '30', marginBottom: 12 },
        actionButtonText: { fontSize: 14, fontWeight: '600', color: colors.primary },
        footerText: { textAlign: 'center', color: colors.muted, fontSize: 12, marginTop: 20 },
      }),
    [colors, isDark]
  );

  const handleDownloadData = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      Alert.alert('Request Submitted', 'Your data will be sent to your email within 48 hours.');
    }, 2000);
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
            setDeleting(true);
            setTimeout(() => {
              setDeleting(false);
              Alert.alert('Account Deletion', 'Your account deletion request has been submitted.');
            }, 2000);
          },
        },
      ]
    );
  };

  const handleRevokeConsent = () => {
    Alert.alert(
      'Revoke Consent',
      'This will revoke your consent for data processing.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: () => {
            setRevoking(true);
            setTimeout(() => {
              setRevoking(false);
              Alert.alert('Consent Revoked', 'Your data processing consent has been revoked.');
            }, 2000);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <BinGoHeader title="Data Rights" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Your Data Rights</Text>
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
          <Text style={styles.infoText}>Under Ghana&apos;s Data Protection Act, you have rights over your personal data.</Text>
        </View>

        <Text style={styles.sectionTitle}>Data Actions</Text>
        <View style={styles.card}>
          <Pressable style={styles.menuItem} onPress={handleDownloadData}>
            <View style={styles.menuItemContent}>
              <View style={styles.iconContainer}><Ionicons name="download" size={18} color={colors.primary} /></View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Download My Data</Text>
                <Text style={styles.menuItemSubtitle}>Get a copy of all your data</Text>
              </View>
            </View>
            {downloading && <Ionicons name="hourglass" size={18} color={colors.primary} />}
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => router.push('/profile/edit')}>
            <View style={styles.menuItemContent}>
              <View style={styles.iconContainer}><Ionicons name="create" size={18} color={colors.primary} /></View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Request Correction</Text>
                <Text style={styles.menuItemSubtitle}>Correct inaccurate data</Text>
              </View>
            </View>
          </Pressable>

          <Pressable style={[styles.menuItem, styles.menuItemLast]} onPress={handleRevokeConsent}>
            <View style={styles.menuItemContent}>
              <View style={styles.iconContainer}><Ionicons name="hand-left" size={18} color={colors.primary} /></View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Revoke Consent</Text>
                <Text style={styles.menuItemSubtitle}>Withdraw data processing consent</Text>
              </View>
            </View>
            {revoking && <Ionicons name="hourglass" size={18} color={colors.primary} />}
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <View style={styles.card}>
          <Pressable style={[styles.menuItem, styles.dangerItem, styles.menuItemLast]} onPress={handleDeleteAccount}>
            <View style={styles.menuItemContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#FEF2F2' }]}><Ionicons name="trash" size={18} color={colors.error} /></View>
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemTitle, styles.dangerText]}>Delete Account</Text>
                <Text style={styles.menuItemSubtitle}>Permanently delete your account and data</Text>
              </View>
            </View>
            {deleting && <Ionicons name="hourglass" size={18} color={colors.error} />}
          </Pressable>
        </View>

        <Text style={styles.footerText}>BinGo Customer v1.0.0</Text>
      </ScrollView>
    </View>
  );
}
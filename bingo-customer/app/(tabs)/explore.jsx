import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BinGoHeader } from '@/components/BinGoHeader';
import { useAppTheme } from '@/hooks/useThemeContext';

const EXPLORE_CATEGORIES = [
  { id: 'pickup', title: 'Request Pickup', subtitle: 'Schedule a waste collection', icon: 'trash', color: '#10B981' },
  { id: 'topup', title: 'Top Up Wallet', subtitle: 'Add funds to your account', icon: 'wallet', color: '#3B82F6' },
  { id: 'history', title: 'Activity History', subtitle: 'View past pickups and payments', icon: 'receipt', color: '#F59E0B' },
  { id: 'support', title: 'Contact Support', subtitle: 'Get help with your account', icon: 'help-circle', color: '#8B5CF6' },
];

const QUICK_ACTIONS = [
  { id: 'new_request', title: 'New Pickup', subtitle: 'Request a waste collection', icon: 'add-circle', screen: '/request' },
  { id: 'topup', title: 'Top Up', subtitle: 'Add funds to wallet', icon: 'arrow-up-circle', screen: '/topup' },
  { id: 'activity', title: 'View Activity', subtitle: 'Check pickup status', icon: 'list', screen: '/(tabs)/activity' },
];

export default function Explore() {
  const router = useRouter();
  const { isDark } = useAppTheme();

  const colors = useMemo(() => isDark
    ? { background: '#121212', card: '#1E1E1E', text: '#FFFFFF', muted: '#A0A0A0', primary: '#10B981', border: '#333333' }
    : { background: '#F9FAFB', card: '#FFFFFF', text: '#111827', muted: '#6B7280', primary: '#10B981', border: '#E5E7EB' }, [isDark]);

  const styles = useMemo(() => StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        content: { padding: 20 },
        sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
        categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
        categoryCard: { width: '47%', backgroundColor: colors.card, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
        categoryIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
        categoryTitle: { fontSize: 14, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 4 },
        categorySubtitle: { fontSize: 11, color: colors.muted, textAlign: 'center' },
        quickActions: { gap: 12, marginBottom: 24 },
        quickActionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
        quickActionIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
        quickActionContent: { flex: 1 },
        quickActionTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
        quickActionSubtitle: { fontSize: 12, color: colors.muted, marginTop: 2 },
        quickActionArrow: { padding: 4 },
        helpCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 24 },
        helpTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
        helpItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
        helpItemLast: { borderBottomWidth: 0 },
        helpIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.primary + '15', justifyContent: 'center', alignItems: 'center' },
        helpText: { fontSize: 14, color: colors.text, flex: 1 },
      }),
    [colors]
  );

  return (
    <View style={styles.container}>
      <BinGoHeader title="Explore" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoryGrid}>
          {EXPLORE_CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => {
                if (cat.id === 'pickup') router.push('/request');
                else if (cat.id === 'topup') router.push('/topup');
                else if (cat.id === 'history') router.push('/(tabs)/activity');
                else if (cat.id === 'support') router.push('/profile/support');
              }}
            >
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + '15' }]}>
                <Ionicons name={cat.icon} size={24} color={cat.color} />
              </View>
              <Text style={styles.categoryTitle}>{cat.title}</Text>
              <Text style={styles.categorySubtitle}>{cat.subtitle}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map((action) => (
            <Pressable
              key={action.id}
              style={styles.quickActionCard}
              onPress={() => router.push(action.screen)}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name={action.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.quickActionContent}>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
              </View>
              <View style={styles.quickActionArrow}>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Pressable style={styles.helpItem} onPress={() => router.push('/profile/support')}>
            <View style={styles.helpIcon}><Ionicons name="chatbubble-ellipses" size={16} color={colors.primary} /></View>
            <Text style={styles.helpText}>Contact Support</Text>
          </Pressable>
          <Pressable style={[styles.helpItem, styles.helpItemLast]} onPress={() => Linking.openURL('tel:+233550000000')}>
            <View style={styles.helpIcon}><Ionicons name="call" size={16} color={colors.primary} /></View>
            <Text style={styles.helpText}>Call Emergency Line</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
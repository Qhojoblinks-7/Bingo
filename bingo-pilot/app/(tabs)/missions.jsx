// BinGo Pilot - Missions Screen
// Active and past job lists with Segmented Control
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';
import useMissionStore from '../../stores/useMissionStore';
import StatusBadge from '../../components/shared/StatusBadge';
import { Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react-native';

// Mock data for demonstration
const MOCK_UPCOMING = [
  {
    id: 'MN-102',
    time: '2:30 PM',
    location: '123 Main Street, Downtown',
    distance: '0.8 km',
    type: 'Standard',
    completed: false,
  },
  {
    id: 'MN-103',
    time: '4:00 PM',
    location: '456 Oak Avenue, East Legon',
    distance: '1.2 km',
    type: 'Large',
    completed: false,
  },
];

const MOCK_HISTORY = [
  {
    id: 'MN-098',
    time: '10:30 AM',
    location: '789 Pine Road, Uptown',
    distance: '0.5 km',
    type: 'Standard',
    completed: true,
  },
  {
    id: 'MN-097',
    time: 'Yesterday',
    location: '555 Market Street, Central',
    distance: '1.5 km',
    type: 'Premium',
    completed: true,
  },
  {
    id: 'MN-096',
    time: 'Yesterday',
    location: '111 First Avenue, North',
    distance: '0.3 km',
    type: 'Standard',
    completed: true,
  },
  {
    id: 'MN-095',
    time: '2 days ago',
    location: '333 Third Lane, West',
    distance: '2.1 km',
    type: 'Large',
    completed: false, // Cancelled
  },
];

export default function MissionsScreen() {
  const router = useRouter();
  const { missionHistory, activeMission, missionStatus } = useMissionStore();
  const [tab, setTab] = useState('upcoming'); // 'upcoming' or 'history'
  const [refreshing, setRefreshing] = useState(false);

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Handle mission press
  const handleMissionPress = (missionId) => {
    router.push(`/mission/${missionId}`);
  };

  // Render mission card
  const renderMission = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleMissionPress(item.id)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.timeText}>{item.time}</Text>
        <View style={[
          styles.badge, 
          { backgroundColor: item.completed ? COLORS.primary + '20' : COLORS.surfaceLight }
        ]}>
          <Text style={[
            styles.badgeText, 
            { color: item.completed ? COLORS.primary : COLORS.muted }
          ]}>
            {item.completed ? 'COMPLETED' : 'PENDING'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.locationTitle}>{item.location}</Text>
      
      <View style={styles.footer}>
        <View style={styles.infoRow}>
          <MapPin size={14} color={COLORS.primary} />
          <Text style={styles.infoText}>{item.distance}</Text>
        </View>
        <View style={styles.infoRow}>
          <Clock size={14} color={COLORS.primary} />
          <Text style={styles.infoText}>{item.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>
        {tab === 'upcoming' ? 'No Upcoming Missions' : 'No Mission History'}
      </Text>
      <Text style={styles.emptySubtext}>
        {tab === 'upcoming'
          ? 'Go online and accept missions from the Radar'
          : 'Your completed missions will appear here'}
      </Text>
    </View>
  );

  const displayData = tab === 'upcoming' ? MOCK_UPCOMING : MOCK_HISTORY;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Missions</Text>
      </View>
      
      {/* Segmented Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          onPress={() => setTab('upcoming')} 
          style={[styles.tab, tab === 'upcoming' && styles.activeTab]}
        >
          <Text style={[styles.tabText, tab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setTab('history')} 
          style={[styles.tab, tab === 'history' && styles.activeTab]}
        >
          <Text style={[styles.tabText, tab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayData}
        renderItem={renderMission}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
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
  
  // Segmented Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: COLORS.surfaceLight,
  },
  tabText: {
    color: COLORS.muted,
    fontWeight: '700',
    fontSize: 13,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  
  // Mission Card
  card: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    marginHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  locationTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    color: COLORS.muted,
    fontSize: 12,
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.muted,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});

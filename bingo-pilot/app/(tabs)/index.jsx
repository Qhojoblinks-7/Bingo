import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import COLORS from '../../constants/Colors';

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning, Pilot!</Text>
            <Text style={styles.status}>You're Online</Text>
          </View>
          <TouchableOpacity style={styles.statusToggle}>
            <Text style={styles.statusToggleText}>Go Offline</Text>
          </TouchableOpacity>
        </View>

        {/* Mission Radar Card */}
        <View style={styles.radarCard}>
          <View style={styles.radarHeader}>
            <Text style={styles.radarTitle}>Mission Radar</Text>
            <View style={styles.radarBadge}>
              <Text style={styles.radarBadgeText}>3 Nearby</Text>
            </View>
          </View>
          <Text style={styles.radarSubtitle}>Tap to view available missions</Text>
          
          <View style={styles.missionList}>
            <View style={styles.missionItem}>
              <View style={styles.missionInfo}>
                <Text style={styles.missionDistance}>0.8 km</Text>
                <Text style={styles.missionAddress}>123 Main Street</Text>
                <Text style={styles.missionPrice}>$15.00</Text>
              </View>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.missionItem}>
              <View style={styles.missionInfo}>
                <Text style={styles.missionDistance}>1.2 km</Text>
                <Text style={styles.missionAddress}>456 Oak Avenue</Text>
                <Text style={styles.missionPrice}>$22.00</Text>
              </View>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Today's Missions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>$186</Text>
            <Text style={styles.statLabel}>Today's Earnings</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📍</Text>
              <Text style={styles.actionLabel}>Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📞</Text>
              <Text style={styles.actionLabel}>Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>💼</Text>
              <Text style={styles.actionLabel}>Earnings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>⚙️</Text>
              <Text style={styles.actionLabel}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  status: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 4,
  },
  statusToggle: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusToggleText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  radarCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  radarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  radarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  radarBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  radarBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  radarSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 16,
  },
  missionList: {
    gap: 12,
  },
  missionItem: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  missionInfo: {
    flex: 1,
  },
  missionDistance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  missionAddress: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 2,
  },
  missionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
    textAlign: 'center',
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
});

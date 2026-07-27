import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, Platform } from 'react-native';
import { MapPin, ArrowRight, Zap, Clock, CheckCircle2 } from 'lucide-react-native';
import { COLORS } from '../../constants'; // Assuming COLORS.primary is your BinGo Green

// Mock Data for Missions
const MOCK_UPCOMING = [
  { id: '#BIN-2847', location: 'Osu Castle Road', distance: '1.2km', type: 'Pickup', time: '2 min', completed: false },
  { id: '#BIN-2846', location: 'Labadi Beach Area', distance: '2.5km', type: 'Dropoff', time: '5 min', completed: false },
];

const MOCK_HISTORY = [
  { id: '#BIN-2845', location: 'Tema Station', distance: '3.2km', type: 'Pickup', time: '10:30 AM', completed: true },
  { id: '#BIN-2844', location: 'Accra Central', distance: '1.8km', type: 'Dropoff', time: '09:45 AM', completed: true },
  { id: '#BIN-2843', location: 'East Legon', distance: '4.1km', type: 'Pickup', time: '08:15 AM', completed: true },
  { id: '#BIN-2842', location: 'Nungua Market', distance: '2.9km', type: 'Dropoff', time: 'Yesterday', completed: true },
  { id: '#BIN-2841', location: 'Teshie Residential', distance: '5.5km', type: 'Pickup', time: 'Yesterday', completed: true },
];

export default function MissionsScreen() {
  const [tab, setTab] = useState('upcoming');

  const renderMission = ({ item }) => (
    <TouchableOpacity style={styles.missionCard} activeOpacity={0.7}>
      {/* Vertical Status Accent */}
      <View style={[styles.statusAccent, { backgroundColor: item.completed ? COLORS.primary : '#3A3A3C' }]} />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.missionId}>{item.id}</Text>
          <View style={styles.timeRow}>
            <Clock size={12} color={COLORS.primary} />
            <Text style={styles.timeLabel}>{item.time}</Text>
          </View>
        </View>

        <Text style={styles.locationTitle} numberOfLines={1}>{item.location}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.metaRow}>
            <View style={styles.pill}>
               <MapPin size={12} color="#8E8E93" />
               <Text style={styles.pillText}>{item.distance}</Text>
            </View>
            <View style={styles.pill}>
               <Zap size={12} color="#FFD60A" />
               <Text style={styles.pillText}>{item.type}</Text>
            </View>
          </View>
          
          <ArrowRight size={18} color="#3A3A3C" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Missions</Text>
        <Text style={styles.headerSubtitle}>
          {tab === 'upcoming' ? 'Queue' : 'Archive'} • {tab === 'upcoming' ? '2 Active' : '48 Total'}
        </Text>
      </View>

      {/* Modern Tab Switcher */}
      <View style={styles.tabContainer}>
        {['upcoming', 'history'].map((t) => (
          <TouchableOpacity 
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tabBtn, tab === t && styles.activeTabBtn]}
          >
            <Text style={[styles.tabLabel, tab === t && styles.activeTabLabel]}>
              {t.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={tab === 'upcoming' ? MOCK_UPCOMING : MOCK_HISTORY}
        renderItem={renderMission}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { paddingHorizontal: 20, paddingTop: 60, marginBottom: 20 },
  headerTitle: { color: '#FFF', fontSize: 32, fontWeight: '800' },
  headerSubtitle: { color: '#8E8E93', fontSize: 13, marginTop: 4, letterSpacing: 0.5 },
  
  tabContainer: { 
    flexDirection: 'row', 
    marginHorizontal: 20, 
    backgroundColor: '#1C1C1E', 
    borderRadius: 12, 
    padding: 4,
    marginBottom: 20 
  },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTabBtn: { backgroundColor: '#2C2C2E' },
  tabLabel: { color: '#8E8E93', fontSize: 12, fontWeight: '700' },
  activeTabLabel: { color: '#FFF' },

  listContent: { paddingHorizontal: 20, paddingBottom: 120 },
  missionCard: { 
    backgroundColor: '#1C1C1E', 
    borderRadius: 16, 
    marginBottom: 12, 
    flexDirection: 'row', 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)'
  },
  statusAccent: { width: 4, height: '100%' },
  cardContent: { flex: 1, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  missionId: { color: '#8E8E93', fontSize: 11, fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  timeLabel: { color: COLORS.primary, fontSize: 12, fontWeight: '800' },
  locationTitle: { color: '#FFF', fontSize: 17, fontWeight: '600', marginBottom: 15 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaRow: { flexDirection: 'row', gap: 10 },
  pill: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 5, 
    backgroundColor: '#2C2C2E', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 8 
  },
  pillText: { color: '#8E8E93', fontSize: 11, fontWeight: '700' }
});
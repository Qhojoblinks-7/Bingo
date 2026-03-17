import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const useMissionStore = create((set, get) => ({
  // Duty Status
  isOnline: false,
  currentLocation: null,
  
  // Active Mission
  activeMission: null,
  missionStatus: 'idle', // idle, accepted, en_route, arrived, completed
  
  // Nearby Missions (from geofencing)
  nearbyMissions: [],
  
  // Mission History
  missionHistory: [],

  // Actions
  setOnline: async (status) => {
    try {
      await AsyncStorage.setItem('isOnline', JSON.stringify(status));
      set({ isOnline: status });
    } catch (error) {
      console.error('Failed to save online status:', error);
    }
  },

  setCurrentLocation: (location) => {
    set({ currentLocation: location });
  },

  // Accept a mission
  acceptMission: async (mission) => {
    set({
      activeMission: mission,
      missionStatus: 'accepted',
    });
    // Trigger haptic feedback
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      // Haptics not available
    }
  },

  // Reject a mission
  rejectMission: () => {
    set({
      activeMission: null,
      missionStatus: 'idle',
    });
  },

  // Update mission status
  updateMissionStatus: (status) => {
    set({ missionStatus: status });
  },

  // Set nearby missions (from geofencing)
  setNearbyMissions: (missions) => {
    set({ nearbyMissions: missions });
  },

  // Add to history
  addToHistory: (mission) => {
    const currentHistory = get().missionHistory;
    set({ 
      missionHistory: [mission, ...currentHistory],
      activeMission: null,
      missionStatus: 'idle',
    });
  },

  // Complete mission with proof of service
  completeMission: async (proofOfService) => {
    const { activeMission } = get();
    if (activeMission) {
      const completedMission = {
        ...activeMission,
        completedAt: new Date().toISOString(),
        proofOfService,
        status: 'completed',
      };
      get().addToHistory(completedMission);
    }
  },

  // Load saved state
  loadSavedState: async () => {
    try {
      const isOnline = await AsyncStorage.getItem('isOnline');
      if (isOnline !== null) {
        set({ isOnline: JSON.parse(isOnline) });
      }
    } catch (error) {
      console.error('Failed to load saved state:', error);
    }
  },

  // Calculate distance between two points (Haversine formula)
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  },

  // Geofencing check - check if pilot is near any mission
  checkGeofence: (pilotLocation, radiusMeters = 500) => {
    const { nearbyMissions, calculateDistance } = get();
    return nearbyMissions.filter(mission => {
      const distance = calculateDistance(
        pilotLocation.latitude,
        pilotLocation.longitude,
        mission.latitude,
        mission.longitude
      );
      return distance <= radiusMeters;
    });
  },
}));

export default useMissionStore;

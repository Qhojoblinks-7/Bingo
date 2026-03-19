// ============================================
// BinGo Pilot - Interactive Mission Map
// Real-time GPS, Hotspot Visualizer, and Active Route
// Enhanced Geofencing & Heatmap Visuals
// ============================================

import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Platform, Text, Animated, Easing } from 'react-native';
import MapView, { 
  Marker, 
  Circle, 
  Polyline, 
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS, DARK_MAP_STYLE, SPACING } from '../../constants';
import useMissionStore from '../../stores/useMissionStore';

// Import components
import { RecenterButton, TrafficToggle, SOSButton } from '../shared';
import { MissionController } from '../pilot/MissionController';
import { DutyHeader } from '../pilot/DutyHeader';

// ============================================
// ENHANCED COLOR SYSTEM FOR GEOFENCING & HEATMAPS
// ============================================

// Geofencing Colors
export const GEOFENCE_COLORS = {
  // Inactive/Approach state - More visible
  INACTIVE_BORDER: 'rgba(255, 255, 255, 0.6)',    // More visible white
  INACTIVE_FILL: 'rgba(255, 255, 255, 0.12)',      // More visible fill
  
  // Active/Inside state  
  ACTIVE_BORDER: '#4CD964',                         // Solid Green
  ACTIVE_FILL: 'rgba(76, 217, 100, 0.35)',          // More visible green fill
  
  // Pulse animation colors
  PULSE_OUTER: 'rgba(76, 217, 100, 0.2)',
  PULSE_INNER: 'rgba(76, 217, 100, 0.4)',
};

// Heatmap/Demand Zone Colors
export const HEATMAP_COLORS = {
  // 3-color gradient system
  HIGH_DEMAND: {
    fill: 'rgba(239, 68, 68, 0.45)',     // Red at 90%+ capacity
    stroke: 'rgba(239, 68, 68, 0.7)',
  },
  MODERATE_DEMAND: {
    fill: 'rgba(245, 158, 11, 0.35)',    // Yellow at 60-80%
    stroke: 'rgba(245, 158, 11, 0.6)',
  },
  LOW_DEMAND: {
    fill: 'rgba(16, 185, 129, 0.2)',    // Green/Transparent for low
    stroke: 'rgba(16, 185, 129, 0.4)',
  },
  NO_DEMAND: {
    fill: 'transparent',
    stroke: 'transparent',
  },
};

// UI Constants
const GEOFENCE_STROKE_WIDTH = 2;
const GEOFENCE_ACTIVE_STROKE_WIDTH = 3;
const HEATMAP_STROKE_WIDTH = 1;
const HEATMAP_BLUR_RADIUS = 25; // Small blur for better street visibility
const PROXIMITY_BADGE_HEIGHT = 36;

// Default Accra location (center of the city)
const DEFAULT_LOCATION = {
  latitude: 5.6037,
  longitude: -0.1870,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Default region for Accra
const DEFAULT_REGION = {
  latitude: 5.6037, // Accra, Ghana
  longitude: -0.1870,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// ============================================
// ZONE TYPES FOR GEOFENCING & HEATMAPS
// ============================================

const ZONE_TYPES = {
  HIGH_DEMAND: 'high_demand',     // Red zones - 90%+ capacity
  MEDIUM_DEMAND: 'medium_demand', // Yellow zones - 60-80% capacity
  LOW_DEMAND: 'low_demand',       // Green zones - routine pickup
  GEOFENCE: 'geofence',           // Blue zones - active mission areas
  GEOFENCE_ACTIVE: 'geofence_active', // Green - pilot is inside
  NO_GO: 'no_go',                 // Gray zones - restricted areas
};

// Accra Zones with Geofencing Data (Updated for 3-color heatmap)
const GEOFENCE_ZONES = [
  // HIGH DEMAND ZONES (Red - 90%+ capacity)
  { 
    id: 'zone_1', 
    type: ZONE_TYPES.HIGH_DEMAND,
    center: { latitude: 5.6150, longitude: -0.1900 },
    radius: 300,
    label: 'Tema Station Market',
    pendingPickups: 12,
    avgWaitTime: '45min',
    capacity: 95, // Percentage
  },
  { 
    id: 'zone_2', 
    type: ZONE_TYPES.HIGH_DEMAND,
    center: { latitude: 5.5800, longitude: -0.2000 },
    radius: 250,
    label: 'Kumasi Road Station',
    pendingPickups: 8,
    avgWaitTime: '30min',
    capacity: 92,
  },
  { 
    id: 'zone_3', 
    type: ZONE_TYPES.HIGH_DEMAND,
    center: { latitude: 5.5920, longitude: -0.1750 },
    radius: 200,
    label: 'Accra Central Bus Stop',
    pendingPickups: 6,
    avgWaitTime: '25min',
    capacity: 88,
  },
  
  // MEDIUM DEMAND ZONES (Yellow - 60-80% capacity)
  { 
    id: 'zone_4', 
    type: ZONE_TYPES.MEDIUM_DEMAND,
    center: { latitude: 5.6200, longitude: -0.1700 },
    radius: 350,
    label: 'Labadi Beach Area',
    pendingPickups: 4,
    avgWaitTime: '1hr',
    capacity: 72,
  },
  { 
    id: 'zone_5', 
    type: ZONE_TYPES.MEDIUM_DEMAND,
    center: { latitude: 5.5700, longitude: -0.1950 },
    radius: 280,
    label: 'Nungua Market',
    pendingPickups: 3,
    avgWaitTime: '50min',
    capacity: 65,
  },
  
  // LOW DEMAND ZONES (Green - Low/Transparent)
  { 
    id: 'zone_6', 
    type: ZONE_TYPES.LOW_DEMAND,
    center: { latitude: 5.6100, longitude: -0.2100 },
    radius: 400,
    label: 'Teshie Residential',
    pendingPickups: 2,
    avgWaitTime: '2hr',
    capacity: 25,
  },
  { 
    id: 'zone_7', 
    type: ZONE_TYPES.LOW_DEMAND,
    center: { latitude: 5.6050, longitude: -0.1600 },
    radius: 320,
    label: 'East Legon',
    pendingPickups: 1,
    avgWaitTime: '3hr',
    capacity: 15,
  },
  
  // GEOFENCE ZONES (Blue - Active Missions with enhanced styling)
  // Note: Rendered LAST so they appear on TOP of heatmap zones
  { 
    id: 'zone_8', 
    type: ZONE_TYPES.GEOFENCE,
    center: { latitude: 5.6037, longitude: -0.1870 },
    radius: 200,  // Increased for better visibility
    label: 'Osu Active Zone',
    activeMissions: 2,
    isActive: true,
    isApproaching: false,
  },
  { 
    id: 'zone_9', 
    type: ZONE_TYPES.GEOFENCE,
    center: { latitude: 5.5950, longitude: -0.1920 },
    radius: 180,  // Increased for better visibility
    label: 'Labadi Active Zone',
    activeMissions: 1,
    isActive: true,
    isApproaching: false,
  },
];

// Sample nearby missions with geofence info
const SAMPLE_MISSIONS = [
  { 
    id: 'm1', 
    latitude: 5.6080, 
    longitude: -0.1850, 
    pickup: '123 Osu Lane', 
    customer: 'John D.', 
    earnings: 25.00, 
    distance: 0.8,
    zoneId: 'zone_8',
    status: 'pending',
    urgency: 'high',
  },
  { 
    id: 'm2', 
    latitude: 5.5950, 
    longitude: -0.1920, 
    pickup: '45 Labadi Road', 
    customer: 'Sarah M.', 
    earnings: 30.00, 
    distance: 1.2,
    zoneId: 'zone_9',
    status: 'pending',
    urgency: 'medium',
  },
  { 
    id: 'm3', 
    latitude: 5.6120, 
    longitude: -0.1750, 
    pickup: '78 East Legon', 
    customer: 'Mike K.', 
    earnings: 35.00, 
    distance: 1.5,
    zoneId: 'zone_7',
    status: 'pending',
    urgency: 'low',
  },
  { 
    id: 'm4', 
    latitude: 5.6150, 
    longitude: -0.1900, 
    pickup: 'Tema Station Market', 
    customer: 'Emma W.', 
    earnings: 45.00, 
    distance: 2.0,
    zoneId: 'zone_1',
    status: 'pending',
    urgency: 'critical',
  },
  { 
    id: 'm5', 
    latitude: 5.5800, 
    longitude: -0.2000, 
    pickup: 'Kumasi Road', 
    customer: 'David L.', 
    earnings: 40.00, 
    distance: 1.8,
    zoneId: 'zone_2',
    status: 'pending',
    urgency: 'high',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get heatmap color based on capacity (3-color gradient)
const getHeatmapColors = (type, capacity = 0) => {
  if (capacity >= 90) {
    return HEATMAP_COLORS.HIGH_DEMAND;
  } else if (capacity >= 60) {
    return HEATMAP_COLORS.MODERATE_DEMAND;
  } else if (capacity >= 30) {
    return HEATMAP_COLORS.LOW_DEMAND;
  }
  return HEATMAP_COLORS.NO_DEMAND;
};

// Get geofence color based on state (approach vs active)
const getGeofenceColors = (zone, userLocation) => {
  if (!zone.isActive) {
    return {
      fill: GEOFENCE_COLORS.INACTIVE_FILL,
      stroke: GEOFENCE_COLORS.INACTIVE_BORDER,
      lineDash: [8, 4], // Marching ants pattern
      strokeWidth: GEOFENCE_STROKE_WIDTH,
    };
  }
  
  // Check if user is inside or approaching the geofence
  if (userLocation) {
    const distance = getDistanceFromLatLonInMeters(
      userLocation.latitude,
      userLocation.longitude,
      zone.center.latitude,
      zone.center.longitude
    );
    
    if (distance <= zone.radius) {
      // Inside geofence - Active state
      return {
        fill: GEOFENCE_COLORS.ACTIVE_FILL,
        stroke: GEOFENCE_COLORS.ACTIVE_BORDER,
        lineDash: [0], // Solid line when active
        strokeWidth: GEOFENCE_ACTIVE_STROKE_WIDTH,
        isActive: true,
        distance: Math.round(distance),
      };
    } else if (distance <= zone.radius * 1.5) {
      // Approaching - Marching ants
      return {
        fill: GEOFENCE_COLORS.INACTIVE_FILL,
        stroke: GEOFENCE_COLORS.INACTIVE_BORDER,
        lineDash: [8, 4],
        strokeWidth: GEOFENCE_STROKE_WIDTH,
        isApproaching: true,
        distance: Math.round(distance),
      };
    }
  }
  
  // Default inactive state
  return {
    fill: GEOFENCE_COLORS.INACTIVE_FILL,
    stroke: GEOFENCE_COLORS.INACTIVE_BORDER,
    lineDash: [8, 4],
    strokeWidth: GEOFENCE_STROKE_WIDTH,
    distance: null,
  };
};

// Calculate distance between two coordinates in meters
const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Format distance for display
const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

// ============================================
// PROXIMITY BADGE COMPONENT
// ============================================

const ProximityBadge = ({ distance, isArrived, zoneLabel }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isArrived) {
      // Pulse animation when arrived
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Glow effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [isArrived]);

  const badgeStyle = [
    styles.proximityBadge,
    isArrived && styles.proximityBadgeArrived,
  ];

  const glowStyle = {
    shadowColor: isArrived ? COLORS.success : COLORS.white,
    shadowOpacity: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.8],
    }),
    shadowRadius: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [4, 12],
    }),
  };

  return (
    <Animated.View 
      style={[
        styles.proximityBadgeContainer,
        isArrived && { transform: [{ scale: pulseAnim }] },
        glowStyle,
      ]}
    >
      <View style={badgeStyle}>
        {isArrived ? (
          <>
            <Text style={styles.proximityCheckmark}>✓</Text>
            <Text style={styles.proximityTextArrived}>ARRIVED</Text>
          </>
        ) : (
          <>
            <Text style={styles.proximityIcon}>📍</Text>
            <Text style={styles.proximityText}>
              {formatDistance(distance)} to {zoneLabel || 'Bin'}
            </Text>
          </>
        )}
      </View>
    </Animated.View>
  );
};

// ============================================
// PULSE CIRCLE COMPONENT (For Active Geofence)
// ============================================

const PulseCircle = ({ center, radius, isActive }) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: radius * 1.3,
            duration: 2000,
            easing: Easing.ease,
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.ease,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [isActive, radius]);

  if (!isActive) return null;

  return (
    <Animated.View
      style={[
        styles.pulseCircle,
        {
          left: center.longitude - (radius * 1.3) / 2,
          top: center.latitude - (radius * 1.3) / 2,
          width: radius * 1.3,
          height: radius * 1.3,
          borderRadius: radius * 1.3,
          opacity: opacityAnim,
          backgroundColor: GEOFENCE_COLORS.PULSE_OUTER,
        },
      ]}
    />
  );
};

// ============================================
// CUSTOM BIN MARKER COMPONENT
// ============================================

// Custom Bin Icon Component - Uses a View with colored background for visibility
const BinMarker = ({ coordinate, label, isActive, isTarget }) => {
  return (
    <Marker
      coordinate={coordinate}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View style={[
        styles.binMarkerContainer,
        isActive && styles.binMarkerActive,
        isTarget && styles.binMarkerTarget,
      ]}>
        {/* Colored circle marker instead of emoji for better visibility */}
        <View style={[
          styles.binMarkerCircle,
          isActive && styles.binMarkerCircleActive,
          isTarget && styles.binMarkerCircleTarget,
        ]}>
          <Text style={[
            styles.binMarkerText,
            isActive && styles.binMarkerTextActive,
          ]}>
            B
          </Text>
        </View>
        {label && (
          <View style={[
            styles.binMarkerLabel,
            isActive && styles.binMarkerLabelActive,
          ]}>
            <Text style={styles.binMarkerLabelText}>{label}</Text>
          </View>
        )}
      </View>
    </Marker>
  );
};

// ============================================
// MAIN MAP COMPONENT
// ============================================

/**
 * InteractiveMissionMap - Main map component for the Pilot app
 * Enhanced with Visual Demarcations for Geofencing & Heatmaps
 */
const InteractiveMissionMap = forwardRef(({
  showTraffic = false,
  isOnline = false,
  onToggleOnline,
  onLocationChange,
  onMissionSelect,
  customMapStyle,
  initialRegion,
  showMissionController = true,
  showRecenterButton = true,
  showTrafficToggle = true,
  showSOSButton = true,
  style,
  ...props
}, ref) => {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [approachingZone, setApproachingZone] = useState(null);
  const [activeZone, setActiveZone] = useState(null);
  
  const { 
    activeMission, 
    missionStatus, 
    nearbyMissions, 
    setCurrentLocation,
    setNearbyMissions,
  } = useMissionStore();

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    animateToRegion: (region, duration) => mapRef.current?.animateToRegion(region, duration || 500),
    fitToCoordinates: (coords, options) => mapRef.current?.fitToCoordinates(coords, options),
    recenter: () => handleRecenter(),
    fitToRoute: () => fitToRoute(),
    fitToHotspots: () => fitToHotspots(),
  }), [userLocation, activeMission]);

  // Request location permissions
  const requestPermissions = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        setHasPermission(false);
        return false;
      }
      setHasPermission(true);
      setLocationError(null);
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setUserLocation(coords);
      setCurrentLocation(coords);
      onLocationChange?.(coords);
      
      return coords;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }, [hasPermission, requestPermissions, setCurrentLocation, onLocationChange]);

  // Start watching location
  const startWatchingLocation = useCallback(async () => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) return null;
    }

    try {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 5000,
        },
        (location) => {
          const coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setUserLocation(coords);
          setCurrentLocation(coords);
          onLocationChange?.(coords);
          
          // Check proximity to geofence zones
          updateZoneProximity(coords);
        }
      );

      return subscription;
    } catch (error) {
      console.error('Error watching location:', error);
      return null;
    }
  }, [hasPermission, requestPermissions, setCurrentLocation, onLocationChange]);

  // Update zone proximity state
  const updateZoneProximity = useCallback((coords) => {
    let foundApproaching = null;
    let foundActive = null;
    
    GEOFENCE_ZONES.forEach(zone => {
      if (zone.type === ZONE_TYPES.GEOFENCE || zone.type === ZONE_TYPES.GEOFENCE_ACTIVE) {
        const distance = getDistanceFromLatLonInMeters(
          coords.latitude,
          coords.longitude,
          zone.center.latitude,
          zone.center.longitude
        );
        
        if (distance <= zone.radius) {
          foundActive = { ...zone, distance: Math.round(distance) };
        } else if (distance <= zone.radius * 1.5) {
          if (!foundApproaching || distance < foundApproaching.distance) {
            foundApproaching = { ...zone, distance: Math.round(distance) };
          }
        }
      }
    });
    
    setApproachingZone(foundApproaching);
    setActiveZone(foundActive);
  }, []);

  // Initialize location tracking
  useEffect(() => {
    let subscription = null;
    
    const init = async () => {
      setNearbyMissions(SAMPLE_MISSIONS);
      await getCurrentLocation();
      subscription = await startWatchingLocation();
    };

    init();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Recenter map to user location
  const handleRecenter = useCallback(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 500);
    }
  }, [userLocation]);

  // Fit map to show active route
  const fitToRoute = useCallback(() => {
    if (mapRef.current && activeMission && userLocation) {
      const coordinates = [
        userLocation,
        { latitude: activeMission.latitude, longitude: activeMission.longitude },
      ];

      if (activeMission.disposalSite) {
        coordinates.push({
          latitude: activeMission.disposalSite.latitude,
          longitude: activeMission.disposalSite.longitude,
        });
      }

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
        animated: true,
      });
    }
  }, [activeMission, userLocation]);

  // Fit to geofence zones
  const fitToHotspots = useCallback(() => {
    if (mapRef.current) {
      const coordinates = GEOFENCE_ZONES.map(zone => zone.center);
      
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 150, right: 50, bottom: 200, left: 50 },
        animated: true,
      });
    }
  }, []);

  // Prepare route coordinates for active mission
  const getRouteCoordinates = () => {
    if (!activeMission || !userLocation) return null;

    const route = [
      userLocation,
      { latitude: activeMission.latitude, longitude: activeMission.longitude },
    ];

    if (missionStatus === 'arrived' && activeMission.disposalSite) {
      route.push({
        latitude: activeMission.disposalSite.latitude,
        longitude: activeMission.disposalSite.longitude,
      });
    }

    return route;
  };

  const routeCoordinates = getRouteCoordinates();

  // Get current user location for SOS and other components
  const currentUserLocation = userLocation || { latitude: 5.6037, longitude: -0.1870 };

  // Determine which zone info to show in proximity badge
  const activeZoneInfo = activeZone || approachingZone;
  const isInsideGeofence = !!activeZone;

  return (
    <View style={[styles.container, style]}>
      {/* STACK HEADER ON MAP */}
      <View style={styles.headerStack}>
        <DutyHeader isOnline={isOnline} onToggle={onToggleOnline} />
      </View>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        customMapStyle={customMapStyle || DARK_MAP_STYLE}
        showsUserLocation={hasPermission}
        followsUserLocation={true}
        showsTraffic={showTraffic}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        showsBuildings={true}
        tintColor={COLORS.primary}
        {...props}
      >
        {/* HEATMAP ZONES - 3 Color Gradient System */}
        {GEOFENCE_ZONES
          .filter(zone => zone.type !== ZONE_TYPES.GEOFENCE && zone.type !== ZONE_TYPES.GEOFENCE_ACTIVE)
          .map((zone) => {
            const colors = getHeatmapColors(zone.type, zone.capacity);
            return (
              <Circle
                key={`heatmap-${zone.id}`}
                center={zone.center}
                radius={zone.radius}
                fillColor={colors.fill}
                strokeColor={colors.stroke}
                strokeWidth={HEATMAP_STROKE_WIDTH}
                lineDashPattern={[0]} // Solid for heatmap
              />
            );
          })}

        {/* GEOFENCE ZONES - Visual Demarcations */}
        {GEOFENCE_ZONES
          .filter(zone => zone.type === ZONE_TYPES.GEOFENCE || zone.type === ZONE_TYPES.GEOFENCE_ACTIVE)
          .map((zone) => {
            const geofenceColors = getGeofenceColors(zone, userLocation);
            const isThisZoneActive = geofenceColors.isActive;
            const isThisZoneApproaching = geofenceColors.isApproaching;
            
            return (
              <React.Fragment key={`geofence-${zone.id}`}>
                {/* Pulse effect for active zone */}
                {isThisZoneActive && (
                  <Circle
                    key={`geofence-pulse-${zone.id}`}
                    center={zone.center}
                    radius={zone.radius * 1.2}
                    fillColor="rgba(76, 217, 100, 0.15)"
                    strokeColor="transparent"
                    strokeWidth={0}
                  />
                )}
                
                {/* Main geofence circle with marching ants */}
                <Circle
                  key={`geofence-main-${zone.id}`}
                  center={zone.center}
                  radius={zone.radius}
                  fillColor={geofenceColors.fill}
                  strokeColor={geofenceColors.stroke}
                  strokeWidth={geofenceColors.strokeWidth}
                  lineDashPattern={geofenceColors.lineDash}
                />
                
                {/* Custom Bin Icon at center */}
                <BinMarker
                  coordinate={zone.center}
                  label={zone.label}
                  isActive={isThisZoneActive}
                  isTarget={isThisZoneApproaching}
                />
              </React.Fragment>
            );
          })}

        {/* NEARBY MISSIONS MARKERS */}
        {nearbyMissions.map((mission) => {
          // Get marker color based on urgency
          const getUrgencyColor = (urgency) => {
            switch (urgency) {
              case 'critical': return COLORS.error;
              case 'high': return COLORS.warning;
              case 'medium': return COLORS.accent;
              case 'low': return COLORS.primary;
              default: return COLORS.primary;
            }
          };
          
          return (
            <Marker
              key={`mission-${mission.id}`}
              coordinate={{ latitude: mission.latitude, longitude: mission.longitude }}
              title={mission.pickup}
              description={`${mission.customer} • GH₵${mission.earnings} • ${mission.urgency?.toUpperCase()}`}
              pinColor={getUrgencyColor(mission.urgency)}
              onPress={() => onMissionSelect?.(mission)}
            />
          );
        })}

        {/* ACTIVE ROUTE POLYLINE */}
        {routeCoordinates && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={COLORS.accent}
            strokeWidth={4}
            lineDashPattern={[0]}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* ACTIVE MISSION DESTINATION MARKER */}
        {activeMission && (
          <Marker
            coordinate={{ latitude: activeMission.latitude, longitude: activeMission.longitude }}
            title={activeMission.pickup || 'Destination'}
            description={missionStatus === 'arrived' ? 'Arrived at location' : 'Head here'}
            pinColor={missionStatus === 'arrived' ? COLORS.success : COLORS.accent}
          />
        )}

        {/* DISPOSAL SITE MARKER */}
        {activeMission?.disposalSite && missionStatus === 'arrived' && (
          <Marker
            coordinate={{ latitude: activeMission.disposalSite.latitude, longitude: activeMission.disposalSite.longitude }}
            title="Disposal Site"
            description="Take waste here"
            pinColor={COLORS.error}
          />
        )}
      </MapView>

      {/* FLOATING UI OVERLAYS */}
      <View style={styles.uiOverlay} pointerEvents="box-none">
        
        {/* PROXIMITY BADGE - Floating above map */}
        {activeZoneInfo && (
          <View style={styles.proximityBadgeWrapper}>
            <ProximityBadge 
              distance={activeZoneInfo.distance}
              isArrived={isInsideGeofence}
              zoneLabel={activeZoneInfo.label}
            />
          </View>
        )}

        {/* RIGHT SIDE: UTILITY BUTTONS */}
        <View style={styles.rightSideUtilities}>
          <TrafficToggle 
            isEnabled={showTraffic} 
            onToggle={() => props.onTrafficToggle?.(!showTraffic)} 
          />
          <RecenterButton onPress={handleRecenter} />
        </View>

        {/* LEFT SIDE: SOS BUTTON */}
        <SOSButton location={currentUserLocation} />

        {/* BOTTOM: MISSION CONTROLLER */}
        <MissionController />
      </View>
    </View>
  );
});

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  headerStack: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 0,
  },
  uiOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  rightSideUtilities: {
    position: 'absolute',
    right: 0,
    top: 120,
    bottom: 150,
    justifyContent: 'center',
    paddingBottom: 100,
  },
  
  // Proximity Badge Styles
  proximityBadgeWrapper: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 90,
    alignSelf: 'center',
    zIndex: 1001,
  },
  proximityBadgeContainer: {
    backgroundColor: 'transparent',
  },
  proximityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)', // Dark aubergine background
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    // White text with outer glow
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
  },
  proximityBadgeArrived: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: COLORS.success,
  },
  proximityIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  proximityText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  proximityTextArrived: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  proximityCheckmark: {
    color: COLORS.success,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 6,
  },
  
  // Pulse Circle
  pulseCircle: {
    position: 'absolute',
  },
  
  // Custom Bin Marker
  binMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  binMarkerActive: {
    transform: [{ scale: 1.2 }],
  },
  binMarkerTarget: {
    transform: [{ scale: 1.15 }],
  },
  // Bin marker circle - solid glyph style
  binMarkerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',  // Blue background
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  binMarkerCircleActive: {
    backgroundColor: 'rgba(76, 217, 100, 0.95)',  // Green when active
    borderColor: '#4CD964',
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  binMarkerCircleTarget: {
    backgroundColor: 'rgba(245, 158, 11, 0.95)',  // Yellow when approaching
    borderColor: '#F59E0B',
  },
  binMarkerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  binMarkerTextActive: {
    fontSize: 18,
  },
  binMarkerLabel: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  binMarkerLabelActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.95)',
    borderColor: '#4CD964',
  },
  binMarkerLabelText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default InteractiveMissionMap;

// Export color constants for external use
// Note: GEOFENCE_COLORS, HEATMAP_COLORS, and ZONE_TYPES are already exported above

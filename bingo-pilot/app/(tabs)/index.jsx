import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { DutyHeader } from '../../components/pilot/DutyHeader';
import { MissionController } from '../../components/pilot/MissionController';
import { RecenterButton, TrafficToggle, SOSButton } from '../../components/shared';
import { COLORS } from '../../constants/Colors';
import useMissionStore from '../../stores/useMissionStore';

export default function PilotHomeScreen() {
  // Connect to mission store
  const { isOnline, setOnline, activeMission, missionStatus, nearbyMissions } = useMissionStore();
  
  const [showTraffic, setShowTraffic] = useState(false);
  const mapRef = useRef(null);

  // Get current user location (would come from useLocation hook in production)
  const userLocation = { latitude: 5.6037, longitude: -0.1870 };

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 500);
    }
  };

  const handleToggleTraffic = () => {
    setShowTraffic(!showTraffic);
  };

  return (
    <View style={styles.container}>
      {/* LAYER 1: THE TACTICAL MAP */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 5.6037, // Accra
          longitude: -0.1870,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        customMapStyle={mapStyle}
        showsUserLocation={true}
        followsUserLocation={true}
        showsTraffic={showTraffic}
        tintColor={COLORS.primary}
      />

      {/* LAYER 2: FLOATING UI MODULES */}
      <View style={styles.uiOverlay} pointerEvents="box-none">
        
        {/* TOP: ONLY THE HEADER (Clean & Minimal) */}
        <View style={styles.topSection}>
          <DutyHeader 
            isOnline={isOnline} 
            onToggle={() => setOnline(!isOnline)} 
          />
        </View>

        {/* RIGHT SIDE: UTILITY BUTTONS */}
        <View style={styles.rightSideUtilities}>
          <TrafficToggle 
            isEnabled={showTraffic} 
            onToggle={handleToggleTraffic} 
          />
          <RecenterButton onPress={handleRecenter} />
        </View>

        {/* LEFT SIDE: SOS BUTTON */}
        <SOSButton location={userLocation} />

        {/* BOTTOM: MISSION CONTROLLER (State Machine) */}
        {/* MissionController handles: OFFER → EN_ROUTE → ARRIVED */}
        <MissionController />
      </View>
    </View>
  );
}

const mapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#334155" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0f172a" }] }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  uiOverlay: {
    flex: 1,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  topSection: {
    // No extra gap needed since there's only one child now
  },
  rightSideUtilities: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 110,
    justifyContent: 'center',
    paddingBottom: 100,
  }
});

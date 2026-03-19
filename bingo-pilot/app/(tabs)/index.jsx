import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import InteractiveMissionMap from '../../components/maps/InteractiveMissionMap';
import { COLORS, DARK_MAP_STYLE } from '../../constants';
import useMissionStore from '../../stores/useMissionStore';

export default function PilotHomeScreen() {
  // Connect to mission store
  const { isOnline, setOnline, currentLocation, setCurrentLocation } = useMissionStore();
  
  const [showTraffic, setShowTraffic] = useState(false);
  const mapRef = useRef(null);

  // Handle location changes from the map
  const handleLocationChange = useCallback((location) => {
    setCurrentLocation(location);
  }, [setCurrentLocation]);

  // Handle mission selection
  const handleMissionSelect = useCallback((mission) => {
    console.log('Mission selected:', mission);
  }, []);

  // Handle online toggle
  const handleToggleOnline = useCallback(() => {
    setOnline(!isOnline);
  }, [isOnline, setOnline]);

  // Handle traffic toggle
  const handleTrafficToggle = useCallback((value) => {
    setShowTraffic(value);
  }, []);

  return (
    <View style={styles.container}>
      <InteractiveMissionMap
        ref={mapRef}
        showTraffic={showTraffic}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
        onLocationChange={handleLocationChange}
        onMissionSelect={handleMissionSelect}
        onTrafficToggle={handleTrafficToggle}
        customMapStyle={DARK_MAP_STYLE}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

// BinGo Pilot - Geofence Hook
import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import { MAPS_CONFIG } from '../constants/Config';

/**
 * Custom hook for geofencing logic - checking if pilot is within 50m of the bin
 * @param {Object} options
 * @param {number} options.radius - Geofence radius in meters (default: 50)
 * @param {number} options.dwellTime - Time required to dwell in milliseconds
 */
const useGeofence = ({
  radius = MAPS_CONFIG.geofence.radius,
  dwellTime = MAPS_CONFIG.geofence.dwellTime,
} = {}) => {
  const [isInsideGeofence, setIsInsideGeofence] = useState(false);
  const [nearbyBins, setNearbyBins] = useState([]);
  const [enteredAt, setEnteredAt] = useState(null);
  const [dwellElapsed, setDwellElapsed] = useState(0);
  
  const locationSubscription = useRef(null);
  const dwellTimer = useRef(null);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
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
  }, []);

  // Check if location is inside geofence for any bin
  const checkGeofence = useCallback((currentLocation, bins) => {
    if (!currentLocation || !bins || bins.length === 0) {
      return { isInside: false, nearbyBins: [] };
    }

    const nearby = bins.filter((bin) => {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        bin.latitude,
        bin.longitude
      );
      return distance <= radius;
    });

    return {
      isInside: nearby.length > 0,
      nearbyBins: nearby,
    };
  }, [calculateDistance, radius]);

  // Handle location update
  const handleLocationUpdate = useCallback((locationCoords, bins) => {
    const { isInside, nearbyBins } = checkGeofence(locationCoords, bins);
    
    setNearbyBins(nearbyBins);
    
    if (isInside && !isInsideGeofence) {
      // Just entered the geofence
      setIsInsideGeofence(true);
      setEnteredAt(Date.now());
      setDwellElapsed(0);
      
      // Start dwell timer
      dwellTimer.current = setInterval(() => {
        setDwellElapsed(Date.now() - enteredAt);
      }, 1000);
    } else if (!isInside && isInsideGeofence) {
      // Left the geofence
      setIsInsideGeofence(false);
      setEnteredAt(null);
      setDwellElapsed(0);
      
      // Clear dwell timer
      if (dwellTimer.current) {
        clearInterval(dwellTimer.current);
        dwellTimer.current = null;
      }
    }
  }, [checkGeofence, isInsideGeofence, enteredAt]);

  // Start watching geofence
  const startGeofenceWatch = useCallback(async (bins) => {
    // Request permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      console.log('[useGeofence] Permission denied');
      return null;
    }

    // Start watching location
    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 5, // Update every 5 meters
        timeInterval: 2000, // Or every 2 seconds
      },
      (location) => {
        handleLocationUpdate(location.coords, bins);
      }
    );

    return locationSubscription.current;
  }, [handleLocationUpdate]);

  // Stop watching
  const stopGeofenceWatch = useCallback(() => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    
    if (dwellTimer.current) {
      clearInterval(dwellTimer.current);
      dwellTimer.current = null;
    }
    
    setIsInsideGeofence(false);
    setEnteredAt(null);
    setDwellElapsed(0);
    setNearbyBins([]);
  }, []);

  // Check if dwell time threshold is met
  const isDwellComplete = dwellElapsed >= dwellTime;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopGeofenceWatch();
    };
  }, []);

  return {
    isInsideGeofence,
    nearbyBins,
    enteredAt,
    dwellElapsed,
    isDwellComplete,
    radius,
    dwellTime,
    startGeofenceWatch,
    stopGeofenceWatch,
    checkGeofence,
  };
};

export default useGeofence;

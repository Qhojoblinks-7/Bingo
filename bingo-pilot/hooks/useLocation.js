// BinGo Pilot - Location Hook
import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { APP_CONFIG } from '../constants/Config';

/**
 * Custom hook for handling location permissions and fetching GPS coordinates
 * @param {Object} options
 * @param {boolean} options.enableHighAccuracy - Use high accuracy mode
 * @param {number} options.distanceFilter - Minimum distance (meters) to trigger update
 * @param {number} options.timeInterval - Minimum time (ms) between updates
 */
const useLocation = ({
  enableHighAccuracy = true,
  distanceFilter = APP_CONFIG.location.distanceFilter,
  timeInterval = APP_CONFIG.location.timeInterval,
} = {}) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  // Request location permissions
  const requestPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setHasPermission(false);
        return false;
      }
      
      setHasPermission(true);
      setErrorMsg(null);
      return true;
    } catch (error) {
      console.log('[useLocation] Permission request error:', error);
      setErrorMsg('Error requesting location permission');
      return false;
    }
  }, []);

  // Get current location once
  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    
    try {
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          setLoading(false);
          return null;
        }
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: enableHighAccuracy 
          ? Location.Accuracy.High 
          : Location.Accuracy.Balanced,
      });
      
      setLocation(loc.coords);
      setErrorMsg(null);
      setLoading(false);
      return loc.coords;
    } catch (error) {
      console.log('[useLocation] Get location error:', error);
      setErrorMsg('Error getting current location');
      setLoading(false);
      return null;
    }
  }, [hasPermission, requestPermission, enableHighAccuracy]);

  // Watch location changes
  const startWatchingLocation = useCallback(async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return null;
    }

    try {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: enableHighAccuracy 
            ? Location.Accuracy.High 
            : Location.Accuracy.Balanced,
          distanceInterval: distanceFilter,
          timeInterval: timeInterval,
        },
        (loc) => {
          setLocation(loc.coords);
          setErrorMsg(null);
          setLoading(false);
        }
      );

      return subscription;
    } catch (error) {
      console.log('[useLocation] Watch error:', error);
      setErrorMsg('Error watching location');
      return null;
    }
  }, [hasPermission, requestPermission, enableHighAccuracy, distanceFilter, timeInterval]);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      await requestPermission();
      await getCurrentLocation();
    };
    
    init();
    
    // Cleanup on unmount
    return () => {
      // Subscription would be cleaned up here if we were storing it
    };
  }, []);

  return {
    location, // { latitude, longitude, altitude, accuracy, speed, heading }
    errorMsg,
    loading,
    hasPermission,
    requestPermission,
    getCurrentLocation,
    startWatchingLocation,
  };
};

export default useLocation;

// BinGo Pilot Configuration - Environment Variables & API Keys

// ============================================
// API CONFIGURATION
// ============================================
export const API_CONFIG = {
  // Base URL for the Django backend
  baseURL: 'https://api.bingo-ride.com', // Replace with actual backend URL
  
  // API version
  apiVersion: 'v1',
  
  // Timeout in milliseconds
  timeout: 30000,
  
  // Endpoints
  endpoints: {
    // Authentication
    login: '/auth/login/',
    register: '/auth/register/',
    logout: '/auth/logout/',
    refreshToken: '/auth/token/refresh/',
    
    // Missions
    missions: '/missions/',
    missionDetail: (id) => `/missions/${id}/`,
    acceptMission: (id) => `/missions/${id}/accept/`,
    completeMission: (id) => `/missions/${id}/complete/`,
    cancelMission: (id) => `/missions/${id}/cancel/`,
    
    // Pilot
    pilotProfile: '/pilots/profile/',
    pilotStatus: '/pilots/status/',
    pilotLocation: '/pilots/location/',
    
    // Wallet
    wallet: '/wallet/',
    transactions: '/wallet/transactions/',
    payout: '/wallet/payout/',
    
    // Chat
    chatMessages: (missionId) => `/chat/${missionId}/messages/`,
    chatWebSocket: 'wss://ws.bingo-ride.com/chat/',
  },
};

// ============================================
// GOOGLE MAPS CONFIGURATION
// ============================================
export const MAPS_CONFIG = {
  // Google Maps API Key
  apiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with actual API key
  
  // Default map settings
  defaultLocation: {
    latitude: 5.6037, // Accra, Ghana
    longitude: -0.1870,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
  
  // Map style options
  mapStyle: {
    mapType: 'standard',
    showsUserLocation: true,
    showsMyLocationButton: true,
    showsCompass: true,
    showsScale: true,
    showsTraffic: true,
    showsBuildings: true,
    showsIndoorLevelPicker: true,
  },
  
  // Geofence settings
  geofence: {
    radius: 50, // meters
    dwellTime: 30000, // milliseconds
  },
  
  // Marker icons - using emoji fallbacks (can be replaced with actual images)
  markerIcons: {
    bin: null, // Can add: require('../assets/icons/bin-marker.png')
    pilot: null, // Can add: require('../assets/icons/pilot-marker.png')
    destination: null, // Can add: require('../assets/icons/destination-marker.png')
  },
};

// ============================================
// WEBSOCKET CONFIGURATION
// ============================================
export const WS_CONFIG = {
  // WebSocket server URL
  url: 'wss://ws.bingo-ride.com',
  
  // Reconnection settings
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  
  // Heartbeat
  heartbeatInterval: 30000,
  heartbeatTimeout: 10000,
  
  // Topics/Subscriptions
  topics: {
    pilotLocation: 'pilot:location',
    missionUpdates: 'mission:updates',
    chatMessages: 'chat:messages',
    notifications: 'notifications',
  },
};

// ============================================
// APP CONFIGURATION
// ============================================
export const APP_CONFIG = {
  // App name
  name: 'BinGo Pilot',
  
  // App version
  version: '1.0.0',
  
  // Build number
  buildNumber: '1',
  
  // Feature flags
  features: {
    geofencing: true,
    realTimeChat: true,
    pushNotifications: true,
    offlineMode: false,
    analytics: true,
  },
  
  // Location settings
  location: {
    enableHighAccuracy: true,
    accuracy: 'high',
    distanceFilter: 10, // meters
    timeInterval: 5000, // milliseconds
  },
  
  // Cache settings
  cache: {
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxSize: 50 * 1024 * 1024, // 50 MB
  },
  
  // Debug settings
  debug: {
    enableLogging: __DEV__,
    enableReduxLogger: __DEV__,
    showPerformanceMonitor: __DEV__,
  },
};

// ============================================
// STORAGE KEYS
// ============================================
export const STORAGE_KEYS = {
  authToken: '@bingo_pilot_auth_token',
  refreshToken: '@bingo_pilot_refresh_token',
  pilotProfile: '@bingo_pilot_profile',
  missionHistory: '@bingo_pilot_mission_history',
  appSettings: '@bingo_pilot_settings',
  lastLocation: '@bingo_pilot_last_location',
  isOnline: '@bingo_pilot_online_status',
};

// ============================================
// NOTIFICATION CHANNELS (Android)
// ============================================
export const NOTIFICATION_CHANNELS = {
  missionAlerts: {
    id: 'mission_alerts',
    name: 'Mission Alerts',
    description: 'Notifications for new missions and updates',
    importance: 4, // High
  },
  chatMessages: {
    id: 'chat_messages',
    name: 'Chat Messages',
    description: 'Real-time chat notifications',
    importance: 3, // Default
  },
  earnings: {
    name: 'Earnings',
    description: 'Payout and earnings notifications',
    importance: 3,
  },
};

// ============================================
// EXPORT DEFAULT CONFIG
// ============================================
const Config = {
  API_CONFIG,
  MAPS_CONFIG,
  WS_CONFIG,
  APP_CONFIG,
  STORAGE_KEYS,
  NOTIFICATION_CHANNELS,
};

export default Config;

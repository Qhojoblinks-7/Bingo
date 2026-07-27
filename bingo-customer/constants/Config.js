// Supabase Configuration
export const SUPABASE_CONFIG = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key',
};

// ============================================
// API CONFIGURATION (kept for reference)
// ============================================
export const API_CONFIG = {
  baseURL: 'https://api.bingo-ride.com',
  apiVersion: 'v1',
  timeout: 30000,
  endpoints: {
    login: '/auth/login/',
    register: '/auth/register/',
    logout: '/auth/logout/',
    refreshToken: '/auth/token/refresh/',
    verifyEmail: '/auth/verify-email/',
    forgotPassword: '/auth/forgot-password/',
    resetPassword: '/auth/reset-password/',
    userProfile: '/customers/profile/',
    updateProfile: '/customers/profile/',
    requests: '/requests/',
    requestDetail: (id) => `/requests/${id}/`,
    cancelRequest: (id) => `/requests/${id}/cancel/`,
    activities: '/activities/',
    activityDetail: (id) => `/activities/${id}/`,
    wallet: '/wallet/',
    walletBalance: '/wallet/balance/',
    transactions: '/wallet/transactions/',
    topUp: '/wallet/topup/',
    proofOfService: (id) => `/activities/${id}/proof/`,
    supportTickets: '/support/tickets/',
    createSupportTicket: '/support/tickets/',
    notifications: '/notifications/',
    savedLocations: '/customers/locations/',
    paymentMethods: '/customers/payment-methods/',
    dataRights: '/customers/data-rights/',
    downloadData: '/customers/data-rights/download/',
    deleteAccount: '/customers/delete/',
  },
};

// ============================================
// STORAGE KEYS
// ============================================
export const STORAGE_KEYS = {
  authToken: '@bingo_customer_auth_token',
  refreshToken: '@bingo_customer_refresh_token',
  customerProfile: '@bingo_customer_profile',
  walletBalance: '@bingo_customer_wallet_balance',
  requestHistory: '@bingo_customer_request_history',
  activityHistory: '@bingo_customer_activity_history',
  appSettings: '@bingo_customer_settings',
  isLoggedIn: '@bingo_customer_logged_in',
};

// ============================================
// APP CONFIGURATION
// ============================================
export const APP_CONFIG = {
  name: 'BinGo Customer',
  version: '1.0.0',
  buildNumber: '1',
  features: {
    geofencing: false,
    realTimeChat: true,
    pushNotifications: true,
    offlineMode: false,
    analytics: true,
  },
};

// ============================================
// EXPORT DEFAULT CONFIG
// ============================================
const Config = {
  API_CONFIG,
  STORAGE_KEYS,
  APP_CONFIG,
};

export default Config;
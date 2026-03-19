// BinGo Pilot Auth Store - Zustand State Management
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { httpClient } from '../services/api';
import { API_CONFIG, STORAGE_KEYS } from '../constants/Config';

// ============================================
// AUTH STORE
// ============================================
const useAuthStore = create((set, get) => ({
  // State
  isAuthenticated: false,
  isLoading: true,
  pilot: null,
  token: null,
  refreshToken: null,
  error: null,
  
  // Actions
  /**
   * Initialize auth state from secure storage
   */
  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.authToken);
      const refresh = await SecureStore.getItemAsync(STORAGE_KEYS.refreshToken);
      const pilotData = await SecureStore.getItemAsync(STORAGE_KEYS.pilotProfile);
      
      if (token && pilotData) {
        set({
          isAuthenticated: true,
          token,
          refreshToken: refresh,
          pilot: JSON.parse(pilotData),
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.log('[AuthStore] Initialize error:', error);
      set({ isLoading: false, error: error.message });
    }
  },
  
  /**
   * Login with email and password
   * @param {string} email 
   * @param {string} password 
   */
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await httpClient.post(API_CONFIG.endpoints.login, {
        email,
        password,
      });
      
      const { access, refresh, user } = response.data;
      
      // Save tokens securely
      await SecureStore.setItemAsync(STORAGE_KEYS.authToken, access);
      await SecureStore.setItemAsync(STORAGE_KEYS.refreshToken, refresh);
      await SecureStore.setItemAsync(STORAGE_KEYS.pilotProfile, JSON.stringify(user));
      
      set({
        isAuthenticated: true,
        token: access,
        refreshToken: refresh,
        pilot: user,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
  
  /**
   * Register a new pilot
   * @param {Object} pilotData - { email, password, firstName, lastName, phone, ... }
   */
  register: async (pilotData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await httpClient.post(API_CONFIG.endpoints.register, pilotData);
      
      // If registration automatically logs in
      if (response.data.access) {
        const { access, refresh, user } = response.data;
        
        await SecureStore.setItemAsync(STORAGE_KEYS.authToken, access);
        await SecureStore.setItemAsync(STORAGE_KEYS.refreshToken, refresh);
        await SecureStore.setItemAsync(STORAGE_KEYS.pilotProfile, JSON.stringify(user));
        
        set({
          isAuthenticated: true,
          token: access,
          refreshToken: refresh,
          pilot: user,
          isLoading: false,
        });
        
        return { success: true };
      }
      
      set({ isLoading: false });
      return { success: true, requiresVerification: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
  
  /**
   * Logout the pilot
   */
  logout: async () => {
    try {
      set({ isLoading: true });
      
      // Try to notify server (fire and forget)
      try {
        await httpClient.post(API_CONFIG.endpoints.logout);
      } catch (e) {
        // Ignore errors
      }
      
      // Clear secure storage
      await SecureStore.deleteItemAsync(STORAGE_KEYS.authToken);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.refreshToken);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.pilotProfile);
      
      set({
        isAuthenticated: false,
        pilot: null,
        token: null,
        refreshToken: null,
        isLoading: false,
        error: null,
      });
      
    } catch (error) {
      console.log('[AuthStore] Logout error:', error);
      // Still clear state even if there's an error
      set({
        isAuthenticated: false,
        pilot: null,
        token: null,
        refreshToken: null,
        isLoading: false,
      });
    }
  },
  
  /**
   * Update pilot profile
   * @param {Object} updates - Fields to update
   */
  updateProfile: async (updates) => {
    try {
      const { pilot } = get();
      const newPilot = { ...pilot, ...updates };
      
      // Update in storage
      await SecureStore.setItemAsync(STORAGE_KEYS.pilotProfile, JSON.stringify(newPilot));
      
      // Update in state
      set({ pilot: newPilot });
      
      return { success: true };
    } catch (error) {
      console.log('[AuthStore] Update profile error:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Clear error
   */
  clearError: () => set({ error: null }),
}));

export default useAuthStore;

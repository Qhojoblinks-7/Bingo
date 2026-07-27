import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authClient } from '../services/api';
import { supabase } from '../lib/supabase';
import { SUPABASE_CONFIG, STORAGE_KEYS } from '../constants/Config';

const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  customer: null,
  token: null,
  refreshToken: null,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      const session = await authClient.getSession();

      if (session?.user) {
        const customer = await fetchUserProfileFromSupabase(session.user.id);
        set({
          isAuthenticated: true,
          customer,
          token: session.access_token,
          refreshToken: session.refresh_token,
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

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { user, session } = await authClient.signIn(email, password);

      const customer = await fetchUserProfileFromSupabase(user.id);

      await SecureStore.setItemAsync(STORAGE_KEYS.authToken, session.access_token);
      await SecureStore.setItemAsync(STORAGE_KEYS.refreshToken, session.refresh_token);
      await SecureStore.setItemAsync(STORAGE_KEYS.customerProfile, JSON.stringify(customer));

      set({
        isAuthenticated: true,
        customer,
        token: session.access_token,
        refreshToken: session.refresh_token,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  register: async (customerData) => {
    try {
      set({ isLoading: true, error: null });
      const { email, password, ...metadata } = customerData;
      const { data } = await authClient.signUp(email, password, metadata);

      if (data.user && data.session) {
        const customer = await fetchUserProfileFromSupabase(data.user.id);

        await SecureStore.setItemAsync(STORAGE_KEYS.authToken, data.session.access_token);
        await SecureStore.setItemAsync(STORAGE_KEYS.refreshToken, data.session.refresh_token);
        await SecureStore.setItemAsync(STORAGE_KEYS.customerProfile, JSON.stringify(customer));

        set({
          isAuthenticated: true,
          customer,
          token: data.session.access_token,
          refreshToken: data.session.refresh_token,
          isLoading: false,
        });

        return { success: true };
      }

      set({ isLoading: false });
      return { success: true, requiresVerification: true };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      try {
        await authClient.signOut();
      } catch (e) {
        // Ignore errors
      }

      await SecureStore.deleteItemAsync(STORAGE_KEYS.authToken);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.refreshToken);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.customerProfile);

      set({
        isAuthenticated: false,
        customer: null,
        token: null,
        refreshToken: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.log('[AuthStore] Logout error:', error);
      set({
        isAuthenticated: false,
        customer: null,
        token: null,
        refreshToken: null,
        isLoading: false,
      });
    }
  },

  updateProfile: async (updates) => {
    try {
      const { customer } = get();
      const newCustomer = { ...customer, ...updates };
      await SecureStore.setItemAsync(STORAGE_KEYS.customerProfile, JSON.stringify(newCustomer));
      set({ customer: newCustomer });
      return { success: true };
    } catch (error) {
      console.log('[AuthStore] Update profile error:', error);
      return { success: false, error: error.message };
    }
  },

  clearError: () => set({ error: null }),
}));

async function fetchUserProfileFromSupabase(userId) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[AuthStore] Fetch profile error:', error);
    return { id: userId, name: '', email: '' };
  }
}

export default useAuthStore;
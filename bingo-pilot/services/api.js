// BinGo Pilot API Service - Base Axios Configuration
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG, STORAGE_KEYS } from '../constants/Config';

// ============================================
// CREATE AXIOS INSTANCE
// ============================================
const api = axios.create({
  baseURL: `${API_CONFIG.baseURL}/${API_CONFIG.apiVersion}`,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
api.interceptors.request.use(
  async (config) => {
    try {
      // Get auth token from secure storage
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.authToken);
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add timestamp for cache busting if needed
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
      
    } catch (error) {
      console.log('[API] Error getting token:', error);
    }
    
    return config;
  },
  (error) => {
    console.log('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
api.interceptors.response.use(
  (response) => {
    // Log successful responses in debug mode
    if (__DEV__) {
      console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url}`, 
        response.status);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error details
    console.log('[API] Response error:', error.response?.status, error.message);
    
    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.refreshToken);
        
        if (refreshToken) {
          const response = await axios.post(
            `${API_CONFIG.baseURL}${API_CONFIG.endpoints.refreshToken}`,
            { refresh: refreshToken }
          );
          
          const { access } = response.data;
          
          // Save new token
          await SecureStore.setItemAsync(STORAGE_KEYS.authToken, access);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.log('[API] Token refresh failed:', refreshError);
        
        // Clear tokens and redirect to login
        await SecureStore.deleteItemAsync(STORAGE_KEYS.authToken);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.refreshToken);
        
        // Could dispatch a logout action here
        // useAuthStore.getState().logout();
      }
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// HTTP METHODS
// ============================================
export const httpClient = {
  // GET request
  get: (url, config = {}) => api.get(url, config),
  
  // POST request
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  
  // PUT request
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  
  // PATCH request
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  
  // DELETE request
  delete: (url, config = {}) => api.delete(url, config),
  
  // Form Data POST
  postFormData: (url, formData, config = {}) => 
    api.post(url, formData, {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export default api;

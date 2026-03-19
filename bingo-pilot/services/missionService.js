// BinGo Pilot Mission Service - Mission API Functions
import { httpClient } from './api';
import { API_CONFIG } from '../constants/Config';

// ============================================
// MISSION API FUNCTIONS
// ============================================

/**
 * Get all available missions for the pilot
 * @param {Object} params - Query parameters (status, page, limit)
 */
export const getMissions = async (params = {}) => {
  try {
    const response = await httpClient.get(API_CONFIG.endpoints.missions, { params });
    return response.data;
  } catch (error) {
    console.log('[MissionService] Get missions error:', error);
    throw error;
  }
};

/**
 * Get a specific mission by ID
 * @param {string} missionId - The mission ID
 */
export const getMissionById = async (missionId) => {
  try {
    const url = API_CONFIG.endpoints.missionDetail(missionId);
    const response = await httpClient.get(url);
    return response.data;
  } catch (error) {
    console.log('[MissionService] Get mission error:', error);
    throw error;
  }
};

/**
 * Accept a mission
 * @param {string} missionId - The mission ID to accept
 */
export const acceptMission = async (missionId) => {
  try {
    const url = API_CONFIG.endpoints.acceptMission(missionId);
    const response = await httpClient.post(url);
    return response.data;
  } catch (error) {
    console.log('[MissionService] Accept mission error:', error);
    throw error;
  }
};

/**
 * Complete a mission
 * @param {string} missionId - The mission ID to complete
 * @param {Object} completionData - Data about the completion (photos, notes, etc.)
 */
export const completeMission = async (missionId, completionData = {}) => {
  try {
    const url = API_CONFIG.endpoints.completeMission(missionId);
    const response = await httpClient.post(url, completionData);
    return response.data;
  } catch (error) {
    console.log('[MissionService] Complete mission error:', error);
    throw error;
  }
};

/**
 * Cancel a mission
 * @param {string} missionId - The mission ID to cancel
 * @param {string} reason - Reason for cancellation
 */
export const cancelMission = async (missionId, reason = '') => {
  try {
    const url = API_CONFIG.endpoints.cancelMission(missionId);
    const response = await httpClient.post(url, { reason });
    return response.data;
  } catch (error) {
    console.log('[MissionService] Cancel mission error:', error);
    throw error;
  }
};

/**
 * Get mission history for the pilot
 * @param {Object} params - Query parameters (page, limit, startDate, endDate)
 */
export const getMissionHistory = async (params = {}) => {
  try {
    const response = await httpClient.get(API_CONFIG.endpoints.missions, {
      params: { ...params, status: 'completed' },
    });
    return response.data;
  } catch (error) {
    console.log('[MissionService] Get mission history error:', error);
    throw error;
  }
};

/**
 * Get active mission for the pilot
 */
export const getActiveMission = async () => {
  try {
    const response = await httpClient.get(API_CONFIG.endpoints.missions, {
      params: { status: 'active', limit: 1 },
    });
    return response.data.results?.[0] || null;
  } catch (error) {
    console.log('[MissionService] Get active mission error:', error);
    throw error;
  }
};

/**
 * Update pilot's mission status
 * @param {string} status - New status (online, offline, busy)
 */
export const updatePilotStatus = async (status) => {
  try {
    const response = await httpClient.post(API_CONFIG.endpoints.pilotStatus, { status });
    return response.data;
  } catch (error) {
    console.log('[MissionService] Update pilot status error:', error);
    throw error;
  }
};

/**
 * Update pilot's current location
 * @param {Object} location - { latitude, longitude, heading, speed }
 */
export const updatePilotLocation = async (location) => {
  try {
    const response = await httpClient.post(API_CONFIG.endpoints.pilotLocation, location);
    return response.data;
  } catch (error) {
    console.log('[MissionService] Update location error:', error);
    throw error;
  }
};

// ============================================
// EXPORT ALL SERVICES
// ============================================
const missionService = {
  getMissions,
  getMissionById,
  acceptMission,
  completeMission,
  cancelMission,
  getMissionHistory,
  getActiveMission,
  updatePilotStatus,
  updatePilotLocation,
};

export default missionService;

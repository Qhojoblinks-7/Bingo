import { httpClient, authClient } from './api';

// ============================================
// AUTH FUNCTIONS
// ============================================

export const login = async (email, password) => {
  try {
    const data = await authClient.signIn(email, password);
    const session = await authClient.getSession();
    const user = data.user;
    return { user, session };
  } catch (error) {
    console.log('[CustomerService] Login error:', error);
    throw error;
  }
};

export const register = async (customerData) => {
  try {
    const { email, password, ...metadata } = customerData;
    const data = await authClient.signUp(email, password, metadata);
    return data;
  } catch (error) {
    console.log('[CustomerService] Register error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await authClient.signOut();
    return { success: true };
  } catch (error) {
    console.log('[CustomerService] Logout error:', error);
    throw error;
  }
};

export const refreshToken = async () => {
  const session = await authClient.getSession();
  return session;
};

export const verifyEmail = async (token) => {
  const { data, error } = await supabase.auth.verifyOtp({
    token,
    type: 'email',
  });
  if (error) throw error;
  return data;
};

export const forgotPassword = async (email) => {
  try {
    const data = await authClient.resetPassword(email);
    return data;
  } catch (error) {
    console.log('[CustomerService] Forgot password error:', error);
    throw error;
  }
};

export const resetPassword = async (newPassword) => {
  try {
    const data = await authClient.updatePassword(newPassword);
    return data;
  } catch (error) {
    console.log('[CustomerService] Reset password error:', error);
    throw error;
  }
};

// ============================================
// USER PROFILE FUNCTIONS
// ============================================

export const fetchUserProfile = async () => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Fetch profile error:', error);
    throw error;
  }
};

export const updateUserProfile = async (updates) => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', user.id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Update profile error:', error);
    throw error;
  }
};

// ============================================
// PICKUP REQUEST FUNCTIONS
// ============================================

export const createRequest = async (requestData) => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('requests')
      .insert({ ...requestData, customer_id: user.id })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Create request error:', error);
    throw error;
  }
};

export const cancelRequest = async (requestId) => {
  try {
    const { data, error } = await supabase
      .from('requests')
      .update({ status: 'cancelled' })
      .eq('id', requestId)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Cancel request error:', error);
    throw error;
  }
};

export const fetchRequests = async (params = {}) => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    let query = supabase
      .from('requests')
      .select('*')
      .eq('customer_id', user.id);

    if (params.status) {
      query = query.eq('status', params.status);
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    if (params.orderBy) {
      query = query.order(params.orderBy, { ascending: params.orderDirection !== 'desc' });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Fetch requests error:', error);
    throw error;
  }
};

export const fetchRequestById = async (requestId) => {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Fetch request error:', error);
    throw error;
  }
};

// ============================================
// ACTIVITY FUNCTIONS
// ============================================

export const fetchActivities = async (params = {}) => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    let query = supabase
      .from('activities')
      .select('*')
      .eq('customer_id', user.id);

    if (params.status) {
      query = query.eq('status', params.status);
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    if (params.orderBy) {
      query = query.order(params.orderBy, { ascending: params.orderDirection !== 'desc' });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Fetch activities error:', error);
    throw error;
  }
};

export const fetchActivityById = async (activityId) => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', activityId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Fetch activity error:', error);
    throw error;
  }
};

// ============================================
// WALLET FUNCTIONS
// ============================================

export const fetchWalletBalance = async () => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('wallet')
      .select('*')
      .eq('customer_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || { balance: 0, currency: 'GH₵' };
  } catch (error) {
    console.log('[CustomerService] Fetch wallet balance error:', error);
    throw error;
  }
};

export const fetchTransactions = async (params = {}) => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('customer_id', user.id);

    if (params.limit) {
      query = query.limit(params.limit);
    }

    if (params.orderBy) {
      query = query.order(params.orderBy, { ascending: params.orderDirection !== 'desc' });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Fetch transactions error:', error);
    throw error;
  }
};

export const processTopUp = async (amount, method) => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        customer_id: user.id,
        type: 'topup',
        amount,
        method,
        status: 'completed',
      })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Top-up error:', error);
    throw error;
  }
};

// ============================================
// PROOF OF SERVICE FUNCTIONS
// ============================================

export const fetchProofOfService = async (activityId) => {
  try {
    const { data, error } = await supabase
      .from('proof_of_service')
      .select('*')
      .eq('activity_id', activityId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Fetch proof error:', error);
    throw error;
  }
};

// ============================================
// SUPPORT FUNCTIONS
// ============================================

export const createSupportTicket = async (ticketData) => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('support_tickets')
      .insert({ ...ticketData, customer_id: user.id })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Create support ticket error:', error);
    throw error;
  }
};

export const fetchSupportTickets = async (params = {}) => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    let query = supabase
      .from('support_tickets')
      .select('*')
      .eq('customer_id', user.id);

    if (params.status) {
      query = query.eq('status', params.status);
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Fetch support tickets error:', error);
    throw error;
  }
};

// ============================================
// LOCATIONS FUNCTIONS
// ============================================

export const fetchSavedLocations = async () => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('customer_locations')
      .select('*')
      .eq('customer_id', user.id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Fetch locations error:', error);
    throw error;
  }
};

export const saveLocation = async (locationData) => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('customer_locations')
      .insert({ ...locationData, customer_id: user.id })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Save location error:', error);
    throw error;
  }
};

export const deleteLocation = async (locationId) => {
  try {
    const { data, error } = await supabase
      .from('customer_locations')
      .delete()
      .eq('id', locationId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Delete location error:', error);
    throw error;
  }
};

// ============================================
// PAYMENT METHODS FUNCTIONS
// ============================================

export const fetchPaymentMethods = async () => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('customer_id', user.id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Fetch payment methods error:', error);
    throw error;
  }
};

export const addPaymentMethod = async (methodData) => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('payment_methods')
      .insert({ ...methodData, customer_id: user.id })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Add payment method error:', error);
    throw error;
  }
};

export const deletePaymentMethod = async (methodId) => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', methodId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Delete payment method error:', error);
    throw error;
  }
};

// ============================================
// DATA RIGHTS FUNCTIONS
// ============================================

export const fetchDataRights = async () => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('customer_data_rights')
      .select('*')
      .eq('customer_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || {};
  } catch (error) {
    console.log('[CustomerService] Fetch data rights error:', error);
    throw error;
  }
};

export const downloadUserData = async () => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('data_download_requests')
      .insert({ customer_id: user.id, status: 'pending' })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Download data error:', error);
    throw error;
  }
};

export const requestDataCorrection = async (correctionData) => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('customer_data_rights')
      .update(correctionData)
      .eq('customer_id', user.id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Data correction error:', error);
    throw error;
  }
};

export const revokeConsent = async () => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('customer_data_rights')
      .update({ consent_granted: false })
      .eq('customer_id', user.id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Revoke consent error:', error);
    throw error;
  }
};

export const deleteAccount = async () => {
  try {
    const user = await authClient.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('customers')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', user.id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('[CustomerService] Delete account error:', error);
    throw error;
  }
};

// ============================================
// EXPORT ALL SERVICES
// ============================================
const customerService = {
  // Auth
  login,
  register,
  logout,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  // Profile
  fetchUserProfile,
  updateUserProfile,
  // Requests
  createRequest,
  cancelRequest,
  fetchRequests,
  fetchRequestById,
  // Activities
  fetchActivities,
  fetchActivityById,
  // Wallet
  fetchWalletBalance,
  fetchTransactions,
  processTopUp,
  // Proof of Service
  fetchProofOfService,
  // Support
  createSupportTicket,
  fetchSupportTickets,
  // Locations
  fetchSavedLocations,
  saveLocation,
  deleteLocation,
  // Payment Methods
  fetchPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  // Data Rights
  fetchDataRights,
  downloadUserData,
  requestDataCorrection,
  revokeConsent,
  deleteAccount,
};

export default customerService;
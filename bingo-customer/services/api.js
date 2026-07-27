import { supabase } from '../lib/supabase';

export const httpClient = {
  get: async (table, options = {}) => {
    const { select, eq, range, order, orderByColumn } = options;
    let query = supabase.from(table).select(select || '*');

    if (eq) {
      Object.entries(eq).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    if (order) {
      query = query.order(orderByColumn || 'id', { ascending: order === 'asc' });
    }

    if (range) {
      query = query.range(range.from, range.to);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  post: async (table, data) => {
    const { data: result, error } = await supabase.from(table).insert(data).select();
    if (error) throw error;
    return result;
  },

  put: async (table, data, filters) => {
    let query = supabase.from(table).update(data);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    const { data: result, error } = await query.select();
    if (error) throw error;
    return result;
  },

  patch: async (table, data, filters) => {
    let query = supabase.from(table).update(data);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    const { data: result, error } = await query.select();
    if (error) throw error;
    return result;
  },

  delete: async (table, filters) => {
    let query = supabase.from(table).delete();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};

export const authClient = {
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (error) throw error;
    return data;
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  },

  updatePassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return data;
  },
};

export default { httpClient, authClient };
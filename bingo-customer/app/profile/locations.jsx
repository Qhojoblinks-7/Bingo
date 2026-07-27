import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BinGoHeader } from '@/components/BinGoHeader';
import { useAppTheme } from '@/hooks/useThemeContext';
import { supabase } from '@/lib/supabase';

export default function SavedLocations() {
  const { isDark } = useAppTheme();
  
  const colors = useMemo(() => isDark ? {
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    muted: '#A0A0A0',
    primary: '#10B981',
    white: '#FFFFFF',
    border: '#333333',
    inputBg: '#2A2A2A',
  } : {
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#111827',
    muted: '#6B7280',
    primary: '#10B981',
    white: '#FFFFFF',
    border: '#E5E7EB',
    inputBg: '#F3F4F6',
  }, [isDark]);

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('customer_locations')
        .select('*')
        .eq('customer_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      Alert.alert('Error', 'Failed to load saved locations');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('customer_locations')
        .update({ is_default: false })
        .eq('customer_id', user.id);

      const { error } = await supabase
        .from('customer_locations')
        .update({ is_default: true })
        .eq('id', id)
        .eq('customer_id', user.id);

      if (error) throw error;
      fetchLocations();
    } catch (_error) {
      Alert.alert('Error', 'Failed to update default location');
    }
  };

  const handleDelete = async (id, label) => {
    Alert.alert(
      'Delete Location',
      `Are you sure you want to delete "${label}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('customer_locations')
                .delete()
                .eq('id', id);

              if (error) throw error;
              fetchLocations();
            } catch (_error) {
              Alert.alert('Error', 'Failed to delete location');
            }
          },
        },
      ]
    );
  };

  const handleAddLocation = () => {
    Alert.alert(
      'Add New Location',
      'This would open a map or GPS code entry screen.',
      [{ text: 'OK' }]
    );
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    infoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: isDark ? '#1A3A2A' : '#F0FDF4',
      padding: 14,
      borderRadius: 12,
      marginBottom: 24,
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      color: colors.text,
      lineHeight: 18,
    },
    locationsSection: {
      marginBottom: 24,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    locationCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    locationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    labelBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: isDark ? '#1A3A2A' : '#EFF6FF',
    },
    labelText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.primary,
    },
    defaultBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
    },
    defaultText: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.white,
    },
    addressText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    gpsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    gpsText: {
      fontSize: 13,
      color: colors.muted,
      fontFamily: 'monospace',
    },
    setDefaultBtn: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    setDefaultText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '600',
    },
    addLocationBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primary,
      borderStyle: 'dashed',
      marginBottom: 24,
    },
    addLocationText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },
    helpSection: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
    },
    helpTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    helpText: {
      fontSize: 13,
      color: colors.muted,
      lineHeight: 18,
    },
  }), [colors, isDark]);

  return (
    <View style={styles.container}>
      <BinGoHeader 
        title="Saved Locations" 
        showBack 
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Add your frequently used addresses for faster pickup requests
          </Text>
        </View>

        {/* Locations List */}
        <View style={styles.locationsSection}>
          <Text style={styles.sectionLabel}>My Locations</Text>
          
          {loading ? (
            <Text style={styles.helpText}>Loading locations...</Text>
          ) : locations.length === 0 ? (
            <Text style={styles.helpText}>No saved locations yet. Add your first one below.</Text>
          ) : (
            locations.map((location) => (
            <Pressable 
              key={location.id} 
              style={styles.locationCard}
            >
              <View style={styles.locationHeader}>
                <View style={styles.labelRow}>
                  <View style={styles.labelBadge}>
                    <Text style={styles.labelText}>
                      {location.label || 'Location'}
                    </Text>
                  </View>
                  {location.is_default && (
                    <View style={styles.defaultBadge}>
                      <Ionicons name="star" size={12} color={colors.white} />
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <Pressable 
                  onPress={() => handleDelete(location.id, location.label)}
                  hitSlop={10}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </Pressable>
              </View>

              <Text style={styles.addressText}>{location.address || 'No address provided'}</Text>
              
              <View style={styles.gpsRow}>
                <Ionicons name="location-outline" size={14} color={colors.muted} />
                <Text style={styles.gpsText}>{location.gps_code || location.address}</Text>
              </View>

              {!location.is_default && (
                <Pressable 
                  style={styles.setDefaultBtn}
                  onPress={() => handleSetDefault(location.id)}
                >
                  <Text style={styles.setDefaultText}>Set as Default</Text>
                </Pressable>
              )}
            </Pressable>
          ))
          )}
        </View>

        {/* Add New Location */}
        <Pressable style={styles.addLocationBtn} onPress={handleAddLocation}>
          <Ionicons name="add-circle" size={24} color={colors.primary} />
          <Text style={styles.addLocationText}>Add New Location</Text>
        </Pressable>

        {/* Ghana Post GPS Info */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>What is Ghana Post GPS?</Text>
          <Text style={styles.helpText}>
            A unique address system that identifies locations across Ghana. 
            Find your code at ghanapostgps.com or use any Ghana Post office.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

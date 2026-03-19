import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Car } from 'lucide-react-native';
import { COLORS } from '../../constants';

// ============================================
// TRIP LIST COMPONENT
// ============================================
const TripList = ({ trips, onTripPress }) => {
  const router = useRouter();
  
  const handleTripPress = (trip) => {
    if (onTripPress) {
      onTripPress(trip);
    }
    // Navigate to receipt detail screen
    router.push('/wallet/PaymentDetail');
  };
  if (!trips || trips.length === 0) {
    return (
      <View style={tripListStyles.emptyContainer}>
        <Text style={tripListStyles.emptyText}>No trips in this period</Text>
      </View>
    );
  }

  return (
    <View style={tripListStyles.container}>
      {trips.map((trip, index) => (
        <Pressable 
          key={index} 
          style={tripListStyles.tripItem}
          onPress={() => handleTripPress(trip)}
        >
          <View style={tripListStyles.iconCircle}>
            <Car size={18} color={COLORS.background} />
          </View>
          <View style={tripListStyles.tripDetails}>
            <Text style={tripListStyles.tripTime}>{trip.time}</Text>
            <Text style={tripListStyles.tripLocation} numberOfLines={2}>
              {trip.location}
            </Text>
          </View>
          <Text style={tripListStyles.tripAmount}>GHS {trip.payout}</Text>
        </Pressable>
      ))}
    </View>
  );
};

// ============================================
// EXPORT
// ============================================
export default TripList;

// ============================================
// TRIP LIST STYLES
// ============================================
const tripListStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 15,
  },
  tripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripDetails: {
    flex: 1,
    paddingHorizontal: 10,
  },
  tripTime: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  tripLocation: {
    color: COLORS.muted,
    fontSize: 11,
  },
  tripAmount: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});

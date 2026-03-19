import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Car } from 'lucide-react-native';
import { COLORS } from '../../constants';

// ============================================
// FEE CHIPS COMPONENT - Earnings Breakdown
// ============================================
const FeeChips = ({ breakdown }) => (
  <View style={chipStyles.chipContainer}>
    <View style={chipStyles.chipRow}>
      <View style={chipStyles.chip}>
        <Text style={chipStyles.chipLabel}>Cash</Text>
        <Text style={chipStyles.chipValue}>GHS {breakdown?.cash || '57'}</Text>
      </View>
      <View style={chipStyles.chip}>
        <Text style={chipStyles.chipLabel}>Bonuses</Text>
        <Text style={chipStyles.chipValue}>GHS {breakdown?.bonuses || '41'}</Text>
      </View>
    </View>
    <View style={chipStyles.chipRow}>
      <View style={[chipStyles.chip, chipStyles.chipNegative]}>
        <Text style={chipStyles.chipLabel}>Service fees</Text>
        <Text style={chipStyles.chipValueNegative}>-GHS {breakdown?.serviceFee || '14.25'}</Text>
      </View>
      <View style={[chipStyles.chip, chipStyles.chipNegative]}>
        <Text style={chipStyles.chipLabel}>Partner fees</Text>
        <Text style={chipStyles.chipValueNegative}>-GHS {breakdown?.partnerFee || '1.14'}</Text>
      </View>
    </View>
  </View>
);

// ============================================
// ACTIVE DAILY DETAIL COMPONENT
// Level 2: Shows detailed earnings when missions exist
// ============================================
export default function ActiveDailyDetail({ 
  missions = [], 
  totalAmount = "82.61",
  date = "February 20",
  breakdown = null
}) {
  // Return null if no missions provided - don't show anything without activity
  if (!missions || missions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* HERO STATISTICS - Total Earnings */}
      <View style={styles.hero}>
        <Text style={styles.amountText}>GHS {totalAmount}</Text>
        <Text style={styles.subText}>{missions.length} trips</Text>
      </View>

      {/* FEE CHIPS BOX - Earnings Breakdown */}
      <View style={styles.statsBox}>
        <FeeChips breakdown={breakdown} />
      </View>

      {/* MISSION TIMELINE - Trip List */}
      <View style={styles.listContainer}>
        <Text style={styles.dateHeader}>{date}</Text>
        
        {missions.map((item, index) => (
          <View key={item.id || index} style={styles.tripItem}>
            <View style={styles.iconCircle}>
              <Car size={18} color={COLORS.background} />
            </View>
            
            <View style={styles.tripDetails}>
              <Text style={styles.tripTime}>{item.time}</Text>
              <Text style={styles.tripLocation} numberOfLines={2}>
                {item.location}
              </Text>
            </View>

            <Text style={styles.tripAmount}>GHS {item.payout}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ============================================
// MAIN CONTAINER STYLES
// ============================================
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background,
  },
  hero: { 
    alignItems: 'center', 
    paddingVertical: 30,
    backgroundColor: COLORS.background,
  },
  amountText: { 
    color: COLORS.text, 
    fontSize: 44, 
    fontWeight: '700' 
  },
  subText: { 
    color: COLORS.muted, 
    fontSize: 16,
    marginTop: 4,
  },
  
  statsBox: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 12,
    marginBottom: 20,
  },

  listContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 24,
  },
  dateHeader: { 
    color: COLORS.text, 
    fontSize: 20, 
    fontWeight: '700', 
    marginBottom: 20 
  },
  tripItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderColor: COLORS.border,
  },
  iconCircle: { 
    width: 40, 
    height: 40, 
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  tripDetails: { 
    flex: 1, 
    paddingHorizontal: 12 
  },
  tripTime: { 
    color: COLORS.text, 
    fontSize: 15, 
    fontWeight: '600', 
    marginBottom: 2 
  },
  tripLocation: { 
    color: COLORS.muted, 
    fontSize: 13 
  },
  tripAmount: { 
    color: COLORS.primary, 
    fontSize: 16, 
    fontWeight: '700' 
  }
});

// ============================================
// FEE CHIPS STYLES
// ============================================
const chipStyles = StyleSheet.create({
  chipContainer: { 
    gap: 8 
  },
  chipRow: { 
    flexDirection: 'row', 
    gap: 8 
  },
  chip: { 
    flex: 1,
    backgroundColor: COLORS.surfaceLight, 
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipNegative: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  chipLabel: { 
    color: COLORS.muted, 
    fontSize: 13, 
    fontWeight: '500' 
  },
  chipValue: { 
    color: COLORS.text, 
    fontSize: 14, 
    fontWeight: '700' 
  },
  chipValueNegative: { 
    color: COLORS.error, 
    fontSize: 14, 
    fontWeight: '600' 
  }
});

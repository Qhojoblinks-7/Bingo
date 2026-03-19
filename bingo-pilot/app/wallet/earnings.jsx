import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Car } from 'lucide-react-native';
import { COLORS } from '../../constants';
import AnalyticsBar from './AnalyticsBar';
import TripList from '../../components/wallet/TripList';
import ActiveDailyDetail from '../../components/wallet/ActiveDailyDetail';

// ============================================
// MAIN EARNINGS SCREEN
// ============================================
export default function EarningsDetailScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('Day');
  const [selectedDayIndex, setSelectedDayIndex] = useState(6);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(3);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(2);
  const [selectedBadge, setSelectedBadge] = useState(null); // Track which badge is selected
  
  // Mock data - in production, this comes from API
  const hasActivity = true;

  // Daily data - full 14 days for scrolling
  const dailyData = [
    { label: '12', subLabel: 'Th', value: 0 },
    { label: '13', subLabel: 'Fr', value: 45 },
    { label: '14', subLabel: 'Sa', value: 120 },
    { label: '15', subLabel: 'Su', value: 80 },
    { label: '16', subLabel: 'Mo', value: 65 },
    { label: '17', subLabel: 'Tu', value: 95 },
    { label: '18', subLabel: 'We', value: 0, isCurrent: true },
    { label: '19', subLabel: 'Th', value: 150 },
    { label: '20', subLabel: 'Fr', value: 85 },
    { label: '21', subLabel: 'Sa', value: 110 },
    { label: '22', subLabel: 'Su', value: 70 },
    { label: '23', subLabel: 'Mo', value: 45 },
    { label: '24', subLabel: 'Tu', value: 200 },
    { label: '25', subLabel: 'We', value: 400 },
  ];

  // Weekly data - full 10 weeks for scrolling
  const weeklyData = [
    { label: '5-11', subLabel: 'Jan', value: 120.5 },
    { label: '12-18', subLabel: 'Jan', value: 185.0 },
    { label: '19-25', subLabel: 'Jan', value: 95.75 },
    { label: '26-1', subLabel: 'Feb', value: 210.25 },
    { label: '2-8', subLabel: 'Feb', value: 150.0 },
    { label: '9-15', subLabel: 'Feb', value: 175.5 },
    { label: '16-22', subLabel: 'Feb', value: 48.36 },
    { label: '23-1', subLabel: 'Mar', value: 95.0 },
    { label: '2-8', subLabel: 'Mar', value: 145.75 },
    { label: '9-15', subLabel: 'Mar', value: 180.25 },
  ];

  // Monthly data - full 7 months
  const monthlyData = [
    { label: 'Sep', subLabel: '2025', value: 450 },
    { label: 'Oct', subLabel: '2025', value: 520 },
    { label: 'Nov', subLabel: '2025', value: 610 },
    { label: 'Dec', subLabel: '2025', value: 580 },
    { label: 'Jan', subLabel: '2026', value: 831 },
    { label: 'Feb', subLabel: '2026', value: 647 },
    { label: 'Mar', subLabel: '2026', value: 400, isCurrent: true },
  ];

  // Get current data based on filter
  const getCurrentData = () => {
    switch (activeFilter) {
      case 'Week': return weeklyData;
      case 'Month': return monthlyData;
      default: return dailyData;
    }
  };

  const getSelectedIndex = () => {
    switch (activeFilter) {
      case 'Week': return selectedWeekIndex;
      case 'Month': return selectedMonthIndex;
      default: return selectedDayIndex;
    }
  };

  const setSelectedIndex = (index) => {
    switch (activeFilter) {
      case 'Week': setSelectedWeekIndex(index); break;
      case 'Month': setSelectedMonthIndex(index); break;
      default: setSelectedDayIndex(index); break;
    }
  };

  const getMaxValue = () => {
    const data = getCurrentData();
    return Math.max(...data.map(d => d.value), 100);
  };

  // Get analytics data - either badge-specific or regular
  const getAnalyticsData = () => {
    if (selectedBadge) {
      return getBadgeAnalytics() || getCurrentData();
    }
    return getCurrentData();
  };

  const getAnalyticsMaxValue = () => {
    const data = getAnalyticsData();
    // For negative values, use absolute values to calculate max height
    const maxAbs = Math.max(...data.map(d => Math.abs(d.value)), 100);
    return maxAbs;
  };

  const getAnalyticsSelectedIndex = () => {
    if (selectedBadge) {
      // Show all bars as not selected for badge analytics
      return -1;
    }
    return getSelectedIndex();
  };

  const handleAnalyticsPress = (index) => {
    // Always allow date selection, even when badge is selected
    setSelectedIndex(index);
  };

  const getAmount = () => {
    const data = getCurrentData();
    const index = getSelectedIndex();
    return data[index]?.value.toFixed(2) || '0';
  };

  const getTripCount = () => {
    // Mock trip count based on selection
    if (!hasActivity) return 0;
    const amount = parseFloat(getAmount());
    if (amount === 0) return 0;
    if (activeFilter === 'Day') return amount > 100 ? 2 : 1;
    if (activeFilter === 'Week') return Math.floor(amount / 50);
    return Math.floor(amount / 100);
  };

  // Mock trips for display
  const getTrips = () => {
    if (!hasActivity) return [];
    const count = getTripCount();
    if (count === 0) return [];
    
    if (activeFilter === 'Day') {
      return [
        { time: '2:30 PM', location: '123 Main St → East Legon', payout: '250.00' },
        { time: '11:15 AM', location: '45 Oxford St → Airport', payout: '150.00' },
      ].slice(0, count);
    }
    if (activeFilter === 'Week') {
      return [
        { time: 'Mon 2:30 PM', location: 'Zone A Collection', payout: '85.00' },
        { time: 'Wed 11:15 AM', location: 'Zone B Collection', payout: '120.00' },
        { time: 'Fri 3:00 PM', location: 'Zone C Collection', payout: '95.00' },
      ].slice(0, Math.min(count, 3));
    }
    // Monthly
    return [
      { time: 'Week 1', location: 'Multiple Collections', payout: '250.00' },
      { time: 'Week 2', location: 'Multiple Collections', payout: '150.00' },
    ].slice(0, Math.min(count, 2));
  };

  // Get the breakdown data for fee chips
  const getBreakdown = () => {
    const amount = parseFloat(getAmount());
    if (amount === 0) return null;
    
    // Calculate breakdown (mock calculation - in production comes from API)
    const serviceFee = (amount * 0.1725).toFixed(2); // ~17.25% service fee
    const partnerFee = (amount * 0.0138).toFixed(2); // ~1.38% partner fee
    const cash = (amount * 0.69).toFixed(0); // 69% cash
    const bonuses = (amount * 0.50).toFixed(0); // 50% bonuses (overlapping with cash)
    
    return { cash, bonuses, serviceFee, partnerFee };
  };

  // Check if there's activity for current selection
  const hasActivityForCurrentSelection = parseFloat(getAmount()) > 0;

  // Get badge-specific analytics data
  const getBadgeAnalytics = () => {
    if (!selectedBadge) return null;
    const amount = parseFloat(getAmount());
    if (amount === 0) return null;

    // Generate mock analytics based on selected badge and filter
    if (activeFilter === 'Day') {
      switch (selectedBadge) {
        case 'Cash':
          return [
            { label: '12', subLabel: 'Th', value: 45 },
            { label: '13', subLabel: 'Fr', value: 80 },
            { label: '14', subLabel: 'Sa', value: 120 },
            { label: '15', subLabel: 'Su', value: 60 },
            { label: '16', subLabel: 'Mo', value: 40 },
            { label: '17', subLabel: 'Tu', value: 95 },
            { label: '18', subLabel: 'We', value: 0 },
          ];
        case 'Bonus':
          return [
            { label: '12', subLabel: 'Th', value: 20 },
            { label: '13', subLabel: 'Fr', value: 35 },
            { label: '14', subLabel: 'Sa', value: 50 },
            { label: '15', subLabel: 'Su', value: 25 },
            { label: '16', subLabel: 'Mo', value: 30 },
            { label: '17', subLabel: 'Tu', value: 45 },
            { label: '18', subLabel: 'We', value: 0 },
          ];
        case 'Service Fee':
          return [
            { label: '12', subLabel: 'Th', value: -8 },
            { label: '13', subLabel: 'Fr', value: -15 },
            { label: '14', subLabel: 'Sa', value: -22 },
            { label: '15', subLabel: 'Su', value: -14 },
            { label: '16', subLabel: 'Mo', value: -12 },
            { label: '17', subLabel: 'Tu', value: -18 },
            { label: '18', subLabel: 'We', value: 0 },
          ];
        case 'Partner Fee':
          return [
            { label: '12', subLabel: 'Th', value: -1 },
            { label: '13', subLabel: 'Fr', value: -2 },
            { label: '14', subLabel: 'Sa', value: -3 },
            { label: '15', subLabel: 'Su', value: -2 },
            { label: '16', subLabel: 'Mo', value: -1 },
            { label: '17', subLabel: 'Tu', value: -2 },
            { label: '18', subLabel: 'We', value: 0 },
          ];
        default:
          return null;
      }
    } else if (activeFilter === 'Week') {
      // Weekly analytics
      switch (selectedBadge) {
        case 'Cash':
          return [
            { label: '5-11', subLabel: 'Jan', value: 85 },
            { label: '12-18', subLabel: 'Jan', value: 120 },
            { label: '19-25', subLabel: 'Jan', value: 95 },
            { label: '26-1', subLabel: 'Feb', value: 150 },
            { label: '2-8', subLabel: 'Feb', value: 110 },
            { label: '9-15', subLabel: 'Feb', value: 135 },
            { label: '16-22', subLabel: 'Mar', value: 90 },
          ];
        case 'Bonus':
          return [
            { label: '5-11', subLabel: 'Jan', value: 25 },
            { label: '12-18', subLabel: 'Jan', value: 40 },
            { label: '19-25', subLabel: 'Jan', value: 30 },
            { label: '26-1', subLabel: 'Feb', value: 55 },
            { label: '2-8', subLabel: 'Feb', value: 35 },
            { label: '9-15', subLabel: 'Feb', value: 45 },
            { label: '16-22', subLabel: 'Mar', value: 28 },
          ];
        case 'Service Fee':
          return [
            { label: '5-11', subLabel: 'Jan', value: -15 },
            { label: '12-18', subLabel: 'Jan', value: -22 },
            { label: '19-25', subLabel: 'Jan', value: -18 },
            { label: '26-1', subLabel: 'Feb', value: -28 },
            { label: '2-8', subLabel: 'Feb', value: -20 },
            { label: '9-15', subLabel: 'Feb', value: -25 },
            { label: '16-22', subLabel: 'Mar', value: -16 },
          ];
        case 'Partner Fee':
          return [
            { label: '5-11', subLabel: 'Jan', value: -2 },
            { label: '12-18', subLabel: 'Jan', value: -3 },
            { label: '19-25', subLabel: 'Jan', value: -2 },
            { label: '26-1', subLabel: 'Feb', value: -4 },
            { label: '2-8', subLabel: 'Feb', value: -3 },
            { label: '9-15', subLabel: 'Feb', value: -3 },
            { label: '16-22', subLabel: 'Mar', value: -2 },
          ];
        default:
          return null;
      }
    } else {
      // Monthly analytics
      switch (selectedBadge) {
        case 'Cash':
          return [
            { label: 'Sep', subLabel: '2025', value: 320 },
            { label: 'Oct', subLabel: '2025', value: 380 },
            { label: 'Nov', subLabel: '2025', value: 450 },
            { label: 'Dec', subLabel: '2025', value: 420 },
            { label: 'Jan', subLabel: '2026', value: 580 },
            { label: 'Feb', subLabel: '2026', value: 450 },
            { label: 'Mar', subLabel: '2026', value: 280 },
          ];
        case 'Bonus':
          return [
            { label: 'Sep', subLabel: '2025', value: 130 },
            { label: 'Oct', subLabel: '2025', value: 140 },
            { label: 'Nov', subLabel: '2025', value: 160 },
            { label: 'Dec', subLabel: '2025', value: 160 },
            { label: 'Jan', subLabel: '2026', value: 251 },
            { label: 'Feb', subLabel: '2026', value: 197 },
            { label: 'Mar', subLabel: '2026', value: 120 },
          ];
        case 'Service Fee':
          return [
            { label: 'Sep', subLabel: '2025', value: -78 },
            { label: 'Oct', subLabel: '2025', value: -90 },
            { label: 'Nov', subLabel: '2025', value: -105 },
            { label: 'Dec', subLabel: '2025', value: -100 },
            { label: 'Jan', subLabel: '2026', value: -143 },
            { label: 'Feb', subLabel: '2026', value: -112 },
            { label: 'Mar', subLabel: '2026', value: -69 },
          ];
        case 'Partner Fee':
          return [
            { label: 'Sep', subLabel: '2025', value: -10 },
            { label: 'Oct', subLabel: '2025', value: -12 },
            { label: 'Nov', subLabel: '2025', value: -14 },
            { label: 'Dec', subLabel: '2025', value: -13 },
            { label: 'Jan', subLabel: '2026', value: -19 },
            { label: 'Feb', subLabel: '2026', value: -15 },
            { label: 'Mar', subLabel: '2026', value: -9 },
          ];
        default:
          return null;
      }
    }
  };

  // Get badge-specific transaction history
  const getBadgeHistory = () => {
    if (!selectedBadge) return [];

    if (activeFilter === 'Day') {
      switch (selectedBadge) {
        case 'Cash':
          return [
            { time: '2:30 PM', location: 'Trip: Main St → East Legon', payout: '150.00', type: 'cash' },
            { time: '11:15 AM', location: 'Trip: Oxford St → Airport', payout: '85.00', type: 'cash' },
            { time: '9:00 AM', location: 'Trip: Ridge → Accra Mall', payout: '45.00', type: 'cash' },
          ];
        case 'Bonus':
          return [
            { time: '2:30 PM', location: 'Peak Hour Bonus', payout: '25.00', type: 'bonus' },
            { time: '11:15 AM', location: 'Distance Bonus', payout: '15.00', type: 'bonus' },
            { time: '5:00 PM', location: 'Completion Bonus', payout: '20.00', type: 'bonus' },
          ];
        case 'Service Fee':
          return [
            { time: '2:30 PM', location: 'Service Fee - Trip 1', payout: '15.50', type: 'fee' },
            { time: '11:15 AM', location: 'Service Fee - Trip 2', payout: '12.30', type: 'fee' },
            { time: '9:00 AM', location: 'Service Fee - Trip 3', payout: '8.75', type: 'fee' },
          ];
        case 'Partner Fee':
          return [
            { time: '2:30 PM', location: 'Partner Fee - Trip 1', payout: '2.10', type: 'fee' },
            { time: '11:15 AM', location: 'Partner Fee - Trip 2', payout: '1.65', type: 'fee' },
          ];
        default:
          return [];
      }
    } else if (activeFilter === 'Week') {
      // Weekly history
      switch (selectedBadge) {
        case 'Cash':
          return [
            { time: 'Mon', location: 'Zone A - Morning', payout: '85.00', type: 'cash' },
            { time: 'Tue', location: 'Zone B - Afternoon', payout: '120.00', type: 'cash' },
            { time: 'Wed', location: 'Zone C - Evening', payout: '95.00', type: 'cash' },
            { time: 'Thu', location: 'Zone A - Morning', payout: '110.00', type: 'cash' },
            { time: 'Fri', location: 'Zone B - Afternoon', payout: '135.00', type: 'cash' },
          ];
        case 'Bonus':
          return [
            { time: 'Mon', location: 'Streak Bonus', payout: '25.00', type: 'bonus' },
            { time: 'Wed', location: 'Distance Bonus', payout: '40.00', type: 'bonus' },
            { time: 'Fri', location: 'Peak Hour Bonus', payout: '35.00', type: 'bonus' },
          ];
        case 'Service Fee':
          return [
            { time: 'Mon', location: 'Service Fee - 5 trips', payout: '15.00', type: 'fee' },
            { time: 'Tue', location: 'Service Fee - 6 trips', payout: '18.00', type: 'fee' },
            { time: 'Wed', location: 'Service Fee - 4 trips', payout: '12.00', type: 'fee' },
            { time: 'Thu', location: 'Service Fee - 5 trips', payout: '15.00', type: 'fee' },
            { time: 'Fri', location: 'Service Fee - 6 trips', payout: '18.00', type: 'fee' },
          ];
        case 'Partner Fee':
          return [
            { time: 'Mon', location: 'Partner Fee - 5 trips', payout: '2.00', type: 'fee' },
            { time: 'Tue', location: 'Partner Fee - 6 trips', payout: '2.40', type: 'fee' },
            { time: 'Wed', location: 'Partner Fee - 4 trips', payout: '1.60', type: 'fee' },
            { time: 'Thu', location: 'Partner Fee - 5 trips', payout: '2.00', type: 'fee' },
            { time: 'Fri', location: 'Partner Fee - 6 trips', payout: '2.40', type: 'fee' },
          ];
        default:
          return [];
      }
    } else {
      // Monthly history
      switch (selectedBadge) {
        case 'Cash':
          return [
            { time: 'Week 1', location: 'Multiple Zones', payout: '150.00', type: 'cash' },
            { time: 'Week 2', location: 'Multiple Zones', payout: '180.00', type: 'cash' },
            { time: 'Week 3', location: 'Multiple Zones', payout: '120.00', type: 'cash' },
            { time: 'Week 4', location: 'Multiple Zones', payout: '130.00', type: 'cash' },
          ];
        case 'Bonus':
          return [
            { time: 'Week 1', location: 'Weekly Bonus', payout: '60.00', type: 'bonus' },
            { time: 'Week 2', location: 'Weekly Bonus', payout: '75.00', type: 'bonus' },
            { time: 'Week 3', location: 'Weekly Bonus', payout: '55.00', type: 'bonus' },
            { time: 'Week 4', location: 'Weekly Bonus', payout: '61.00', type: 'bonus' },
          ];
        case 'Service Fee':
          return [
            { time: 'Week 1', location: 'Service Fee - 25 trips', payout: '35.00', type: 'fee' },
            { time: 'Week 2', location: 'Service Fee - 30 trips', payout: '42.00', type: 'fee' },
            { time: 'Week 3', location: 'Service Fee - 22 trips', payout: '31.00', type: 'fee' },
            { time: 'Week 4', location: 'Service Fee - 24 trips', payout: '34.00', type: 'fee' },
          ];
        case 'Partner Fee':
          return [
            { time: 'Week 1', location: 'Partner Fee - 25 trips', payout: '5.00', type: 'fee' },
            { time: 'Week 2', location: 'Partner Fee - 30 trips', payout: '6.00', type: 'fee' },
            { time: 'Week 3', location: 'Partner Fee - 22 trips', payout: '4.40', type: 'fee' },
            { time: 'Week 4', location: 'Partner Fee - 24 trips', payout: '4.80', type: 'fee' },
          ];
        default:
          return [];
      }
    }
  };

  const handleBadgePress = (badgeName) => {
    // Toggle badge selection
    if (selectedBadge === badgeName) {
      setSelectedBadge(null);
    } else {
      setSelectedBadge(badgeName);
    }
  };

  // Handle transaction card press - navigate to receipt
  const handleTransactionPress = (transaction) => {
    // Navigate to receipt detail screen
    router.push('/wallet/PaymentDetail');
  };

  // Show ActiveDailyDetail for Day view with activity
  const showActiveDetail = activeFilter === 'Day' && hasActivity && parseFloat(getAmount()) > 0;

  const getCurrentDateLabel = () => {
    const index = getSelectedIndex();
    const data = getCurrentData();
    if (activeFilter === 'Day') {
      return `Mar ${data[index]?.label || '18'}`;
    } else if (activeFilter === 'Week') {
      return `${data[index]?.label || '2-8'} ${data[index]?.subLabel || 'Mar'}`;
    } else {
      return `${data[index]?.label || 'Jan'} ${data[index]?.subLabel || '2026'}`;
    }
  };

  const getSectionTitle = () => {
    const index = getSelectedIndex();
    const data = getCurrentData();
    
    // Check if it's the current day (for Day filter)
    if (activeFilter === 'Day' && data[index]?.isCurrent) {
      return 'Today';
    }
    
    if (activeFilter === 'Day') {
      // Format: "Wed - 20, Mar"
      const dayName = dailyData[index]?.subLabel || 'Wed';
      const dayNum = dailyData[index]?.label || '18';
      return `${dayName} - ${dayNum}, Mar`;
    } else if (activeFilter === 'Week') {
      // Format: "2-8, Jan"
      return `${weeklyData[index]?.label || '2-8'}, ${weeklyData[index]?.subLabel || 'Jan'}`;
    } else {
      // Format: "Jan 2026"
      return `${monthlyData[index]?.label || 'Jan'} ${monthlyData[index]?.subLabel || '2026'}`;
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={COLORS.text} />
        </Pressable>
        
        <View style={styles.filterContainer}>
          {['Day', 'Week', 'Month'].map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[styles.filterBtn, activeFilter === filter && styles.filterBtnActive]}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                {filter}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* AMOUNT DISPLAY */}
      <View style={styles.amountSection}>
        <Text style={styles.dateLabel}>{getCurrentDateLabel()}</Text>
        {parseFloat(getAmount()) > 0 ? (
          <>
            <Text style={styles.amountText}>GHS {getAmount()}</Text>
            <Text style={styles.tripsText}>{getTripCount()} trips</Text>
          </>
        ) : (
          <Text style={styles.noActivityText}>
            {activeFilter === 'Day' ? 'No activities about earnings for the day' : 
             activeFilter === 'Week' ? 'No activities about earnings for the week' : 
             'No activities about earnings for the month'}
          </Text>
        )}
        
        {/* Divider */}
        <View style={styles.divider} />
      </View>

      {/* ANALYTICS - Scrollable horizontal section - always show */}
      <View style={styles.analyticsSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.analyticsScroll}
        >
          {getAnalyticsData().map((item, index) => (
            <AnalyticsBar
              key={index}
              value={item.value}
              maxValue={getAnalyticsMaxValue()}
              label={item.label}
              subLabel={item.subLabel}
              active={index === getAnalyticsSelectedIndex()}
              onPress={() => handleAnalyticsPress(index)}
            />
          ))}
        </ScrollView>
      </View>

      {/* BREAKDOWN BADGES - Earnings Breakdown as badges in a container - always show */}
      <View style={styles.breakdownContainer}>
        <Text style={styles.breakdownTitle}>
          {selectedBadge ? `${selectedBadge} Breakdown` : 'Earnings Breakdown'}
        </Text>
        <View style={styles.badgesContainer}>
          <Pressable 
            style={[styles.badge, selectedBadge === 'Cash' && styles.badgeSelected]}
            onPress={() => handleBadgePress('Cash')}
          >
            <Text style={[styles.badgeLabel, selectedBadge === 'Cash' && styles.badgeLabelSelected]}>Cash</Text>
            <Text style={[styles.badgeValue, selectedBadge === 'Cash' && styles.badgeValueSelected]}>GHS {getBreakdown()?.cash || '0'}</Text>
          </Pressable>
          <Pressable 
            style={[styles.badge, selectedBadge === 'Bonus' && styles.badgeSelected]}
            onPress={() => handleBadgePress('Bonus')}
          >
            <Text style={[styles.badgeLabel, selectedBadge === 'Bonus' && styles.badgeLabelSelected]}>Bonus</Text>
            <Text style={[styles.badgeValue, selectedBadge === 'Bonus' && styles.badgeValueSelected]}>GHS {getBreakdown()?.bonuses || '0'}</Text>
          </Pressable>
          <Pressable 
            style={[styles.badge, styles.badgeNegative, selectedBadge === 'Service Fee' && styles.badgeSelectedNegative]}
            onPress={() => handleBadgePress('Service Fee')}
          >
            <Text style={[styles.badgeLabelNegative, selectedBadge === 'Service Fee' && styles.badgeLabelSelectedNegative]}>Service Fee</Text>
            <Text style={[styles.badgeValueNegative, selectedBadge === 'Service Fee' && styles.badgeValueSelectedNegative]}>-GHS {getBreakdown()?.serviceFee || '0'}</Text>
          </Pressable>
          <Pressable 
            style={[styles.badge, styles.badgeNegative, selectedBadge === 'Partner Fee' && styles.badgeSelectedNegative]}
            onPress={() => handleBadgePress('Partner Fee')}
          >
            <Text style={[styles.badgeLabelNegative, selectedBadge === 'Partner Fee' && styles.badgeLabelSelectedNegative]}>Partner Fee</Text>
            <Text style={[styles.badgeValueNegative, selectedBadge === 'Partner Fee' && styles.badgeValueSelectedNegative]}>-GHS {getBreakdown()?.partnerFee || '0'}</Text>
          </Pressable>
        </View>
      </View>

      {/* TRIP LIST - Scrollable - only show if there's activity */}
      {hasActivityForCurrentSelection && (
      <ScrollView style={styles.tripsSection} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          {selectedBadge ? `${selectedBadge} History` : getSectionTitle()}
        </Text>
        {selectedBadge && getBadgeHistory().length > 0 ? (
          <View>
            {getBadgeHistory().map((item, index) => (
              <Pressable key={index} style={styles.historyItem} onPress={() => router.push('/wallet/PaymentDetail')}>
                <View style={styles.transactionIcon}>
                  <Car size={16} color={COLORS.background} />
                </View>
                <View style={styles.historyDetails}>
                  <Text style={styles.historyTime}>{item.time}</Text>
                  <Text style={styles.historyLocation}>{item.location}</Text>
                </View>
                <Text style={[
                  styles.historyAmount,
                  item.type === 'fee' && styles.historyAmountNegative
                ]}>
                  {item.type === 'fee' ? '-GHS ' : 'GHS '}{item.payout}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <TripList trips={getTrips()} onTripPress={handleTransactionPress} />
        )}
      </ScrollView>
      )}
    </View>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  backBtn: {
    padding: 5,
  },
  filterContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 3,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.background,
  },
  amountSection: {
    alignItems: 'center',
    paddingTop: 20,
  },
  dateLabel: {
    color: COLORS.muted,
    fontSize: 14,
    marginBottom: 4,
  },
  amountText: {
    color: COLORS.text,
    fontSize: 40,
    fontWeight: '700',
  },
  tripsText: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 2,
  },
  noActivityText: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 16,
    marginBottom: 12,
  },
  analyticsSection: {
    paddingVertical: 8,
  },
  analyticsScroll: {
    paddingHorizontal: 20,
    gap: 16,
    justifyContent: 'center',
  },
  breakdownContainer: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  breakdownTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  badgeAnalyticsContainer: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  badgeAnalyticsTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  badgeAnalyticsScroll: {
    gap: 12,
    justifyContent: 'center',
  },
  badgeBarContainer: {
    alignItems: 'center',
    gap: 6,
  },
  badgeBar: {
    width: 32,
    height: 60,
    backgroundColor: COLORS.background,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  badgeBarFill: {
    width: '100%',
    borderRadius: 6,
  },
  badgeBarPositive: {
    backgroundColor: COLORS.primary,
  },
  badgeBarNegative: {
    backgroundColor: COLORS.error,
  },
  badgeBarLabel: {
    color: COLORS.muted,
    fontSize: 10,
  },
  badgeHistoryContainer: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  badgeHistoryTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  badgeHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  badgeHistoryDetails: {
    flex: 1,
  },
  badgeHistoryTime: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  badgeHistoryLocation: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 2,
  },
  badgeHistoryAmount: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  badgeHistoryAmountNegative: {
    color: COLORS.error,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  badgeSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  badgeSelectedNegative: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.error + '15',
  },
  badgeLabel: {
    color: COLORS.muted,
    fontSize: 12,
  },
  badgeLabelSelected: {
    color: COLORS.primary,
  },
  badgeLabelSelectedNegative: {
    color: COLORS.error,
  },
  badgeNegative: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  badgeLabel: {
    color: COLORS.muted,
    fontSize: 12,
  },
  badgeLabelNegative: {
    color: COLORS.error,
    fontSize: 12,
  },
  badgeValue: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeValueNegative: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '600',
  },
  breakdownCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  breakdownTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  breakdownItem: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownNegative: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  breakdownLabel: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  breakdownValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  breakdownValueNegative: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '600',
  },
  tripsSection: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  inlineAnalyticsContainer: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  inlineAnalyticsScroll: {
    gap: 12,
    justifyContent: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyDetails: {
    flex: 1,
    paddingHorizontal: 10,
  },
  historyTime: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  historyLocation: {
    color: COLORS.muted,
    fontSize: 11,
  },
  historyAmount: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  historyAmountNegative: {
    color: COLORS.error,
  },
});

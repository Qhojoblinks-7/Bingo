import React from 'react';
import { View, StyleSheet, ScrollView, Text, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { BinGoHeader } from '../../components/BinGoHeader';
import { BinGoInput } from '../../components/BinGoInput';
import { BinGoButton } from '../../components/BinGoButton';
import { BinSizePicker } from '../../components/BinSizePicker';
import { PaymentSelectionSheet } from '../../components/PaymentSelectionSheet';
import { SuccessModal } from '../../components/SuccessModal';
import { COLORS } from '../../constants/Colors';
import { useAppTheme } from '../../hooks/useThemeContext';
import { useRequestStore, useWalletStore, BinSizes, PaymentMethods } from '../../stores';

export default function RequestPickup() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const theme = isDark ? COLORS.dark : COLORS.light;
  
  // Use stores
  const { 
    address, binSize, notes, paymentMethod, isProcessing, error,
    setAddress, setBinSize, setNotes, setPaymentMethod, setProcessing, setError, reset 
  } = useRequestStore();
  const { balance, deductBalance, minimumPickupPrice } = useWalletStore();
  
  // Local UI state
  const [showBinPicker, setShowBinPicker] = React.useState(false);
  const [showPaymentSheet, setShowPaymentSheet] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showErrorBanner, setShowErrorBanner] = React.useState(false);

  // Bin options derived from store
  const binOptions = [
    { label: BinSizes.STANDARD.label, price: BinSizes.STANDARD.price, id: BinSizes.STANDARD.id },
    { label: BinSizes.LARGE.label, price: BinSizes.LARGE.price, id: BinSizes.LARGE.id },
    { label: BinSizes.EXTRA_LARGE.label, price: BinSizes.EXTRA_LARGE.price, id: BinSizes.EXTRA_LARGE.id },
  ];

  const selectedPrice = binOptions.find(o => o.id === binSize)?.price || '20';
  const hasSufficientBalance = parseFloat(balance) >= parseFloat(selectedPrice);

  const handleConfirm = () => {
    // Show payment selection sheet
    setShowPaymentSheet(true);
  };

  const handlePaymentConfirm = async () => {
    // Close payment sheet
    setShowPaymentSheet(false);
    
    // Start processing
    setProcessing(true);
    setError(null);
    setShowErrorBanner(false);

    // Client-side balance check
    if (!hasSufficientBalance) {
      setProcessing(false);
      setError('Insufficient balance. Please top up your wallet.');
      setShowErrorBanner(true);
      return;
    }

    try {
      // Simulate API call to Django backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success (in production: check for 201 Created)
      const success = true;
      
      if (success) {
        // Trigger haptic feedback
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Deduct from wallet if using wallet
        if (paymentMethod === 'wallet') {
          deductBalance(parseFloat(selectedPrice));
        }
        
        // Show success modal
        setProcessing(false);
        setShowSuccess(true);
      } else {
        throw new Error('No riders available');
      }
    } catch (err) {
      // Handle error
      setProcessing(false);
      setError('Sorry, no riders are currently active in your area. Please try again in a few minutes.');
      setShowErrorBanner(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    reset(); // Reset request store
    // Use replace to clear navigation history
    router.replace('/(tabs)/activity');
  };

  const handleDismissError = () => {
    setShowErrorBanner(false);
    setError(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <BinGoHeader 
        title="Pickup Details" 
        showBack={!isProcessing} 
        onBack={() => router.back()} 
      />

      {/* Error Banner */}
      {showErrorBanner && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={20} color={COLORS.white} />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={handleDismissError}>
            <Ionicons name="close" size={20} color={COLORS.white} />
          </Pressable>
        </View>
      )}

      {/* Loading Overlay */}
      {isProcessing && (
        <View style={[styles.loadingOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)' }]}>
          <View style={[styles.loadingCard, { backgroundColor: theme.card }]}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={[styles.loadingText, { color: theme.text }]}>Processing your request...</Text>
            <Text style={[styles.loadingSubtext, { color: COLORS.muted }]}>Connecting to rider network</Text>
          </View>
        </View>
      )}

      <ScrollView 
        contentContainerStyle={styles.content}
        scrollEnabled={!isProcessing}
      >
        {/* Step 1: Location */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Where is the bin?</Text>
          <BinGoInput
            label="Ghana Post GPS / Digital Address"
            placeholder="e.g. GA-123-4567"
            value={address}
            onChangeText={setAddress}
            editable={!isProcessing}
          />
          <View style={[styles.infoBox, { backgroundColor: isDark ? '#052e16' : '#ECFDF5' }]}>
            <Ionicons name="location" size={16} color={COLORS.primary} />
            <Text style={[styles.infoText, { color: COLORS.primary }]}>Your location helps the rider find you faster.</Text>
          </View>
        </View>

        {/* Step 2: Bin Size Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Bin Size</Text>
          <Pressable 
            style={[styles.binSelector, { backgroundColor: theme.card, borderColor: theme.border }]} 
            onPress={() => !isProcessing && setShowBinPicker(true)}
            disabled={isProcessing}
          >
            <View style={styles.binSelectorContent}>
              <View>
                <Text style={[styles.binSelectorLabel, { color: theme.text }]}>{binSize}</Text>
                <Text style={[styles.binSelectorHint, { color: COLORS.primary }]}>Tap to see dimensions</Text>
              </View>
              <View style={styles.binSelectorRight}>
                <Text style={[styles.binSelectorPrice, { color: theme.text }]}>GH₵ {selectedPrice}</Text>
                <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
              </View>
            </View>
          </Pressable>
        </View>

        {/* Step 3: Instructions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Additional Instructions</Text>
          <BinGoInput
            placeholder="e.g. The bin is near the generator..."
            value={notes}
            onChangeText={setNotes}
            multiline={true}
            numberOfLines={4}
            editable={!isProcessing}
          />
        </View>

        {/* Footer Action */}
        <View style={styles.footer}>
          <View style={styles.priceRow}>
            <Text style={[styles.totalLabel, { color: COLORS.muted }]}>Total Price</Text>
            <Text style={[styles.totalAmount, { color: theme.text }]}>
               GH₵ {selectedPrice}
            </Text>
          </View>
          
          {/* Insufficient Balance Error */}
          {error && !showErrorBanner && (
            <Text style={styles.balanceError}>{error}</Text>
          )}
          
          <BinGoButton 
            title="Confirm & Pay" 
            onPress={handleConfirm}
            loading={isProcessing}
            disabled={isProcessing}
          />
        </View>
      </ScrollView>

      {/* Bin Size Picker Sheet */}
      <BinSizePicker
        visible={showBinPicker}
        onClose={() => setShowBinPicker(false)}
        selectedSize={binOptions.find(o => o.label === binSize)?.id}
        onSelectSize={(id) => {
          const selected = binOptions.find(o => o.id === id);
          if (selected) setBinSize(selected.label);
        }}
      />

      {/* Payment Selection Sheet */}
      <PaymentSelectionSheet
        visible={showPaymentSheet}
        onClose={() => setShowPaymentSheet(false)}
        selectedMethod={paymentMethod}
        onSelectMethod={setPaymentMethod}
        walletBalance={balance}
        totalAmount={selectedPrice}
        onConfirm={handlePaymentConfirm}
      />

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccess}
        onClose={handleSuccessClose}
        title="Request Submitted!"
        message={`Your pickup request for GH₵ ${selectedPrice} has been confirmed. A rider will be assigned shortly.`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error,
    padding: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  errorText: {
    flex: 1,
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '500',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingCard: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '700',
  },
  loadingSubtext: {
    marginTop: 4,
    fontSize: 13,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginTop: -8,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '500',
  },
  binSelector: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  binSelectorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  binSelectorLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  binSelectorHint: {
    fontSize: 12,
    marginTop: 2,
  },
  binSelectorRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  binSelectorPrice: {
    fontSize: 18,
    fontWeight: '800',
  },
  footer: {
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  balanceError: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '800',
  },
});

import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, CreditCard, ChevronRight, X } from 'lucide-react-native';

// ============================================
// MORE BOTTOM SHEET COMPONENT
// Shows administrative financial options
// ============================================
export default function MoreBottomSheet({ visible, onClose }) {
  const router = useRouter();
  
  const menuItems = [
    { 
      id: 'payment-history',
      icon: Calendar, 
      label: 'Payment history',
      onPress: () => {
        onClose();
        router.push('/wallet/PaymentHistory');
      }
    },
    { 
      id: 'payout-details',
      icon: CreditCard, 
      label: 'Payout details',
      onPress: () => {
        onClose();
        router.push('/wallet/PayoutDetails');
      }
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.bottomSheet}>
              {/* Handle */}
              <View style={styles.handle} />
              
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.sheetTitle}>More</Text>
                <Pressable onPress={onClose} style={styles.closeButton}>
                  <X color="#8E8E93" size={24} />
                </Pressable>
              </View>
    
              {/* Menu Items */}
              {menuItems.map((item) => (
                <Pressable 
                  key={item.id} 
                  style={styles.sheetItem}
                  onPress={item.onPress}
                >
                  <View style={styles.iconContainer}>
                    <item.icon color="#FFF" size={20} />
                  </View>
                  <Text style={styles.sheetText}>{item.label}</Text>
                  <ChevronRight color="#333" size={20} />
                </Pressable>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    alignSelf: 'center',
    borderRadius: 2,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
    gap: 15,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetText: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

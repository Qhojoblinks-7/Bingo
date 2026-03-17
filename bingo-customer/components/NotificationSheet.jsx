import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';
import { useAppTheme } from '../hooks/useThemeContext';

export const NotificationSheet = ({ visible, onClose, notifications = [] }) => {
  const { isDark } = useAppTheme();
  const theme = isDark ? COLORS.dark : COLORS.light;

  // Default mock notifications - in production, this comes from your Django API
  const defaultNotifications = [
    { 
      id: '1', 
      type: 'status', 
      title: 'Rider Arrived!', 
      message: 'Your rider is at the gate for GA-123-4567.', 
      time: '2m ago', 
      icon: 'car-sport',
      color: '#10B981' 
    },
    { 
      id: '2', 
      type: 'payment', 
      title: 'Top-up Successful', 
      message: 'GH₵ 50.00 added to your wallet.', 
      time: '1h ago', 
      icon: 'checkmark-circle',
      color: '#3B82F6' 
    },
    { 
      id: '3', 
      type: 'info', 
      title: 'Holiday Notice', 
      message: 'Pickups may be delayed this Friday.', 
      time: '5h ago', 
      icon: 'information-circle',
      color: '#F59E0B' 
    },
  ];

  const displayNotifications = notifications.length > 0 ? notifications : defaultNotifications;

  const getIconName = (iconName) => {
    // Map icon names to Ionicons
    const iconMap = {
      'truck': 'car-sport',
      'checkmark-circle': 'checkmark-circle',
      'information-circle': 'information-circle',
      'alert-circle': 'alert-circle',
      'wallet': 'wallet',
      'time': 'time',
    };
    return iconMap[iconName] || 'notifications';
  };

  const renderItem = ({ item }) => (
    <View style={[styles.notiItem, { borderBottomColor: theme.border }]}>
      <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
        <Ionicons name={getIconName(item.icon)} size={20} color={item.color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.notiTitle, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.notiMsg, { color: COLORS.muted }]}>{item.message}</Text>
        <Text style={styles.notiTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <Modal 
      animationType="slide" 
      transparent={true} 
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerLeft}>
              <Ionicons name="notifications" size={24} color={theme.text} />
              <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={theme.text} />
            </Pressable>
          </View>

          <FlatList
            data={displayNotifications}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="notifications-outline" size={48} color={COLORS.muted} />
                <Text style={[styles.emptyText, { color: COLORS.muted }]}>No notifications yet</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: { 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    height: '60%', 
    padding: 20,
    paddingBottom: 40,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700' 
  },
  closeBtn: {
    padding: 4,
  },
  notiItem: { 
    flexDirection: 'row', 
    paddingVertical: 15, 
    borderBottomWidth: 1 
  },
  iconBox: { 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  textContainer: { 
    flex: 1 
  },
  notiTitle: { 
    fontSize: 15, 
    fontWeight: '700' 
  },
  notiMsg: { 
    fontSize: 13, 
    marginTop: 2, 
    lineHeight: 18 
  },
  notiTime: { 
    fontSize: 11, 
    color: '#9CA3AF', 
    marginTop: 4 
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
  },
});

export default NotificationSheet;

import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform } from 'react-native';
import { ShieldCheck, Zap } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/Colors';
import { TEXT_STYLES, SHADOWS } from '../../constants/Styles';

export const DutyHeader = ({ isOnline, onToggle }) => {
  
  const handleToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(
        isOnline 
          ? Haptics.NotificationFeedbackType.Warning 
          : Haptics.NotificationFeedbackType.Success
      );
    }
    onToggle();
  };

  return (
    <View style={[styles.container, SHADOWS.card]}>
      {/* LEFT: IDENTITY SECTION (Always Static) */}
      <View style={styles.profileGroup}>
        <View style={styles.avatarWrapper}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' }} 
            style={[
              styles.avatar, 
              { borderColor: isOnline ? COLORS.primary : COLORS.surfaceLight }
            ]} 
          />
          {isOnline && <View style={styles.onlinePulse} />}
        </View>
        
        <View>
          <Text style={TEXT_STYLES.body}>Pilot Kwesi</Text>
          <View style={styles.rankRow}>
            <ShieldCheck size={12} color={COLORS.primary} />
            <Text style={styles.rankText}>Gold Class</Text>
          </View>
        </View>
      </View>

      {/* RIGHT: PURE TOGGLE (Fixed size, no expansion) */}
      <Pressable 
        onPress={handleToggle}
        style={({ pressed }) => [
          styles.toggleBtn,
          isOnline ? styles.btnOnline : styles.btnOffline,
          pressed && { transform: [{ scale: 0.96 }] }
        ]}
      >
        <View style={styles.statusRow}>
          <Zap 
            size={14} 
            color={COLORS.text} 
            fill={isOnline ? COLORS.text : 'transparent'} 
          />
          <Text style={styles.toggleLabel}>
            {isOnline ? 'ON DUTY' : 'OFFLINE'}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: Platform.OS === 'ios' ? 0 : 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  profileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
  },
  onlinePulse: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rankText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  toggleBtn: {
    width: 110, // Fixed width prevents the layout from jumping
    height: 40,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnOnline: {
    backgroundColor: COLORS.primary,
  },
  btnOffline: {
    backgroundColor: COLORS.surfaceLight,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toggleLabel: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
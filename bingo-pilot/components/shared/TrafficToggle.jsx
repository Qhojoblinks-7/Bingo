import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Layers } from 'lucide-react-native';
import { COLORS } from '../../constants/Colors';
import { SHADOWS } from '../../constants/Styles';

export const TrafficToggle = ({ isEnabled, onToggle }) => (
  <Pressable 
    onPress={onToggle} 
    style={({ pressed }) => [
      styles.btn, 
      SHADOWS.card, 
      isEnabled && styles.btnActive,
      { opacity: pressed ? 0.7 : 1 }
    ]}
  >
    <Layers 
      size={22} 
      color={isEnabled ? COLORS.primary : COLORS.textMuted} 
    />
    {isEnabled && <View style={styles.activeDot} />}
  </Pressable>
);

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    right: 20,
    bottom: 200,
    backgroundColor: COLORS.surface,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  btnActive: {
    borderColor: COLORS.primary,
  },
  activeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  }
});

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Navigation } from 'lucide-react-native';
import { COLORS } from '../../constants/Colors';
import { SHADOWS } from '../../constants/Styles';

export const RecenterButton = ({ onPress }) => (
  <Pressable 
    onPress={onPress} 
    style={({ pressed }) => [
      styles.btn, 
      SHADOWS.card, 
      { opacity: pressed ? 0.7 : 1 }
    ]}
  >
    <Navigation size={24} color={COLORS.primary} />
  </Pressable>
);

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    right: 20,
    bottom: 140,
    backgroundColor: COLORS.surface,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  }
});

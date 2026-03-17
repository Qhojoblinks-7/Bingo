import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/Colors';

export const Skeleton = ({ width, height, borderRadius = 8, style }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: COLORS.border },
        style,
        { opacity },
      ]}
    />
  );
};

// Card skeleton for lists
export const CardSkeleton = ({ style }) => {
  return (
    <View style={[styles.cardSkeleton, style]}>
      <Skeleton width={48} height={48} borderRadius={24} />
      <View style={styles.cardContent}>
        <Skeleton width="60%" height={16} />
        <Skeleton width="40%" height={12} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
};

// List skeleton
export const ListSkeleton = ({ count = 3, style }) => {
  return (
    <View style={style}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} style={{ marginBottom: 12 }} />
      ))}
    </View>
  );
};

// Activity item skeleton
export const ActivitySkeleton = ({ style }) => {
  return (
    <View style={[styles.activitySkeleton, style]}>
      <View style={styles.activityHeader}>
        <Skeleton width={120} height={14} />
        <Skeleton width={60} height={20} borderRadius={10} />
      </View>
      <Skeleton width="80%" height={12} style={{ marginTop: 8 }} />
      <View style={styles.activityFooter}>
        <Skeleton width={100} height={12} />
        <Skeleton width={80} height={12} />
      </View>
    </View>
  );
};

// Profile skeleton
export const ProfileSkeleton = ({ style }) => {
  return (
    <View style={[styles.profileSkeleton, style]}>
      <Skeleton width={80} height={80} borderRadius={40} />
      <Skeleton width={150} height={20} style={{ marginTop: 16 }} />
      <Skeleton width={120} height={14} style={{ marginTop: 8 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  activitySkeleton: {
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  profileSkeleton: {
    alignItems: 'center',
    padding: 24,
  },
});

export default Skeleton;

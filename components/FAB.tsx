// components/FAB.tsx
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FABProps {
  onPress: () => void;
  icon?: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export default function FAB({ 
  onPress, 
  icon = "add", 
  size = 24, 
  color = "#fff",
  backgroundColor = "#0066cc" 
}: FABProps) {
  const [scaleValue] = useState(new Animated.Value(1));
  const [rotateValue] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(rotateValue, {
        toValue: 1,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(rotateValue, {
        toValue: 0,
        useNativeDriver: true,
      })
    ]).start();
  };

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          transform: [{ scale: scaleValue }],
          backgroundColor,
          shadowColor: backgroundColor,
        }
      ]}
    >
      <TouchableOpacity
        style={styles.fab}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name={icon as any} size={size} color={color} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fab: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
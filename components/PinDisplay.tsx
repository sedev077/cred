// components/PinDisplay.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface PinDisplayProps {
  length: number;
  value: string;
  error?: boolean;
}

export default function PinDisplay({ length, value, error = false }: PinDisplayProps) {
  const shakeAnimation = React.useRef(new Animated.Value(0)).current;
  const scaleAnimations = React.useRef(
    Array.from({ length }, () => new Animated.Value(1))
  ).current;

  useEffect(() => {
    if (error) {
      // Shake animation for error
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error]);

  useEffect(() => {
    // Animate the current pin digit
    if (value.length > 0) {
      const currentIndex = value.length - 1;
      if (currentIndex < scaleAnimations.length) {
        Animated.sequence([
          Animated.spring(scaleAnimations[currentIndex], {
            toValue: 1.2,
            useNativeDriver: true,
            tension: 500,
            friction: 10,
          }),
          Animated.spring(scaleAnimations[currentIndex], {
            toValue: 1,
            useNativeDriver: true,
            tension: 500,
            friction: 10,
          }),
        ]).start();
      }
    }
  }, [value.length]);

  const renderDots = () => {
    return Array.from({ length }).map((_, index) => {
      const isFilled = index < value.length;
      const isActive = index === value.length;

      return (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            isFilled && styles.filledDot,
            error && styles.errorDot,
            isActive && styles.activeDot,
            {
              transform: [{ scale: scaleAnimations[index] }],
            },
          ]}
        />
      );
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: shakeAnimation }],
        },
      ]}
    >
      {renderDots()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filledDot: {
    backgroundColor: '#0066cc',
  },
  activeDot: {
    borderColor: '#0066cc',
  },
  errorDot: {
    backgroundColor: '#ff6b6b',
  },
});
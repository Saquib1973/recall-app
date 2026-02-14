import { radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext'; // Import Hook
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.3)).current;
  const { colors, theme } = useTheme(); // Get theme mode

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Define placeholder color based on theme
  const placeholderColor = theme === 'dark' ? '#333' : '#E1E9EE';

  return (
    <Animated.View 
        style={[
            styles.card, 
            { 
                opacity, 
                backgroundColor: colors.card, // Dynamic Card Background
                // Optional: Add border in dark mode if you want it to match other cards
                borderWidth: theme === 'dark' ? 1 : 0,
                borderColor: 'rgba(255,255,255,0.1)'
            }
        ]}
    >
      {/* Fake Title Line */}
      <View style={[styles.titlePlaceholder, { backgroundColor: placeholderColor }]} />
      
      {/* Fake Description Lines */}
      <View style={[styles.descPlaceholder, { backgroundColor: placeholderColor }]} />
      <View style={[styles.descPlaceholder, { width: '60%', backgroundColor: placeholderColor }]} />

      {/* Fake Bottom Buttons */}
      <View style={styles.bottomRow}>
        <View style={[styles.pill, { backgroundColor: placeholderColor }]} />
        <View style={[styles.pill, { backgroundColor: placeholderColor }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacingX._20,
    borderRadius: radius._40,
    marginBottom: spacingY._15,
    height: 180,
    justifyContent: 'center',
  },
  titlePlaceholder: {
    height: 24,
    width: '50%',
    borderRadius: 4,
    marginBottom: 20,
  },
  descPlaceholder: {
    height: 14,
    width: '90%',
    borderRadius: 4,
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  pill: {
    width: 60,
    height: 30,
    borderRadius: 15,
  }
});
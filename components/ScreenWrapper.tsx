import { useTheme } from '@/context/ThemeContext'; // Import Hook
import type { ScreenWrapperProps } from '@/types';
import React from 'react';
import { Dimensions, Platform, StatusBar, View } from 'react-native';

const { height } = Dimensions.get('window');

const ScreenWrapper = ({
  style,
  children,
  barStyle, // Remove default here, calculate inside
  isModal = false,
}: ScreenWrapperProps) => {
  const { colors, theme } = useTheme(); // Use Theme

  // Dynamic status bar based on theme
  const nativeBarStyle = theme === 'dark' ? 'light-content' : 'dark-content';
  
  let paddingTop = Platform.OS == 'ios' ? height * 0.06 : 40;
  let paddingBottom = 0;
  if (isModal) {
    paddingTop = Platform.OS == 'ios' ? height * 0.02 : 45;
    paddingBottom = height * 0.02;
  }

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.background, // Dynamic Background
          paddingBottom,
          paddingTop,
        },
        style,
      ]}
    >
      <StatusBar barStyle={nativeBarStyle} backgroundColor={'transparent'} translucent />
      {children}
    </View>
  );
};

export default ScreenWrapper;
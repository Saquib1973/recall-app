import { useTheme } from '@/context/ThemeContext';
import type { TypoProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import React from 'react';
import { Text, type TextStyle } from 'react-native';

const Typo = ({
  size = 16,
  color, // Don't set default here
  fontWeight = '400',
  children,
  style,
  textProps = {},
}: TypoProps) => {
  const { colors } = useTheme();
  
  const textStyle: TextStyle = {
    fontSize: verticalScale(size),
    color: color || colors.text, // Use prop color OR theme text color
    fontWeight,
  };
  
  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;
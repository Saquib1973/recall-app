import { radius, spacingX } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import type { InputProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const Input = (props: InputProps) => {
  const [focused, setFocused] = useState(false);
  const { colors } = useTheme();

  return (
    <View
    style={[
      styles.container,
      { 
          backgroundColor: colors.inputBg, 
          borderColor: focused ? colors.primary : colors.inputBorder 
      },
      props.containerStyle,
    ]}
  >
      {props.icon && props.icon}
      <TextInput
        style={[styles.input, { color: colors.text }, props.inputStyle]} // Dynamic text
        placeholderTextColor={props.placeholderTextColor || colors.textLight}
        ref={props.inputRef && props.inputRef}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: verticalScale(52),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: radius._90,
    borderCurve: 'continuous',
    paddingHorizontal: spacingX._15,
    gap: spacingX._10,
  },
  input: {
    flex: 1,
    fontSize: verticalScale(14),
  },
});
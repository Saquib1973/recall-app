import { radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext'; // 1. Import Theme Hook
import type { InputProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const TextArea = (props: InputProps) => {
  const [focused, setFocused] = useState(false);
  const { colors } = useTheme(); // 2. Get dynamic colors

  return (
    <View
      style={[
        styles.container,
        {
          // 3. Use dynamic background and border
          backgroundColor: colors.inputBg,
          borderColor: focused ? colors.primary : colors.inputBorder,
        },
        props.containerStyle,
      ]}
    >
      <TextInput
        multiline={true}
        numberOfLines={4}
        style={[
            styles.input, 
            { color: colors.text }, // 4. Dynamic text color
            props.inputStyle
        ]}
        // 5. Dynamic placeholder color
        placeholderTextColor={props.placeholderTextColor || colors.textLight}
        ref={props.inputRef}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
    </View>
  );
};

export default TextArea;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: verticalScale(100),
    borderWidth: 1,
    borderRadius: radius._15,
    borderCurve: 'continuous',
    paddingVertical: spacingY._15,
    paddingHorizontal: spacingX._15,
    gap: spacingX._10,
  },
  input: {
    flex: 1,
    fontSize: verticalScale(14),
    textAlignVertical: 'top',
  },
});
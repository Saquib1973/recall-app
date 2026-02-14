import { colors, radius } from '@/constants/theme'
import type { ButtonProps } from '@/types'
import { verticalScale } from '@/utils/styling'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Loading from './Loading'

const Button = ({ style, onPress, children, loading = false }: ButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {!loading ? children : <Loading color={colors.white} />}
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius._90,
    borderCurve: 'continuous',
    height: verticalScale(52), // Match Input Height
    justifyContent: 'center',
    alignItems: 'center',
  },
})
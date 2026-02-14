import { colors } from '@/constants/theme'
import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type ActivityIndicatorProps
} from 'react-native'

const Loading = ({
  size = 'large',
  color = colors.primaryDark,
}: ActivityIndicatorProps) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={color} size={size} />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({})

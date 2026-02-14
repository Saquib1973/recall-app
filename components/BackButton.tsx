import { colors } from '@/constants/theme'
import type { BackButtonProps } from '@/types'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import { CaretLeftIcon } from 'phosphor-react-native'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

const BackButton = ({
  style,
  iconSize = 30,
  color = colors.white,
}: BackButtonProps) => {
  const router = useRouter()

  console.log(router.canGoBack())

  const backAction = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/');
    }
  }

    return (
      <TouchableOpacity
        onPress={backAction}
        style={[styles.button, style]}
      >
        <CaretLeftIcon size={verticalScale(iconSize)} color={color} weight="bold" />
      </TouchableOpacity>
    )
  }

  export default BackButton

  const styles = StyleSheet.create({
    button: {
      padding: verticalScale(6),
    },
  })

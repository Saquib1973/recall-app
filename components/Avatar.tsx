import { colors, radius } from '@/constants/theme'
import { getAvatarPath } from '@/services/imageService'
import type { AvatarProps } from '@/types'
import { verticalScale } from '@/utils/styling'
import { Image } from 'expo-image'
import React from 'react'
import { StyleSheet, View } from 'react-native'
const Avatar = ({ size = 40, uri, style, isGroup = false }: AvatarProps) => {
  return (
    <View
      style={[
        styles.avatar,
        {
          height: verticalScale(size),
          width: verticalScale(size),
          borderRadius: radius.full,
          borderWidth: 1,
          borderColor: colors.neutral500,
        },
        style,
      ]}
    >
      <Image
        transition={1000}
        source={getAvatarPath(uri, isGroup)}
        contentFit="cover"
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  )
}

export default Avatar

const styles = StyleSheet.create({
  avatar: {
    alignSelf: 'center',
    backgroundColor: colors.neutral200,
    height: verticalScale(47),
    width: verticalScale(47),
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.neutral100,
    overflow: 'hidden',
  },
})

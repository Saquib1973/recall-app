import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import BackButton from './BackButton';
import Typo from './Typo';

interface HeaderProps {
  title?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showBackButton?: boolean;
  children?: React.ReactNode;
  style?: any; // Allow overriding height
}

const Header = ({ title, leftIcon, rightIcon, showBackButton = true, children, style }: HeaderProps) => {
  return (
    <View style={[styles.container, style]}>
      
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          {leftIcon ? leftIcon : showBackButton ? <BackButton color={colors.white} /> : null}
        </View>

        {title && (
          <Typo size={26} fontWeight={'bold'} color={colors.white} style={styles.title}>
            {title}
          </Typo>
        )}

        <View style={styles.iconContainer}>
          {rightIcon}
        </View>
      </View>

      {children && (
        <View style={styles.bottomRow}>
          {children}
        </View>
      )}

    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'ios' ? 70 : 60,
    paddingBottom: spacingY._20,
    paddingHorizontal: spacingX._10,
    borderBottomLeftRadius: radius._30,
    borderBottomRightRadius: radius._30,
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 100,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10, // Spacing between title and search bar
  },
  bottomRow: {
    paddingTop: 5,
  },
  title: {
    textAlign: 'center',
    flex: 1,
  },
  iconContainer: {
    zIndex: 20,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
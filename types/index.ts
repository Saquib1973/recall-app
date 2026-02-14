import { ReactNode, RefObject } from "react";
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  ViewStyle,
} from "react-native";

export interface AvatarProps {
  size?: number;
  uri?: string;
  style?: StyleProp<ViewStyle>;
  isGroup?: boolean;
}

export interface BackButtonProps {
  style?: StyleProp<ViewStyle>;
  iconSize?: number;
  color?: string;
}

export interface ButtonProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  children: ReactNode;
  loading?: boolean;
}

export interface HeaderProps {
  title?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface InputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  icon?: ReactNode;
  inputRef?: RefObject<TextInput | null>;
}

export interface ScreenWrapperProps {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  showPattern?: boolean;
  parentStyle?: StyleProp<ViewStyle>;
  barStyle?: "light" | "dark";
  isModal?: boolean;
  bgOpacity?: number;
}

export interface TypoProps {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  textProps?: TextProps;
}

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Theme } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  testID,
}: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Theme.Colors.white : Theme.Colors.primary}
          size="small"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Theme.BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Theme.Layout.minTouchTarget,
    paddingHorizontal: Theme.Spacing.md,
    ...Theme.Shadows.sm,
  },
  
  // Variants
  primary: {
    backgroundColor: Theme.Colors.primary,
  },
  secondary: {
    backgroundColor: Theme.Colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  
  // Sizes
  sm: {
    paddingHorizontal: Theme.Spacing.sm,
    minHeight: 36,
  },
  md: {
    paddingHorizontal: Theme.Spacing.md,
    minHeight: Theme.Layout.buttonHeight,
  },
  lg: {
    paddingHorizontal: Theme.Spacing.lg,
    minHeight: 56,
  },
  
  // Text styles
  text: {
    fontFamily: Theme.Typography.fontFamily.semiBold,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    textAlign: 'center',
  },
  
  primaryText: {
    color: Theme.Colors.white,
    fontSize: Theme.Typography.fontSize.base,
  },
  secondaryText: {
    color: Theme.Colors.white,
    fontSize: Theme.Typography.fontSize.base,
  },
  outlineText: {
    color: Theme.Colors.primary,
    fontSize: Theme.Typography.fontSize.base,
  },
  ghostText: {
    color: Theme.Colors.primary,
    fontSize: Theme.Typography.fontSize.base,
  },
  
  smText: {
    fontSize: Theme.Typography.fontSize.sm,
  },
  mdText: {
    fontSize: Theme.Typography.fontSize.base,
  },
  lgText: {
    fontSize: Theme.Typography.fontSize.lg,
  },
  
  // States
  disabled: {
    backgroundColor: Theme.Colors.gray300,
    opacity: 0.6,
  },
  disabledText: {
    color: Theme.Colors.gray500,
  },
});
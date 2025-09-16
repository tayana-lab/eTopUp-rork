import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof Theme.Spacing;
  shadow?: keyof typeof Theme.Shadows;
  testID?: string;
}

export default function Card({
  children,
  style,
  padding = 'md',
  shadow = 'md',
  testID,
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        { padding: Theme.Spacing[padding] },
        Theme.Shadows[shadow],
        style,
      ]}
      testID={testID}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    borderWidth: 1,
    borderColor: Theme.Colors.borderLight,
  },
});
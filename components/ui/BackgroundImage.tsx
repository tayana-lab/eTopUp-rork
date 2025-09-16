import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/theme';

interface BackgroundImageProps {
  children: React.ReactNode;
  style?: any;
}

export default function BackgroundImage({ children, style }: BackgroundImageProps) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
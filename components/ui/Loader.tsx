import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal,
} from 'react-native';
import { Theme } from '@/constants/theme';

interface LoaderProps {
  visible: boolean;
  text?: string;
  overlay?: boolean;
  size?: 'small' | 'large';
  color?: string;
  testID?: string;
}

export default function Loader({
  visible,
  text,
  overlay = true,
  size = 'large',
  color = Theme.Colors.primary,
  testID,
}: LoaderProps) {
  if (!visible) return null;

  const content = (
    <View style={[styles.container, !overlay && styles.inline]} testID={testID}>
      <View style={styles.content}>
        <ActivityIndicator size={size} color={color} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </View>
  );

  if (overlay) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        {content}
      </Modal>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  inline: {
    backgroundColor: 'transparent',
    padding: Theme.Spacing.lg,
  },
  content: {
    backgroundColor: Theme.Colors.surface,
    padding: Theme.Spacing.lg,
    borderRadius: Theme.BorderRadius.lg,
    alignItems: 'center',
    minWidth: 120,
    ...Theme.Shadows.lg,
  },
  text: {
    marginTop: Theme.Spacing.sm,
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    textAlign: 'center',
  },
});
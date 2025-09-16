import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Theme } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export default function Input({
  label,
  error,
  containerStyle,
  required = false,
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          style,
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={Theme.Colors.textSecondary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.Spacing.md,
  },
  label: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.xs,
  },
  required: {
    color: Theme.Colors.error,
  },
  input: {
    height: Theme.Layout.inputHeight,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    borderRadius: Theme.BorderRadius.md,
    paddingHorizontal: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
    backgroundColor: Theme.Colors.surface,
    // Android-specific fixes
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  inputFocused: {
    borderColor: Theme.Colors.primary,
    borderWidth: 2,
    ...Theme.Shadows.sm,
  },
  inputError: {
    borderColor: Theme.Colors.error,
    borderWidth: 2,
  },
  errorText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.error,
    marginTop: Theme.Spacing.xs,
  },
});
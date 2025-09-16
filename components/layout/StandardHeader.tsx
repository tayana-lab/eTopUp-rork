import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { Theme } from '@/constants/theme';

interface StandardHeaderProps {
  title: string;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  testID?: string;
}

export default function StandardHeader({
  title,
  onBackPress,
  rightComponent,
  backgroundColor = Theme.Colors.primary,
  testID,
}: StandardHeaderProps) {
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor },
      ]}
      testID={testID}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={backgroundColor}
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color={Theme.Colors.white} />
        </TouchableOpacity>
        
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Theme.Shadows.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.borderLight,
  },
  header: {
    height: Theme.Layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.Spacing.md,
  },
  backButton: {
    width: Theme.Layout.minTouchTarget,
    height: Theme.Layout.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -Theme.Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.white,
    textAlign: 'center',
    marginHorizontal: Theme.Spacing.sm,
  },
  rightContainer: {
    width: Theme.Layout.minTouchTarget,
    alignItems: 'flex-end',
  },
});
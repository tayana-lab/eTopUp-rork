import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Eye, EyeOff, Menu, User } from 'lucide-react-native';
import { Theme } from '@/constants/theme';

interface DashboardHeaderProps {
  customerName: string;
  customerBalance?: number;
  isBalanceVisible?: boolean;
  profileImage?: string;
  onProfilePress: () => void;
  onNotificationPress: () => void;
  onToggleBalance?: () => void;
  onMenuPress: () => void;
  notificationCount?: number;
  backgroundColor?: string;
  testID?: string;
}

export default function DashboardHeader({
  customerName,
  customerBalance,
  isBalanceVisible = false,
  profileImage,
  onProfilePress,
  onNotificationPress,
  onToggleBalance,
  onMenuPress,
  notificationCount = 0,
  backgroundColor = Theme.Colors.primary,
  testID,
}: DashboardHeaderProps) {
  const insets = useSafeAreaInsets();

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
          style={styles.menuButton}
          onPress={onMenuPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Menu size={24} color={Theme.Colors.white} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.profileSection}
          //onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <User size={24} color={Theme.Colors.white} />
              </View>
            )}
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName} numberOfLines={1}>
               John Doe
            </Text>
            {customerBalance !== undefined && (
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Balance: </Text>
                <Text style={styles.balanceAmount}>
                  {isBalanceVisible ? `SCR ${customerBalance.toFixed(2)}` : '••••••'}
                </Text>
                {onToggleBalance && (
                  <TouchableOpacity
                    onPress={onToggleBalance}
                    style={styles.eyeButton}
                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                  >
                    {isBalanceVisible ? (
                      <EyeOff size={16} color="rgba(255, 255, 255, 0.6)" />
                    ) : (
                      <Eye size={16} color="rgba(255, 255, 255, 0.6)" />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={onNotificationPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Bell size={24} color={Theme.Colors.white} />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>
                {notificationCount > 99 ? '99+' : notificationCount.toString()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
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
  menuButton: {
    width: Theme.Layout.minTouchTarget,
    height: Theme.Layout.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.Spacing.sm,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Theme.Spacing.sm,
  },
  profileImageContainer: {
    marginRight: Theme.Spacing.sm,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.white,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  balanceLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  balanceAmount: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.white,
  },
  eyeButton: {
    marginLeft: Theme.Spacing.xs,
    padding: 2,
  },
  notificationButton: {
    width: Theme.Layout.minTouchTarget,
    height: Theme.Layout.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Theme.Colors.error,
    borderRadius: Theme.BorderRadius.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationCount: {
    fontSize: 10,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.white,
  },
});
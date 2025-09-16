import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { 
  Bell, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  Gift,
  Trash2,
  ChartArea,
} from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import StandardLayout from '@/components/layout/StandardLayout';
import Button from '@/components/ui/Button';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'promotion';
  timestamp: string;
  isRead: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Package Activated',
    message: 'Your Standard Plan has been successfully activated. Enjoy 5GB data for 30 days.',
    type: 'success',
    timestamp: '2 hours ago',
    isRead: false,
  },
  {
    id: '2',
    title: 'Special Offer',
    message: 'Get 50% off on all premium packages this weekend! Limited time offer.',
    type: 'promotion',
    timestamp: '1 day ago',
    isRead: false,
  },
  {
    id: '3',
    title: 'Low Balance Alert',
    message: 'Your account balance is running low. Top up now to avoid service interruption.',
    type: 'warning',
    timestamp: '2 days ago',
    isRead: true,
  },
  {
    id: '4',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM. Services may be temporarily unavailable.',
    type: 'info',
    timestamp: '3 days ago',
    isRead: true,
  },
  {
    id: '5',
    title: 'Payment Successful',
    message: 'Your payment of SCR 150 has been processed successfully. Thank you!',
    type: 'success',
    timestamp: '1 week ago',
    isRead: false,
  },
  {
    id: '6',
    title: 'New Feature Available',
    message: 'Check out our new mobile app features including enhanced security and faster transactions.',
    type: 'info',
    timestamp: '1 week ago',
    isRead: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'promotion':
        return Gift;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return Theme.Colors.success;
      case 'warning':
        return Theme.Colors.warning;
      case 'promotion':
        return Theme.Colors.secondary;
      default:
        return Theme.Colors.info;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => prev.filter(notification => notification.id !== id));
          },
        },
      ]
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') {
      return !notification.isRead;
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderNotification = (notification: NotificationItem) => {
    const IconComponent = getNotificationIcon(notification.type);
    const iconColor = getNotificationColor(notification.type);

    return (
      <TouchableOpacity
        key={notification.id}
        style={[
          styles.notificationCard,
          !notification.isRead && styles.unreadCard,
        ]}
        onPress={() => !notification.isRead && markAsRead(notification.id)}
        activeOpacity={0.7}
      >
        <View style={styles.notificationHeader}>
          <View style={styles.iconContainer}>
            <IconComponent size={24} color={iconColor} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={[
              styles.notificationTitle,
              !notification.isRead && styles.unreadTitle,
            ]}>
              {notification.title}
            </Text>
            <Text style={styles.notificationMessage}>
              {notification.message}
            </Text>
            <Text style={styles.notificationTimestamp}>
              {notification.timestamp}
            </Text>
          </View>
          <View style={styles.notificationActions}>
            {!notification.isRead && (
              <View style={styles.unreadDot} />
            )}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => deleteNotification(notification.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Trash2 size={18} color={Theme.Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <StandardLayout title="Notifications">
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'all' && styles.activeFilterButton,
              ]}
              onPress={() => setFilter('all')}
            >
              <Text style={[
                styles.filterButtonText,
                filter === 'all' && styles.activeFilterButtonText,
              ]}>
                All ({notifications.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'unread' && styles.activeFilterButton,
              ]}
              onPress={() => setFilter('unread')}
            >
              <Text style={[
                styles.filterButtonText,
                filter === 'unread' && styles.activeFilterButtonText,
              ]}>
                Unread ({unreadCount})
              </Text>
            </TouchableOpacity>
          </View>
          
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={markAllAsRead}
            >
              <ChartArea size={16} color={Theme.Colors.primary} />
              <Text style={styles.markAllButtonText}>Mark All Read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredNotifications.length > 0 ? (
            <View style={styles.notificationsContainer}>
              {filteredNotifications.map(renderNotification)}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Bell size={64} color={Theme.Colors.textTertiary} />
              <Text style={styles.emptyStateTitle}>
                {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
              </Text>
              <Text style={styles.emptyStateMessage}>
                {filter === 'unread' 
                  ? 'All caught up! You have no unread notifications.'
                  : 'You have no notifications at the moment.'
                }
              </Text>
            </View>
          )}
        </ScrollView>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.Spacing.md,
    backgroundColor: Theme.Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.borderLight,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: Theme.Spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
    borderRadius: Theme.BorderRadius.md,
    backgroundColor: Theme.Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },
  activeFilterButton: {
    backgroundColor: Theme.Colors.primary,
    borderColor: Theme.Colors.primary,
  },
  filterButtonText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textSecondary,
  },
  activeFilterButtonText: {
    color: Theme.Colors.white,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.Spacing.xs,
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: Theme.Spacing.xs,
  },
  markAllButtonText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Theme.Spacing.md,
  },
  notificationsContainer: {
    gap: Theme.Spacing.sm,
  },
  notificationCard: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.md,
    borderWidth: 1,
    borderColor: Theme.Colors.borderLight,
    ...Platform.select({
      ios: {
        ...Theme.Shadows.sm,
      },
      android: {
        elevation: 0,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.08)',
      },
    }),
  },
  unreadCard: {
    borderColor: Theme.Colors.primary,
    backgroundColor: Theme.Colors.primary + '05',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Theme.Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Theme.BorderRadius.lg,
    backgroundColor: Theme.Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.xs,
  },
  unreadTitle: {
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },
  notificationMessage: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    lineHeight: Theme.Typography.lineHeight.normal * Theme.Typography.fontSize.sm,
    marginBottom: Theme.Spacing.xs,
  },
  notificationTimestamp: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.textTertiary,
  },
  notificationActions: {
    alignItems: 'center',
    gap: Theme.Spacing.sm,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.Colors.primary,
  },
  actionButton: {
    padding: Theme.Spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Theme.Spacing.xl * 2,
  },
  emptyStateTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginTop: Theme.Spacing.lg,
    marginBottom: Theme.Spacing.sm,
  },
  emptyStateMessage: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Theme.Typography.lineHeight.relaxed * Theme.Typography.fontSize.base,
    maxWidth: 280,
  },
});
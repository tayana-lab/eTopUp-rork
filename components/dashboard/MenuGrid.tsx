import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { 
  Heart, 
  Plus, 
  Smartphone, 
  Package, 
  CreditCard, 
  Receipt,
  Wifi,
  Star,
  DollarSign,
  Zap,
  Warehouse,
  ClipboardList,
  CardSim
} from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { AppConfig } from '@/constants/config';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  notificationCount?: number;
  onPress: () => void;
}

interface MenuGridProps {
  items: MenuItem[];
  favorites?: string[];
  onAddToFavorites?: (itemId: string) => void;
  onRemoveFromFavorites?: (itemId: string) => void;
  testID?: string;
}

export default function MenuGrid({ 
  items, 
  favorites = [], 
  onAddToFavorites, 
  onRemoveFromFavorites, 
  testID 
}: MenuGridProps) {
  const itemsPerRow = AppConfig.menuIcons.itemsPerRow;
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'smartphone':
        return Smartphone;
      case 'package':
        return Package;
      case 'creditcard':
        return CreditCard;
      case 'receipt':
        return Receipt;
      case 'wifi':
        return Wifi;
      case 'dollarsign':
        return DollarSign;
      case 'zap':
        return Zap;
      case 'warehouse':
        return Warehouse;
      case 'sim':
        return CardSim;
      case 'clipboardlist':
        return ClipboardList;
      default:
        return Smartphone;
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const isFavorite = favorites.includes(item.id);
    const IconComponent = getIconComponent(item.icon);
    
    return (
      <View key={item.id} style={styles.menuItemContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <IconComponent size={40} color={Theme.Colors.primary} />
            {AppConfig.menuIcons.showNotificationBadge && item.notificationCount && item.notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>
                  {item.notificationCount > 99 ? '99+' : item.notificationCount.toString()}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.menuTitle} numberOfLines={2}>
            {item.title}
          </Text>
        </TouchableOpacity>
        
        {(onAddToFavorites || onRemoveFromFavorites) && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => {
              if (isFavorite && onRemoveFromFavorites) {
                onRemoveFromFavorites(item.id);
              } else if (!isFavorite && onAddToFavorites) {
                onAddToFavorites(item.id);
              }
            }}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          >
            {isFavorite ? (
              <Star size={16} color={Theme.Colors.error} fill={Theme.Colors.error} />
            ) : (
              <Star size={16} color={Theme.Colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderRow = (rowItems: MenuItem[], rowIndex: number) => (
    <View key={rowIndex} style={styles.row}>
      {rowItems.map(renderMenuItem)}
      {/* Fill empty spaces in the last row */}
      {rowItems.length < itemsPerRow &&
        Array.from({ length: itemsPerRow - rowItems.length }).map((_, index) => (
          <View key={`empty-${index}`} style={styles.menuItemContainer} />
        ))}
    </View>
  );

  const rows = [];
  for (let i = 0; i < items.length; i += itemsPerRow) {
    rows.push(items.slice(i, i + itemsPerRow));
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      testID={testID}
    >
      <View style={styles.grid}>
        {rows.map((rowItems, index) => renderRow(rowItems, index))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Theme.Spacing.md,
  },
  grid: {
    paddingVertical: Theme.Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.Spacing.md,
  },
  menuItemContainer: {
    flex: 1,
    marginHorizontal: Theme.Spacing.xs,
    position: 'relative',
  },
  menuItem: {
    alignItems: 'center',
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.sm,
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    ...Theme.Shadows.sm,
    height:110,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.Shadows.sm,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: Theme.Spacing.sm,
  },

  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Theme.Colors.error,
    borderRadius: Theme.BorderRadius.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationText: {
    fontSize: 10,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.white,
  },
  menuTitle: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textPrimary,
    textAlign: 'center',
    lineHeight: Theme.Typography.lineHeight.tight * Theme.Typography.fontSize.sm,
  },
});
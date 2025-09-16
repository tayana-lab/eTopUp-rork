import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { 
  Smartphone, 
  Package, 
  CreditCard, 
  Receipt,
  DollarSign,
  Zap,
  Warehouse,
  ClipboardList,
  CardSim
} from 'lucide-react-native';
import { router } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useTheme } from '@/contexts/ThemeContext';
import DashboardHeader from '@/components/layout/DashboardHeader';
import MarketingCarousel from '@/components/dashboard/MarketingCarousel';
import MenuGrid from '@/components/dashboard/MenuGrid';
import HamburgerMenu from '@/components/layout/HamburgerMenu';
import BackgroundImage from '@/components/ui/BackgroundImage';

// Mock data
const mockAds = [
  {
    id: '1',
    image: 'https://www.cwseychelles.com/system/home_carousel_banners/images/000/000/034/original/Roaming_Data_Booster_%281%29.png?1736417939',
    title: 'Roaming Data Booster',
    description: 'Stay connected while traveling',
  },
  {
    id: '2',
    image: 'https://www.cwseychelles.com/system/home_carousel_banners/images/000/000/015/original/JUMBO_AD_Banner.jpg?1724080867',
    title: 'Jumbo Packages',
    description: 'Get more value with our jumbo deals',
  },
  {
    id: '3',
    image: 'https://www.cwseychelles.com/system/home_carousel_banners/images/000/000/020/original/5G_Unlimited_Website_Banner.jpg?1728471750',
    title: '5G Unlimited',
    description: 'Experience blazing fast 5G speeds',
  },
  {
    id: '4',
    image: 'https://www.cwseychelles.com/system/home_carousel_banners/images/000/000/027/original/2.png?1733303933',
    title: 'Special Promotion',
    description: 'Limited time offers available',
  },
];

const mockMenuItems = [
  {
    id: '1',
    title: 'Purchase Package',
    icon: 'package',
    onPress: () => router.push('/purchase-packages'),
  },
  {
    id: '2',
    title: 'Bill Pay',
    icon: 'receipt',
    onPress: () => router.push('/bill-pay'),
  },
  {
    id: '3',
    title: 'TopUp',
    icon: 'zap',
    onPress: () => router.push('/topup'),
  },
  {
    id: '4',
    title: 'SIM Inventory',
    icon: 'warehouse',
    onPress: () => router.push('/sim-inventory'),
  },
  {
    id: '5',
    title: 'SIM Sale',
    icon: 'sim',
    onPress: () => router.push('/sim-sale'),
  },
  {
    id: '6',
    title: 'Job Card',
    icon: 'clipboardlist',
    onPress: () => router.push('/job-card'),
  },

];

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const { favoriteItems, addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { colors, theme } = useTheme();
  const [notificationCount] = useState(5);
  const [customerBalance] = useState(1250.75);
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleMenuPress = () => {
    setIsMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setIsMenuVisible(false);
  };

  const handleProfilePress = () => {
    Alert.alert(
      'Profile Menu',
      'Choose an option',
      [
        { text: 'View Profile', onPress: () => console.log('View Profile') },
        { text: 'Settings', onPress: () => console.log('Settings') },
        { text: 'Logout', onPress: logout, style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  const handleAdPress = (ad: any) => {
    Alert.alert('Marketing Ad', `Clicked on: ${ad.title}`);
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const handleAddToFavorites = async (itemId: string) => {
    const menuItem = mockMenuItems.find(item => item.id === itemId);
    if (menuItem) {
      const favoriteItem = {
        id: itemId,
        title: menuItem.title,
        icon: menuItem.icon,
        type: 'menu' as const,
        onPress: menuItem.onPress,
      };
      await addToFavorites(favoriteItem);
    }
  };

  const handleRemoveFromFavorites = async (itemId: string) => {
    await removeFromFavorites(itemId);
  };

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
      case 'dollarsign':
        return DollarSign;
      case 'zap':
        return Zap;
      case 'sim':
        return CardSim;
      case 'warehouse':
        return Warehouse;
      case 'clipboardlist':
        return ClipboardList;
      default:
        return Smartphone;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: theme.Spacing.lg,
    },
    favoritesSection: {
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
      paddingVertical: theme.Spacing.sm,
      marginBottom: theme.Spacing.xs,
    },
    favoritesTitle: {
      fontSize: theme.Typography.fontSize.sm,
      fontWeight: theme.Typography.fontWeight.semiBold,
      color: colors.textSecondary,
      paddingHorizontal: theme.Spacing.md,
      marginBottom: theme.Spacing.xs,
    },
    favoritesScrollView: {
      paddingHorizontal: theme.Spacing.md,
    },
    favoritesScrollContent: {
      flexDirection: 'row',
      gap: theme.Spacing.md,
      paddingRight: theme.Spacing.md,
    },
    favoriteItem: {
      alignItems: 'center',
      width: 70,
    },
    favoriteButton: {
      width: 60,
      height: 60,
      borderRadius: theme.BorderRadius.lg,
      backgroundColor: colors.surfaceSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.Shadows.sm,
      marginBottom: theme.Spacing.xs,
    },

    favoriteTitle: {
      fontSize: theme.Typography.fontSize.xs,
      fontWeight: theme.Typography.fontWeight.medium,
      color: colors.textSecondary,
      textAlign: 'center',
      width: 70,
      lineHeight: theme.Typography.fontSize.xs * 1.3,
    },
  });

  return (
    <BackgroundImage style={styles.container}>
        <DashboardHeader
          customerName={user?.name || 'Guest User'}
          customerBalance={customerBalance}
          isBalanceVisible={isBalanceVisible}
          profileImage={user?.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
          onProfilePress={handleProfilePress}
          onNotificationPress={handleNotificationPress}
          onToggleBalance={toggleBalanceVisibility}
          onMenuPress={handleMenuPress}
          notificationCount={notificationCount}
        />
        
        <View style={styles.content}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <MarketingCarousel
              ads={mockAds}
              onAdPress={handleAdPress}
            />
            
            <MenuGrid 
              items={mockMenuItems} 
              favorites={favoriteItems.map(item => item.id)}
              onAddToFavorites={handleAddToFavorites}
              onRemoveFromFavorites={handleRemoveFromFavorites}
            />
          </ScrollView>
          
          {favoriteItems.length > 0 && (
            <View style={styles.favoritesSection}>
              <Text style={styles.favoritesTitle}>Favorites</Text>
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.favoritesScrollContent}
                style={styles.favoritesScrollView}
              >
                {favoriteItems.map((item) => {
                  const IconComponent = getIconComponent(item.icon);
                  return (
                    <View key={item.id} style={styles.favoriteItem}>
                      <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={item.onPress}
                        activeOpacity={0.7}
                      >
                        <IconComponent size={24} color={colors.primary} />
                      </TouchableOpacity>
                      <Text style={styles.favoriteTitle} numberOfLines={2}>
                        {item.title}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>
        
        <HamburgerMenu
          visible={isMenuVisible}
          onClose={handleCloseMenu}
        />
    </BackgroundImage>
  );
}
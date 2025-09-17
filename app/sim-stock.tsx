import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Smartphone, Plus, Minus, AlertTriangle, Package,CardSim } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { Theme } from '@/constants/theme';
import BackgroundImage from '@/components/ui/BackgroundImage';
import StandardLayout from '@/components/layout/StandardLayout';

interface StockItem {
  id: string;
  date: string;
  time: string;
  type: 'addition' | 'sale' | 'damaged';
  quantity: number;
  description: string;
}

const mockStockData: StockItem[] = [
  {
    id: '1',
    date: '2025-09-18',
    time: '14:30:25',
    type: 'addition',
    quantity: 50,
    description: 'Stock replenishment',
  },
  {
    id: '2',
    date: '2024-09-17',
    time: '11:45:12',
    type: 'sale',
    quantity: 5,
    description: 'Customer purchase',
  },
  {
    id: '3',
    date: '2024-09-16',
    time: '16:20:08',
    type: 'damaged',
    quantity: 2,
    description: 'Defective units',
  },
  {
    id: '4',
    date: '2024-09-15',
    time: '09:15:33',
    type: 'sale',
    quantity: 8,
    description: 'Bulk sale',
  },
  {
    id: '5',
    date: '2024-09-14',
    time: '13:55:47',
    type: 'addition',
    quantity: 25,
    description: 'New stock arrival',
  },
];

const currentStock = 89; // Mock current stock

export default function SimStockScreen() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'addition':
        return Plus;
      case 'sale':
        return Minus;
      case 'damaged':
        return AlertTriangle;
      default:
        return Package;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'addition':
        return Theme.Colors.success;
      case 'sale':
        return Theme.Colors.primary;
      case 'damaged':
        return Theme.Colors.error;
      default:
        return Theme.Colors.textSecondary;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'addition':
        return 'Addition';
      case 'sale':
        return 'Sale';
      case 'damaged':
        return 'Damaged';
      default:
        return 'Unknown';
    }
  };

  const renderStockItem = (item: StockItem, index: number) => {
    const isLast = index === mockStockData.length - 1;
    const IconComponent = getTypeIcon(item.type);
    const typeColor = getTypeColor(item.type);
    const typeText = getTypeText(item.type);
    
    return (
      <View key={item.id} style={[styles.stockItem, isLast && styles.stockItemLast]}>
        <View style={styles.stockItemContent}>
          <View style={styles.stockItemLeft}>
            <View style={[styles.typeIconContainer, { backgroundColor: typeColor }]}>
              <IconComponent size={20} color={Theme.Colors.white} />
            </View>
            <View style={styles.stockInfo}>
              <View style={styles.dateTimeContainer}>
                <Text style={styles.dateText}>{item.date}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
          </View>
          
          <View style={styles.stockChangeContainer}>
            <Text style={[styles.typeText, { color: typeColor }]}>{typeText}</Text>
            <Text style={styles.quantityText}>{item.quantity} units</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StandardLayout title="SIM Stock">
        <BackgroundImage style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Stats Overview */}
            <View style={styles.statsOverview}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <CardSim size={24} color={Theme.Colors.primary} />
                </View>
                <Text style={styles.statValue}>{currentStock}</Text>
                <Text style={styles.statLabel}>Current Stock</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Package size={24} color={Theme.Colors.success} />
                </View>
                <Text style={styles.statValue}>{mockStockData.length}</Text>
                <Text style={styles.statLabel}>Transactions</Text>
              </View>
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Stock History</Text>
              <Text style={styles.headerSubtitle}>SIM card inventory updates</Text>
            </View>

            {/* Stock List */}
            <View style={styles.stockContainer}>
              {mockStockData.map((item, index) => renderStockItem(item, index))}
            </View>
          </ScrollView>
        </BackgroundImage>
      </StandardLayout>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.gray50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Theme.Spacing.md,
    paddingBottom: Theme.Spacing['2xl'],
  },
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.Spacing.xl,
    gap: Theme.Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.xl,
    padding: Theme.Spacing.lg,
    alignItems: 'center',
    ...Theme.Shadows.sm,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Theme.BorderRadius.full,
    backgroundColor: Theme.Colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  statValue: {
    fontSize: Theme.Typography.fontSize['2xl'],
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.xs,
  },
  statLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  header: {
    marginBottom: Theme.Spacing.xl,
  },
  headerTitle: {
    fontSize: Theme.Typography.fontSize['2xl'],
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  stockContainer: {
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.xl,
    marginBottom: Theme.Spacing.xl,
    ...Theme.Shadows.md,
    overflow: 'hidden',
  },
  stockItem: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.gray100,
  },
  stockItemLast: {
    borderBottomWidth: 0,
  },
  stockItemContent: {
    padding: Theme.Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: Theme.BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.Spacing.md,
  },
  stockInfo: {
    flex: 1,
  },
  dateTimeContainer: {
    marginBottom: Theme.Spacing.xs,
  },
  dateText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
  },
  timeText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  descriptionText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  stockChangeContainer: {
    alignItems: 'flex-end',
  },
  typeText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    marginBottom: Theme.Spacing.xs,
  },
  quantityText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textPrimary,
  },
});
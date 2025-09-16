import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { DollarSign, Smartphone, Package, Zap, TrendingUp, BarChart3 } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import BackgroundImage from '@/components/ui/BackgroundImage';
import StandardLayout from '@/components/layout/StandardLayout';

interface SaleItem {
  id: string;
  service: string;
  amount: number;
  icon: string;
  color: string;
}

const mockSaleData: SaleItem[] = [
  {
    id: '1',
    service: 'TopUp',
    amount: 5500,
    icon: 'zap',
    color: '#3B82F6',
  },
  {
    id: '2',
    service: 'Package Purchase',
    amount: 4200,
    icon: 'package',
    color: '#10B981',
  },
  {
    id: '3',
    service: 'SIM Sale',
    amount: 2000,
    icon: 'smartphone',
    color: '#F59E0B',
  },
];

const totalAmount = mockSaleData.reduce((sum, item) => sum + item.amount, 0);

export default function TotalSaleScreen() {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'zap':
        return Zap;
      case 'package':
        return Package;
      case 'smartphone':
        return Smartphone;
      default:
        return DollarSign;
    }
  };

  const renderSaleItem = (item: SaleItem, index: number) => {
    const IconComponent = getIconComponent(item.icon);
    const isLast = index === mockSaleData.length - 1;
    
    return (
      <View key={item.id} style={[styles.saleItem, isLast && styles.saleItemLast]}>
        <View style={styles.saleItemContent}>
          <View style={styles.saleItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
              <IconComponent size={24} color={Theme.Colors.white} />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{item.service}</Text>
              <Text style={styles.serviceSubtitle}>Sales Revenue</Text>
            </View>
          </View>
          
          <View style={styles.saleAmountContainer}>
            <Text style={styles.saleAmount}>SCR {item.amount.toLocaleString()}</Text>
            <View style={styles.trendContainer}>
              <TrendingUp size={14} color={Theme.Colors.success} />
              <Text style={styles.trendText}>+12%</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <StandardLayout title="Total Sale">
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
                <BarChart3 size={24} color={Theme.Colors.primary} />
              </View>
              <Text style={styles.statValue}>{mockSaleData.length}</Text>
              <Text style={styles.statLabel}>Services</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <TrendingUp size={24} color={Theme.Colors.success} />
              </View>
              <Text style={styles.statValue}>+15%</Text>
              <Text style={styles.statLabel}>Growth</Text>
            </View>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Sales Breakdown</Text>
            <Text style={styles.headerSubtitle}>Revenue by service category</Text>
          </View>

          {/* Sales List */}
          <View style={styles.salesContainer}>
            {mockSaleData.map((item, index) => renderSaleItem(item, index))}
          </View>

          {/* Total Section */}
          <View style={styles.totalSection}>
            <View style={styles.totalCard}>
              <View style={styles.totalCardHeader}>
                <View style={styles.totalIconWrapper}>
                  <DollarSign size={32} color={Theme.Colors.white} />
                </View>
                <View style={styles.totalTextContainer}>
                  <Text style={styles.totalLabel}>Total Revenue</Text>
                  <Text style={styles.totalPeriod}>This Month</Text>
                </View>
              </View>
              <Text style={styles.totalAmount}>SCR {totalAmount.toLocaleString()}</Text>
              <View style={styles.totalFooter}>
                <View style={styles.totalTrend}>
                  <TrendingUp size={16} color={Theme.Colors.white} />
                  <Text style={styles.totalTrendText}>+8.2% from last month</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </BackgroundImage>
    </StandardLayout>
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
  salesContainer: {
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.xl,
    marginBottom: Theme.Spacing.xl,
    ...Theme.Shadows.md,
    overflow: 'hidden',
  },
  saleItem: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.gray100,
  },
  saleItemLast: {
    borderBottomWidth: 0,
  },
  saleItemContent: {
    padding: Theme.Spacing.lg,
  },
  saleItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: Theme.BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.Spacing.md,
    ...Theme.Shadows.sm,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.xs,
  },
  serviceSubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  saleAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saleAmount: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.gray50,
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: Theme.Spacing.xs,
    borderRadius: Theme.BorderRadius.md,
  },
  trendText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.success,
    marginLeft: Theme.Spacing.xs,
  },
  totalSection: {
    marginBottom: Theme.Spacing.lg,
  },
  totalCard: {
    backgroundColor: Theme.Colors.primary,
    borderRadius: Theme.BorderRadius.xl,
    padding: Theme.Spacing.xl,
    ...Theme.Shadows.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  totalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.lg,
  },
  totalIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: Theme.BorderRadius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.Spacing.md,
  },
  totalTextContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.white,
    marginBottom: Theme.Spacing.xs,
  },
  totalPeriod: {
    fontSize: Theme.Typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  totalAmount: {
    fontSize: Theme.Typography.fontSize['4xl'],
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.white,
    textAlign: 'center',
    marginBottom: Theme.Spacing.lg,
  },
  totalFooter: {
    alignItems: 'center',
  },
  totalTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
    borderRadius: Theme.BorderRadius.lg,
  },
  totalTrendText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.white,
    marginLeft: Theme.Spacing.xs,
  },
});
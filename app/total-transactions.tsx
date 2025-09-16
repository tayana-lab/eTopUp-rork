import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Hash, Smartphone, Package, Zap, Activity, TrendingUp, BarChart3 } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { Theme } from '@/constants/theme';
import BackgroundImage from '@/components/ui/BackgroundImage';
import StandardLayout from '@/components/layout/StandardLayout';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

interface TransactionItem {
  id: string;
  service: string;
  count: number;
  icon: string;
  color: string;
}

const mockTransactionData: TransactionItem[] = [
  {
    id: '1',
    service: 'TopUp',
    count: 10,
    icon: 'zap',
    color: '#3B82F6',
  },
  {
    id: '2',
    service: 'Package Purchase',
    count: 25,
    icon: 'package',
    color: '#10B981',
  },
  {
    id: '3',
    service: 'SIM Sale',
    count: 10,
    icon: 'smartphone',
    color: '#F59E0B',
  },
];

const totalTransactions = mockTransactionData.reduce((sum, item) => sum + item.count, 0);

interface PieChartProps {
  data: TransactionItem[];
}

function PieChart({ data }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const size = 120;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let cumulativePercentage = 0;
  
  return (
    <View style={styles.pieChart}>
      <Svg width={size} height={size}>
        {data.map((item, index) => {
          const percentage = (item.count / total) * 100;
          const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
          const strokeDashoffset = -cumulativePercentage * circumference / 100;
          
          cumulativePercentage += percentage;
          
          return (
            <Circle
              key={item.id}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              fill="transparent"
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}
      </Svg>
      <View style={styles.pieChartCenter}>
        <Text style={styles.pieChartCenterText}>{total}</Text>
        <Text style={styles.pieChartCenterLabel}>Total</Text>
      </View>
    </View>
  );
}

export default function TotalTransactionsScreen() {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'zap':
        return Zap;
      case 'package':
        return Package;
      case 'smartphone':
        return Smartphone;
      default:
        return Hash;
    }
  };

  const renderTransactionItem = (item: TransactionItem, index: number) => {
    const IconComponent = getIconComponent(item.icon);
    const isLast = index === mockTransactionData.length - 1;
    const percentage = ((item.count / totalTransactions) * 100).toFixed(1);
    
    return (
      <View key={item.id} style={[styles.transactionItem, isLast && styles.transactionItemLast]}>
        <View style={styles.transactionItemContent}>
          <View style={styles.transactionItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
              <IconComponent size={24} color={Theme.Colors.white} />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{item.service}</Text>
              <Text style={styles.serviceSubtitle}>Transaction Count</Text>
            </View>
          </View>
          
          <View style={styles.transactionCountContainer}>
            <Text style={styles.transactionCount}>{item.count}</Text>
            <View style={styles.percentageContainer}>
              <Text style={styles.percentageText}>{percentage}%</Text>
            </View>
          </View>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  width: `${percentage}%`,
                  backgroundColor: item.color,
                }
              ]} 
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StandardLayout title="Total Transactions">
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
                <Activity size={24} color={Theme.Colors.primary} />
              </View>
              <Text style={styles.statValue}>{mockTransactionData.length}</Text>
              <Text style={styles.statLabel}>Services</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.pieChartContainer}>
                {Platform.OS !== 'web' ? (
                  <PieChart data={mockTransactionData} />
                ) : (
                  <View style={styles.pieChartFallback}>
                    <BarChart3 size={32} color={Theme.Colors.primary} />
                    <Text style={styles.pieChartFallbackText}>Chart View</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Transaction Breakdown</Text>
            <Text style={styles.headerSubtitle}>Volume by service category</Text>
          </View>

          {/* Transactions List */}
          <View style={styles.transactionsContainer}>
            {mockTransactionData.map((item, index) => renderTransactionItem(item, index))}
          </View>

          {/* Total Section */}
          <View style={styles.totalSection}>
            <View style={styles.totalCard}>
              <View style={styles.totalCardHeader}>
                <View style={styles.totalIconWrapper}>
                  <Hash size={32} color={Theme.Colors.white} />
                </View>
                <View style={styles.totalTextContainer}>
                  <Text style={styles.totalLabel}>Total Transactions</Text>
                  <Text style={styles.totalPeriod}>This Month</Text>
                </View>
              </View>
              <Text style={styles.totalAmount}>{totalTransactions}</Text>
              <View style={styles.totalFooter}>
                <View style={styles.totalTrend}>
                  <TrendingUp size={16} color={Theme.Colors.white} />
                  <Text style={styles.totalTrendText}>+12.5% from last month</Text>
                </View>
              </View>
            </View>
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
  transactionsContainer: {
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.xl,
    marginBottom: Theme.Spacing.xl,
    ...Theme.Shadows.md,
    overflow: 'hidden',
  },
  transactionItem: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.gray100,
  },
  transactionItemLast: {
    borderBottomWidth: 0,
  },
  transactionItemContent: {
    padding: Theme.Spacing.lg,
  },
  transactionItemLeft: {
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
  transactionCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  transactionCount: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
  },
  percentageContainer: {
    backgroundColor: Theme.Colors.gray50,
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: Theme.Spacing.xs,
    borderRadius: Theme.BorderRadius.md,
  },
  percentageText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textSecondary,
  },
  progressBarContainer: {
    marginTop: Theme.Spacing.sm,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: Theme.Colors.gray100,
    borderRadius: Theme.BorderRadius.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: Theme.BorderRadius.sm,
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
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  pieChart: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChartCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChartCenterText: {
    fontSize: Theme.Typography.fontSize['2xl'],
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
  },
  pieChartCenterLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  pieChartFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChartFallbackText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
    marginTop: Theme.Spacing.xs,
  },
});
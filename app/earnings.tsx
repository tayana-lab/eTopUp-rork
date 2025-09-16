import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { Theme } from '@/constants/theme';
import BackgroundImage from '@/components/ui/BackgroundImage';
import StandardLayout from '@/components/layout/StandardLayout';

interface EarningItem {
  id: string;
  date: string;
  time: string;
  amount: number;
  type: string;
}

const mockEarningsData: EarningItem[] = [
  {
    id: '1',
    date: '2024-01-15',
    time: '14:30:25',
    amount: 100,
    type: 'Commission',
  },
  {
    id: '2',
    date: '2024-01-14',
    time: '11:45:12',
    amount: 75,
    type: 'Bonus',
  },
  {
    id: '3',
    date: '2024-01-13',
    time: '16:20:08',
    amount: 150,
    type: 'Commission',
  },
  {
    id: '4',
    date: '2024-01-12',
    time: '09:15:33',
    amount: 50,
    type: 'Referral',
  },
  {
    id: '5',
    date: '2024-01-11',
    time: '13:55:47',
    amount: 200,
    type: 'Commission',
  },
];

const totalEarnings = mockEarningsData.reduce((sum, item) => sum + item.amount, 0);

export default function EarningsScreen() {
  const renderEarningItem = (item: EarningItem, index: number) => {
    const isLast = index === mockEarningsData.length - 1;
    
    return (
      <View key={item.id} style={[styles.earningItem, isLast && styles.earningItemLast]}>
        <View style={styles.earningItemContent}>
          <View style={styles.earningItemLeft}>
            <View style={styles.dateTimeContainer}>
              <Text style={styles.dateText}>{item.date}</Text>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
          
          <View style={styles.earningAmountContainer}>
            <Text style={styles.earningAmount}>+SCR {item.amount}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StandardLayout title="Earnings">
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
                  <DollarSign size={24} color={Theme.Colors.primary} />
                </View>
                <Text style={styles.statValue}>SCR {totalEarnings}</Text>
                <Text style={styles.statLabel}>Total Earnings</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <TrendingUp size={24} color={Theme.Colors.success} />
                </View>
                <Text style={styles.statValue}>{mockEarningsData.length}</Text>
                <Text style={styles.statLabel}>Transactions</Text>
              </View>
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Earnings History</Text>
              <Text style={styles.headerSubtitle}>Your earning transactions</Text>
            </View>

            {/* Earnings List */}
            <View style={styles.earningsContainer}>
              {mockEarningsData.map((item, index) => renderEarningItem(item, index))}
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
  earningsContainer: {
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.xl,
    marginBottom: Theme.Spacing.xl,
    ...Theme.Shadows.md,
    overflow: 'hidden',
  },
  earningItem: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.gray100,
  },
  earningItemLast: {
    borderBottomWidth: 0,
  },
  earningItemContent: {
    padding: Theme.Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningItemLeft: {
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
  typeText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.primary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  earningAmountContainer: {
    alignItems: 'flex-end',
  },
  earningAmount: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.success,
  },
});
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Zap, TrendingUp, Building2 } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { Theme } from '@/constants/theme';
import BackgroundImage from '@/components/ui/BackgroundImage';
import StandardLayout from '@/components/layout/StandardLayout';

interface AirtimePurchaseItem {
  id: string;
  date: string;
  time: string;
  amount: number;
  operator: string;
}

const mockAirtimeData: AirtimePurchaseItem[] = [
  {
    id: '1',
    date: '2025-09-18',
    time: '14:30:25',
    amount: 2500.00,
    operator: 'Cable & Wireless',
  },
  {
    id: '2',
    date: '2025-09-17',
    time: '11:45:12',
    amount: 1800.00,
    operator: 'Cable & Wireless',
  },
  {
    id: '3',
    date: '2025-09-16',
    time: '16:20:08',
    amount: 3200.00,
    operator: 'Cable & Wireless',
  },
  {
    id: '4',
    date: '2025-09-15',
    time: '09:15:33',
    amount: 1500.00,
    operator: 'Cable & Wireless',
  },
  {
    id: '5',
    date: '2025-09-14',
    time: '13:55:47',
    amount: 4000.00,
    operator: 'Cable & Wireless',
  },
];

const totalAmount = mockAirtimeData.reduce((sum, item) => sum + item.amount, 0);

export default function AirtimePurchaseScreen() {
  const renderAirtimeItem = (item: AirtimePurchaseItem, index: number) => {
    const isLast = index === mockAirtimeData.length - 1;
    
    return (
      <View key={item.id} style={[styles.airtimeItem, isLast && styles.airtimeItemLast]}>
        <View style={styles.airtimeItemContent}>
          <View style={styles.airtimeItemLeft}>
            <View style={styles.operatorIconContainer}>
              <Building2 size={20} color={Theme.Colors.primary} />
            </View>
            <View style={styles.airtimeInfo}>
              <View style={styles.dateTimeContainer}>
                <Text style={styles.dateText}>{item.date}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <Text style={styles.operatorText}>{item.operator}</Text>
            </View>
          </View>
          
          <View style={styles.airtimeAmountContainer}>
            <Text style={styles.airtimeAmount}>+SCR {item.amount.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StandardLayout title="Airtime Purchase">
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
                  <Zap size={24} color={Theme.Colors.primary} />
                </View>
                <Text style={styles.statValue}>       SCR {totalAmount.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Total Received</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <TrendingUp size={24} color={Theme.Colors.success} />
                </View>
                <Text style={styles.statValue}>{mockAirtimeData.length}</Text>
                <Text style={styles.statLabel}>Transactions</Text>
              </View>
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Airtime Transfers</Text>
              <Text style={styles.headerSubtitle}>Amount received from operator</Text>
            </View>

            {/* Airtime List */}
            <View style={styles.airtimeContainer}>
              {mockAirtimeData.map((item, index) => renderAirtimeItem(item, index))}
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
  airtimeContainer: {
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.xl,
    marginBottom: Theme.Spacing.xl,
    ...Theme.Shadows.md,
    overflow: 'hidden',
  },
  airtimeItem: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.gray100,
  },
  airtimeItemLast: {
    borderBottomWidth: 0,
  },
  airtimeItemContent: {
    padding: Theme.Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  airtimeItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  operatorIconContainer: {
    width: 40,
    height: 40,
    borderRadius: Theme.BorderRadius.lg,
    backgroundColor: Theme.Colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.Spacing.md,
  },
  airtimeInfo: {
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
  operatorText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.primary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  airtimeAmountContainer: {
    alignItems: 'flex-end',
  },
  airtimeAmount: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.success,
  },
});
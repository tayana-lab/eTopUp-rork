import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Wallet } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { Theme } from '@/constants/theme';
import BackgroundImage from '@/components/ui/BackgroundImage';
import StandardLayout from '@/components/layout/StandardLayout';
import Dropdown from '@/components/ui/Dropdown';

interface BalanceTransaction {
  id: string;
  date: string;
  time: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  balance: number;
}

interface BalanceType {
  id: string;
  name: string;
  currentBalance: number;
}

const balanceTypes: BalanceType[] = [
  { id: '1', name: 'Main Balance', currentBalance: 15420.50 },
  { id: '2', name: 'Commission Balance', currentBalance: 2340.75 },
  { id: '3', name: 'Bonus Balance', currentBalance: 890.25 },
  { id: '4', name: 'Airtime Balance', currentBalance: 5670.00 },
];

const mockTransactionData: { [key: string]: BalanceTransaction[] } = {
  '1': [
    {
      id: '1',
      date: '2025-09-18',
      time: '14:30:25',
      type: 'credit',
      amount: 500.00,
      description: 'Top-up commission',
      balance: 15420.50,
    },
    {
      id: '2',
      date: '2025-09-17',
      time: '11:45:12',
      type: 'debit',
      amount: 200.00,
      description: 'Service charge',
      balance: 14920.50,
    },
    {
      id: '3',
      date: '2025-09-16',
      time: '16:20:08',
      type: 'credit',
      amount: 750.00,
      description: 'Package sale commission',
      balance: 15120.50,
    },
  ],
  '2': [
    {
      id: '4',
      date: '2025-09-15',
      time: '13:20:15',
      type: 'credit',
      amount: 150.00,
      description: 'Monthly commission',
      balance: 2340.75,
    },
    {
      id: '5',
      date: '2025-09-14',
      time: '10:30:45',
      type: 'credit',
      amount: 200.00,
      description: 'Sales bonus',
      balance: 2190.75,
    },
  ],
  '3': [
    {
      id: '6',
      date: '2025-09-13',
      time: '15:45:30',
      type: 'credit',
      amount: 100.00,
      description: 'Referral bonus',
      balance: 890.25,
    },
  ],
  '4': [
    {
      id: '7',
      date: '2025-09-12',
      time: '12:15:20',
      type: 'credit',
      amount: 2500.00,
      description: 'Airtime purchase',
      balance: 5670.00,
    },
    {
      id: '8',
      date: '2025-09-11',
      time: '09:30:10',
      type: 'debit',
      amount: 1000.00,
      description: 'Airtime distribution',
      balance: 3170.00,
    },
  ],
};

export default function BalanceScreen() {
  const [selectedBalance, setSelectedBalance] = useState<string>('1');
  
  const currentBalanceType = balanceTypes.find(b => b.id === selectedBalance);
  const transactions = mockTransactionData[selectedBalance] || [];

  const renderTransactionItem = (item: BalanceTransaction, index: number) => {
    const isLast = index === transactions.length - 1;
    const isCredit = item.type === 'credit';
    
    return (
      <View key={item.id} style={[styles.transactionItem, isLast && styles.transactionItemLast]}>
        <View style={styles.transactionItemContent}>
          <View style={styles.transactionItemLeft}>
            <View style={styles.dateTimeContainer}>
              <Text style={styles.dateText}>{item.date}</Text>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
          
          <View style={styles.transactionAmountContainer}>
            <Text style={[styles.transactionAmount, { color: isCredit ? Theme.Colors.success : Theme.Colors.error }]}>
              {isCredit ? '+' : '-'}SCR {item.amount.toFixed(2)}
            </Text>
            <Text style={styles.balanceText}>Balance: SCR {item.balance.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StandardLayout title="Balance">
        <BackgroundImage style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Balance Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Select Balance Type</Text>
              <Dropdown
                title="Balance Type"
                options={balanceTypes.map(balance => ({
                  id: balance.id,
                  name: balance.name,
                }))}
                selectedValue={selectedBalance}
                onSelect={setSelectedBalance}
                placeholder="Select balance type"
              />
            </View>

            {/* Current Balance Overview */}
            {currentBalanceType && (
              <View style={styles.balanceOverview}>
                <View style={styles.balanceCard}>
                  <View style={styles.balanceCardHeader}>
                    <View style={styles.balanceIconWrapper}>
                      <Wallet size={32} color={Theme.Colors.white} />
                    </View>
                    <View style={styles.balanceTextContainer}>
                      <Text style={styles.balanceLabel}>{currentBalanceType.name}</Text>
                      <Text style={styles.balancePeriod}>Current Balance</Text>
                    </View>
                  </View>
                  <Text style={styles.balanceAmount}>SCR {currentBalanceType.currentBalance.toFixed(2)}</Text>
                </View>
              </View>
            )}

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Transaction History</Text>
              <Text style={styles.headerSubtitle}>Recent balance transactions</Text>
            </View>

            {/* Transactions List */}
            {transactions.length > 0 ? (
              <View style={styles.transactionsContainer}>
                {transactions.map((item, index) => renderTransactionItem(item, index))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No transactions found for this balance type</Text>
              </View>
            )}
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
  filterSection: {
    marginBottom: Theme.Spacing.xl,
  },
  filterLabel: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.sm,
  },
  balanceOverview: {
    marginBottom: Theme.Spacing.xl,
  },
  balanceCard: {
    backgroundColor: Theme.Colors.primary,
    borderRadius: Theme.BorderRadius.xl,
    padding: Theme.Spacing.xl,
    ...Theme.Shadows.lg,
  },
  balanceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.lg,
  },
  balanceIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: Theme.BorderRadius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.Spacing.md,
  },
  balanceTextContainer: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.white,
    marginBottom: Theme.Spacing.xs,
  },
  balancePeriod: {
    fontSize: Theme.Typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  balanceAmount: {
    fontSize: Theme.Typography.fontSize['4xl'],
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.white,
    textAlign: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionItemLeft: {
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
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    marginBottom: Theme.Spacing.xs,
  },
  balanceText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  emptyState: {
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.xl,
    padding: Theme.Spacing.xl,
    alignItems: 'center',
    ...Theme.Shadows.sm,
  },
  emptyStateText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
});
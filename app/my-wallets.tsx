import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Stack } from 'expo-router';
import { Wallet, Eye, EyeOff, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Smartphone, Filter } from 'lucide-react-native';
import { Theme } from '@/constants/theme';

export default function MyWalletsScreen() {
  const [prepaidBalance] = useState(1250.75);
  const [postpaidBalance] = useState(850.30);
  const [isPrepaidVisible, setIsPrepaidVisible] = useState(false);
  const [isPostpaidVisible, setIsPostpaidVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const recentTransactions = [
    { id: '1', type: 'topup', amount: 100, date: '2024-01-15', description: 'Mobile TopUp', balanceName: 'Prepaid Balance' },
    { id: '2', type: 'payment', amount: -50, date: '2024-01-14', description: 'Bill Payment', balanceName: 'Postpaid Balance' },
    { id: '3', type: 'topup', amount: 200, date: '2024-01-13', description: 'Prepaid Recharge', balanceName: 'Prepaid Balance' },
    { id: '4', type: 'payment', amount: -75, date: '2024-01-12', description: 'Data Package', balanceName: 'Prepaid Balance' },
    { id: '5', type: 'topup', amount: 150, date: '2024-01-11', description: 'Account Credit', balanceName: 'Postpaid Balance' },
    { id: '6', type: 'payment', amount: -25, date: '2024-01-10', description: 'SMS Bundle', balanceName: 'Prepaid Balance' },
  ];

  const balanceNames = ['All', 'Prepaid Balance', 'Postpaid Balance'];

  const filteredTransactions = selectedFilter === 'All' 
    ? recentTransactions 
    : recentTransactions.filter(transaction => transaction.balanceName === selectedFilter);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'My Wallets',
          headerStyle: { 
            backgroundColor: Theme.Colors.primary,
          },
          headerTintColor: Theme.Colors.white,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Prepaid Wallet */}
        <View style={styles.section}>
          <View style={styles.walletCard}>
            <View style={styles.walletHeader}>
              <View style={styles.walletTitleContainer}>
                <View style={[styles.walletIcon, { backgroundColor: Theme.Colors.primary + '20' }]}>
                  <Smartphone size={20} color={Theme.Colors.primary} />
                </View>
                <Text style={styles.walletTitle}>Recharge Balance</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsPrepaidVisible(!isPrepaidVisible)}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                {isPrepaidVisible ? (
                  <EyeOff size={20} color={Theme.Colors.textSecondary} />
                ) : (
                  <Eye size={20} color={Theme.Colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.walletAmount}>
              {isPrepaidVisible ? `SCR ${prepaidBalance.toFixed(2)}` : '••••••'}
            </Text>
            <TouchableOpacity style={styles.addFundsButton}>
              <Plus size={16} color={Theme.Colors.primary} />
              <Text style={styles.addFundsText}>Request Funds</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Postpaid Wallet */}
        <View style={styles.section}>
          <View style={styles.walletCard}>
            <View style={styles.walletHeader}>
              <View style={styles.walletTitleContainer}>
                <View style={[styles.walletIcon, { backgroundColor: Theme.Colors.secondary + '20' }]}>
                  <CreditCard size={20} color={Theme.Colors.secondary} />
                </View>
                <Text style={styles.walletTitle}>Bill-Pay Balance</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsPostpaidVisible(!isPostpaidVisible)}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                {isPostpaidVisible ? (
                  <EyeOff size={20} color={Theme.Colors.textSecondary} />
                ) : (
                  <Eye size={20} color={Theme.Colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.walletAmount}>
              {isPostpaidVisible ? `SCR ${postpaidBalance.toFixed(2)}` : '••••••'}
            </Text>
            <TouchableOpacity style={styles.addFundsButton}>
              <Plus size={16} color={Theme.Colors.secondary} />
              <Text style={[styles.addFundsText, { color: Theme.Colors.secondary }]}>Request Funds</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.transactionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <View style={styles.filterContainer}>
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <Filter size={16} color={Theme.Colors.textSecondary} />
                <Text style={styles.filterText}>{selectedFilter}</Text>
              </TouchableOpacity>
              
              {showFilterDropdown && (
                <View style={styles.filterDropdown}>
                  {balanceNames.map((balance) => (
                    <TouchableOpacity
                      key={balance}
                      style={[
                        styles.filterOption,
                        selectedFilter === balance && styles.filterOptionSelected
                      ]}
                      onPress={() => {
                        setSelectedFilter(balance);
                        setShowFilterDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedFilter === balance && styles.filterOptionTextSelected
                      ]}>
                        {balance}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
          {filteredTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={[
                  styles.transactionIcon,
                  { backgroundColor: transaction.amount > 0 ? Theme.Colors.success : Theme.Colors.error }
                ]}>
                  {transaction.amount > 0 ? (
                    <ArrowDownLeft size={16} color={Theme.Colors.white} />
                  ) : (
                    <ArrowUpRight size={16} color={Theme.Colors.white} />
                  )}
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
              </View>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.amount > 0 ? Theme.Colors.success : Theme.Colors.error }
              ]}>
                {transaction.amount > 0 ? '+' : ''}SCR {Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
  },
  sectionTitle: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  filterContainer: {
    position: 'relative',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: Theme.Spacing.xs,
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.md,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    ...Theme.Shadows.sm,
  },
  filterText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    marginLeft: Theme.Spacing.xs,
  },
  filterDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.md,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    ...Theme.Shadows.lg,
    zIndex: 1000,
    minWidth: 140,
    marginTop: 4,
  },
  filterOption: {
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.border,
  },
  filterOptionSelected: {
    backgroundColor: Theme.Colors.primary + '10',
  },
  filterOptionText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textPrimary,
  },
  filterOptionTextSelected: {
    color: Theme.Colors.primary,
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },
  walletCard: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.lg,
    ...Theme.Shadows.md,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  walletTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIcon: {
    width: 40,
    height: 40,
    borderRadius: Theme.BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginLeft: Theme.Spacing.sm,
  },
  walletAmount: {
    fontSize: Theme.Typography.fontSize['3xl'],
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.primary,
    textAlign: 'center',
    marginBottom: Theme.Spacing.lg,
  },
  addFundsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.Spacing.sm,
    borderRadius: Theme.BorderRadius.md,
    borderWidth: 1,
    borderColor: Theme.Colors.primary,
  },
  addFundsText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.primary,
    marginLeft: Theme.Spacing.xs,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.md,
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.md,
    marginBottom: Theme.Spacing.sm,
    ...Theme.Shadows.sm,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: Theme.BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    marginLeft: Theme.Spacing.sm,
    flex: 1,
  },
  transactionDescription: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
  },
  transactionAmount: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },
});
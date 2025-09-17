import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { BarChart3, Download, Filter, TrendingUp, TrendingDown, DollarSign, CreditCard, Smartphone, Zap, PiggyBank ,CardSim} from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import BackgroundImage from '@/components/ui/BackgroundImage';
import StandardLayout from '@/components/layout/StandardLayout';
import { router } from 'expo-router';

interface ReportItem {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}



const mockReports: ReportItem[] = [
  {
    id: '1',
    title: 'Total Sale',
    value: 'SCR 15,420',
    change: '+12.5%',
    trend: 'up',
    icon: 'dollar-sign',
  },
  {
    id: '2',
    title: 'Total Transactions',
    value: '234',
    change: '+8.2%',
    trend: 'up',
    icon: 'credit-card',
  },
  {
    id: '3',
    title: 'Earnings',
    value: 'SCR 1,542',
    change: '+5.7%',
    trend: 'up',
    icon: 'trending-up',
  },
  {
    id: '4',
    title: 'SIM Stock',
    value: '89',
    change: '-3.2%',
    trend: 'down',
    icon: 'smartphone',
  },
  {
    id: '5',
    title: 'Airtime Purchase',
    value: 'SCR 8,750',
    change: '+15.3%',
    trend: 'up',
    icon: 'zap',
  },
  {
    id: '6',
    title: 'Balance',
    value: 'SCR 3,280',
    change: '+2.1%',
    trend: 'up',
    icon: 'piggy-bank',
  },
];



export default function ReportsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('This Month');

  const periods = ['Today', 'This Week', 'This Month', 'Last Month', 'Custom'];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'trending-up':
        return TrendingUp;
      case 'trending-down':
        return TrendingDown;
      case 'dollar-sign':
        return DollarSign;
      case 'credit-card':
        return CreditCard;
      case 'smartphone':
        return Smartphone;
      case 'zap':
        return Zap;
      case 'piggy-bank':
        return PiggyBank;
      default:
        return BarChart3;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return Theme.Colors.success;
      case 'down':
        return Theme.Colors.error;
      default:
        return Theme.Colors.textSecondary;
    }
  };



  const handleExportReport = () => {
    Alert.alert('Export Report', 'Report will be exported to your device.');
  };

  const handleFilterPress = () => {
    Alert.alert('Filter', 'Filter options will be shown here.');
  };

  const handleReportCardPress = (reportTitle: string) => {
    switch (reportTitle) {
      case 'Total Sale':
        router.push('/total-sale');
        break;
      case 'Total Transactions':
        router.push('/total-transactions');
        break;
      case 'Earnings':
        router.push('/earnings');
        break;
      case 'SIM Stock':
        router.push('/sim-stock');
        break;
      case 'Airtime Purchase':
        router.push('/airtime-purchase');
        break;
      case 'Balance':
        router.push('/balance');
        break;
      default:
        break;
    }
  };

  const renderReportCard = (report: ReportItem) => {
    const IconComponent = getIconComponent(report.icon);
    const trendColor = getTrendColor(report.trend);
    const isClickable = ['Total Sale', 'Total Transactions', 'Earnings', 'SIM Stock', 'Airtime Purchase', 'Balance'].includes(report.title);
    
    if (isClickable) {
      return (
        <TouchableOpacity
          key={report.id}
          onPress={() => handleReportCardPress(report.title)}
          activeOpacity={0.7}
          style={styles.reportCard}
        >
          <View style={styles.reportHeader}>
            <View style={styles.reportIconContainer}>
              <IconComponent size={24} color={Theme.Colors.primary} />
            </View>
            <Text style={styles.reportTitle}>{report.title}</Text>
          </View>
          
          <Text style={styles.reportValue}>{report.value}</Text>
          
          <View style={styles.reportChange}>
            <Text style={[styles.changeText, { color: trendColor }]}>
              {report.change}
            </Text>
            <Text style={styles.changeLabel}>vs last period</Text>
          </View>
        </TouchableOpacity>
      );
    }
    
    return (
      <View key={report.id} style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <View style={styles.reportIconContainer}>
            <IconComponent size={24} color={Theme.Colors.primary} />
          </View>
          <Text style={styles.reportTitle}>{report.title}</Text>
        </View>
        
        <Text style={styles.reportValue}>{report.value}</Text>
        
        <View style={styles.reportChange}>
          <Text style={[styles.changeText, { color: trendColor }]}>
            {report.change}
          </Text>
          <Text style={styles.changeLabel}>vs last period</Text>
        </View>
      </View>
    );
  };



  return (
    <StandardLayout title="Reports">
      <BackgroundImage style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Period Selection */}
          <View style={styles.periodSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.periodContainer}
            >
              {periods.map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive,
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text
                    style={[
                      styles.periodText,
                      selectedPeriod === period && styles.periodTextActive,
                    ]}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleFilterPress}>
              <Filter size={20} color={Theme.Colors.primary} />
              <Text style={styles.actionButtonText}>Filter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleExportReport}>
              <Download size={20} color={Theme.Colors.primary} />
              <Text style={styles.actionButtonText}>Export</Text>
            </TouchableOpacity>
          </View>

          {/* Reports Grid */}
          <View style={styles.reportsGrid}>
            {mockReports.map(renderReportCard)}
          </View>


        </ScrollView>
      </BackgroundImage>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Theme.Spacing.md,
  },
  periodSection: {
    marginBottom: Theme.Spacing.lg,
  },
  periodContainer: {
    paddingHorizontal: Theme.Spacing.xs,
  },
  periodButton: {
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
    borderRadius: Theme.BorderRadius.lg,
    backgroundColor: Theme.Colors.surface,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    marginRight: Theme.Spacing.sm,
  },
  periodButtonActive: {
    backgroundColor: Theme.Colors.primary,
    borderColor: Theme.Colors.primary,
  },
  periodText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textPrimary,
  },
  periodTextActive: {
    color: Theme.Colors.white,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Theme.Spacing.md,
    marginBottom: Theme.Spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.Spacing.md,
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    gap: Theme.Spacing.sm,
  },
  actionButtonText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.primary,
  },
  reportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.Spacing.md,
    marginBottom: Theme.Spacing.xl,
  },
  reportCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.md,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    ...Theme.Shadows.sm,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  reportIconContainer: {
    width: 40,
    height: 40,
    borderRadius: Theme.BorderRadius.lg,
    backgroundColor: Theme.Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.Spacing.sm,
  },
  reportTitle: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textSecondary,
    flex: 1,
  },
  reportValue: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.xs,
  },
  reportChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.Spacing.xs,
  },
  changeText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },
  changeLabel: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.textSecondary,
  },

});
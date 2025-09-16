import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { 
  Calendar,
  MapPin,
  User,
  Search,
  Filter,
} from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import StandardLayout from '@/components/layout/StandardLayout';

interface JobCard {
  id: string;
  customerName: string;
  customerType: 'Local' | 'GOP Holder' | 'Tourist';
  address: string;
  appliedDateTime: string;
  scheduledDateTime: string;
  status: 'scheduled' | 'completed';
  completedBy?: string;
  completedDateTime?: string;
}

const mockJobCards: JobCard[] = [
  {
    id: '1',
    customerName: 'John Smith',
    customerType: 'Local',
    address: '123 Main Street, Downtown, City 12345',
    appliedDateTime: '2025-01-14 10:30 AM',
    scheduledDateTime: '2025-01-15 2:00 PM',
    status: 'scheduled',
  },
  {
    id: '2',
    customerName: 'Sarah Johnson',
    customerType: 'GOP Holder',
    address: '456 Oak Avenue, Suburb, City 67890',
    appliedDateTime: '2025-01-14 2:15 PM',
    scheduledDateTime: '2025-01-16 11:00 AM',
    status: 'scheduled',
  },
  {
    id: '3',
    customerName: 'Michael Brown',
    customerType: 'Tourist',
    address: '789 Pine Road, Uptown, City 54321',
    appliedDateTime: '2025-01-13 4:45 PM',
    scheduledDateTime: '2025-01-15 9:30 AM',
    status: 'scheduled',
  },
  {
    id: '4',
    customerName: 'Emily Davis',
    customerType: 'Local',
    address: '321 Elm Street, Midtown, City 98765',
    appliedDateTime: '2025-01-12 11:20 AM',
    scheduledDateTime: '2025-01-14 3:15 PM',
    status: 'completed',
    completedBy: 'Agent Smith',
    completedDateTime: '2025-01-14 4:30 PM',
  },
  {
    id: '5',
    customerName: 'David Wilson',
    customerType: 'GOP Holder',
    address: '654 Maple Drive, Eastside, City 13579',
    appliedDateTime: '2025-01-14 9:00 AM',
    scheduledDateTime: '2025-01-17 1:30 PM',
    status: 'completed',
    completedBy: 'Agent Johnson',
    completedDateTime: '2025-01-17 2:45 PM',
  },
];

export default function JobCardScreen() {
  const [jobCards] = useState<JobCard[]>(mockJobCards);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const handleOnboard = (jobCard: JobCard) => {
    console.log('Starting onboarding for:', jobCard.customerName);
    router.push({
      pathname: '/digital-onboard' as any,
      params: { 
        jobCardId: jobCard.id,
        customerName: jobCard.customerName,
        customerType: jobCard.customerType.toLowerCase().replace(' ', '-')
      }
    });
  };

  const handleCardPress = (jobCard: JobCard) => {
    router.push({
      pathname: '/digital-onboard' as any,
      params: { 
        jobCardId: jobCard.id,
        customerName: jobCard.customerName,
        customerType: jobCard.customerType.toLowerCase().replace(' ', '-')
      }
    });
  };

  const filteredJobCards = jobCards.filter(card => {
    const matchesSearch = card.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || card.status === statusFilter;
    
    // Date filtering logic
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const cardDate = new Date(card.appliedDateTime.split(' ')[0]);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - cardDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case '24h':
          matchesDate = diffDays <= 1;
          break;
        case '7d':
          matchesDate = diffDays <= 7;
          break;
        case '30d':
          matchesDate = diffDays <= 30;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const activeJobsCount = jobCards.filter(card => card.status === 'scheduled').length;

  const getStatusColor = (status: JobCard['status']) => {
    switch (status) {
      case 'scheduled':
        return Theme.Colors.primary;
      case 'completed':
        return Theme.Colors.success;
      default:
        return Theme.Colors.textSecondary;
    }
  };

  const getStatusText = (status: JobCard['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const getCustomerTypeColor = (type: JobCard['customerType']) => {
    switch (type) {
      case 'Local':
        return Theme.Colors.primary;
      case 'GOP Holder':
        return Theme.Colors.warning;
      case 'Tourist':
        return Theme.Colors.success;
      default:
        return Theme.Colors.textSecondary;
    }
  };

  const renderJobCard = (jobCard: JobCard) => (
    <TouchableOpacity 
      key={jobCard.id} 
      style={styles.jobCard}
      onPress={() => handleCardPress(jobCard)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.customerInfo}>
          <View style={styles.nameAndTypeContainer}>
            <View style={styles.nameRow}>
              <User size={20} color={Theme.Colors.primary} />
              <Text style={styles.customerName}>{jobCard.customerName}</Text>
            </View>
            <View style={styles.customerTypeRow}>
              <Text style={styles.customerTypeLabel}>Customer Type: </Text>
              <Text style={[styles.customerTypeValue, { color: getCustomerTypeColor(jobCard.customerType) }]}>
                {jobCard.customerType}
              </Text>
            </View>
          </View>
          <View style={styles.badgeContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(jobCard.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(jobCard.status) }]}>
                {getStatusText(jobCard.status)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <MapPin size={16} color={Theme.Colors.textSecondary} />
          <Text style={styles.address} numberOfLines={1}>{jobCard.address}</Text>
        </View>

        <View style={styles.dateTimeContainer}>
          <View style={styles.dateTimeRow}>
            <Calendar size={16} color={Theme.Colors.textSecondary} />
            <Text style={styles.dateTimeLabel}>Applied: {jobCard.appliedDateTime}</Text>
          </View>
          
          <View style={styles.dateTimeRow}>
            <Calendar size={16} color={Theme.Colors.textSecondary} />
            <Text style={styles.dateTimeLabel}>Scheduled: {jobCard.scheduledDateTime}</Text>
          </View>
          
          {jobCard.status === 'completed' && jobCard.completedBy && (
            <>
              <View style={styles.dateTimeRow}>
                <Calendar size={16} color={Theme.Colors.success} />
                <Text style={[styles.dateTimeLabel, { color: Theme.Colors.success }]}>Completed: {jobCard.completedDateTime}</Text>
              </View>
              <View style={styles.dateTimeRow}>
                <User size={16} color={Theme.Colors.success} />
                <Text style={[styles.dateTimeLabel, { color: Theme.Colors.success }]}>Completed by: {jobCard.completedBy}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[styles.onboardButton, jobCard.status === 'completed' && styles.onboardButtonDisabled]}
          onPress={() => handleOnboard(jobCard)}
          disabled={jobCard.status === 'completed'}
        >
          <User size={20} color={jobCard.status === 'completed' ? Theme.Colors.textSecondary : Theme.Colors.white} />
          <Text style={[styles.onboardButtonText, jobCard.status === 'completed' && styles.onboardButtonTextDisabled]}>Onboard Customer</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <StandardLayout 
      title={`Job Card (${activeJobsCount})`}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={Theme.Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search customers or addresses..."
              placeholderTextColor={Theme.Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={Theme.Colors.primary} />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View style={styles.filtersContainer}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Status:</Text>
              <View style={styles.filterOptions}>
                {['all', 'scheduled', 'completed'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterOption,
                      statusFilter === status && styles.filterOptionActive
                    ]}
                    onPress={() => setStatusFilter(status)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      statusFilter === status && styles.filterOptionTextActive
                    ]}>
                      {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Date:</Text>
              <View style={styles.filterOptions}>
                {['all', '24h', '7d', '30d'].map((date) => (
                  <TouchableOpacity
                    key={date}
                    style={[
                      styles.filterOption,
                      dateFilter === date && styles.filterOptionActive
                    ]}
                    onPress={() => setDateFilter(date)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      dateFilter === date && styles.filterOptionTextActive
                    ]}>
                      {date === 'all' ? 'All Time' : 
                       date === '24h' ? 'Last 24 hrs' :
                       date === '7d' ? 'Last 7 days' :
                       date === '30d' ? 'Last 30 days' : 'All Time'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        <View style={styles.jobList}>
          {filteredJobCards.map(renderJobCard)}
        </View>
      </ScrollView>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Theme.Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
    gap: Theme.Spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.md,
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
    ...Theme.Shadows.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
    marginLeft: Theme.Spacing.sm,
  },
  filterButton: {
    backgroundColor: Theme.Colors.surface,
    padding: Theme.Spacing.sm,
    borderRadius: Theme.BorderRadius.md,
    ...Theme.Shadows.sm,
  },
  filtersContainer: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.md,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.md,
    ...Theme.Shadows.sm,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.Spacing.sm,
  },
  filterLabel: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textPrimary,
    flex: 1,
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.surfaceSecondary,
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
    borderRadius: Theme.BorderRadius.sm,
    flex: 2,
    justifyContent: 'space-between',
  },
  filterValue: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textPrimary,
  },
  jobList: {
    gap: Theme.Spacing.md,
  },
  jobCard: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.md,
    ...Theme.Shadows.md,
  },
  cardHeader: {
    marginBottom: Theme.Spacing.md,
  },
  customerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameAndTypeContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.xs,
  },
  customerTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 28,
  },
  customerTypeLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  customerTypeValue: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },
  customerName: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginLeft: Theme.Spacing.sm,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: Theme.Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: Theme.Spacing.xs,
    borderRadius: Theme.BorderRadius.md,
  },
  statusText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  cardContent: {
    marginBottom: Theme.Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.Spacing.md,
  },
  address: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    marginLeft: Theme.Spacing.sm,
    flex: 1,
    lineHeight: Theme.Typography.lineHeight.relaxed * Theme.Typography.fontSize.base,
  },
  dateTimeContainer: {
    marginTop: Theme.Spacing.sm,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  dateTimeLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
    marginLeft: Theme.Spacing.sm,
    flex: 1,
  },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: Theme.Colors.borderLight,
    paddingTop: Theme.Spacing.md,
  },
  onboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.Colors.primary,
    paddingHorizontal: Theme.Spacing.lg,
    paddingVertical: Theme.Spacing.md,
    borderRadius: Theme.BorderRadius.md,
    gap: Theme.Spacing.sm,
    minHeight: 48,
  },
  onboardButtonDisabled: {
    backgroundColor: Theme.Colors.gray200,
  },
  onboardButtonText: {
    color: Theme.Colors.white,
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },
  onboardButtonTextDisabled: {
    color: Theme.Colors.textSecondary,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.Spacing.xs,
    flex: 2,
  },
  filterOption: {
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: Theme.Spacing.xs,
    borderRadius: Theme.BorderRadius.sm,
    backgroundColor: Theme.Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Theme.Colors.borderLight,
  },
  filterOptionActive: {
    backgroundColor: Theme.Colors.primary,
    borderColor: Theme.Colors.primary,
  },
  filterOptionText: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.textPrimary,
  },
  filterOptionTextActive: {
    color: Theme.Colors.white,
  },
});
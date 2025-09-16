import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import {
  Search,
  Filter,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Download,
  Upload,
  Plus,
} from 'lucide-react-native';

import StandardLayout from '@/components/layout/StandardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Theme } from '@/constants/theme';

type SimStatus = 'available' | 'sold' | 'reserved' | 'damaged';

interface SimCard {
  id: string;
  simNumber: string;
  iccid: string;
  pukCode: string;
  status: SimStatus;
  batchNumber: string;
  dateReceived: string;
  soldDate?: string;
  customerName?: string;
  price: number;
  network: string;
}

const mockSimCards: SimCard[] = [
  {
    id: '1',
    simNumber: '248-2501001',
    iccid: '89248020000000000001',
    pukCode: '12345678',
    status: 'available',
    batchNumber: 'BATCH001',
    dateReceived: '2025-01-13',
    price: 25.00,
    network: 'Cable & Wireless',
  },
  {
    id: '2',
    simNumber: '248-2501002',
    iccid: '89248020000000000002',
    pukCode: '87654321',
    status: 'sold',
    batchNumber: 'BATCH001',
    dateReceived: '2025-01-13',
    soldDate: '2025-01-15',
    customerName: 'John Doe',
    price: 25.00,
    network: 'Cable & Wireless',
  },
  {
    id: '3',
    simNumber: '248-2501003',
    iccid: '89248020000000000003',
    pukCode: '11223344',
    status: 'available',
    batchNumber: 'BATCH002',
    dateReceived: '2025-01-14',
    price: 25.00,
    network: 'Cable & Wireless',
  },
  {
    id: '4',
    simNumber: '248-2501004',
    iccid: '89248020000000000004',
    pukCode: '44332211',
    status: 'sold',
    batchNumber: 'BATCH002',
    dateReceived: '2025-01-14',
    soldDate: '2025-01-16',
    customerName: 'Jane Smith',
    price: 25.00,
    network: 'Cable & Wireless',
  },
  {
    id: '5',
    simNumber: '248-2501005',
    iccid: '89248020000000000005',
    pukCode: '55667788',
    status: 'available',
    batchNumber: 'BATCH003',
    dateReceived: '2025-01-15',
    price: 30.00,
    network: 'Cable & Wireless',
  },
  {
    id: '6',
    simNumber: '248-2501006',
    iccid: '89248020000000000006',
    pukCode: '99887766',
    status: 'sold',
    batchNumber: 'BATCH003',
    dateReceived: '2025-01-16',
    soldDate: '2025-01-17',
    customerName: 'Mike Johnson',
    price: 30.00,
    network: 'Cable & Wireless',
  },
  {
    id: '7',
    simNumber: '248-2501007',
    iccid: '89248020000000000007',
    pukCode: '33445566',
    status: 'available',
    batchNumber: 'BATCH004',
    dateReceived: '2025-01-17',
    price: 25.00,
    network: 'Cable & Wireless',
  },
  {
    id: '8',
    simNumber: '248-2501008',
    iccid: '89248020000000000008',
    pukCode: '77889900',
    status: 'sold',
    batchNumber: 'BATCH004',
    dateReceived: '2025-01-18',
    soldDate: '2025-01-19',
    customerName: 'Sarah Wilson',
    price: 25.00,
    network: 'Cable & Wireless',
  },
];

const statusConfig = {
  available: {
    color: Theme.Colors.success,
    icon: CheckCircle,
    label: 'Available',
  },
  sold: {
    color: Theme.Colors.gray500,
    icon: XCircle,
    label: 'Sold',
  },
  reserved: {
    color: Theme.Colors.warning,
    icon: Clock,
    label: 'Reserved',
  },
  damaged: {
    color: Theme.Colors.error,
    icon: XCircle,
    label: 'Damaged',
  },
};

export default function SimInventoryScreen() {
  const [simCards] = useState<SimCard[]>(mockSimCards);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<SimStatus | 'all'>('all');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const networks = useMemo(() => {
    const uniqueNetworks = [...new Set(simCards.map(sim => sim.network))];
    return uniqueNetworks;
  }, [simCards]);

  const filteredSimCards = useMemo(() => {
    return simCards.filter(sim => {
      const matchesSearch = 
        sim.simNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sim.iccid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sim.pukCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sim.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sim.customerName && sim.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = selectedStatus === 'all' || sim.status === selectedStatus;
      const matchesNetwork = selectedNetwork === 'all' || sim.network === selectedNetwork;
      
      const isAllowedStatus = sim.status === 'available' || sim.status === 'sold';
      const isCableWireless = sim.network === 'Cable & Wireless';
      
      return matchesSearch && matchesStatus && matchesNetwork && isAllowedStatus && isCableWireless;
    });
  }, [simCards, searchQuery, selectedStatus, selectedNetwork]);

  const inventoryStats = useMemo(() => {
    const cableWirelessSims = simCards.filter(sim => 
      sim.network === 'Cable & Wireless' && 
      (sim.status === 'available' || sim.status === 'sold')
    );
    
    const stats = {
      total: cableWirelessSims.length,
      available: 0,
      sold: 0,
      reserved: 0,
      damaged: 0,
    };
    
    cableWirelessSims.forEach(sim => {
      stats[sim.status]++;
    });
    
    return stats;
  }, [simCards]);



  const handleSimAction = (sim: SimCard, action: string) => {
    if (!sim?.simNumber?.trim()) return;
    
    if (Platform.OS === 'web') {
      console.log(`${action} action for SIM: ${sim.simNumber}`);
      return;
    }
    
    switch (action) {
      case 'view':
        console.log('Viewing details for', sim.simNumber);
        break;
      case 'edit':
        console.log('Editing', sim.simNumber);
        break;
      case 'sell':
        if (sim.status === 'available') {
          console.log('Selling', sim.simNumber);
        }
        break;
      case 'reserve':
        if (sim.status === 'available') {
          console.log('Reserving', sim.simNumber);
        }
        break;
      default:
        break;
    }
  };

  const handleAddNewSim = () => {
    console.log('Navigate to add new SIM form');
  };

  const handleExportInventory = () => {
    console.log('Exporting inventory data...');
  };

  const handleImportSims = () => {
    console.log('Navigate to import SIMs form');
  };

  const renderStatusFilter = () => {
    const statuses: (SimStatus | 'all')[] = ['all', 'available', 'sold'];
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScrollView}
        contentContainerStyle={styles.filterScrollContent}
      >
        {statuses.map(status => {
          const isSelected = selectedStatus === status;
          const config = status === 'all' ? 
            { color: Theme.Colors.primary, label: 'All' } : 
            statusConfig[status];
          
          return (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                isSelected && { backgroundColor: config.color }
              ]}
              onPress={() => {
                if (status && typeof status === 'string') {
                  setSelectedStatus(status);
                }
              }}
            >
              <Text style={[
                styles.filterChipText,
                isSelected && { color: Theme.Colors.white }
              ]}>
                {config.label}
              </Text>
              {status !== 'all' && (
                <Text style={[
                  styles.filterChipCount,
                  isSelected && { color: Theme.Colors.white }
                ]}>
                  {inventoryStats[status]}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderNetworkFilter = () => {
    const allNetworks = ['all', ...networks];
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScrollView}
        contentContainerStyle={styles.filterScrollContent}
      >
        {allNetworks.map(network => {
          const isSelected = selectedNetwork === network;
          
          return (
            <TouchableOpacity
              key={network}
              style={[
                styles.networkChip,
                isSelected && styles.networkChipSelected
              ]}
              onPress={() => {
                if (network && typeof network === 'string') {
                  setSelectedNetwork(network);
                }
              }}
            >
              <Text style={[
                styles.networkChipText,
                isSelected && styles.networkChipTextSelected
              ]}>
                {network === 'all' ? 'All Networks' : network}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderSimCard = (sim: SimCard) => {
    const config = statusConfig[sim.status];
    const StatusIcon = config.icon;
    
    return (
      <Card key={sim.id} style={styles.simCard}>
        <View style={styles.simCardHeader}>
          <View style={styles.simCardInfo}>
            <Text style={styles.simNumber}>{sim.simNumber}</Text>
            <Text style={styles.network}>{sim.network}</Text>
          </View>
          <View style={styles.simCardActions}>
            <View style={[styles.statusBadge, { backgroundColor: config.color }]}>
              <StatusIcon size={12} color={Theme.Colors.white} />
              <Text style={styles.statusText}>{config.label}</Text>
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                if (Platform.OS === 'web') {
                  console.log('SIM Actions for', sim?.simNumber);
                } else {
                  handleSimAction(sim, 'view');
                }
              }}
            >
              <MoreVertical size={16} color={Theme.Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.simCardDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>SIM:</Text>
            <Text style={styles.detailValue}>{sim.iccid}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>PUK:</Text>
            <Text style={styles.detailValue}>{sim.pukCode}</Text>
          </View>
          {/* <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Batch:</Text>
            <Text style={styles.detailValue}>{sim.batchNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.priceValue}>SCR {sim.price.toFixed(2)}</Text>
          </View> */}
          {sim.customerName && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Customer:</Text>
              <Text style={styles.detailValue}>{sim.customerName}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>
              {sim.soldDate ? `Sold: ${sim.soldDate}` : `Received: ${sim.dateReceived}`}
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  const headerRightComponent = (
    <View style={styles.headerActions}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={handleExportInventory}
      >
        <Download size={20} color={Theme.Colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={handleImportSims}
      >
        <Upload size={20} color={Theme.Colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={handleAddNewSim}
      >
        <Plus size={20} color={Theme.Colors.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <StandardLayout 
      title="SIM Inventory" 
      rightComponent={headerRightComponent}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Package size={24} color={Theme.Colors.primary} />
            <Text style={styles.statNumber}>{inventoryStats.total}</Text>
            <Text style={styles.statLabel}>Total SIMs</Text>
          </View>
          <View style={styles.statCard}>
            <CheckCircle size={24} color={Theme.Colors.success} />
            <Text style={styles.statNumber}>{inventoryStats.available}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statCard}>
            <XCircle size={24} color={Theme.Colors.gray500} />
            <Text style={styles.statNumber}>{inventoryStats.sold}</Text>
            <Text style={styles.statLabel}>Sold</Text>
          </View>
        </View>

        {/* Search Bar */}

<View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={Theme.Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by SIM number, SIM or PUK"
              placeholderTextColor={Theme.Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              textAlignVertical="center"
            />
          </View>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              showFilters && styles.filterButtonActive
            ]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={showFilters ? Theme.Colors.white : Theme.Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            <Text style={styles.filterTitle}>Status</Text>
            {renderStatusFilter()}
          </View>
        )}

        {/* Results Count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredSimCards.length} of {inventoryStats.total} Cable & Wireless SIMs
          </Text>
        </View>

        {/* SIM Cards List */}
        <View style={styles.simCardsList}>
          {filteredSimCards.map(renderSimCard)}
        </View>

        {filteredSimCards.length === 0 && (
          <View style={styles.emptyState}>
            <Package size={48} color={Theme.Colors.textSecondary} />
            <Text style={styles.emptyStateTitle}>No SIMs Found</Text>
            <Text style={styles.emptyStateDescription}>
              {searchQuery || selectedStatus !== 'all' || selectedNetwork !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No SIM cards in inventory'}
            </Text>
            {!searchQuery && selectedStatus === 'all' && selectedNetwork === 'all' && (
              <Button
                title="Add New SIM"
                onPress={handleAddNewSim}
                style={styles.emptyStateButton}
              />
            )}
          </View>
        )}
      </ScrollView>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.Spacing.sm,
  },
  headerButton: {
    padding: Theme.Spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: Theme.Spacing.md,
    gap: Theme.Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.md,
    alignItems: 'center',
    ...Theme.Shadows.sm,
  },
  statNumber: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
    marginTop: Theme.Spacing.xs,
  },
  statLabel: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.textSecondary,
    textAlign: 'center',
    marginTop: Theme.Spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingBottom: Theme.Spacing.md,
    gap: Theme.Spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.lg,
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
    ...Theme.Shadows.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: Theme.Spacing.sm,
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
  },
  filterButton: {
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.md,
    ...Theme.Shadows.sm,
  },
  filterButtonActive: {
    backgroundColor: Theme.Colors.primary,
  },
  filtersContainer: {
    paddingBottom: Theme.Spacing.md,
  },
  filterTitle: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.sm,
    marginTop: Theme.Spacing.sm,
  },
  filterScrollView: {
    marginBottom: Theme.Spacing.sm,
  },
  filterScrollContent: {
    paddingRight: Theme.Spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.full,
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
    marginRight: Theme.Spacing.sm,
    ...Theme.Shadows.sm,
  },
  filterChipText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textPrimary,
  },
  filterChipCount: {
    fontSize: Theme.Typography.fontSize.xs,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textSecondary,
    marginLeft: Theme.Spacing.xs,
    backgroundColor: Theme.Colors.gray100,
    borderRadius: Theme.BorderRadius.full,
    paddingHorizontal: Theme.Spacing.xs,
    paddingVertical: 2,
    minWidth: 20,
    textAlign: 'center',
  },
  networkChip: {
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.full,
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
    marginRight: Theme.Spacing.sm,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },
  networkChipSelected: {
    backgroundColor: Theme.Colors.primary,
    borderColor: Theme.Colors.primary,
  },
  networkChipText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textPrimary,
  },
  networkChipTextSelected: {
    color: Theme.Colors.white,
  },
  resultsHeader: {
    paddingBottom: Theme.Spacing.sm,
  },
  resultsCount: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
  },
  simCardsList: {
    paddingBottom: Theme.Spacing.xl,
  },
  simCard: {
    marginBottom: Theme.Spacing.md,
  },
  simCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.Spacing.md,
  },
  simCardInfo: {
    flex: 1,
  },
  simNumber: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
  },
  network: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    marginTop: Theme.Spacing.xs,
  },
  simCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.Spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: Theme.Spacing.xs,
    borderRadius: Theme.BorderRadius.full,
    gap: Theme.Spacing.xs,
  },
  statusText: {
    fontSize: Theme.Typography.fontSize.xs,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.white,
  },
  actionButton: {
    padding: Theme.Spacing.xs,
  },
  simCardDetails: {
    gap: Theme.Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  detailValue: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textPrimary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  priceValue: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.success,
    fontWeight: Theme.Typography.fontWeight.bold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Theme.Spacing.xl * 2,
  },
  emptyStateTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginTop: Theme.Spacing.md,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    textAlign: 'center',
    marginTop: Theme.Spacing.sm,
    lineHeight: Theme.Typography.lineHeight.relaxed * Theme.Typography.fontSize.base,
  },
  emptyStateButton: {
    marginTop: Theme.Spacing.lg,
  },
});
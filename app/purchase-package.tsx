import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { QrCode, Package, Zap, Phone, Wifi, X, Check } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import StandardLayout from '@/components/layout/StandardLayout';
import Card from '@/components/ui/Card';
import TransactionAuth from '@/components/ui/TransactionAuth';

interface PackageItem {
  id: string;
  name: string;
  description: string;
  price: number;
  validity: string;
  category: 'popular' | 'data' | 'voice' | 'combo';
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: string;
  features: string[];
}

const mockPackages: PackageItem[] = [
  {
    id: '1',
    name: 'Smart Starter',
    description: 'Perfect for light users',
    price: 45,
    validity: '30 days',
    category: 'popular',
    size: 'S',
    color: '#10B981',
    features: ['2GB Data', '500 Minutes', '1000 SMS', 'Basic Support'],
  },
  {
    id: '2',
    name: 'Data Boost 5GB',
    description: 'High-speed data package',
    price: 85,
    validity: '30 days',
    category: 'data',
    size: 'M',
    color: '#3B82F6',
    features: ['5GB High-Speed Data', '4G/5G Access', 'Data Rollover', 'Hotspot Sharing'],
  },
  {
    id: '3',
    name: 'Voice Unlimited',
    description: 'Unlimited calling package',
    price: 65,
    validity: '30 days',
    category: 'voice',
    size: 'M',
    color: '#F59E0B',
    features: ['Unlimited Local Calls', 'International Minutes', 'Call Waiting', 'Voicemail'],
  },
  {
    id: '4',
    name: 'Ultimate Combo',
    description: 'Best value for everything',
    price: 180,
    validity: '30 days',
    category: 'combo',
    size: 'L',
    color: '#8B5CF6',
    features: ['15GB Data', 'Unlimited Calls', '2000 SMS', 'Premium Support'],
  },
  {
    id: '5',
    name: 'Data Pro 25GB',
    description: 'Heavy data users',
    price: 150,
    validity: '30 days',
    category: 'data',
    size: 'XL',
    color: '#3B82F6',
    features: ['25GB High-Speed Data', '5G Priority', 'Unlimited Hotspot', 'Cloud Storage'],
  },
  {
    id: '6',
    name: 'Business Voice Pro',
    description: 'Professional calling solution',
    price: 120,
    validity: '30 days',
    category: 'voice',
    size: 'L',
    color: '#F59E0B',
    features: ['Unlimited Calls', 'Conference Calling', 'Call Recording', 'Business Support'],
  },
  {
    id: '7',
    name: 'Premium All-in-One',
    description: 'Ultimate package for power users',
    price: 350,
    validity: '30 days',
    category: 'popular',
    size: 'XXL',
    color: '#10B981',
    features: ['50GB Data', 'Unlimited Everything', 'Premium Roaming', 'VIP Support'],
  },
  {
    id: '8',
    name: 'Family Combo',
    description: 'Perfect for families',
    price: 220,
    validity: '30 days',
    category: 'combo',
    size: 'XL',
    color: '#8B5CF6',
    features: ['30GB Shared Data', 'Family Calling', 'Parental Controls', 'Multi-SIM Support'],
  },
];

const categories = [
  { id: 'popular', label: 'Popular', icon: Package },
  { id: 'data', label: 'Data', icon: Wifi },
  { id: 'voice', label: 'Voice', icon: Phone },
  { id: 'combo', label: 'Combo', icon: Zap },
] as const;

export default function PurchasePackagesScreen() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'popular' | 'data' | 'voice' | 'combo'>('popular');
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isNumberValid = mobileNumber.length === 7;

  const filteredPackages = useMemo(() => {
    return mockPackages.filter(pkg => pkg.category === selectedCategory);
  }, [selectedCategory]);

  const handlePackageSelect = (pkg: PackageItem) => {
    console.log('Package selected:', pkg.name);
    setSelectedPackage(pkg);
    setShowPurchaseModal(true);
    console.log('Modal should be visible now');
  };

  const handlePurchaseConfirm = async () => {
    if (!selectedPackage) return;
    
    // Show authentication modal before processing
    setShowPurchaseModal(false);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = async () => {
    if (!selectedPackage) return;
    
    setShowAuthModal(false);
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Purchase Successful',
        `${selectedPackage.name} has been successfully purchased for +248${mobileNumber}`,
        [{ text: 'OK', onPress: () => setSelectedPackage(null) }]
      );
    }, 2000);
  };

  const handleAuthCancel = () => {
    setShowAuthModal(false);
    setShowPurchaseModal(true); // Go back to purchase modal
  };

  const handlePurchaseCancel = () => {
    setShowPurchaseModal(false);
    setSelectedPackage(null);
  };

  const formatCurrency = (value: number) => {
    return `SCR ${value.toFixed(2)}`;
  };

  const renderPackageCard = (pkg: PackageItem) => (
    <Card key={pkg.id} style={styles.packageCard}>
      <View style={styles.packageHeader}>
        <View style={styles.packageInfo}>
          <Text style={styles.packageName}>{pkg.name}</Text>
          <Text style={styles.packageDescription}>{pkg.description}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>SR {pkg.price}</Text>
          <Text style={styles.validity}>{pkg.validity}</Text>
        </View>
      </View>
      
      <View style={styles.featuresContainer}>
        {pkg.features.map((feature) => (
          <View key={feature} style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: pkg.color }]} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.packageFooter}>
        <TouchableOpacity 
          style={[styles.selectButton, { borderColor: pkg.color }]}
          onPress={() => {
            console.log('Select button pressed for:', pkg.name);
            handlePackageSelect(pkg);
          }}
        >
          <Text style={[styles.selectButtonText, { color: pkg.color }]}>Select Package</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <StandardLayout title="Purchase Packages">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mobile Number</Text>
            <View style={styles.inputRow}>
              <Text style={styles.countryCode}>+248</Text>
              <TextInput
                style={styles.mobileInput}
                placeholder="Enter Mobile Number"
                value={mobileNumber}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '').slice(0, 7);
                  setMobileNumber(numericText);
                }}
                keyboardType="phone-pad"
                maxLength={7}
              />
              <TouchableOpacity style={styles.qrIconButton}>
                <QrCode size={24} color={Theme.Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {isNumberValid && (
            <>
              <View style={styles.categoriesContainer}>
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  const isSelected = selectedCategory === category.id;
                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryTab,
                        isSelected && styles.selectedCategoryTab,
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <IconComponent 
                        size={18} 
                        color={isSelected ? Theme.Colors.white : Theme.Colors.textSecondary} 
                      />
                      <Text
                        style={[
                          styles.categoryTabText,
                          isSelected && styles.selectedCategoryTabText,
                        ]}
                      >
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                  {filteredPackages.length} {selectedCategory} packages available
                </Text>
              </View>

              <View style={styles.packagesContainer}>
                {filteredPackages.length > 0 ? (
                  filteredPackages.map(renderPackageCard)
                ) : (
                  <View style={styles.emptyState}>
                    <Package size={48} color={Theme.Colors.textSecondary} />
                    <Text style={styles.emptyStateText}>No Packages found</Text>
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Purchase Confirmation Modal */}
      <Modal
        visible={showPurchaseModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handlePurchaseCancel}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
            handlePurchaseCancel();
          }}>
            <View style={styles.modalOverlayTouchable}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Purchase</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handlePurchaseCancel}
              >
                <X size={24} color={Theme.Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {selectedPackage && (
              <>
                <View style={styles.modalPackageInfo}>
                  <View style={styles.modalPackageHeader}>
                    <Text style={styles.modalPackageName}>{selectedPackage.name}</Text>
                    <Text style={styles.modalPackagePrice}>SR {selectedPackage.price}</Text>
                  </View>
                  <Text style={styles.modalPackageDescription}>{selectedPackage.description}</Text>
                  <Text style={styles.modalPackageValidity}>Valid for {selectedPackage.validity}</Text>
                </View>

                <View style={styles.modalCustomerInfo}>
                  <Text style={styles.modalCustomerLabel}>Mobile Number:</Text>
                  <Text style={styles.modalCustomerValue}>+248 {mobileNumber}</Text>
                </View>

                <View style={styles.modalFeatures}>
                  <Text style={styles.modalFeaturesTitle}>Package Features:</Text>
                  {selectedPackage.features.map((feature, index) => (
                    <View key={index} style={styles.modalFeatureItem}>
                      <Check size={16} color={selectedPackage.color} />
                      <Text style={styles.modalFeatureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={handlePurchaseCancel}
                    disabled={isProcessing}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.confirmButton, { backgroundColor: selectedPackage.color }]}
                    onPress={handlePurchaseConfirm}
                    disabled={isProcessing}
                  >
                    <Text style={styles.confirmButtonText}>
                      {isProcessing ? 'Processing...' : 'Authenticate & Purchase'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Transaction Authentication Modal */}
      <TransactionAuth
        visible={showAuthModal}
        onSuccess={handleAuthSuccess}
        onCancel={handleAuthCancel}
        title="Confirm Purchase"
        description={`Please authenticate to purchase ${selectedPackage?.name || 'this package'}`}
        amount={selectedPackage ? formatCurrency(selectedPackage.price) : undefined}
      />
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Theme.Spacing.md,
  },
  section: {
    marginBottom: Theme.Spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    paddingHorizontal: Theme.Spacing.md,
  },
  countryCode: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textSecondary,
    marginRight: Theme.Spacing.sm,
  },
  mobileInput: {
    flex: 1,
    height: Theme.Layout.inputHeight,
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
  },
  qrIconButton: {
    padding: Theme.Spacing.sm,
    marginLeft: Theme.Spacing.sm,
    borderRadius: Theme.BorderRadius.md,
    backgroundColor: Theme.Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.xs,
    marginBottom: Theme.Spacing.md,
    ...Theme.Shadows.sm,
  },
  categoryTab: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: Theme.Spacing.sm,
    paddingHorizontal: Theme.Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.BorderRadius.md,
    gap: Theme.Spacing.xs,
  },
  selectedCategoryTab: {
    backgroundColor: Theme.Colors.primary,
  },
  categoryTabText: {
    fontSize: Theme.Typography.fontSize.xs,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textSecondary,
    textAlign: 'center',
    numberOfLines: 1,
  },
  selectedCategoryTabText: {
    color: Theme.Colors.white,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    textAlign: 'center',
    numberOfLines: 1,
  },
  resultsHeader: {
    marginBottom: Theme.Spacing.md,
  },
  resultsCount: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    textTransform: 'capitalize',
  },
  packagesContainer: {
    gap: Theme.Spacing.md,
    paddingBottom: Theme.Spacing.xl,
  },
  packageCard: {
    marginBottom: 0,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.Spacing.md,
  },
  packageInfo: {
    flex: 1,
    marginRight: Theme.Spacing.md,
  },
  packageName: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.xs,
  },
  packageDescription: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
  },
  validity: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.textSecondary,
    marginTop: Theme.Spacing.xs,
  },
  featuresContainer: {
    marginBottom: Theme.Spacing.md,
    gap: Theme.Spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.Spacing.sm,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  featureText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    flex: 1,
  },
  packageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  selectButton: {
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
    borderRadius: Theme.BorderRadius.md,
    borderWidth: 1.5,
  },
  selectButtonText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Theme.Spacing.xl * 2,
  },
  emptyStateText: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textSecondary,
    marginTop: Theme.Spacing.md,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
  },
  modalOverlayTouchable: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.Spacing.md,
  },
  modalContent: {
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.xl,
    padding: Theme.Spacing.lg,
    width: '100%',
    maxWidth: 400,
    ...Theme.Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.lg,
  },
  modalTitle: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
  },
  closeButton: {
    padding: Theme.Spacing.xs,
  },
  modalPackageInfo: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.md,
  },
  modalPackageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  modalPackageName: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
  },
  modalPackagePrice: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.primary,
  },
  modalPackageDescription: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    marginBottom: Theme.Spacing.xs,
  },
  modalPackageValidity: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.textSecondary,
    fontStyle: 'italic',
  },
  modalCustomerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.border,
    marginBottom: Theme.Spacing.md,
  },
  modalCustomerLabel: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
  },
  modalCustomerValue: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
  },
  modalFeatures: {
    marginBottom: Theme.Spacing.lg,
  },
  modalFeaturesTitle: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.sm,
  },
  modalFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.Spacing.sm,
    marginBottom: Theme.Spacing.xs,
  },
  modalFeatureText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Theme.Spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Theme.Spacing.md,
    borderRadius: Theme.BorderRadius.lg,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textSecondary,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: Theme.Spacing.md,
    borderRadius: Theme.BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.white,
  },
});
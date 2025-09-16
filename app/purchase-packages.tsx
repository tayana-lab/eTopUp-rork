import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Keyboard,
} from 'react-native';
import { QrCode, Package, Zap, Phone, Wifi, PackageOpen, X, CheckCircle } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { useTransactionPin } from '@/contexts/TransactionPinContext';
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
  numberType: 'Prepaid' | 'Postpaid';
}

const prepaidPackages: PackageItem[] = [
  {
    id: 'p1',
    name: 'Prepaid Starter',
    description: 'Perfect for light users',
    price: 25,
    validity: '7 days',
    category: 'popular',
    size: 'S',
    color: '#10B981',
    features: ['1GB Data', '100 Minutes', '500 SMS', 'Basic Support'],
    numberType: 'Prepaid',
  },
  {
    id: 'p2',
    name: 'Prepaid Data 3GB',
    description: 'High-speed data for prepaid',
    price: 45,
    validity: '15 days',
    category: 'data',
    size: 'M',
    color: '#3B82F6',
    features: ['3GB High-Speed Data', '4G Access', 'Social Media Free', 'Hotspot Sharing'],
    numberType: 'Prepaid',
  },
  {
    id: 'p3',
    name: 'Prepaid Voice Plus',
    description: 'More calling minutes',
    price: 35,
    validity: '15 days',
    category: 'voice',
    size: 'M',
    color: '#F59E0B',
    features: ['500 Local Minutes', '50 International Minutes', 'Call Waiting', 'SMS Pack'],
    numberType: 'Prepaid',
  },
  {
    id: 'p4',
    name: 'Prepaid Weekly Combo',
    description: 'Best weekly value',
    price: 55,
    validity: '7 days',
    category: 'combo',
    size: 'L',
    color: '#8B5CF6',
    features: ['5GB Data', '300 Minutes', '1000 SMS', 'Social Apps Free'],
    numberType: 'Prepaid',
  },
  {
    id: 'p5',
    name: 'Prepaid Data Pro 10GB',
    description: 'Heavy data users',
    price: 85,
    validity: '30 days',
    category: 'data',
    size: 'XL',
    color: '#3B82F6',
    features: ['10GB High-Speed Data', '4G Priority', 'YouTube Free', 'Night Data Bonus'],
    numberType: 'Prepaid',
  },
  {
    id: 'p6',
    name: 'Prepaid Monthly Max',
    description: 'Ultimate prepaid package',
    price: 120,
    validity: '30 days',
    category: 'popular',
    size: 'XXL',
    color: '#10B981',
    features: ['20GB Data', '1000 Minutes', '2000 SMS', 'All Apps Free'],
    numberType: 'Prepaid',
  },
];

const postpaidPackages: PackageItem[] = [
  {
    id: 'po1',
    name: 'Postpaid Basic',
    description: 'Essential postpaid plan',
    price: 65,
    validity: '30 days',
    category: 'popular',
    size: 'S',
    color: '#10B981',
    features: ['5GB Data', 'Unlimited Local Calls', '1000 SMS', 'Bill Protection'],
    numberType: 'Postpaid',
  },
  {
    id: 'po2',
    name: 'Postpaid Data 15GB',
    description: 'High-speed data postpaid',
    price: 95,
    validity: '30 days',
    category: 'data',
    size: 'M',
    color: '#3B82F6',
    features: ['15GB High-Speed Data', '5G Access', 'Data Rollover', 'International Roaming'],
    numberType: 'Postpaid',
  },
  {
    id: 'po3',
    name: 'Postpaid Voice Unlimited',
    description: 'Unlimited calling postpaid',
    price: 85,
    validity: '30 days',
    category: 'voice',
    size: 'M',
    color: '#F59E0B',
    features: ['Unlimited Local Calls', 'International Minutes', 'Conference Calling', 'Voicemail Plus'],
    numberType: 'Postpaid',
  },
  {
    id: 'po4',
    name: 'Postpaid Business Pro',
    description: 'Professional business plan',
    price: 150,
    validity: '30 days',
    category: 'combo',
    size: 'L',
    color: '#8B5CF6',
    features: ['25GB Data', 'Unlimited Calls', 'Business Support', 'Priority Network'],
    numberType: 'Postpaid',
  },
  {
    id: 'po5',
    name: 'Postpaid Data Pro 50GB',
    description: 'Heavy data users',
    price: 180,
    validity: '30 days',
    category: 'data',
    size: 'XL',
    color: '#3B82F6',
    features: ['50GB High-Speed Data', '5G Priority', 'Unlimited Hotspot', 'Cloud Storage Pro'],
    numberType: 'Postpaid',
  },
  {
    id: 'po6',
    name: 'Postpaid Premium Unlimited',
    description: 'Ultimate postpaid experience',
    price: 250,
    validity: '30 days',
    category: 'popular',
    size: 'XXL',
    color: '#10B981',
    features: ['Unlimited Data', 'Unlimited Everything', 'Premium Roaming', 'VIP Support'],
    numberType: 'Postpaid',
  },
  {
    id: 'po7',
    name: 'Postpaid Family Plan',
    description: 'Perfect for families',
    price: 280,
    validity: '30 days',
    category: 'combo',
    size: 'XL',
    color: '#8B5CF6',
    features: ['100GB Shared Data', 'Family Calling', 'Parental Controls', 'Multi-SIM Support'],
    numberType: 'Postpaid',
  },
];

const categories = [
  { id: 'popular', label: 'Popular', icon: Package },
  { id: 'data', label: 'Data', icon: Wifi },
  { id: 'voice', label: 'Voice', icon: Phone },
  { id: 'combo', label: 'Combo', icon: Zap },
] as const;

// Mock function to determine number type
const getNumberType = (number: string): 'Prepaid' | 'Postpaid' => {
  // Mock logic: numbers starting with 2, 4, 6 are Prepaid, others are Postpaid
  const firstDigit = parseInt(number.charAt(0));
  return [2, 4, 6].includes(firstDigit) ? 'Prepaid' : 'Postpaid';
};

export default function PurchasePackagesScreen() {
  const { checkTransactionPinRequired } = useTransactionPin();
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'popular' | 'data' | 'voice' | 'combo'>('popular');
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const mobileInputRef = useRef<TextInput>(null);
  
  const isNumberValid = mobileNumber.length === 7;
  const numberType = isNumberValid ? getNumberType(mobileNumber) : null;

  const filteredPackages = useMemo(() => {
    if (!isNumberValid || !numberType) return [];
    
    const availablePackages = numberType === 'Prepaid' ? prepaidPackages : postpaidPackages;
    return availablePackages.filter(pkg => pkg.category === selectedCategory);
  }, [selectedCategory, isNumberValid, numberType]);

  const handleSelectPackage = (pkg: PackageItem) => {
    console.log('Package selected:', pkg.name);
    setSelectedPackage(pkg);
    setShowPurchaseModal(true);
    console.log('Modal should show:', true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPackage) return;
    
    // Check if transaction PIN is required
    if (checkTransactionPinRequired()) {
      setShowPurchaseModal(false);
      setShowAuthModal(true);
    } else {
      // Proceed directly without authentication
      setShowPurchaseModal(false);
      await processPurchase();
    }
  };

  const handleAuthSuccess = async () => {
    setShowAuthModal(false);
    await processPurchase();
  };

  const handleAuthCancel = () => {
    setShowAuthModal(false);
    setShowPurchaseModal(true); // Go back to purchase modal
  };

  const processPurchase = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };

  const handleCancelPurchase = () => {
    setShowPurchaseModal(false);
    setSelectedPackage(null);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setSelectedPackage(null);
    setMobileNumber('');
    setShowPurchaseModal(false);
    setShowAuthModal(false);
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
            handleSelectPackage(pkg);
          }}
          activeOpacity={0.7}
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
                ref={mobileInputRef}
                style={styles.mobileInput}
                placeholder="Enter Mobile Number"
                value={mobileNumber}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '').slice(0, 7);
                  setMobileNumber(numericText);
                  // Auto-close keyboard after 7 digits
                  if (numericText.length === 7) {
                    Keyboard.dismiss();
                  }
                }}
                keyboardType="phone-pad"
                maxLength={7}
              />
              <TouchableOpacity style={styles.qrIconButton}>
                <QrCode size={24} color={Theme.Colors.primary} />
              </TouchableOpacity>
            </View>
            
            {/* Number Type Display */}
            {isNumberValid && numberType && (
              <View style={styles.numberTypeContainer}>
                <Text style={styles.numberTypeLabel}>Number Type:</Text>
                <View style={[styles.numberTypeBadge, 
                  numberType === 'Prepaid' ? styles.prepaidBadge : styles.postpaidBadge
                ]}>
                  <Text style={[styles.numberTypeText,
                    numberType === 'Prepaid' ? styles.prepaidText : styles.postpaidText
                  ]}>
                    {numberType}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {isNumberValid ? (
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
                  {filteredPackages.length} {selectedCategory} packages available for {numberType}
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
          ) : (
            <View style={styles.emptyState}>
              <PackageOpen size={100} color={Theme.Colors.textTertiary} />
              <Text style={styles.emptyStateText}>No Packages found</Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Purchase Confirmation Modal */}
      <Modal
        visible={showPurchaseModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelPurchase}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pack Purchase</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleCancelPurchase}
              >
                <X size={24} color={Theme.Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {selectedPackage && (
              <>
                <View style={styles.packageSummary}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Package:</Text>
                    <Text style={styles.summaryValue}>{selectedPackage.name}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Mobile Number:</Text>
                    <Text style={styles.summaryValue}>+248{mobileNumber}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Price:</Text>
                    <Text style={styles.summaryPrice}>SR {selectedPackage.price}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Validity:</Text>
                    <Text style={styles.summaryValue}>{selectedPackage.validity}</Text>
                  </View>
                </View>
                
                <View style={styles.featuresPreview}>
                  <Text style={styles.featuresTitle}>Package Features:</Text>
                  {selectedPackage.features.map((feature, index) => (
                    <View key={index} style={styles.featurePreviewItem}>
                      <CheckCircle size={16} color={selectedPackage.color} />
                      <Text style={styles.featurePreviewText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={handleCancelPurchase}
                    disabled={isProcessing}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.confirmButton, { backgroundColor: selectedPackage.color }]}
                    onPress={handleConfirmPurchase}
                    disabled={isProcessing}
                  >
                    <Text style={styles.confirmButtonText}>
                      {isProcessing ? 'Processing...' : 'Confirm'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccess}
        transparent={true}
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <CheckCircle size={64} color={Theme.Colors.success} />
            <Text style={styles.successTitle}>Purchase Successful!</Text>
            <Text style={styles.successMessage}>
              {selectedPackage && `${selectedPackage.name} has been successfully purchased for +248${mobileNumber}`}
            </Text>
            <View style={styles.successDetails}>
              {selectedPackage && (
                <>
                  <View style={styles.successDetailRow}>
                    <Text style={styles.successDetailLabel}>Package:</Text>
                    <Text style={styles.successDetailValue}>{selectedPackage.name}</Text>
                  </View>
                  <View style={styles.successDetailRow}>
                    <Text style={styles.successDetailLabel}>Amount:</Text>
                    <Text style={styles.successDetailPrice}>SR {selectedPackage.price}</Text>
                  </View>
                  <View style={styles.successDetailRow}>
                    <Text style={styles.successDetailLabel}>Mobile Number:</Text>
                    <Text style={styles.successDetailValue}>+248{mobileNumber}</Text>
                  </View>
                  <View style={styles.successDetailRow}>
                    <Text style={styles.successDetailLabel}>Validity:</Text>
                    <Text style={styles.successDetailValue}>{selectedPackage.validity}</Text>
                  </View>
                </>
              )}
            </View>
            <TouchableOpacity 
              style={styles.successButton}
              onPress={handleSuccessClose}
            >
              <Text style={styles.successButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Transaction Authentication Modal */}
      <TransactionAuth
        visible={showAuthModal}
        onSuccess={handleAuthSuccess}
        onCancel={handleAuthCancel}
        title="Confirm Package Purchase"
        description={`Please authenticate to purchase ${selectedPackage?.name || ''} for +248${mobileNumber}`}
        amount={selectedPackage ? `SR ${selectedPackage.price}` : undefined}
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
    paddingVertical: Theme.Spacing.xl * 6,
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
  packageSummary: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  summaryLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  summaryValue: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textPrimary,
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },
  summaryPrice: {
    fontSize: Theme.Typography.fontSize.lg,
    color: Theme.Colors.primary,
    fontWeight: Theme.Typography.fontWeight.bold,
  },
  featuresPreview: {
    marginBottom: Theme.Spacing.lg,
  },
  featuresTitle: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.sm,
  },
  featurePreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.Spacing.sm,
    marginBottom: Theme.Spacing.xs,
  },
  featurePreviewText: {
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
    paddingHorizontal: Theme.Spacing.lg,
    borderRadius: Theme.BorderRadius.lg,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textSecondary,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.lg,
    borderRadius: Theme.BorderRadius.lg,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.white,
  },
  successModal: {
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.xl,
    padding: Theme.Spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    ...Theme.Shadows.lg,
  },
  successTitle: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
    textAlign: 'center',
    marginTop: Theme.Spacing.md,
    marginBottom: Theme.Spacing.md,
  },
  successMessage: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.Spacing.lg,
    lineHeight: 24,
  },
  successDetails: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.md,
    width: '100%',
    marginBottom: Theme.Spacing.lg,
  },
  successDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  successDetailLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  successDetailValue: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textPrimary,
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },
  successDetailPrice: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.primary,
    fontWeight: Theme.Typography.fontWeight.bold,
  },
  successButton: {
    backgroundColor: Theme.Colors.primary,
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.xl,
    borderRadius: Theme.BorderRadius.lg,
    width: '100%',
    alignItems: 'center',
  },
  successButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.white,
  },
  numberTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.Spacing.md,
    gap: Theme.Spacing.sm,
  },
  numberTypeLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  numberTypeBadge: {
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: Theme.Spacing.xs,
    borderRadius: Theme.BorderRadius.md,
    borderWidth: 1,
  },
  prepaidBadge: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  postpaidBadge: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  numberTypeText: {
    fontSize: Theme.Typography.fontSize.xs,
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },
  prepaidText: {
    color: '#3B82F6',
  },
  postpaidText: {
    color: '#10B981',
  },
});
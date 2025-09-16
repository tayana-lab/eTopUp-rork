import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  QrCode,
  CheckCircle,
  Wifi,
  Calendar,
  Globe,
  Zap,
  WalletCards,
  Smartphone,
  Receipt
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTransactionPin } from '@/contexts/TransactionPinContext';
import Button from '@/components/ui/Button';
import BackgroundImage from '@/components/ui/BackgroundImage';
import StandardLayout from '@/components/layout/StandardLayout';
import TransactionAuth from '@/components/ui/TransactionAuth';
import * as Haptics from 'expo-haptics';

// Mock bill data (both broadband and mobile) - Updated with recent dates
const MOCK_BILLS = {
  // Broadband bills
  'BB001234567': {
    accountNumber: 'BB001234567',
    customerName: 'John Doe',
    serviceAddress: '123 Main Street, Victoria, Mahe',
    planName: 'Fiber Pro 100Mbps',
    billAmount: 850.00,
    dueDate: '2025-01-25',
    serviceType: 'fiber',
    billType: 'broadband',
    lastBillDate: '2024-12-25',
    dataUsage: '450GB / 500GB',
    status: 'pending'
  },
  'BB007654321': {
    accountNumber: 'BB007654321',
    customerName: 'Jane Smith',
    serviceAddress: '456 Ocean View, Praslin',
    planName: 'ADSL Standard 25Mbps',
    billAmount: 520.75,
    dueDate: '2025-01-28',
    serviceType: 'adsl',
    billType: 'broadband',
    lastBillDate: '2024-12-28',
    dataUsage: 'Unlimited',
    status: 'pending'
  },
  'BB111111111': {
    accountNumber: 'BB111111111',
    customerName: 'Alice Johnson',
    serviceAddress: '789 Paradise Road, Victoria, Mahe',
    planName: 'Fiber Ultra 200Mbps',
    billAmount: 1250.00,
    dueDate: '2025-01-30',
    serviceType: 'fiber',
    billType: 'broadband',
    lastBillDate: '2024-12-30',
    dataUsage: '850GB / 1TB',
    status: 'pending'
  },
  'BB12345': {
    accountNumber: 'BB12345',
    customerName: 'Test User',
    serviceAddress: '123 Test Street, Victoria, Mahe',
    planName: 'Fiber Test 100Mbps',
    billAmount: 500.00,
    dueDate: '2025-01-22',
    serviceType: 'fiber',
    billType: 'broadband',
    lastBillDate: '2024-12-22',
    dataUsage: '300GB / 500GB',
    status: 'pending'
  },
  // Mobile bills
  '2484567890': {
    accountNumber: '2484567890',
    customerName: 'Michael Brown',
    serviceAddress: '321 Mobile Street, Victoria, Mahe',
    planName: 'Postpaid Unlimited',
    billAmount: 450.00,
    dueDate: '2025-01-26',
    serviceType: 'postpaid',
    billType: 'mobile',
    lastBillDate: '2024-12-26',
    dataUsage: '25GB / 30GB',
    status: 'pending'
  },
  '2484567891': {
    accountNumber: '2484567891',
    customerName: 'Sarah Wilson',
    serviceAddress: '654 Phone Avenue, Praslin',
    planName: 'Business Mobile Plan',
    billAmount: 680.00,
    dueDate: '2025-01-29',
    serviceType: 'postpaid',
    billType: 'mobile',
    lastBillDate: '2024-12-29',
    dataUsage: '45GB / 50GB',
    status: 'pending'
  },
  '248123456': {
    accountNumber: '248123456',
    customerName: 'David Lee',
    serviceAddress: '987 Cellular Road, Victoria, Mahe',
    planName: 'Family Mobile Plan',
    billAmount: 320.00,
    dueDate: '2025-01-24',
    serviceType: 'postpaid',
    billType: 'mobile',
    lastBillDate: '2024-12-24',
    dataUsage: '18GB / 25GB',
    status: 'pending'
  },
};

export default function BroadbandBillPayScreen() {
  const { colors } = useTheme();
  const { checkTransactionPinRequired } = useTransactionPin();
  const insets = useSafeAreaInsets();
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [billDetails, setBillDetails] = useState<any>(null);
  const [isFromQRScan, setIsFromQRScan] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isLoadingBill, setIsLoadingBill] = useState<boolean>(false);
  const [paymentType, setPaymentType] = useState<'full' | 'custom'>('full');
  const [customAmount, setCustomAmount] = useState<string>('');

  const handleQRScan = () => {
    Alert.alert(
      'QR Scanner',
      'QR scanner would open here. For demo, using mock account.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Use Mock',
          onPress: () => {
            setAccountNumber('BB001234567');
            setIsFromQRScan(true);
            handleFetchBill('BB001234567');
          },
        },
      ]
    );
  };

  const formatAccountNumber = (number: string) => {
    if (isFromQRScan && number.length > 4) {
      return `****${number.slice(-4)}`;
    }
    return number;
  };

  const handleAccountNumberChange = (text: string) => {
    // Allow alphanumeric characters for broadband account numbers
    const cleanText = text.replace(/[^A-Za-z0-9]/g, '').slice(0, 11);
    setAccountNumber(cleanText);
    setBillDetails(null);
    if (text.length > 0) {
      setIsFromQRScan(false);
    }
    
    // Auto-fetch bill details when account number is complete
    if (cleanText.length >= 8) {
      handleFetchBill(cleanText);
    }
  };

  const handleFetchBill = async (account?: string) => {
    const accountToUse = account || accountNumber;
    if (!accountToUse.trim() || accountToUse.length < 8) {
      Alert.alert('Error', 'Please enter a valid account number (minimum 8 characters)');
      return;
    }

    setIsLoadingBill(true);
    
    // Mock API call to fetch bill details
    setTimeout(() => {
      const mockBill = MOCK_BILLS[accountToUse as keyof typeof MOCK_BILLS];
      
      if (mockBill) {
        setBillDetails(mockBill);
      } else {
        setBillDetails(null);
      }
      setIsLoadingBill(false);
    }, 1000);
  };

  const formatCurrency = (value: number) => {
    return `SCR ${value.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePayBill = async () => {
    if (!billDetails) {
      Alert.alert('Error', 'No bill details available');
      return;
    }

    if (paymentType === 'custom') {
      const amount = parseFloat(customAmount);
      if (!customAmount.trim() || isNaN(amount) || amount <= 0) {
        Alert.alert('Error', 'Please enter a valid custom amount');
        return;
      }
      if (amount > billDetails.billAmount) {
        Alert.alert('Error', 'Custom amount cannot exceed the bill amount');
        return;
      }
    }

    setShowConfirmModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!billDetails) {
      return;
    }

    // Check if transaction PIN is required
    if (checkTransactionPinRequired()) {
      setShowConfirmModal(false);
      setShowAuthModal(true);
    } else {
      // Proceed directly without authentication
      await processPayment();
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  const handleAuthSuccess = async () => {
    setShowAuthModal(false);
    await processPayment();
  };

  const handleAuthCancel = () => {
    setShowAuthModal(false);
    setShowConfirmModal(true); // Go back to confirmation modal
  };

  const processPayment = async () => {
    setShowConfirmModal(false);
    setIsProcessing(true);
    
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Mock payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setAccountNumber('');
    setBillDetails(null);
    setIsFromQRScan(false);
    setIsProcessing(false);
    setShowConfirmModal(false);
    setShowAuthModal(false);
    setPaymentType('full');
    setCustomAmount('');
  };

  const formatCurrencyForAuth = (value: number) => {
    return `SCR ${value.toFixed(2)}`;
  };

  const getPaymentAmount = () => {
    if (paymentType === 'custom' && customAmount) {
      return parseFloat(customAmount);
    }
    return billDetails?.billAmount || 0;
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getBillStatusColor = (dueDate: string) => {
    const daysUntilDue = getDaysUntilDue(dueDate);
    if (daysUntilDue < 0) return colors.error;
    if (daysUntilDue <= 3) return colors.warning;
    return colors.success;
  };

  const getServiceIcon = (billType: string, serviceType: string) => {
    if (billType === 'mobile') {
      return <Smartphone size={24} color={colors.primary} />;
    }
    
    // Broadband icons
    switch (serviceType) {
      case 'fiber':
        return <Zap size={24} color={colors.primary} />;
      case 'adsl':
        return <Globe size={24} color={colors.primary} />;
      case 'wireless':
        return <Wifi size={24} color={colors.primary} />;
      default:
        return <Wifi size={24} color={colors.primary} />;
    }
  };

  return (
    <StandardLayout title="Bill Pay">
      <BackgroundImage style={[styles.container, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
          {/* Account Number Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Account Number</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TextInput
                style={[styles.accountInput, { color: colors.textPrimary }]}
                placeholder="Enter account number"
                placeholderTextColor={colors.textSecondary}
                value={formatAccountNumber(accountNumber)}
                onChangeText={handleAccountNumberChange}
                maxLength={11}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={[styles.qrIconButton, { backgroundColor: colors.surfaceSecondary }]} onPress={handleQRScan}>
                <QrCode size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            {isLoadingBill && (
              <View style={[styles.loadingContainer, { backgroundColor: colors.surfaceSecondary }]}>
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Fetching bill details...</Text>
              </View>
            )}
            

          </View>

          {/* Bill Details Section */}
          {billDetails ? (
            <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Bill Details</Text>
              <View style={[styles.billDetailsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.billHeader, { borderBottomColor: colors.borderLight }]}>
                  {getServiceIcon(billDetails.billType, billDetails.serviceType)}
                  <View style={styles.billHeaderText}>
                    <Text style={[styles.accountNumber, { color: colors.textSecondary }]}>Account: {billDetails.accountNumber}</Text>
                    <Text style={[styles.customerName, { color: colors.textPrimary }]}>{billDetails.customerName}</Text>
                    <Text style={[styles.planName, { color: colors.primary }]}>{billDetails.planName}</Text>
                    <Text style={[styles.billTypeLabel, { color: colors.textSecondary }]}>{billDetails.billType === 'mobile' ? 'Mobile Service' : 'Broadband Service'}</Text>
                  </View>
                </View>
                
                <View style={[styles.addressSection, { borderBottomColor: colors.borderLight }]}>
                  <Text style={[styles.addressLabel, { color: colors.textSecondary }]}>Service Address:</Text>
                  <Text style={[styles.addressText, { color: colors.textPrimary }]}>{billDetails.serviceAddress}</Text>
                </View>
                
                <View style={styles.billInfoGrid}>
                  <View style={styles.billInfoItem}>
                    <Text style={[styles.billInfoLabel, { color: colors.textSecondary }]}>Bill Amount</Text>
                    <Text style={[styles.billAmount, { color: colors.primary }]}>{formatCurrency(billDetails.billAmount)}</Text>
                  </View>
                  
                  <View style={styles.billInfoItem}>
                    <Text style={[styles.billInfoLabel, { color: colors.textSecondary }]}>Due Date</Text>
                    <View style={styles.dueDateContainer}>
                      <Calendar size={16} color={getBillStatusColor(billDetails.dueDate)} />
                      <Text style={[styles.dueDate, { color: getBillStatusColor(billDetails.dueDate) }]}>
                        {formatDate(billDetails.dueDate)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.billInfoItem}>
                    <Text style={[styles.billInfoLabel, { color: colors.textSecondary }]}>Data Usage</Text>
                    <Text style={[styles.billInfoValue, { color: colors.textPrimary }]}>{billDetails.dataUsage}</Text>
                  </View>
                  
                  <View style={styles.billInfoItem}>
                    <Text style={[styles.billInfoLabel, { color: colors.textSecondary }]}>Last Bill Date</Text>
                    <Text style={[styles.billInfoValue, { color: colors.textPrimary }]}>{formatDate(billDetails.lastBillDate)}</Text>
                  </View>
                  
                  <View style={styles.billInfoItem}>
                    <Text style={[styles.billInfoLabel, { color: colors.textSecondary }]}>Status</Text>
                    <Text style={[styles.billStatus, { color: colors.warning }]}>
                      {billDetails.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                {getDaysUntilDue(billDetails.dueDate) <= 3 && (
                  <View style={[styles.urgentNotice, { backgroundColor: colors.errorLight }]}>
                    <Text style={[styles.urgentNoticeText, { color: colors.error }]}>
                      {getDaysUntilDue(billDetails.dueDate) < 0 
                        ? 'This bill is overdue!' 
                        : `Due in ${getDaysUntilDue(billDetails.dueDate)} day(s)`}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            
            {/* Payment Options Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Payment Options</Text>
              
              <View style={styles.paymentOptionsContainer}>
                {/* Full Bill Payment Option */}
                <TouchableOpacity
                  style={[
                    styles.paymentOptionCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    paymentType === 'full' && { 
                      backgroundColor: colors.primary + '15', 
                      borderColor: colors.primary,
                      borderWidth: 2
                    },
                    Platform.select({
                      android: {
                        elevation: 0,
                        borderWidth: paymentType === 'full' ? 2 : 0.5,
                        borderColor: paymentType === 'full' ? colors.primary : 'rgba(0,0,0,0.08)',
                      },
                    }),
                  ]}
                  onPress={() => {
                    setPaymentType('full');
                    setCustomAmount('');
                  }}
                >
                  <View style={styles.paymentOptionHeader}>
                    <View style={[
                      styles.paymentOptionIcon,
                      { backgroundColor: paymentType === 'full' ? colors.primary : colors.surfaceSecondary }
                    ]}>
                      <WalletCards size={20} color={paymentType === 'full' ? colors.white : colors.primary} />
                    </View>
                    <View style={styles.paymentOptionContent}>
                      <Text style={[
                        styles.paymentOptionTitle,
                        { color: paymentType === 'full' ? colors.primary : colors.textPrimary }
                      ]}>
                        Full Bill Payment
                      </Text>
                      <Text style={[
                        styles.paymentOptionDescription,
                        { color: colors.textSecondary }
                      ]}>
                        Pay the complete bill amount
                      </Text>
                    </View>
                    <Text style={[
                      styles.paymentOptionPrice,
                      { color: paymentType === 'full' ? colors.primary : colors.textPrimary }
                    ]}>
                      {formatCurrency(billDetails.billAmount)}
                    </Text>
                  </View>
                  {paymentType === 'full' && (
                    <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]}>
                      <CheckCircle size={16} color={colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
                
                {/* Custom Amount Option */}
                <TouchableOpacity
                  style={[
                    styles.paymentOptionCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    paymentType === 'custom' && { 
                      backgroundColor: colors.primary + '15', 
                      borderColor: colors.primary,
                      borderWidth: 2
                    },
                    Platform.select({
                      android: {
                        elevation: 0,
                        borderWidth: paymentType === 'custom' ? 2 : 0.5,
                        borderColor: paymentType === 'custom' ? colors.primary : 'rgba(0,0,0,0.08)',
                      },
                    }),
                  ]}
                  onPress={() => setPaymentType('custom')}
                >
                  <View style={styles.paymentOptionHeader}>
                    <View style={[
                      styles.paymentOptionIcon,
                      { backgroundColor: paymentType === 'custom' ? colors.primary : colors.surfaceSecondary }
                    ]}>
                      <Zap size={20} color={paymentType === 'custom' ? colors.white : colors.primary} />
                    </View>
                    <View style={styles.paymentOptionContent}>
                      <Text style={[
                        styles.paymentOptionTitle,
                        { color: paymentType === 'custom' ? colors.primary : colors.textPrimary }
                      ]}>
                        Custom Amount
                      </Text>
                      <Text style={[
                        styles.paymentOptionDescription,
                        { color: colors.textSecondary }
                      ]}>
                        Pay a partial amount
                      </Text>
                    </View>
                    {paymentType === 'custom' && customAmount ? (
                      <Text style={[
                        styles.paymentOptionPrice,
                        { color: colors.primary }
                      ]}>
                        {formatCurrency(parseFloat(customAmount))}
                      </Text>
                    ) : (
                      <Text style={[
                        styles.paymentOptionPrice,
                        { color: colors.textSecondary }
                      ]}>
                        Enter amount
                      </Text>
                    )}
                  </View>
                  
                  {paymentType === 'custom' && (
                    <>
                      <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]}>
                        <CheckCircle size={16} color={colors.white} />
                      </View>
                      <View style={[styles.customAmountContainer, { backgroundColor: colors.surfaceSecondary }]}>
                        <TextInput
                          style={[
                            styles.customAmountInput,
                            { color: colors.textPrimary, borderColor: colors.border }
                          ]}
                          placeholder="Enter custom amount"
                          placeholderTextColor={colors.textSecondary}
                          value={customAmount}
                          onChangeText={(text) => {
                            const numericText = text.replace(/[^0-9.]/g, '');
                            if (numericText.split('.').length <= 2) {
                              setCustomAmount(numericText);
                            }
                          }}
                          keyboardType="decimal-pad"
                          maxLength={10}
                          autoFocus
                        />
                        <Text style={[styles.customAmountHelper, { color: colors.textSecondary }]}>
                          Maximum: {formatCurrency(billDetails.billAmount)}
                        </Text>
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            </>
          ) : !isLoadingBill && accountNumber.length < 8 && (
            <View style={styles.emptyState}>
              <Receipt size={100} color={colors.textTertiary} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>No Bills found</Text>
            </View>
          )}
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Pay Bill Button */}
        {billDetails && (
          <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16, backgroundColor: colors.surface, borderTopColor: colors.borderLight }]}>
            <Button
              title={`Pay ${formatCurrency(getPaymentAmount())}`}
              onPress={handlePayBill}
              loading={isProcessing}
              disabled={isProcessing}
              style={styles.payButton}
            />
          </View>
        )}

        {/* Confirmation Modal */}
        <Modal
          visible={showConfirmModal}
          transparent
          animationType="fade"
          onRequestClose={handleCancelConfirm}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <View style={[styles.confirmModal, { backgroundColor: colors.surface }]}>
              <Text style={[styles.confirmTitle, { color: colors.textPrimary }]}>Confirm Payment</Text>
              <Text style={[styles.confirmDescription, { color: colors.textSecondary }]}>
                Please confirm your bill payment details
              </Text>
              
              {billDetails && (
                <View style={[styles.confirmDetails, { backgroundColor: colors.surfaceSecondary }]}>
                  <View style={styles.confirmRow}>
                    <Text style={[styles.confirmLabel, { color: colors.textSecondary }]}>Account:</Text>
                    <Text style={[styles.confirmValue, { color: colors.textPrimary }]}>{billDetails.accountNumber}</Text>
                  </View>
                  <View style={styles.confirmRow}>
                    <Text style={[styles.confirmLabel, { color: colors.textSecondary }]}>Customer:</Text>
                    <Text style={[styles.confirmValue, { color: colors.textPrimary }]}>{billDetails.customerName}</Text>
                  </View>
                  <View style={styles.confirmRow}>
                    <Text style={[styles.confirmLabel, { color: colors.textSecondary }]}>Amount:</Text>
                    <Text style={[styles.confirmAmount, { color: colors.primary }]}>{formatCurrency(getPaymentAmount())}</Text>
                  </View>
                  {paymentType === 'custom' && (
                    <View style={styles.confirmRow}>
                      <Text style={[styles.confirmLabel, { color: colors.textSecondary }]}>Payment Type:</Text>
                      <Text style={[styles.confirmValue, { color: colors.textPrimary }]}>Custom Amount</Text>
                    </View>
                  )}
                </View>
              )}
              
              <View style={styles.confirmActions}>
                <Button
                  title="Cancel"
                  onPress={handleCancelConfirm}
                  variant="outline"
                  style={[
                    styles.confirmCancelButton,
                    Platform.select({
                      android: {
                        elevation: 0,
                        borderWidth: 0.5,
                        borderColor: 'rgba(0,0,0,0.08)',
                      },
                    }),
                  ]}
                  disabled={isProcessing}
                />
                <Button
                  title="Confirm"
                  onPress={handleConfirmPayment}
                  style={styles.confirmButton}
                  loading={isProcessing}
                  disabled={isProcessing}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Success Modal */}
        <Modal
          visible={showSuccess}
          transparent
          animationType="fade"
          onRequestClose={handleSuccessClose}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.successModal, { backgroundColor: colors.surface }]}>
              <CheckCircle size={64} color={colors.success} />
              <Text style={[styles.successTitle, { color: colors.textPrimary }]}>Payment Successful!</Text>
              <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
                {billDetails && `${formatCurrency(getPaymentAmount())} has been successfully paid for account ${billDetails.accountNumber}`}
              </Text>
              <Button
                title="Done"
                onPress={handleSuccessClose}
                style={styles.successButton}
              />
            </View>
          </View>
        </Modal>

        {/* Transaction Authentication Modal */}
        <TransactionAuth
          visible={showAuthModal}
          onSuccess={handleAuthSuccess}
          onCancel={handleAuthCancel}
          title="Confirm Bill Payment"
          description={`Please authenticate to pay ${paymentType === 'custom' ? 'custom amount' : 'full bill'} for account ${billDetails?.accountNumber || ''}`}
          amount={billDetails ? formatCurrencyForAuth(getPaymentAmount()) : undefined}
        />
      </BackgroundImage>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  accountInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  qrIconButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billDetailsCard: {
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  billHeaderText: {
    marginLeft: 16,
    flex: 1,
  },
  accountNumber: {
    fontSize: 14,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  planName: {
    fontSize: 14,
    fontWeight: '500',
  },
  billTypeLabel: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  addressSection: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  addressLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    lineHeight: 24,
  },
  billInfoGrid: {
    gap: 16,
  },
  billInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billInfoLabel: {
    fontSize: 16,
  },
  billAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDate: {
    fontSize: 16,
    fontWeight: '500',
  },
  billInfoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  billStatus: {
    fontSize: 14,
    fontWeight: '700',
  },
  urgentNotice: {
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  urgentNoticeText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomSection: {
    padding: 16,
    borderTopWidth: 1,
  },
  payButton: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  successModal: {
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  successButton: {
    width: '100%',
  },
  loadingContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  noDataContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
    paddingVertical: 192,
    paddingHorizontal: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    textAlign: 'center',
  },
  paymentOptionsContainer: {
    gap: 16,
  },
  paymentOptionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.08)',
      },
    }),
  },
  paymentOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  paymentOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentOptionContent: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  paymentOptionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  paymentOptionPrice: {
    fontSize: 20,
    fontWeight: '800',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customAmountContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  customAmountInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  customAmountHelper: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  confirmModal: {
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  confirmDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  confirmDetails: {
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  confirmLabel: {
    fontSize: 16,
  },
  confirmValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  confirmCancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
});
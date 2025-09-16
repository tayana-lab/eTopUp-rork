import React, { useState, useRef } from 'react';
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
  Keyboard,
} from 'react-native';
import {
  QrCode,
  CheckCircle,
  X,
  Zap
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '@/constants/theme';
import Button from '@/components/ui/Button';
import BackgroundImage from '@/components/ui/BackgroundImage';
import StandardLayout from '@/components/layout/StandardLayout';
import TransactionAuth from '@/components/ui/TransactionAuth';
import { useTransactionPin } from '@/contexts/TransactionPinContext';
import * as Haptics from 'expo-haptics';

// Standard top-up amounts in Seychelles Rupees (SCR)
const STANDARD_AMOUNTS = [50, 100, 200, 500, 1000, 2000];

export default function TopUpScreen() {
  const insets = useSafeAreaInsets();
  const { checkTransactionPinRequired } = useTransactionPin();
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isFromQRScan, setIsFromQRScan] = useState<boolean>(false);

  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const mobileInputRef = useRef<TextInput>(null);

  const handleQRScan = () => {
    // Mock QR scan - in real app, this would open camera
    Alert.alert(
      'QR Scanner',
      'QR scanner would open here. For demo, using mock number.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Use Mock',
          onPress: () => {
            setMobileNumber('4567890'); // 7 digits after country code
            setIsFromQRScan(true);
          },
        },
      ]
    );
  };

  const handleStandardAmount = (standardAmount: number) => {
    setAmount(standardAmount.toString());
  };

  const formatMobileNumber = (number: string) => {
    if (isFromQRScan && number.length > 4) {
      return `****${number.slice(-4)}`;
    }
    return number;
  };

  const handleMobileNumberChange = (text: string) => {
    // Remove any non-numeric characters and limit to 7 digits (after +248)
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 7);
    setMobileNumber(numericText);
    // If user starts typing, it's not from QR scan anymore
    if (text.length > 0) {
      setIsFromQRScan(false);
    }
    // Auto-close keyboard after 7 digits
    if (numericText.length === 7) {
      Keyboard.dismiss();
    }
  };

  const getFullMobileNumber = () => {
    return `+248${mobileNumber}`;
  };

  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'SCR 0.00';
    return `SCR ${numValue.toFixed(2)}`;
  };

  const validateForm = () => {
    if (!mobileNumber.trim()) {
      Alert.alert('Error', 'Please enter a mobile number');
      return false;
    }
    if (mobileNumber.length !== 7) {
      Alert.alert('Error', 'Mobile number must be 7 digits (total 10 digits including +248)');
      return false;
    }
    if (!amount.trim() || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }
    return true;
  };

  const handleTopUp = async () => {
    if (!validateForm()) {
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmTopUp = async () => {
    setShowConfirmModal(false);
    
    // Check if transaction PIN is required
    if (checkTransactionPinRequired()) {
      setShowAuthModal(true);
    } else {
      // Proceed directly without authentication
      await processTopUp();
    }
  };

  const handleCancelTopUp = () => {
    setShowConfirmModal(false);
  };

  const handleAuthSuccess = async () => {
    setShowAuthModal(false);
    await processTopUp();
  };

  const handleAuthCancel = () => {
    setShowAuthModal(false);
  };

  const processTopUp = async () => {
    setIsProcessing(true);
    
    // Haptic feedback for success
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Mock API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 1000);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setMobileNumber('');
    setAmount('');
    setIsFromQRScan(false);
    setIsProcessing(false);
  };

  return (
    <StandardLayout title="TopUp">
      <BackgroundImage style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Mobile Number Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mobile Number</Text>
            <View style={styles.inputRow}>
              <Text style={styles.countryCode}>+248</Text>
              <TextInput
                ref={mobileInputRef}
                style={styles.mobileInput}
                placeholder="Enter 7 digits"
                value={formatMobileNumber(mobileNumber)}
                onChangeText={handleMobileNumberChange}
                keyboardType="phone-pad"
                maxLength={7}
              />
              <TouchableOpacity style={styles.qrIconButton} onPress={handleQRScan}>
                <QrCode size={24} color={Theme.Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {mobileNumber.length === 7 ? (
            <>
              {/* Amount Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Amount</Text>
                <View style={styles.amountContainer}>
                  <Text style={styles.currencyLabel}>SCR</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Standard Amounts */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Standard Top Up Amount</Text>
                <View style={styles.standardAmountsGrid}>
                  {STANDARD_AMOUNTS.map((standardAmount) => (
                    <TouchableOpacity
                      key={standardAmount}
                      style={[
                        styles.standardAmountButton,
                        amount === standardAmount.toString() && styles.standardAmountButtonActive,
                      ]}
                      onPress={() => handleStandardAmount(standardAmount)}
                    >
                      <Text
                        style={[
                          styles.standardAmountText,
                          amount === standardAmount.toString() && styles.standardAmountTextActive,
                        ]}
                      >
                        SCR {standardAmount}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Summary */}
              {mobileNumber && amount && (
                <View style={styles.summarySection}>
                  <Text style={styles.summaryTitle}>Transaction Summary</Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Mobile Number:</Text>
                    <Text style={styles.summaryValue}>{getFullMobileNumber()}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Amount:</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(amount)}</Text>
                  </View>
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Zap size={80} color={Theme.Colors.textTertiary} />
            
            </View>
          )}
        </ScrollView>

        {/* TopUp Button */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + Theme.Spacing.md }]}>
          <Button
            title="TopUp"
            onPress={handleTopUp}
            loading={isProcessing}
            disabled={isProcessing || !mobileNumber.trim() || !amount.trim()}
            style={styles.topUpButton}
          />
        </View>

        {/* Success Modal */}
        <Modal
          visible={showSuccess}
          transparent
          animationType="fade"
          onRequestClose={handleSuccessClose}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.successModal}>
              <CheckCircle size={64} color={Theme.Colors.success} />
              <Text style={styles.successTitle}>Top Up Successful!</Text>
              <Text style={styles.successMessage}>
                {formatCurrency(amount)} has been successfully added to {getFullMobileNumber()}
              </Text>
              <Button
                title="Done"
                onPress={handleSuccessClose}
                style={styles.successButton}
              />
            </View>
          </View>
        </Modal>

        {/* Confirmation Modal */}
        <Modal
          visible={showConfirmModal}
          transparent
          animationType="fade"
          onRequestClose={handleCancelTopUp}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmModal}>
              <View style={styles.confirmHeader}>
                <Text style={styles.confirmTitle}>Confirm Top Up</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={handleCancelTopUp}
                >
                  <X size={24} color={Theme.Colors.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.confirmSummary}>
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Mobile Number:</Text>
                  <Text style={styles.confirmValue}>{getFullMobileNumber()}</Text>
                </View>
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Amount:</Text>
                  <Text style={styles.confirmPrice}>{formatCurrency(amount)}</Text>
                </View>
              </View>
              
              <View style={styles.confirmActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={handleCancelTopUp}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.confirmButton}
                  onPress={handleConfirmTopUp}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Transaction Authentication Modal */}
        <TransactionAuth
          visible={showAuthModal}
          onSuccess={handleAuthSuccess}
          onCancel={handleAuthCancel}
          title="Confirm Top Up"
          description={`Please authenticate to top up ${formatCurrency(amount)} to ${getFullMobileNumber()}`}
          amount={formatCurrency(amount)}
        />
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
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    paddingHorizontal: Theme.Spacing.md,
  },
  currencyLabel: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textSecondary,
    marginRight: Theme.Spacing.sm,
  },
  amountInput: {
    flex: 1,
    height: Theme.Layout.inputHeight,
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
  },
  standardAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.Spacing.sm,
  },
  standardAmountButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    paddingVertical: Theme.Spacing.md,
    alignItems: 'center',
  },
  standardAmountButtonActive: {
    backgroundColor: Theme.Colors.primary,
    borderColor: Theme.Colors.primary,
  },
  standardAmountText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textPrimary,
  },
  standardAmountTextActive: {
    color: Theme.Colors.white,
  },
  summarySection: {
    backgroundColor: Theme.Colors.surfaceSecondary,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.md,
    marginTop: Theme.Spacing.md,
  },
  summaryTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.Spacing.sm,
  },
  summaryLabel: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
  },
  summaryValue: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textPrimary,
  },
  bottomSection: {
    padding: Theme.Spacing.md,
    backgroundColor: Theme.Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Theme.Colors.borderLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.Spacing.md,
  },
  topUpButton: {
    width: '100%',
  },

  successModal: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.xl,
    padding: Theme.Spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: Theme.Typography.fontSize['2xl'],
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
    marginBottom: Theme.Spacing.xl,
    lineHeight: Theme.Typography.lineHeight.relaxed * Theme.Typography.fontSize.base,
  },
  successButton: {
    width: '100%',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
    paddingVertical: Theme.Spacing.xl * 4,
    paddingHorizontal: Theme.Spacing.lg,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 16,
    textAlign: 'center',
  },
  confirmModal: {
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.xl,
    padding: Theme.Spacing.lg,
    width: '100%',
    maxWidth: 400,
    ...Theme.Shadows.lg,
  },
  confirmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.lg,
  },
  confirmTitle: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
  },
  closeButton: {
    padding: Theme.Spacing.xs,
  },
  confirmSummary: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.lg,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  confirmLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  confirmValue: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textPrimary,
    fontWeight: Theme.Typography.fontWeight.semiBold,
  },
  confirmPrice: {
    fontSize: Theme.Typography.fontSize.lg,
    color: Theme.Colors.primary,
    fontWeight: Theme.Typography.fontWeight.bold,
  },
  confirmActions: {
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
    backgroundColor: Theme.Colors.primary,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.white,
  },
});
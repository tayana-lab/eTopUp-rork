import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Fingerprint, Lock, X } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import Button from './Button';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTransactionPin } from '@/contexts/TransactionPinContext';

interface TransactionAuthProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  amount?: string;
}

export default function TransactionAuth({
  visible,
  onSuccess,
  onCancel,
  title = 'Transaction Authentication',
  description = 'Please authenticate to proceed with this transaction',
  amount,
}: TransactionAuthProps) {
  const { checkTransactionPinRequired, verifyTransactionPin } = useTransactionPin();
  const [pin, setPin] = useState<string>('');
  const [showPinInput, setShowPinInput] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const maxAttempts = 3;
  
  const isTransactionPinRequired = checkTransactionPinRequired();

  const resetState = () => {
    setPin('');
    setShowPinInput(false);
    setIsAuthenticating(false);
    setAttempts(0);
  };

  const handleBiometricAuth = async () => {
    if (Platform.OS === 'web') {
      // Web fallback - go directly to PIN
      setShowPinInput(true);
      return;
    }

    try {
      setIsAuthenticating(true);
      
      // Check if biometric authentication is available
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware || !isEnrolled) {
        setShowPinInput(true);
        setIsAuthenticating(false);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to proceed with transaction',
        fallbackLabel: 'Use PIN',
        cancelLabel: 'Cancel',
      });

      setIsAuthenticating(false);

      if (result.success) {
        resetState();
        onSuccess();
      } else {
        // Biometric failed, show PIN input
        setShowPinInput(true);
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      setIsAuthenticating(false);
      setShowPinInput(true);
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length !== 4) {
      Alert.alert('Invalid PIN', 'Please enter a 4-digit PIN');
      return;
    }

    try {
      const isValid = await verifyTransactionPin(pin);
      
      if (isValid) {
        resetState();
        onSuccess();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setPin('');
        
        if (newAttempts >= maxAttempts) {
          Alert.alert(
            'Too Many Attempts',
            'You have exceeded the maximum number of attempts. Please try again later.',
            [{ text: 'OK', onPress: () => { resetState(); onCancel(); } }]
          );
        } else {
          Alert.alert(
            'Incorrect PIN',
            `Incorrect PIN. ${maxAttempts - newAttempts} attempts remaining.`
          );
        }
      }
    } catch (error) {
      console.error('PIN verification error:', error);
      Alert.alert('Error', 'Failed to verify PIN. Please try again.');
    }
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    resetState();
    onCancel();
  };

  const handleOverlayPress = () => {
    Keyboard.dismiss();
  };

  const handleModalShow = () => {
    // Check if transaction PIN is required
    if (isTransactionPinRequired) {
      // If transaction PIN is required, skip biometric and go directly to PIN
      setShowPinInput(true);
    } else {
      // Auto-trigger biometric authentication when modal opens
      if (visible && !showPinInput) {
        setTimeout(() => {
          handleBiometricAuth();
        }, 300);
      }
    }
  };

  // If transaction PIN is not required, proceed directly without authentication
  React.useEffect(() => {
    if (visible && !isTransactionPinRequired) {
      // Skip authentication entirely if transaction PIN is disabled
      onSuccess();
      return;
    }
  }, [visible, isTransactionPinRequired, onSuccess]);

  // Don't render modal if transaction PIN is not required
  if (!isTransactionPinRequired) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
      onShow={handleModalShow}
    >
      <KeyboardAvoidingView 
        style={styles.overlay} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View style={styles.overlayTouchable}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <X size={24} color={Theme.Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>{description}</Text>
          
          {amount && (
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Amount:</Text>
              <Text style={styles.amountValue}>{amount}</Text>
            </View>
          )}

          {!showPinInput && !isTransactionPinRequired ? (
            <View style={styles.biometricSection}>
              <View style={styles.biometricIcon}>
                <Fingerprint size={64} color={Theme.Colors.primary} />
              </View>
              <Text style={styles.biometricText}>
                {isAuthenticating ? 'Authenticating...' : 'Touch sensor or face ID to authenticate'}
              </Text>
              <Button
                title="Use PIN Instead"
                onPress={() => setShowPinInput(true)}
                variant="outline"
                style={styles.pinFallbackButton}
                disabled={isAuthenticating}
              />
            </View>
          ) : (
            <View style={styles.pinSection}>
              <View style={styles.pinIcon}>
                <Lock size={48} color={Theme.Colors.primary} />
              </View>
              <Text style={styles.pinText}>
                {isTransactionPinRequired ? 'Enter your Transaction PIN' : 'Enter your 4-digit PIN'}
              </Text>
              
              <View style={styles.pinInputContainer}>
                <TextInput
                  style={styles.pinInput}
                  value={pin}
                  onChangeText={(text) => setPin(text.replace(/[^0-9]/g, '').slice(0, 4))}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                  placeholder="••••"
                  placeholderTextColor={Theme.Colors.textTertiary}
                  autoFocus
                />
              </View>
              
              {attempts > 0 && (
                <Text style={styles.attemptsText}>
                  {maxAttempts - attempts} attempts remaining
                </Text>
              )}
              
              <View style={styles.pinActions}>
                <Button
                  title="Cancel"
                  onPress={handleCancel}
                  variant="outline"
                  style={styles.cancelButton}
                />
                <Button
                  title="Confirm"
                  onPress={handlePinSubmit}
                  style={styles.confirmButton}
                  disabled={pin.length !== 4}
                />
              </View>
            </View>
          )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  overlayTouchable: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.Spacing.md,
  },
  container: {
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.xl,
    padding: Theme.Spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 0,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.08)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  title: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
  },
  closeButton: {
    padding: Theme.Spacing.xs,
  },
  description: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.Spacing.lg,
    lineHeight: Theme.Typography.lineHeight.relaxed * Theme.Typography.fontSize.base,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Theme.Colors.surfaceSecondary,
    padding: Theme.Spacing.md,
    borderRadius: Theme.BorderRadius.md,
    marginBottom: Theme.Spacing.lg,
  },
  amountLabel: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
  },
  amountValue: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.primary,
  },
  biometricSection: {
    alignItems: 'center',
    paddingVertical: Theme.Spacing.xl,
  },
  biometricIcon: {
    marginBottom: Theme.Spacing.lg,
  },
  biometricText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.Spacing.xl,
  },
  pinFallbackButton: {
    width: '100%',
  },
  pinSection: {
    alignItems: 'center',
    paddingVertical: Theme.Spacing.lg,
  },
  pinIcon: {
    marginBottom: Theme.Spacing.md,
  },
  pinText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.Spacing.lg,
  },
  pinInputContainer: {
    width: '100%',
    marginBottom: Theme.Spacing.md,
  },
  pinInput: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    paddingHorizontal: Theme.Spacing.lg,
    paddingVertical: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    textAlign: 'center',
    letterSpacing: 8,
    color: Theme.Colors.textPrimary,
    ...Platform.select({
      android: {
        borderColor: 'rgba(0,0,0,0.12)',
      },
    }),
  },
  attemptsText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.error,
    marginBottom: Theme.Spacing.md,
  },
  pinActions: {
    flexDirection: 'row',
    gap: Theme.Spacing.md,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
});
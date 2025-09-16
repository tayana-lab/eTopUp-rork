import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  QrCode,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit3,
  Shield,
  X,
  Lock,
} from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactionPin } from '@/contexts/TransactionPinContext';
import { Theme } from '@/constants/theme';
import Button from '@/components/ui/Button';

export default function ProfileSettingsScreen() {
  const { user } = useAuth();
  const { isEnabled, hasPin, enableTransactionPin, disableTransactionPin, changeTransactionPin } = useTransactionPin();
  const [isEditing, setIsEditing] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinModalType, setPinModalType] = useState<'setup' | 'change'>('setup');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdatePhoto = () => {
    Alert.alert('Profile Photo', 'Update profile photo functionality');
  };

  const handleUpdateEmail = () => {
    Alert.alert('Email', 'Update email functionality');
  };

  const handleUpdatePhone = () => {
    Alert.alert('Phone', 'Update phone functionality');
  };

  const handleUpdateAddress = () => {
    Alert.alert('Address', 'Update address functionality');
  };

  const handleTransactionPinToggle = async (value: boolean) => {
    if (value && !hasPin) {
      // Enable transaction PIN - show setup modal
      setPinModalType('setup');
      setShowPinModal(true);
    } else if (!value && hasPin) {
      // Disable transaction PIN
      Alert.alert(
        'Disable Transaction PIN',
        'Are you sure you want to disable Transaction PIN? This will remove the security requirement for transactions.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: async () => {
              const success = await disableTransactionPin();
              if (success) {
                Alert.alert('Success', 'Transaction PIN has been disabled.');
              } else {
                Alert.alert('Error', 'Failed to disable Transaction PIN.');
              }
            },
          },
        ]
      );
    }
  };

  const handleChangePinPress = () => {
    setPinModalType('change');
    setShowPinModal(true);
  };

  const resetPinModal = () => {
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setIsProcessing(false);
    setShowPinModal(false);
  };

  const handlePinSubmit = async () => {
    if (pinModalType === 'setup') {
      if (!newPin || newPin.length !== 4) {
        Alert.alert('Error', 'Please enter a 4-digit PIN');
        return;
      }
      if (newPin !== confirmPin) {
        Alert.alert('Error', 'PINs do not match');
        return;
      }

      setIsProcessing(true);
      const success = await enableTransactionPin(newPin);
      setIsProcessing(false);

      if (success) {
        Alert.alert('Success', 'Transaction PIN has been set successfully.');
        resetPinModal();
      } else {
        Alert.alert('Error', 'Failed to set Transaction PIN.');
      }
    } else {
      // Change PIN
      if (!currentPin || currentPin.length !== 4) {
        Alert.alert('Error', 'Please enter your current 4-digit PIN');
        return;
      }
      if (!newPin || newPin.length !== 4) {
        Alert.alert('Error', 'Please enter a new 4-digit PIN');
        return;
      }
      if (newPin !== confirmPin) {
        Alert.alert('Error', 'New PINs do not match');
        return;
      }

      setIsProcessing(true);
      const success = await changeTransactionPin(currentPin, newPin);
      setIsProcessing(false);

      if (success) {
        Alert.alert('Success', 'Transaction PIN has been changed successfully.');
        resetPinModal();
      } else {
        Alert.alert('Error', 'Failed to change Transaction PIN. Please check your current PIN.');
      }
    }
  };

  const generateQRCode = () => {
    const phoneNumber = user?.phone || '+248XXXXXXX';
    return `QR:${phoneNumber}`;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Profile Settings',
          headerStyle: { 
            backgroundColor: Theme.Colors.primary,
          },
          headerTintColor: Theme.Colors.white,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              style={styles.headerButton}
            >
              <Edit3 size={20} color={Theme.Colors.white} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* QR Code Section */}
        <View style={styles.section}>
          <View style={styles.qrSection}>
            <View style={styles.qrHeader}>
              <QrCode size={24} color={Theme.Colors.primary} />
              <Text style={styles.qrTitle}>My QR Code</Text>
            </View>
            <View style={styles.qrCodeContainer}>
              <View style={styles.qrCodeWrapper}>
                <QRCode
                  value={generateQRCode()}
                  size={150}
                  color={Theme.Colors.textPrimary}
                  backgroundColor={Theme.Colors.white}
                  logoSize={30}
                  logoBackgroundColor='transparent'
                />
              </View>
              <Text style={styles.qrSubtext}>
                Auto-generated based on: +248 254 1234
              </Text>
            </View>
          </View>
        </View>

        {/* Profile Photo */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.settingItem, !isEditing && styles.disabledItem]} 
            onPress={isEditing ? handleUpdatePhoto : undefined}
            disabled={!isEditing}
          >
            <View style={styles.settingLeft}>
              <Camera size={20} color={isEditing ? Theme.Colors.textSecondary : Theme.Colors.textTertiary} />
              <Text style={[styles.settingTitle, !isEditing && styles.disabledText]}>Profile Photo</Text>
            </View>
            <Text style={[styles.settingValue, !isEditing && styles.disabledText]}>Update</Text>
          </TouchableOpacity>
        </View>

        {/* Email */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.settingItem, !isEditing && styles.disabledItem]} 
            onPress={isEditing ? handleUpdateEmail : undefined}
            disabled={!isEditing}
          >
            <View style={styles.settingLeft}>
              <Mail size={20} color={isEditing ? Theme.Colors.textSecondary : Theme.Colors.textTertiary} />
              <Text style={[styles.settingTitle, !isEditing && styles.disabledText]}>Email ID</Text>
            </View>
            <Text style={[styles.settingValue, !isEditing && styles.disabledText]}>{user?.email || 'Not set'}</Text>
          </TouchableOpacity>
        </View>

        {/* Mobile Number */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.settingItem, !isEditing && styles.disabledItem]} 
            onPress={isEditing ? handleUpdatePhone : undefined}
            disabled={!isEditing}
          >
            <View style={styles.settingLeft}>
              <Phone size={20} color={isEditing ? Theme.Colors.textSecondary : Theme.Colors.textTertiary} />
              <Text style={[styles.settingTitle, !isEditing && styles.disabledText]}>Mobile Number</Text>
            </View>
            <Text style={[styles.settingValue, !isEditing && styles.disabledText]}>{user?.phone || 'Not set'}</Text>
          </TouchableOpacity>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.settingItem, !isEditing && styles.disabledItem]} 
            onPress={isEditing ? handleUpdateAddress : undefined}
            disabled={!isEditing}
          >
            <View style={styles.settingLeft}>
              <MapPin size={20} color={isEditing ? Theme.Colors.textSecondary : Theme.Colors.textTertiary} />
              <Text style={[styles.settingTitle, !isEditing && styles.disabledText]}>Update Address</Text>
            </View>
            <Text style={[styles.settingValue, !isEditing && styles.disabledText]}>Manage</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction PIN */}
        <View style={styles.section}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Shield size={20} color={Theme.Colors.textSecondary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Transaction PIN</Text>
                <Text style={styles.settingSubtitle}>
                  {isEnabled ? 'Required for transactions' : 'Secure your transactions'}
                </Text>
              </View>
            </View>
            <Switch
              value={isEnabled}
              onValueChange={handleTransactionPinToggle}
              trackColor={{ false: Theme.Colors.border, true: Theme.Colors.primary }}
              thumbColor={isEnabled ? Theme.Colors.white : Theme.Colors.textTertiary}
            />
          </View>
          
          {isEnabled && hasPin && (
            <TouchableOpacity 
              style={[styles.settingItem, styles.subSettingItem]}
              onPress={handleChangePinPress}
            >
              <View style={styles.settingLeft}>
                <Lock size={18} color={Theme.Colors.textSecondary} />
                <Text style={styles.settingTitle}>Change PIN</Text>
              </View>
              <Text style={styles.settingValue}>Update</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* PIN Setup/Change Modal */}
      <Modal
        visible={showPinModal}
        transparent
        animationType="fade"
        onRequestClose={resetPinModal}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.modalOverlayTouchable}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {pinModalType === 'setup' ? 'Set Transaction PIN' : 'Change Transaction PIN'}
                    </Text>
                    <TouchableOpacity onPress={resetPinModal} style={styles.closeButton}>
                      <X size={24} color={Theme.Colors.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.modalDescription}>
                    {pinModalType === 'setup'
                      ? 'Create a 4-digit PIN to secure your transactions'
                      : 'Enter your current PIN and create a new one'}
                  </Text>

                  {pinModalType === 'change' && (
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Current PIN</Text>
                      <TextInput
                        style={styles.pinInput}
                        value={currentPin}
                        onChangeText={(text) => setCurrentPin(text.replace(/[^0-9]/g, '').slice(0, 4))}
                        keyboardType="numeric"
                        secureTextEntry
                        maxLength={4}
                        placeholder="••••"
                        placeholderTextColor={Theme.Colors.textTertiary}
                      />
                    </View>
                  )}

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>
                      {pinModalType === 'setup' ? 'New PIN' : 'New PIN'}
                    </Text>
                    <TextInput
                      style={styles.pinInput}
                      value={newPin}
                      onChangeText={(text) => setNewPin(text.replace(/[^0-9]/g, '').slice(0, 4))}
                      keyboardType="numeric"
                      secureTextEntry
                      maxLength={4}
                      placeholder="••••"
                      placeholderTextColor={Theme.Colors.textTertiary}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Confirm PIN</Text>
                    <TextInput
                      style={styles.pinInput}
                      value={confirmPin}
                      onChangeText={(text) => setConfirmPin(text.replace(/[^0-9]/g, '').slice(0, 4))}
                      keyboardType="numeric"
                      secureTextEntry
                      maxLength={4}
                      placeholder="••••"
                      placeholderTextColor={Theme.Colors.textTertiary}
                    />
                  </View>

                  <View style={styles.modalActions}>
                    <Button
                      title="Cancel"
                      onPress={resetPinModal}
                      variant="outline"
                      style={styles.cancelButton}
                      disabled={isProcessing}
                    />
                    <Button
                      title={pinModalType === 'setup' ? 'Set PIN' : 'Change PIN'}
                      onPress={handlePinSubmit}
                      style={styles.confirmButton}
                      loading={isProcessing}
                      disabled={isProcessing}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
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
  qrSection: {
    backgroundColor: Theme.Colors.surfaceSecondary,
    borderRadius: Theme.BorderRadius.md,
    padding: Theme.Spacing.md,
  },
  qrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  qrTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginLeft: Theme.Spacing.sm,
  },
  qrCodeContainer: {
    alignItems: 'center',
    paddingVertical: Theme.Spacing.lg,
  },
  qrCodeWrapper: {
    padding: Theme.Spacing.md,
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.lg,
    ...Theme.Shadows.md,
  },
  qrSubtext: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    marginTop: Theme.Spacing.sm,
    textAlign: 'center',
  },
  settingItem: {
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
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTitle: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
    marginLeft: Theme.Spacing.sm,
  },
  settingValue: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
  },
  disabledItem: {
    opacity: 0.6,
  },
  disabledText: {
    color: Theme.Colors.textTertiary,
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: Theme.Spacing.sm,
  },
  settingSubtitle: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.textSecondary,
    marginTop: Theme.Spacing.xs,
  },
  subSettingItem: {
    marginLeft: Theme.Spacing.lg,
    marginTop: Theme.Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
  },
  modalOverlayTouchable: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.Spacing.md,
  },
  modalContent: {
    backgroundColor: Theme.Colors.white,
    borderRadius: Theme.BorderRadius.xl,
    padding: Theme.Spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...Theme.Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  modalTitle: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
  },
  closeButton: {
    padding: Theme.Spacing.xs,
  },
  modalDescription: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.Spacing.lg,
    lineHeight: Theme.Typography.lineHeight.relaxed * Theme.Typography.fontSize.base,
  },
  inputContainer: {
    marginBottom: Theme.Spacing.md,
  },
  inputLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.sm,
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
    minHeight: 56,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Theme.Spacing.md,
    marginTop: Theme.Spacing.lg,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
  headerButton: {
    marginRight: 16,
  },
});
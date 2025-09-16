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
} from 'react-native';
import {
  DollarSign,
  CheckCircle,
  Calendar,
  FileText,
  Clock,
  AlertCircle,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import Button from '@/components/ui/Button';
import BackgroundImage from '@/components/ui/BackgroundImage';

import Dropdown from '@/components/ui/Dropdown';
import * as Haptics from 'expo-haptics';
import StandardLayout from '@/components/layout/StandardLayout';
const FUND_REQUEST_TYPES = [
  { id: 'emergency', name: 'Emergency Fund' },
  { id: 'equipment', name: 'Equipment Purchase' },
  { id: 'training', name: 'Training & Development' },
  { id: 'marketing', name: 'Marketing Campaign' },
  { id: 'supplies', name: 'Office Supplies' },
  { id: 'travel', name: 'Travel Expenses' },
  { id: 'other', name: 'Other' },
];

const PRIORITY_LEVELS = [
  { id: 'low', name: 'Low' },
  { id: 'medium', name: 'Medium' },
  { id: 'high', name: 'High' },
  { id: 'urgent', name: 'Urgent' },
];

// Mock fund request history
const MOCK_FUND_REQUESTS = [
  {
    id: 'FR001',
    type: 'Equipment Purchase',
    amount: 2500.00,
    status: 'approved',
    requestDate: '2024-01-10',
    approvalDate: '2024-01-12',
    description: 'New laptop for development team',
    priority: 'medium',
  },
  {
    id: 'FR002',
    type: 'Emergency Fund',
    amount: 1000.00,
    status: 'pending',
    requestDate: '2024-01-15',
    description: 'Server maintenance emergency',
    priority: 'urgent',
  },
  {
    id: 'FR003',
    type: 'Training & Development',
    amount: 800.00,
    status: 'rejected',
    requestDate: '2024-01-08',
    rejectionDate: '2024-01-10',
    description: 'Online certification course',
    priority: 'low',
    rejectionReason: 'Budget constraints for Q1',
  },
];

export default function FundRequestScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [requestType, setRequestType] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<string>('medium');
  const [justification, setJustification] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const handleAmountChange = (text: string) => {
    // Only allow numbers and decimal point
    const numericText = text.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = numericText.split('.');
    if (parts.length > 2) {
      return;
    }
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    setAmount(numericText);
  };

  const validateForm = () => {
    if (!requestType.trim()) {
      Alert.alert('Validation Error', 'Please select a request type');
      return false;
    }
    if (!amount.trim() || parseFloat(amount) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please provide a description');
      return false;
    }
    if (description.trim().length < 10) {
      Alert.alert('Validation Error', 'Description must be at least 10 characters');
      return false;
    }
    if (!justification.trim()) {
      Alert.alert('Validation Error', 'Please provide justification for this request');
      return false;
    }
    if (justification.trim().length < 20) {
      Alert.alert('Validation Error', 'Justification must be at least 20 characters');
      return false;
    }
    return true;
  };

  const handleSubmitRequest = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Mock submission processing
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 2000);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    // Reset form
    setRequestType('');
    setAmount('');
    setDescription('');
    setPriority('medium');
    setJustification('');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'rejected':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} color={colors.success} />;
      case 'pending':
        return <Clock size={16} color={colors.warning} />;
      case 'rejected':
        return <AlertCircle size={16} color={colors.error} />;
      default:
        return <Clock size={16} color={colors.textSecondary} />;
    }
  };

  const getPriorityColor = (priorityLevel: string) => {
    switch (priorityLevel) {
      case 'urgent':
        return colors.error;
      case 'high':
        return colors.warning;
      case 'medium':
        return colors.primary;
      case 'low':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <>
      <StandardLayout title="Fund Request">
      <BackgroundImage style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Actions */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.historyButton, { backgroundColor: colors.surfaceSecondary }]}
              onPress={() => setShowHistory(true)}
            >
              <FileText size={20} color={colors.primary} />
              <Text style={[styles.historyButtonText, { color: colors.primary }]}>View History</Text>
            </TouchableOpacity>
          </View>

          {/* Request Form */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>New Fund Request</Text>
            
            {/* Request Type */}
            <View style={styles.inputGroup}>
              <Dropdown
                title="Request Type *"
                options={FUND_REQUEST_TYPES}
                selectedValue={requestType}
                onSelect={setRequestType}
                placeholder="Select request type"
              />
            </View>

            {/* Amount */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Amount (SCR) *</Text>
              <View style={[styles.amountInputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <DollarSign size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.amountInput, { color: colors.textPrimary }]}
                  placeholder="0.00"
                  placeholderTextColor={colors.textSecondary}
                  value={amount}
                  onChangeText={handleAmountChange}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Priority */}
            <View style={styles.inputGroup}>
              <Dropdown
                title="Priority Level *"
                options={PRIORITY_LEVELS}
                selectedValue={priority}
                onSelect={setPriority}
                placeholder="Select priority"
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Description *</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
                placeholder="Brief description of the fund request..."
                placeholderTextColor={colors.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
              <Text style={[styles.characterCount, { color: colors.textSecondary }]}>
                {description.length}/200 characters
              </Text>
            </View>

            {/* Justification */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Justification *</Text>
              <TextInput
                style={[styles.textAreaLarge, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
                placeholder="Detailed justification for why this fund is needed, including business impact, urgency, and expected outcomes..."
                placeholderTextColor={colors.textSecondary}
                value={justification}
                onChangeText={setJustification}
                multiline
                numberOfLines={5}
                maxLength={500}
              />
              <Text style={[styles.characterCount, { color: colors.textSecondary }]}>
                {justification.length}/500 characters
              </Text>
            </View>

            {/* Info Box */}
            <View style={[styles.infoBox, { backgroundColor: colors.primaryLight }]}>
              <AlertCircle size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.primary }]}>
                All fund requests are subject to approval. Processing time is typically 2-5 business days.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16, backgroundColor: colors.surface, borderTopColor: colors.borderLight }]}>
          <Button
            title="Submit Request"
            onPress={handleSubmitRequest}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
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
            <View style={[styles.successModal, { backgroundColor: colors.surface }]}>
              <CheckCircle size={64} color={colors.success} />
              <Text style={[styles.successTitle, { color: colors.textPrimary }]}>Request Submitted!</Text>
              <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
                Your fund request for {formatCurrency(parseFloat(amount || '0'))} has been submitted successfully. 
                You will receive a notification once it&apos;s reviewed.
              </Text>
              <Button
                title="Done"
                onPress={handleSuccessClose}
                style={styles.successButton}
              />
            </View>
          </View>
        </Modal>

        {/* History Modal */}
        <Modal
          visible={showHistory}
          transparent
          animationType="slide"
          onRequestClose={() => setShowHistory(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.historyModal, { backgroundColor: colors.surface }]}>
              <View style={[styles.historyHeader, { borderBottomColor: colors.borderLight }]}>
                <Text style={[styles.historyTitle, { color: colors.textPrimary }]}>Fund Request History</Text>
                <TouchableOpacity onPress={() => setShowHistory(false)}>
                  <Text style={[styles.closeButton, { color: colors.primary }]}>Close</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.historyContent}>
                {MOCK_FUND_REQUESTS.map((request) => (
                  <View key={request.id} style={[styles.historyItem, { backgroundColor: colors.surfaceSecondary, borderColor: colors.borderLight }]}>
                    <View style={styles.historyItemHeader}>
                      <View style={styles.historyItemTitle}>
                        <Text style={[styles.requestId, { color: colors.textPrimary }]}>{request.id}</Text>
                        <View style={styles.statusContainer}>
                          {getStatusIcon(request.status)}
                          <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
                            {request.status.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.requestAmount, { color: colors.primary }]}>
                        {formatCurrency(request.amount)}
                      </Text>
                    </View>
                    
                    <Text style={[styles.requestType, { color: colors.textSecondary }]}>{request.type}</Text>
                    <Text style={[styles.requestDescription, { color: colors.textPrimary }]}>{request.description}</Text>
                    
                    <View style={styles.requestMeta}>
                      <View style={styles.metaItem}>
                        <Calendar size={14} color={colors.textSecondary} />
                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                          Requested: {formatDate(request.requestDate)}
                        </Text>
                      </View>
                      
                      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(request.priority) }]}>
                        <Text style={[styles.priorityText, { color: colors.white }]}>
                          {request.priority.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    
                    {request.approvalDate && (
                      <Text style={[styles.approvalDate, { color: colors.success }]}>
                        Approved: {formatDate(request.approvalDate)}
                      </Text>
                    )}
                    
                    {request.rejectionReason && (
                      <Text style={[styles.rejectionReason, { color: colors.error }]}>
                        Rejection Reason: {request.rejectionReason}
                      </Text>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </BackgroundImage>
        </StandardLayout>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  historyButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  amountInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  textArea: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  textAreaLarge: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  bottomSection: {
    padding: 16,
    borderTopWidth: 1,
  },
  submitButton: {
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
  historyModal: {
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  historyContent: {
    padding: 16,
  },
  historyItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  historyItemTitle: {
    flex: 1,
  },
  requestId: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  requestAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  requestType: {
    fontSize: 14,
    marginBottom: 4,
  },
  requestDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  requestMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  approvalDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  rejectionReason: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});
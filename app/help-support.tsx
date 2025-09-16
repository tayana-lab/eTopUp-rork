import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  ChevronRight,
  ExternalLink,
} from 'lucide-react-native';
import { Theme } from '@/constants/theme';

export default function HelpSupportScreen() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs = [
    {
      id: '1',
      question: 'How do I top up my mobile account?',
      answer: 'You can top up your mobile account by going to the TopUp section in the main menu, entering your mobile number, selecting the amount, and confirming the payment.',
    },
    {
      id: '2',
      question: 'What payment methods are accepted?',
      answer: 'We accept various payment methods including credit/debit cards, mobile money, and bank transfers. All transactions are secured with industry-standard encryption.',
    },
    {
      id: '3',
      question: 'How can I check my balance?',
      answer: 'Your current balance is displayed on the dashboard. You can also check it in the My Wallets section for detailed information about prepaid and postpaid balances.',
    },
    {
      id: '4',
      question: 'What should I do if a transaction fails?',
      answer: 'If a transaction fails, please check your internet connection and try again. If the problem persists, contact our support team with your transaction reference number.',
    },
    {
      id: '5',
      question: 'How do I reset my PIN?',
      answer: 'You can reset your PIN by going to Settings > Security > Change PIN. You will need to verify your identity through OTP verification.',
    },
  ];

  const contactOptions = [
    {
      id: 'phone',
      title: 'Call Support',
      subtitle: '+248 428 4000',
      icon: Phone,
      action: () => Linking.openURL('tel:+2484284000'),
    },
    {
      id: 'email',
      title: 'Email Support',
      subtitle: 'info@cwseychelles.com',
      icon: Mail,
      action: () => Linking.openURL('mailto:info@cwseychelles.com'),
    },
    {
      id: 'chat',
      title: 'Live Chat',
      subtitle: 'Available 24/7',
      icon: MessageCircle,
      action: () => Alert.alert('Live Chat', 'Live chat feature coming soon!'),
    },
  ];

  const handleFAQPress = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Help & Support',
          headerStyle: { 
            backgroundColor: Theme.Colors.primary,
          },
          headerTintColor: Theme.Colors.white,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <HelpCircle size={48} color={Theme.Colors.primary} />
          <Text style={styles.headerTitle}>How can we help you?</Text>
          <Text style={styles.headerSubtitle}>
            Find answers to common questions or get in touch with our support team
          </Text>
        </View>

        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          {contactOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <TouchableOpacity
                key={option.id}
                style={styles.contactOption}
                onPress={option.action}
                activeOpacity={0.7}
              >
                <View style={styles.contactLeft}>
                  <View style={styles.contactIcon}>
                    <IconComponent size={20} color={Theme.Colors.primary} />
                  </View>
                  <View style={styles.contactDetails}>
                    <Text style={styles.contactTitle}>{option.title}</Text>
                    <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
                  </View>
                </View>
                <ExternalLink size={16} color={Theme.Colors.textTertiary} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Support Hours */}
        <View style={styles.section}>
          <View style={styles.supportHours}>
            <Clock size={20} color={Theme.Colors.secondary} />
            <Text style={styles.supportHoursText}>
              Support Hours: 24/7 Available
            </Text>
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq) => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => handleFAQPress(faq.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <ChevronRight
                  size={16}
                  color={Theme.Colors.textTertiary}
                  style={[
                    styles.faqChevron,
                    expandedFAQ === faq.id && styles.faqChevronExpanded,
                  ]}
                />
              </TouchableOpacity>
              {expandedFAQ === faq.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Ticketing System */}
        <View style={styles.section}>
          <View style={styles.ticketingInfo}>
            <Text style={styles.ticketingTitle}>Need More Help?</Text>
            <Text style={styles.ticketingText}>
              If you can&apos;t find the answer you&apos;re looking for, our support team is here to help. 
              Contact us using any of the methods above, and we&apos;ll get back to you as soon as possible.
            </Text>
            <TouchableOpacity
              style={styles.ticketButton}
              onPress={() => Alert.alert('Ticket System', 'Ticketing system coming soon!')}
              activeOpacity={0.7}
            >
              <Text style={styles.ticketButtonText}>Create Support Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  header: {
    alignItems: 'center',
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.xl,
  },
  headerTitle: {
    fontSize: Theme.Typography.fontSize['2xl'],
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
    marginTop: Theme.Spacing.md,
    marginBottom: Theme.Spacing.sm,
  },
  headerSubtitle: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Theme.Typography.lineHeight.relaxed * Theme.Typography.fontSize.base,
  },
  section: {
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
  },
  sectionTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.md,
  },
  contactOption: {
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
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: Theme.BorderRadius.md,
    backgroundColor: Theme.Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactDetails: {
    marginLeft: Theme.Spacing.sm,
    flex: 1,
  },
  contactTitle: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
  },
  contactSubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    marginTop: 2,
  },
  supportHours: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.md,
    backgroundColor: Theme.Colors.surfaceSecondary,
    borderRadius: Theme.BorderRadius.md,
  },
  supportHoursText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textPrimary,
    marginLeft: Theme.Spacing.sm,
  },
  faqItem: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.md,
    marginBottom: Theme.Spacing.sm,
    overflow: 'hidden',
    ...Theme.Shadows.sm,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.md,
  },
  faqQuestionText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textPrimary,
    flex: 1,
    marginRight: Theme.Spacing.sm,
  },
  faqChevron: {
    transform: [{ rotate: '0deg' }],
  },
  faqChevronExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  faqAnswer: {
    paddingHorizontal: Theme.Spacing.md,
    paddingBottom: Theme.Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.Colors.borderLight,
  },
  faqAnswerText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    lineHeight: Theme.Typography.lineHeight.relaxed * Theme.Typography.fontSize.base,
  },
  ticketingInfo: {
    backgroundColor: Theme.Colors.surfaceSecondary,
    borderRadius: Theme.BorderRadius.md,
    padding: Theme.Spacing.lg,
  },
  ticketingTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.sm,
  },
  ticketingText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    marginBottom: Theme.Spacing.lg,
    lineHeight: Theme.Typography.lineHeight.relaxed * Theme.Typography.fontSize.base,
  },
  ticketButton: {
    backgroundColor: Theme.Colors.primary,
    paddingVertical: Theme.Spacing.md,
    borderRadius: Theme.BorderRadius.md,
    alignItems: 'center',
  },
  ticketButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.white,
  },
});
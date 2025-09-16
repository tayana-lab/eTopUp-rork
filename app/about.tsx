import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Stack } from 'expo-router';
import { ExternalLink, Smartphone, Shield, Users } from 'lucide-react-native';
import { Theme } from '@/constants/theme';

export default function AboutScreen() {
  const currentVersion = '1.0.0';
  const latestVersion = '1.0.0';
  const isUpToDate = currentVersion === latestVersion;

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://www.cwseychelles.com/privacy-policies');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://www.cwseychelles.com/terms-and-conditions');
  };

  const handleWebsite = () => {
    Linking.openURL('https://www.cwseychelles.com');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'About',
          headerStyle: { 
            backgroundColor: Theme.Colors.primary,
          },
          headerTintColor: Theme.Colors.white,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Info */}
        <View style={styles.header}>
          <View style={styles.appIcon}>
            <Smartphone size={48} color={Theme.Colors.primary} />
          </View>
          <Text style={styles.appName}>ETopUp App</Text>
          <Text style={styles.appTagline}>Your quick Top-Up Solution</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This App</Text>
          <Text style={styles.description}>
            Our ETopUp app provides a comprehensive platform for managing your mobile account, 
            topping up your balance, paying bills, and accessing various telecom services. 
            Built with security and user experience in mind, we make top-up services simple and accessible.
          </Text>
        </View>

        {/* Version Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Version Information</Text>
          
          <View style={styles.versionItem}>
            <Text style={styles.versionLabel}>Current App Version</Text>
            <Text style={styles.versionValue}>{currentVersion}</Text>
          </View>
          
          <View style={styles.versionItem}>
            <Text style={styles.versionLabel}>Latest Available Version</Text>
            <View style={styles.versionRight}>
              <Text style={styles.versionValue}>{latestVersion}</Text>
              {isUpToDate && (
                <View style={styles.upToDateBadge}>
                  <Text style={styles.upToDateText}>Up to date</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          
          <View style={styles.featureItem}>
            <Smartphone size={20} color={Theme.Colors.primary} />
            <Text style={styles.featureText}>Mobile TopUp & Recharge</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Shield size={20} color={Theme.Colors.secondary} />
            <Text style={styles.featureText}>Secure Payments & Transactions</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Users size={20} color={Theme.Colors.accent} />
            <Text style={styles.featureText}>24/7 Customer Support</Text>
          </View>
        </View>

        {/* Legal Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal & Privacy</Text>
          
          <TouchableOpacity style={styles.linkItem} onPress={handlePrivacyPolicy}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <ExternalLink size={16} color={Theme.Colors.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkItem} onPress={handleTermsOfService}>
            <Text style={styles.linkText}>Terms of Service</Text>
            <ExternalLink size={16} color={Theme.Colors.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkItem} onPress={handleWebsite}>
            <Text style={styles.linkText}>Visit Our Website</Text>
            <ExternalLink size={16} color={Theme.Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Company Info */}
        <View style={styles.section}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>Cable & Wireless (Seychelles) Ltd.</Text>
            <Text style={styles.companyAddress}>
              Rue de la possession PO Box 4{'\n'}
              Victoria, Mahé{'\n'}
              Seychelles
            </Text>
            <Text style={styles.companyContact}>
              Email: info@cwseychelles.com{'\n'}
              Phone: +248 428 4000
            </Text>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.footer}>
          <Text style={styles.copyright}>
            © 2025 Cable & Wireless (Seychelles) Ltd. All rights reserved.
          </Text>
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
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: Theme.BorderRadius.xl,
    backgroundColor: Theme.Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  appName: {
    fontSize: Theme.Typography.fontSize['2xl'],
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.xs,
  },
  appTagline: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    textAlign: 'center',
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
  description: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    lineHeight: Theme.Typography.lineHeight.relaxed * Theme.Typography.fontSize.base,
  },
  versionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.borderLight,
  },
  versionLabel: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
  },
  versionValue: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textSecondary,
  },
  versionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upToDateBadge: {
    backgroundColor: Theme.Colors.success,
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.BorderRadius.sm,
    marginLeft: Theme.Spacing.sm,
  },
  upToDateText: {
    fontSize: Theme.Typography.fontSize.xs,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.white,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.Spacing.sm,
  },
  featureText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
    marginLeft: Theme.Spacing.sm,
  },
  linkItem: {
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
  linkText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.primary,
  },
  companyInfo: {
    backgroundColor: Theme.Colors.surfaceSecondary,
    borderRadius: Theme.BorderRadius.md,
    padding: Theme.Spacing.lg,
  },
  companyName: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.sm,
  },
  companyAddress: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    marginBottom: Theme.Spacing.md,
    lineHeight: Theme.Typography.lineHeight.relaxed * Theme.Typography.fontSize.base,
  },
  companyContact: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    fontFamily: 'monospace',
    lineHeight: Theme.Typography.lineHeight.relaxed * Theme.Typography.fontSize.base,
  },
  footer: {
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.xl,
    alignItems: 'center',
  },
  copyright: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textTertiary,
    textAlign: 'center',
  },
});
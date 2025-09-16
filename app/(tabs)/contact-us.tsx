import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Phone, Mail, MessageCircle, MapPin, Clock, ExternalLink } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import BackgroundImage from '@/components/ui/BackgroundImage';
import StandardLayout from '@/components/layout/StandardLayout';

interface ContactMethod {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  action: () => void;
}

export default function ContactUsScreen() {
  const handlePhoneCall = () => {
    Linking.openURL('tel:+2484567890');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:info@cwseychelles.com');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/+2484284000');
  };

  const handleLocation = () => {
    Alert.alert('Location', 'Opening map to our office location...');
  };

  const handleWebsite = () => {
    Linking.openURL('https://www.cwseychelles.com');
  };

  const contactMethods: ContactMethod[] = [
    {
      id: '1',
      title: 'Phone Support',
      subtitle: '+248 428 4000 ',
      icon: 'phone',
      action: handlePhoneCall,
    },
    {
      id: '2',
      title: 'Email Support',
      subtitle: 'info@cwseychelles.com',
      icon: 'mail',
      action: handleEmail,
    },
    {
      id: '3',
      title: 'WhatsApp',
      subtitle: 'Chat with us on WhatsApp',
      icon: 'message',
      action: handleWhatsApp,
    },
    {
      id: '4',
      title: 'Visit Our Office',
      subtitle: 'Cable & Wireless (Seychelles) Ltd, Rue de la possession PO Box 4 Victoria, Mahe, Seychelles',
      icon: 'location',
      action: handleLocation,
    },
    {
      id: '5',
      title: 'Website',
      subtitle: 'https://www.cwseychelles.com',
      icon: 'website',
      action: handleWebsite,
    },
  ];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'phone':
        return Phone;
      case 'mail':
        return Mail;
      case 'message':
        return MessageCircle;
      case 'location':
        return MapPin;
      case 'website':
        return ExternalLink;
      default:
        return Phone;
    }
  };

  const renderContactMethod = (method: ContactMethod) => {
    const IconComponent = getIconComponent(method.icon);
    
    return (
      <TouchableOpacity
        key={method.id}
        style={styles.contactCard}
        onPress={method.action}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <IconComponent size={24} color={Theme.Colors.primary} />
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>{method.title}</Text>
          <Text style={styles.contactSubtitle}>{method.subtitle}</Text>
        </View>
        
        <ExternalLink size={20} color={Theme.Colors.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <StandardLayout title="Contact Us">
      <BackgroundImage style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Get in Touch</Text>
            <Text style={styles.headerSubtitle}>
              We&apos;re here to help you with any questions or concerns you may have.
            </Text>
          </View>

          {/* Contact Methods */}
          <View style={styles.contactMethods}>
            {contactMethods.map(renderContactMethod)}
          </View>

          {/* Business Hours */}
          <View style={styles.businessHours}>
            <View style={styles.sectionHeader}>
              <Clock size={24} color={Theme.Colors.primary} />
              <Text style={styles.sectionTitle}>Business Hours</Text>
            </View>
            
            <View style={styles.hoursContainer}>
              <View style={styles.hourRow}>
                <Text style={styles.dayText}>Monday - Friday</Text>
                <Text style={styles.timeText}>8:00 AM - 5:00 PM</Text>
              </View>
              
              <View style={styles.hourRow}>
                <Text style={styles.dayText}>Saturday</Text>
                <Text style={styles.timeText}>9:00 AM - 1:00 PM</Text>
              </View>
              
              <View style={styles.hourRow}>
                <Text style={styles.dayText}>Sunday</Text>
                <Text style={styles.timeText}>Closed</Text>
              </View>
            </View>
          </View>

          {/* Emergency Contact */}
          <View style={styles.emergencySection}>
            <Text style={styles.emergencyTitle}>Emergency Support</Text>
            <Text style={styles.emergencySubtitle}>
              For urgent technical issues outside business hours
            </Text>
            
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={() => Linking.openURL('tel:+248 428 4000')}
            >
              <Phone size={20} color={Theme.Colors.white} />
              <Text style={styles.emergencyButtonText}>Call Emergency Line</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  header: {
    marginBottom: Theme.Spacing.xl,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Theme.Typography.fontSize['2xl'],
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.sm,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Theme.Typography.lineHeight.relaxed * Theme.Typography.fontSize.base,
  },
  contactMethods: {
    marginBottom: Theme.Spacing.xl,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.md,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    ...Theme.Shadows.sm,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: Theme.BorderRadius.lg,
    backgroundColor: Theme.Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.Spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
  },
  businessHours: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.xl,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginLeft: Theme.Spacing.sm,
  },
  hoursContainer: {
    gap: Theme.Spacing.sm,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  timeText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
  },
  emergencySection: {
    backgroundColor: Theme.Colors.error,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.lg,
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.white,
    marginBottom: Theme.Spacing.xs,
  },
  emergencySubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.white,
    textAlign: 'center',
    marginBottom: Theme.Spacing.lg,
    opacity: 0.9,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Theme.Spacing.lg,
    paddingVertical: Theme.Spacing.md,
    borderRadius: Theme.BorderRadius.lg,
    gap: Theme.Spacing.sm,
  },
  emergencyButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.white,
  },
});
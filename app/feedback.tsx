import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { MessageSquare, Star, Send } from 'lucide-react-native';
import { Theme } from '@/constants/theme';

export default function FeedbackScreen() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarPress = (starRating: number) => {
    setRating(starRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please provide a rating before submitting.');
      return;
    }

    if (feedback.trim().length < 10) {
      Alert.alert('Feedback Required', 'Please provide at least 10 characters of feedback.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully. We appreciate your input!',
        [
          {
            text: 'OK',
            onPress: () => {
              setRating(0);
              setFeedback('');
            },
          },
        ]
      );
    }, 2000);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleStarPress(i)}
          style={styles.starButton}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <Star
            size={32}
            color={i <= rating ? Theme.Colors.warning : Theme.Colors.gray300}
            fill={i <= rating ? Theme.Colors.warning : 'transparent'}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Feedback',
          headerStyle: { 
            backgroundColor: Theme.Colors.primary,
          },
          headerTintColor: Theme.Colors.white,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <MessageSquare size={48} color={Theme.Colors.primary} />
          <Text style={styles.headerTitle}>We Value Your Feedback</Text>
          <Text style={styles.headerSubtitle}>
            Help us improve our services by sharing your experience
          </Text>
        </View>

        {/* Rating Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rate Your Experience</Text>
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
          {rating > 0 && (
            <Text style={styles.ratingText}>
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </Text>
          )}
        </View>

        {/* Feedback Text */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tell Us More</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Share your thoughts, suggestions, or report any issues..."
            placeholderTextColor={Theme.Colors.textTertiary}
            multiline
            numberOfLines={6}
            value={feedback}
            onChangeText={setFeedback}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>
            {feedback.length}/500 characters
          </Text>
        </View>

        {/* Submit Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (rating === 0 || feedback.trim().length < 10 || isSubmitting) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={rating === 0 || feedback.trim().length < 10 || isSubmitting}
            activeOpacity={0.7}
          >
            <Send size={20} color={Theme.Colors.white} />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Need Immediate Help?</Text>
            <Text style={styles.contactText}>
              For urgent matters, please contact our support team directly:
            </Text>
            <Text style={styles.contactDetails}>
              Email: info@cwseychelles.com{'\n'}
              Phone: +248 428 4000{'\n'}
              Hours: 24/7 Support Available
            </Text>
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
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  starButton: {
    marginHorizontal: Theme.Spacing.xs,
  },
  ratingText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.warning,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.md,
    padding: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    minHeight: 120,
  },
  characterCount: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    textAlign: 'right',
    marginTop: Theme.Spacing.xs,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.Colors.primary,
    paddingVertical: Theme.Spacing.md,
    borderRadius: Theme.BorderRadius.md,
    ...Theme.Shadows.sm,
  },
  submitButtonDisabled: {
    backgroundColor: Theme.Colors.gray400,
  },
  submitButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.white,
    marginLeft: Theme.Spacing.sm,
  },
  contactInfo: {
    backgroundColor: Theme.Colors.surfaceSecondary,
    borderRadius: Theme.BorderRadius.md,
    padding: Theme.Spacing.lg,
  },
  contactTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.sm,
  },
  contactText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    marginBottom: Theme.Spacing.md,
    lineHeight: Theme.Typography.lineHeight.relaxed * Theme.Typography.fontSize.base,
  },
  contactDetails: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
    fontFamily: 'monospace',
    lineHeight: Theme.Typography.lineHeight.relaxed * Theme.Typography.fontSize.base,
  },
});
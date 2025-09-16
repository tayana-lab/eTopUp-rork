import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { 
  CheckCircle,
  Sparkles,
  Trophy,
} from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import Button from '@/components/ui/Button';

export default function OnboardingSuccessScreen() {
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animation sequence
    const animationSequence = Animated.sequence([
      // Initial fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Scale up the success icon
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    // Slide up text animation
    const slideAnimation = Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      delay: 400,
      useNativeDriver: true,
    });

    // Sparkle animation
    const sparkleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Pulse animation for the success icon
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Confetti animation
    const confettiAnimation = Animated.timing(confettiAnim, {
      toValue: 1,
      duration: 2000,
      delay: 800,
      useNativeDriver: true,
    });

    // Start all animations
    animationSequence.start();
    slideAnimation.start();
    sparkleAnimation.start();
    pulseAnimation.start();
    confettiAnimation.start();

    // Cleanup
    return () => {
      sparkleAnimation.stop();
      pulseAnimation.stop();
    };
  }, [fadeAnim, scaleAnim, slideAnim, sparkleAnim, pulseAnim, confettiAnim]);

  const handleGoHome = () => {
    router.replace('/(tabs)/dashboard');
  };

  const handleViewDetails = () => {
    router.back();
  };

  // Create confetti particles
  const renderConfetti = () => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const randomX = Math.random() * width;
      
      particles.push(
        <Animated.View
          key={i}
          style={[
            styles.confettiParticle,
            {
              left: randomX,
              backgroundColor: i % 4 === 0 ? Theme.Colors.primary : 
                             i % 4 === 1 ? Theme.Colors.success : 
                             i % 4 === 2 ? Theme.Colors.warning : Theme.Colors.error,
              transform: [
                {
                  translateY: confettiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, height + 50],
                  }),
                },
                {
                  rotate: confettiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      );
    }
    return particles;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      
      {/* Background Gradient Effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Confetti */}
      <View style={styles.confettiContainer}>
        {renderConfetti()}
      </View>
      
      {/* Main Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {/* Sparkles */}
        <Animated.View 
          style={[
            styles.sparkleContainer,
            {
              opacity: sparkleAnim,
            },
          ]}
        >
          <View style={[styles.sparkle, styles.sparkle1]}>
            <Sparkles size={16} color={Theme.Colors.warning} />
          </View>
          <View style={[styles.sparkle, styles.sparkle2]}>
            <Sparkles size={12} color={Theme.Colors.primary} />
          </View>
          <View style={[styles.sparkle, styles.sparkle3]}>
            <Sparkles size={14} color={Theme.Colors.success} />
          </View>
          <View style={[styles.sparkle, styles.sparkle4]}>
            <Sparkles size={10} color={Theme.Colors.error} />
          </View>
        </Animated.View>
        
        {/* Success Icon */}
        <Animated.View 
          style={[
            styles.successIconContainer,
            {
              transform: [
                { scale: scaleAnim },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          <View style={styles.successIconBackground}>
            <CheckCircle size={80} color={Theme.Colors.white} />
          </View>
          <View style={styles.successIconGlow} />
        </Animated.View>
        
    
        
        {/* Success Text */}
        <Animated.View 
          style={[
            styles.textContainer,
            {
              transform: [
                {
                  translateY: slideAnim,
                },
              ],
            },
          ]}
        >
          <Text style={styles.congratsTitle}>Congratulations!</Text>
          <Text style={styles.successMessage}>
            Digital onboarding completed successfully
          </Text>

        </Animated.View>
        
        {/* Action Buttons */}
        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim,
                },
              ],
            },
          ]}
        >
          <Button
            title="Go to Dashboard"
            onPress={handleGoHome}
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}
          />
          
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `linear-gradient(135deg, ${Theme.Colors.primary}15 0%, ${Theme.Colors.success}10 100%)`,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  confettiParticle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.Spacing.xl,
    paddingTop: Theme.Spacing.xl * 2,
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: '20%',
    left: '15%',
  },
  sparkle2: {
    top: '25%',
    right: '20%',
  },
  sparkle3: {
    top: '60%',
    left: '10%',
  },
  sparkle4: {
    top: '65%',
    right: '15%',
  },
  successIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.Spacing.lg,
    position: 'relative',
  },
  successIconBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Theme.Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Theme.Colors.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  successIconGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Theme.Colors.success + '20',
    top: -10,
    left: -10,
  },
  trophyContainer: {
    marginBottom: Theme.Spacing.md,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Theme.Spacing.xl,
  },
  congratsTitle: {
    fontSize: Theme.Typography.fontSize['4xl'],
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Theme.Spacing.sm,
    letterSpacing: 0.5,
  },
  successMessage: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.success,
    textAlign: 'center',
    marginBottom: Theme.Spacing.md,
  },
  successSubtitle: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Theme.Typography.lineHeight.relaxed * Theme.Typography.fontSize.base,
    paddingHorizontal: Theme.Spacing.md,
  },
  detailsContainer: {
    alignSelf: 'stretch',
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.BorderRadius.lg,
    padding: Theme.Spacing.lg,
    marginBottom: Theme.Spacing.xl,
    shadowColor: Theme.Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  detailIcon: {
    marginRight: Theme.Spacing.md,
  },
  detailText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
    fontWeight: Theme.Typography.fontWeight.medium,
    flex: 1,
  },
  buttonContainer: {
    alignSelf: 'stretch',
    paddingHorizontal: Theme.Spacing.xl,
    marginTop: Theme.Spacing.xl,
    gap: Theme.Spacing.md,
  },
  primaryButton: {
    backgroundColor: Theme.Colors.primary,
    paddingVertical: Theme.Spacing.lg,
    borderRadius: Theme.BorderRadius.lg,
    shadowColor: Theme.Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.white,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.lg,
    borderRadius: Theme.BorderRadius.lg,
    borderWidth: 2,
    borderColor: Theme.Colors.border,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textSecondary,
  },
});
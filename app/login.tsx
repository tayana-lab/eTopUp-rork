import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import BackgroundImage from '@/components/ui/BackgroundImage';

import { Fingerprint, Eye, EyeOff, Box } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { AppConfig } from '@/constants/config';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Loader from '@/components/ui/Loader';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@/constants/theme';
interface MarketingAd {
  id: string;
  title: string;
  description: string;
  image: string;
  action: string;
  actionData: Record<string, any>;
}

interface MarketingCarouselProps {
  ads: MarketingAd[];
}

const MarketingCarousel: React.FC<MarketingCarouselProps> = ({ ads }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, AppConfig.dashboard.marketingAds.autoScrollInterval);

    return () => clearInterval(interval);
  }, [ads.length]);

  const handleAdPress = (ad: MarketingAd) => {
    console.log('Ad pressed:', ad.action, ad.actionData);
    Alert.alert(ad.title, ad.description);
  };

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
          setCurrentIndex(index);
        }}
        testID="marketing-carousel"
      >
        {ads.map((ad) => (
          <TouchableOpacity
            key={ad.id}
            style={styles.adContainer}
            onPress={() => handleAdPress(ad)}
            testID={`marketing-ad-${ad.id}`}
          >
            <Image
              source={{ uri: ad.image }}
              style={styles.adImage}
              contentFit="cover"
            />
            <View style={styles.adGradient}>
              <Text style={styles.adTitle}>{ad.title}</Text>
              <Text style={styles.adDescription}>{ad.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {AppConfig.dashboard.marketingAds.showIndicators && (
        <View style={styles.indicatorContainer}>
          {ads.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

interface PinInputProps {
  value: string;
  onChange: (pin: string) => void;
  maxLength: number;
  secureTextEntry?: boolean;
  error?: string;
  onSubmit?: () => void;
}

const PinInput: React.FC<PinInputProps> = ({
  value,
  onChange,
  maxLength,
  secureTextEntry = true,
  error,
  onSubmit,
}) => {
  const [showPin, setShowPin] = useState<boolean>(!secureTextEntry);

  return (
    <View style={styles.pinInputContainer}>
      <View style={styles.pinInputWrapper}>
        <Input
          value={value}
          onChangeText={onChange}
          placeholder={`Enter ${maxLength}-digit PIN`}
          keyboardType="numeric"
          maxLength={maxLength}
          secureTextEntry={secureTextEntry && !showPin}
          style={styles.pinInput}
          error={error}
          testID="pin-input"
          returnKeyType="done"
          onSubmitEditing={onSubmit}
          blurOnSubmit={true}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.pinToggleButton}
            onPress={() => setShowPin(!showPin)}
            testID="pin-toggle-visibility"
          >
            {showPin ? (
              <EyeOff size={20} color={Colors.gray500} />
            ) : (
              <Eye size={20} color={Colors.gray500} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function LoginScreen() {
  const {
    isAuthenticated,
    isLoading,
    isLocked,
    lockoutEndTime,
    loginAttempts,
    loginWithBiometric,
    loginWithPin,
    loginWithOtp,
    sendOtp,
    checkBiometricSupport,
    clearLockout,
  } = useAuth();
  
  const router = useRouter();

  const [loginMethod, setLoginMethod] = useState<'biometric' | 'pin' | 'otp'>('biometric');
  const [pin, setPin] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [, setBiometricSupported] = useState<boolean>(false);

  console.log('LoginScreen rendered', { isLoading, isLocked, loginMethod });

  const initializeLoginMethod = useCallback(async () => {
    const supported = await checkBiometricSupport();
    setBiometricSupported(supported);

    // Start with biometric for better UX
    setLoginMethod('biometric');
  }, [checkBiometricSupport]);

  useEffect(() => {
    initializeLoginMethod();
  }, [initializeLoginMethod]);

  useEffect(() => {
    if (isLocked && lockoutEndTime) {
      const timer = setInterval(() => {
        if (Date.now() >= lockoutEndTime) {
          clearLockout();
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutEndTime, clearLockout]);

  // Navigate to dashboard when user becomes authenticated
  useEffect(() => {
    console.log('LoginScreen: Auth state changed', { isAuthenticated, isLoading });
    if (isAuthenticated && !isLoading) {
      console.log('LoginScreen: User is authenticated, navigating to dashboard');
      // Use a small delay to ensure state is properly updated
      const timer = setTimeout(() => {
        router.replace('/(tabs)/dashboard');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, router]);

  const handleBiometricLogin = async () => {
    if (isLocked) return;
    
    setLoginMethod('biometric');
    setIsSubmitting(true);
    setError('');

    try {
      const success = await loginWithBiometric();
      if (!success) {
        setError('Biometric authentication failed. Please try PIN login.');
      }
    } catch {
      setError('Biometric authentication error. Please try PIN login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePinLogin = async () => {
    console.log('handlePinLogin called with PIN:', pin);
    if (isLocked || !pin.trim()) {
      console.log('Login blocked - locked or empty PIN:', { isLocked, pin: pin.trim() });
      return;
    }
    
    if (!AppConfig.regex.pin.test(pin)) {
      console.log('PIN validation failed:', pin, 'regex test:', AppConfig.regex.pin.test(pin));
      setError(AppConfig.validation.invalidPin);
      return;
    }

    console.log('PIN validation passed, attempting login...');
    setLoginMethod('pin');
    setIsSubmitting(true);
    setError('');

    try {
      console.log('Calling loginWithPin...');
      const success = await loginWithPin(pin);
      console.log('loginWithPin result:', success);
      if (!success) {
        setError(`Incorrect PIN. ${AppConfig.auth.maxLoginAttempts - loginAttempts - 1} attempts remaining.`);
        setPin('');
      } else {
        console.log('PIN login successful! Auth state should be updated.');
        // Force a small delay to ensure state is updated
        setTimeout(() => {
          console.log('Attempting to navigate to dashboard after PIN login');
        }, 100);
      }
    } catch (error) {
      console.error('PIN login error:', error);
      setError('PIN login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!AppConfig.regex.phone.test(phone)) {
      setError(AppConfig.validation.invalidPhone);
      return;
    }

    setLoginMethod('otp');
    setIsSubmitting(true);
    setError('');

    try {
      const success = await sendOtp(phone);
      if (success) {
        setOtpSent(true);
        Alert.alert('OTP Sent', 'Please check your phone for the verification code.');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch {
      setError('Failed to send OTP. Please check your phone number.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpLogin = async () => {
    if (isLocked || !otp.trim()) return;
    
    if (!AppConfig.regex.otp.test(otp)) {
      setError(AppConfig.validation.invalidOtp);
      return;
    }

    setLoginMethod('otp');
    setIsSubmitting(true);
    setError('');

    try {
      const success = await loginWithOtp(phone, otp);
      if (!success) {
        setError('Invalid OTP. Please try again.');
        setOtp('');
      }
    } catch {
      setError('OTP verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLockoutTimeRemaining = (): string => {
    if (!isLocked || !lockoutEndTime) return '';
    
    const remaining = Math.max(0, lockoutEndTime - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Loader visible={true} size="large" overlay={false} />
      </SafeAreaView>
    );
  }

  return (
    <BackgroundImage style={styles.container}>
       <View style={styles.topSafeArea} />
       <StatusBar backgroundColor="#0584dc" barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContentContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentContainer}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View style={styles.promoCard}>
                <Text style={styles.promoTitle}>Seamless Integration</Text>
                <Text style={styles.promoSubtitle}>Connect with 500+ retailers in your network</Text>
                <View style={styles.pagerDots}>
                  <View style={[styles.dot, styles.dotActive]} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
              </View>

              <View style={styles.logoContainer}>
                <Image
                  source={{ uri: 'https://unomessaging.tayana.in/images/cws-logo.png' }}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.brandTitle}>ETopUp</Text>
              <Text style={styles.brandTagline}>Your Quick Top-Up Solutions</Text>
            </View>
          </LinearGradient>

          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>Choose your preferred login method.</Text>
        


          
            {isLocked ? (
              <View style={styles.lockoutContainer}>
                <Text style={styles.lockoutTitle}>Account Temporarily Locked</Text>
                <Text style={styles.lockoutMessage}>
                  Too many failed attempts. Please try again in {getLockoutTimeRemaining()}
                </Text>
              </View>
            ) : (
              <>
                {error ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                {loginMethod === 'biometric' ? (
                  <View style={styles.biometricSection}>
                    <TouchableOpacity 
                      style={styles.biometricCard}
                      onPress={handleBiometricLogin}
                      disabled={isSubmitting && loginMethod === 'biometric'}
                      testID="biometric-login-button"
                    >
                      <View style={styles.biometricIconContainer}>
                        <Fingerprint size={24} color={Colors.primary} />
                      </View>
                      <Text style={styles.biometricTitle}>Face/Biometric Login</Text>
                      <Text style={styles.biometricDescription}>
                        Use your face or fingerprint for quick and secure access
                      </Text>
                      <View style={styles.biometricFakeButton}>
                        <Text style={styles.biometricFakeButtonText}>Login with Biometric</Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.usePinButton}
                      onPress={() => setLoginMethod('pin')}
                      testID="use-pin-button"
                    >
                      <Text style={styles.usePinText}>Use PIN instead</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

             {loginMethod === 'pin' ? (
  <View style={styles.biometricCard}>
    <Text style={styles.biometricTitle}>Enter PIN</Text>
    <Text style={styles.biometricDescription}>
      Use your PIN for quick and secure access
    </Text>

    <PinInput
      value={pin}
      onChange={setPin}
      maxLength={AppConfig.auth.pinLength}
      error={error}
      onSubmit={handlePinLogin}
    />

    <Button
      title="Login with PIN"
      onPress={handlePinLogin}
      loading={isSubmitting}
      disabled={pin.length !== AppConfig.auth.pinLength}
      style={styles.pinLoginButton}
      testID="pin-login-button"
    />

    <TouchableOpacity
      style={styles.backToBiometricButton}
      onPress={() => setLoginMethod('biometric')}
      testID="back-to-biometric-button"
    >
      <Text style={styles.backToBiometricText}>← Back to Biometric</Text>
    </TouchableOpacity>
  </View>
): null}


                {loginMethod === 'otp' ? (
                  <View style={styles.otpSection}>
                    {!otpSent ? (
                      <>
                        <Input
                          value={phone}
                          onChangeText={setPhone}
                          placeholder="Enter phone number"
                          keyboardType="phone-pad"
                          style={styles.phoneInput}
                          testID="phone-input"
                        />
                        <Button
                          title="Send OTP"
                          onPress={handleSendOtp}
                          loading={isSubmitting && loginMethod === 'otp' && !otpSent}
                          disabled={!phone.trim()}
                          style={styles.otpButton}
                          testID="send-otp-button"
                        />
                      </>
                    ) : (
                      <>
                        <Input
                          value={otp}
                          onChangeText={setOtp}
                          placeholder="Enter 6-digit OTP"
                          keyboardType="numeric"
                          maxLength={AppConfig.auth.otpLength}
                          style={styles.otpInput}
                          testID="otp-input"
                        />
                        <Button
                          title="Verify OTP"
                          onPress={handleOtpLogin}
                          loading={isSubmitting && loginMethod === 'otp' && otpSent}
                          disabled={otp.length !== AppConfig.auth.otpLength}
                          style={styles.otpButton}
                          testID="verify-otp-button"
                        />
                        <TouchableOpacity
                          style={styles.changeNumberButton}
                          onPress={() => {
                            setOtpSent(false);
                            setOtp('');
                            setError('');
                          }}
                          testID="change-number-button"
                        >
                          <Text style={styles.changeNumberText}>Change Number</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                ) : null}
              </>
            )}

 {!isLocked && (
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>New User?{' '}</Text>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert('Sign Up', 'This will navigate to sign up flow');
                }}
                testID="sign-up-button"
              >
                <Text style={styles.signUpLink}>Register</Text>
              </TouchableOpacity>
            </View>
          )}
            
          </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    //backgroundColor:'#0584dc',
  },
    topSafeArea: {
    height: StatusBar.currentHeight || 0,
    backgroundColor: '#007BFF', // Your blue color
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 600,
  },
  headerGradient: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl + 24,
    paddingHorizontal: Spacing.md,
  },
  headerContent: {
    alignItems: 'center',
  },
  promoCard: {
    width: '100%',
    backgroundColor: '#E8505B',
    borderRadius: 16,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    ...Shadows.lg,
    marginBottom: Spacing.lg,
  },
  promoTitle: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'left',
    marginBottom: 4,
  },
  promoSubtitle: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    opacity: 0.9,
  },
  pagerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: Colors.white,
  },
  logoContainer: {
    alignItems: 'center',
    //marginBottom: 12,
  },
  logoImage: {
    width: 300,
    height: 60,
  },
  brandTitle: {
    color: Colors.white,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 6,
    textAlign: 'center',
  },
  brandTagline: {
    color: Colors.white,
    opacity: 0.95,
    fontSize: Typography.fontSize.base,
  },
  
  // Marketing Carousel
  carouselContainer: {
    flex: 1,
    marginBottom: Spacing.sm,
  },
  adContainer: {
    width: 350,
    height: 180,
    marginHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  adImage: {
    width: '100%',
    height: '100%',
  },
  adGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  adTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  adDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.white,
    opacity: 0.9,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
    opacity: 0.3,
    marginHorizontal: 4,
  },
  activeIndicator: {
    opacity: 1,
    backgroundColor: Colors.primary,
  },
  
welcomeSection: {
  alignItems: 'center',
  paddingHorizontal: Spacing.lg,
  paddingVertical: Spacing.xl,
 // marginHorizontal: Spacing.md,
  backgroundColor: Colors.white,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  marginTop: -24,
  ...Shadows.lg,
  flex: 1,
  position: 'relative',
  zIndex: 1,
},


  welcomeTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  
  
 loginCard: {
  backgroundColor: Colors.white,
  marginHorizontal: 0,
  marginBottom: Spacing.md,
  padding: Spacing.lg,
  borderBottomLeftRadius: BorderRadius.xl,
  borderBottomRightRadius: BorderRadius.xl,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  ...Shadows.lg,
  minHeight: 200,
},

  loginOptionsContainer: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  loginOptionCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  
  // Login Option Headers
  loginOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  loginOptionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  loginOptionDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  loginOptionButton: {
    marginTop: Spacing.sm,
  },
  
  // Error Container
  errorContainer: {
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.white,
    textAlign: 'center',
  },
  
  // Biometric Section
  biometricSection: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  biometricCard: {
    backgroundColor: '#F8F9FF',
    borderRadius: 16,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E8EAFF',
  },
  biometricIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  biometricTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  biometricDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    marginBottom: Spacing.md,
  },
  biometricFakeButton: {
    alignSelf: 'stretch',
    backgroundColor: '#E8EAFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 48,
  },
  biometricFakeButtonText: {
    color: '#5C79FF',
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  usePinButton: {
    paddingVertical: Spacing.lg,
  },
  usePinText: {
    fontSize: Typography.fontSize.base,
    color: '#8B9DC3',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  backToBiometricButton: {
    paddingVertical: Spacing.md,
    alignSelf: 'center',
    marginTop: Spacing.sm,
  },
  backToBiometricText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    textAlign: 'center',
  },
  
  // PIN Section
  pinSection: {
    paddingVertical: Spacing.md,
  },
  demoPinHelper: {
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  demoPinText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  pinButton: {
    alignSelf: 'stretch',
    marginTop: Spacing.md,
  },
  pinLoginButton: {
    marginTop: Spacing.md,
  },
  
  // OTP Section
  otpSection: {
    paddingVertical: Spacing.md,
  },
  otpButton: {
    alignSelf: 'stretch',
    marginTop: Spacing.md,
  },
  
  // PIN Footer
  pinFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  switchMethodButton: {
    paddingVertical: Spacing.sm,
  },
  switchMethodText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  

  

  pinInputContainer: {
    marginBottom: Spacing.sm,
    alignSelf: 'stretch',
  },
  pinInputWrapper: {
    position: 'relative',
    alignSelf: 'stretch',
  },

pinInput: {
  flex: 1,
  //fontSize: Typography.fontSize.xl,
  //letterSpacing: 4,
  textAlign: 'center',
  paddingVertical: 12,
},


  pinToggleButton: {
    position: 'absolute',
    right: 16,
    top: -12,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  forgotButton: {
    alignSelf: 'center',
  },
  forgotButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  
  // Input Styles
  phoneInput: {
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.sm,
  },
  otpInput: {
    textAlign: 'center',
    fontSize: Typography.fontSize.lg,
    letterSpacing: 2,
  },
  otpButtonsContainer: {
    gap: Spacing.sm,
  },
  verifyButton: {
    marginTop: Spacing.sm,
  },
  changeNumberButton: {
    alignSelf: 'center',
    paddingVertical: Spacing.sm,
  },
  changeNumberText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  

  
  // Lockout
  lockoutContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  lockoutTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.error,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  lockoutMessage: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  
  // Sign Up
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    marginTop: 'auto',
  },
  signUpText: {
    fontSize: Typography.fontSize.base,
    color: '#8B9DC3',
  },
  signUpLink: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary,
  },
});
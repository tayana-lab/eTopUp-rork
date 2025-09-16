import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { AppConfig } from '@/constants/config';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  role: 'customer' | 'admin' | 'manager';
  isVerified: boolean;
  createdAt: string;
}

export interface Address {
  id: string;
  type: 'primary' | 'secondary';
  label: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  photo?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  biometricEnabled: boolean;
  hasPin: boolean;
  loginAttempts: number;
  isLocked: boolean;
  lockoutEndTime: number | null;
}

interface AuthContextValue extends AuthState {
  // Authentication methods
  loginWithBiometric: () => Promise<boolean>;
  loginWithPin: (pin: string) => Promise<boolean>;
  loginWithOtp: (phone: string, otp: string) => Promise<boolean>;
  sendOtp: (phone: string) => Promise<boolean>;
  
  // Registration methods
  registerUser: (userData: RegisterUserData) => Promise<boolean>;
  verifyOtpForRegistration: (phone: string, otp: string) => Promise<boolean>;
  
  // PIN management
  setPin: (pin: string) => Promise<boolean>;
  changePin: (oldPin: string, newPin: string) => Promise<boolean>;
  resetPin: (phone: string, otp: string, newPin: string) => Promise<boolean>;
  
  // Biometric management
  enableBiometric: () => Promise<boolean>;
  disableBiometric: () => Promise<boolean>;
  checkBiometricSupport: () => Promise<boolean>;
  
  // User management
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<boolean>;
  updateAddress: (addressId: string, address: Partial<Address>) => Promise<boolean>;
  deleteAddress: (addressId: string) => Promise<boolean>;
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => Promise<boolean>;
  deletePaymentMethod: (paymentMethodId: string) => Promise<boolean>;
  
  // Session management
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearLockout: () => void;
}

export interface RegisterUserData {
  name: string;
  email: string;
  phone: string;
  addresses: Omit<Address, 'id'>[];
  pin: string;
  enableBiometric?: boolean;
  paymentMethods?: Omit<PaymentMethod, 'id'>[];
}

const STORAGE_KEYS = {
  USER: 'user',
  PIN: 'user_pin',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  LOGIN_ATTEMPTS: 'login_attempts',
  LOCKOUT_END_TIME: 'lockout_end_time',
} as const;

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    biometricEnabled: false,
    hasPin: false,
    loginAttempts: 0,
    isLocked: false,
    lockoutEndTime: null,
  });

  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setAuthState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetLoginAttempts = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
    await AsyncStorage.removeItem(STORAGE_KEYS.LOCKOUT_END_TIME);
    setAuthState(prev => ({ ...prev, loginAttempts: 0, isLocked: false, lockoutEndTime: null }));
  }, []);

  const clearLockout = useCallback(() => {
    if (authState.lockoutEndTime && Date.now() >= authState.lockoutEndTime) {
      resetLoginAttempts();
    }
  }, [authState.lockoutEndTime, resetLoginAttempts]);

  const incrementLoginAttempts = useCallback(async () => {
    const newAttempts = authState.loginAttempts + 1;
    await AsyncStorage.setItem(STORAGE_KEYS.LOGIN_ATTEMPTS, newAttempts.toString());
    
    if (newAttempts >= AppConfig.auth.maxLoginAttempts) {
      const lockoutEndTime = Date.now() + (AppConfig.auth.lockoutDurationMinutes * 60 * 1000);
      await AsyncStorage.setItem(STORAGE_KEYS.LOCKOUT_END_TIME, lockoutEndTime.toString());
      updateAuthState({ loginAttempts: newAttempts, isLocked: true, lockoutEndTime });
    } else {
      updateAuthState({ loginAttempts: newAttempts });
    }
  }, [authState.loginAttempts, updateAuthState]);

  const initializeAuth = useCallback(async () => {
    try {
      console.log('Initializing auth state...');
      
      const [user, biometricEnabled, loginAttempts, lockoutEndTime] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        Platform.OS !== 'web' ? SecureStore.getItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED) : null,
        AsyncStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS),
        AsyncStorage.getItem(STORAGE_KEYS.LOCKOUT_END_TIME),
      ]);

      let hasPin = Platform.OS !== 'web' ? 
        !!(await SecureStore.getItemAsync(STORAGE_KEYS.PIN)) : 
        !!(await AsyncStorage.getItem(STORAGE_KEYS.PIN));

      // For demo purposes, always ensure PIN is set to 123456
      const demoPin = '123456';
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(STORAGE_KEYS.PIN, demoPin);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.PIN, demoPin);
      }
      hasPin = true;
      console.log('Demo PIN set/reset to: 123456');

      let parsedUser = null;
      if (user) {
        try {
          parsedUser = typeof user === 'string' ? JSON.parse(user) : user;
        } catch (e) {
          console.error('Failed to parse user data:', e);
          parsedUser = null;
        }
      }
      const attempts = loginAttempts ? parseInt(loginAttempts, 10) : 0;
      const lockoutEnd = lockoutEndTime ? parseInt(lockoutEndTime, 10) : null;
      const isLocked = lockoutEnd ? Date.now() < lockoutEnd : false;

      const newAuthState = {
        user: parsedUser,
        isAuthenticated: !!parsedUser,
        isLoading: false,
        biometricEnabled: biometricEnabled === 'true',
        hasPin,
        loginAttempts: attempts,
        isLocked,
        lockoutEndTime: lockoutEnd,
      };

      console.log('Setting auth state:', newAuthState);
      setAuthState(newAuthState);

      console.log('Auth state initialized successfully');
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Auto-clear lockout when time expires
  useEffect(() => {
    if (authState.isLocked && authState.lockoutEndTime) {
      const timeRemaining = authState.lockoutEndTime - Date.now();
      if (timeRemaining > 0) {
        const timeout = setTimeout(clearLockout, timeRemaining);
        return () => clearTimeout(timeout);
      } else {
        clearLockout();
      }
    }
  }, [authState.isLocked, authState.lockoutEndTime, clearLockout]);



  const checkBiometricSupport = async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;
    
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Biometric check failed:', error);
      return false;
    }
  };

  const loginWithBiometric = async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;
    if (authState.isLocked) return false;
    
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: AppConfig.auth.biometricPromptTitle,
        fallbackLabel: AppConfig.auth.biometricFallbackLabel,
        disableDeviceFallback: false,
      });

      if (result.success) {
        await resetLoginAttempts();
        
        // Load existing user or create demo user
        let userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        let user: User;
        
        if (userData) {
          try {
            user = typeof userData === 'string' ? JSON.parse(userData) : userData;
          } catch (e) {
            console.error('Failed to parse user data:', e);
            // Return false if we can't parse user data
            return false;
          }
        } else {
          // Create demo user if none exists
          user = {
            id: '1',
            name: 'Demo User',
            email: 'demo@example.com',
            phone: '+1234567890',
            profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            addresses: [],
            paymentMethods: [],
            role: 'customer',
            isVerified: true,
            createdAt: new Date().toISOString(),
          };
          await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        }
        
        updateAuthState({ user, isAuthenticated: true });
        console.log('Biometric login successful');
        return true;
      } else {
        await incrementLoginAttempts();
        console.log('Biometric login failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      await incrementLoginAttempts();
      return false;
    }
  };

  const loginWithPin = async (pin: string): Promise<boolean> => {
    console.log('AuthContext: loginWithPin called with:', pin);
    console.log('AuthContext: Current auth state:', { isLocked: authState.isLocked, loginAttempts: authState.loginAttempts });
    
    if (authState.isLocked) {
      console.log('AuthContext: Login blocked - account is locked');
      return false;
    }
    
    // Trim the PIN and validate
    const trimmedPin = pin.trim();
    if (!AppConfig.regex.pin.test(trimmedPin)) {
      console.log('AuthContext: PIN validation failed:', trimmedPin, 'regex:', AppConfig.regex.pin);
      return false;
    }

    try {
      const storedPin = Platform.OS !== 'web' ? 
        await SecureStore.getItemAsync(STORAGE_KEYS.PIN) :
        await AsyncStorage.getItem(STORAGE_KEYS.PIN);
      
      console.log('AuthContext: Stored PIN:', storedPin, 'Input PIN:', trimmedPin, 'Match:', storedPin === trimmedPin);

      if (storedPin === trimmedPin) {
        console.log('AuthContext: PIN match successful, resetting login attempts...');
        await resetLoginAttempts();
        
        // Load existing user or create demo user
        let userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        let user: User;
        
        if (userData) {
          console.log('AuthContext: Loading existing user data');
          try {
            user = typeof userData === 'string' ? JSON.parse(userData) : userData;
          } catch (e) {
            console.error('Failed to parse user data:', e);
            // Return false if we can't parse user data
            return false;
          }
        } else {
          console.log('AuthContext: Creating demo user');
          // Create demo user if none exists
          user = {
            id: '1',
            name: 'Demo User',
            email: 'demo@example.com',
            phone: '+1234567890',
            profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            addresses: [],
            paymentMethods: [],
            role: 'customer',
            isVerified: true,
            createdAt: new Date().toISOString(),
          };
          await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        }
        
        console.log('AuthContext: Updating auth state with user:', user);
        updateAuthState({ user, isAuthenticated: true });
        console.log('AuthContext: PIN login successful');
        return true;
      } else {
        console.log('AuthContext: PIN mismatch, incrementing login attempts');
        await incrementLoginAttempts();
        console.log('AuthContext: PIN login failed: incorrect PIN');
        return false;
      }
    } catch (error) {
      console.error('AuthContext: PIN login error:', error);
      await incrementLoginAttempts();
      return false;
    }
  };

  const sendOtp = async (phone: string): Promise<boolean> => {
    if (!AppConfig.regex.phone.test(phone)) return false;

    try {
      // Simulate OTP sending - replace with actual API call
      console.log('Sending OTP to:', phone);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Send OTP error:', error);
      return false;
    }
  };

  const loginWithOtp = async (phone: string, otp: string): Promise<boolean> => {
    if (authState.isLocked) return false;
    if (!AppConfig.regex.phone.test(phone) || !AppConfig.regex.otp.test(otp)) return false;

    try {
      // Simulate OTP verification - replace with actual API call
      console.log('Verifying OTP for phone:', phone, 'OTP:', otp);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 6-digit OTP
      if (otp.length === 6) {
        await resetLoginAttempts();
        
        // Load or create user data
        const userData: User = {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          phone,
          addresses: [],
          paymentMethods: [],
          role: 'customer',
          isVerified: true,
          createdAt: new Date().toISOString(),
        };
        
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        updateAuthState({ user: userData, isAuthenticated: true });
        console.log('OTP login successful');
        return true;
      } else {
        await incrementLoginAttempts();
        console.log('OTP login failed: invalid OTP');
        return false;
      }
    } catch (error) {
      console.error('OTP login error:', error);
      await incrementLoginAttempts();
      return false;
    }
  };

  const setPin = async (pin: string): Promise<boolean> => {
    if (!AppConfig.regex.pin.test(pin)) return false;

    try {
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(STORAGE_KEYS.PIN, pin);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.PIN, pin);
      }
      updateAuthState({ hasPin: true });
      console.log('PIN set successfully');
      return true;
    } catch (error) {
      console.error('Set PIN error:', error);
      return false;
    }
  };

  const changePin = async (oldPin: string, newPin: string): Promise<boolean> => {
    if (!AppConfig.regex.pin.test(oldPin) || !AppConfig.regex.pin.test(newPin)) return false;

    try {
      const storedPin = Platform.OS !== 'web' ? 
        await SecureStore.getItemAsync(STORAGE_KEYS.PIN) :
        await AsyncStorage.getItem(STORAGE_KEYS.PIN);

      if (storedPin === oldPin) {
        return await setPin(newPin);
      } else {
        console.log('Change PIN failed: incorrect old PIN');
        return false;
      }
    } catch (error) {
      console.error('Change PIN error:', error);
      return false;
    }
  };

  const resetPin = async (phone: string, otp: string, newPin: string): Promise<boolean> => {
    if (!AppConfig.regex.phone.test(phone) || !AppConfig.regex.otp.test(otp) || !AppConfig.regex.pin.test(newPin)) {
      return false;
    }

    try {
      // Simulate OTP verification - replace with actual API call
      console.log('Verifying OTP for PIN reset:', phone, otp);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 6-digit OTP
      if (otp.length === 6) {
        return await setPin(newPin);
      } else {
        console.log('PIN reset failed: invalid OTP');
        return false;
      }
    } catch (error) {
      console.error('Reset PIN error:', error);
      return false;
    }
  };

  const enableBiometric = async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;
    
    try {
      const isSupported = await checkBiometricSupport();
      if (!isSupported) return false;

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable biometric authentication',
        fallbackLabel: 'Cancel',
      });

      if (result.success) {
        await SecureStore.setItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
        updateAuthState({ biometricEnabled: true });
        console.log('Biometric enabled successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Enable biometric error:', error);
      return false;
    }
  };

  const disableBiometric = async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;
    
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED);
      updateAuthState({ biometricEnabled: false });
      console.log('Biometric disabled successfully');
      return true;
    } catch (error) {
      console.error('Disable biometric error:', error);
      return false;
    }
  };

  const registerUser = async (userData: RegisterUserData): Promise<boolean> => {
    try {
      console.log('Registering user:', userData.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const user: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        addresses: userData.addresses.map((addr, index) => ({
          ...addr,
          id: `addr_${index}`,
        })),
        paymentMethods: userData.paymentMethods?.map((pm, index) => ({
          ...pm,
          id: `pm_${index}`,
        })) || [],
        role: 'customer',
        isVerified: true,
        createdAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      await setPin(userData.pin);
      
      if (userData.enableBiometric) {
        await enableBiometric();
      }
      
      updateAuthState({ user, isAuthenticated: true });
      console.log('User registered successfully');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const verifyOtpForRegistration = async (phone: string, otp: string): Promise<boolean> => {
    if (!AppConfig.regex.phone.test(phone) || !AppConfig.regex.otp.test(otp)) return false;

    try {
      console.log('Verifying OTP for registration:', phone, otp);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return otp.length === 6; // Demo: accept any 6-digit OTP
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const updatedUser = { ...authState.user, ...userData };
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      updateAuthState({ user: updatedUser });
      console.log('User updated successfully');
      return true;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  };

  const addAddress = async (address: Omit<Address, 'id'>): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const newAddress: Address = {
        ...address,
        id: `addr_${Date.now()}`,
      };
      
      const updatedAddresses = [...authState.user.addresses, newAddress];
      return await updateUser({ addresses: updatedAddresses });
    } catch (error) {
      console.error('Add address error:', error);
      return false;
    }
  };

  const updateAddress = async (addressId: string, address: Partial<Address>): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const updatedAddresses = authState.user.addresses.map(addr => 
        addr.id === addressId ? { ...addr, ...address } : addr
      );
      return await updateUser({ addresses: updatedAddresses });
    } catch (error) {
      console.error('Update address error:', error);
      return false;
    }
  };

  const deleteAddress = async (addressId: string): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const updatedAddresses = authState.user.addresses.filter(addr => addr.id !== addressId);
      return await updateUser({ addresses: updatedAddresses });
    } catch (error) {
      console.error('Delete address error:', error);
      return false;
    }
  };

  const addPaymentMethod = async (paymentMethod: Omit<PaymentMethod, 'id'>): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const newPaymentMethod: PaymentMethod = {
        ...paymentMethod,
        id: `pm_${Date.now()}`,
      };
      
      const updatedPaymentMethods = [...authState.user.paymentMethods, newPaymentMethod];
      return await updateUser({ paymentMethods: updatedPaymentMethods });
    } catch (error) {
      console.error('Add payment method error:', error);
      return false;
    }
  };

  const deletePaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const updatedPaymentMethods = authState.user.paymentMethods.filter(pm => pm.id !== paymentMethodId);
      return await updateUser({ paymentMethods: updatedPaymentMethods });
    } catch (error) {
      console.error('Delete payment method error:', error);
      return false;
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (userData) {
        let user;
        try {
          user = typeof userData === 'string' ? JSON.parse(userData) : userData;
        } catch (e) {
          console.error('Failed to parse user data:', e);
          return;
        }
        updateAuthState({ user });
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('AuthContext: Starting logout process...');
      
      // Clear user data and session info, but keep PIN for demo
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.LOGIN_ATTEMPTS,
        STORAGE_KEYS.LOCKOUT_END_TIME,
      ]);
      
      // Clear biometric settings but keep PIN for demo
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED);
      }
      
      // Reset PIN to demo value for easy re-login
      const demoPin = '123456';
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(STORAGE_KEYS.PIN, demoPin);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.PIN, demoPin);
      }
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        biometricEnabled: false,
        hasPin: true, // Keep PIN available
        loginAttempts: 0,
        isLocked: false,
        lockoutEndTime: null,
      });
      
      console.log('AuthContext: Logout successful, PIN reset to demo value');
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
    }
  };



  return {
    ...authState,
    loginWithBiometric,
    loginWithPin,
    loginWithOtp,
    sendOtp,
    registerUser,
    verifyOtpForRegistration,
    setPin,
    changePin,
    resetPin,
    enableBiometric,
    disableBiometric,
    checkBiometricSupport,
    updateUser,
    addAddress,
    updateAddress,
    deleteAddress,
    addPaymentMethod,
    deletePaymentMethod,
    logout,
    refreshUser,
    clearLockout,
  };
});
import createContextHook from '@nkzw/create-context-hook';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { useCallback, useEffect, useState, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TransactionPinState {
  isEnabled: boolean;
  hasPin: boolean;
  isLoading: boolean;
}



const STORAGE_KEYS = {
  TRANSACTION_PIN_ENABLED: 'transaction_pin_enabled',
  TRANSACTION_PIN: 'transaction_pin',
} as const;

export const [TransactionPinProvider, useTransactionPin] = createContextHook(() => {
  const [state, setState] = useState<TransactionPinState>({
    isEnabled: false,
    hasPin: false,
    isLoading: true,
  });

  const updateState = useCallback((updates: Partial<TransactionPinState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const initializeTransactionPin = useCallback(async () => {
    try {
      console.log('Initializing transaction PIN state...');
      
      const [isEnabled, hasPin] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TRANSACTION_PIN_ENABLED),
        Platform.OS !== 'web' ? 
          SecureStore.getItemAsync(STORAGE_KEYS.TRANSACTION_PIN) :
          AsyncStorage.getItem(STORAGE_KEYS.TRANSACTION_PIN)
      ]);

      const enabled = isEnabled === 'true';
      const pinExists = !!hasPin;

      setState({
        isEnabled: enabled,
        hasPin: pinExists,
        isLoading: false,
      });

      console.log('Transaction PIN state initialized:', { enabled, pinExists });
    } catch (error) {
      console.error('Failed to initialize transaction PIN:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    initializeTransactionPin();
  }, []);

  const enableTransactionPin = useCallback(async (pin: string): Promise<boolean> => {
    const sanitizedPin = pin?.trim();
    if (!sanitizedPin || sanitizedPin.length !== 4 || !/^\d{4}$/.test(sanitizedPin)) {
      console.log('Invalid transaction PIN format');
      return false;
    }

    try {
      // Store the PIN securely
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(STORAGE_KEYS.TRANSACTION_PIN, sanitizedPin);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTION_PIN, sanitizedPin);
      }
      
      // Enable transaction PIN
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTION_PIN_ENABLED, 'true');
      
      updateState({ isEnabled: true, hasPin: true });
      console.log('Transaction PIN enabled successfully');
      return true;
    } catch (error) {
      console.error('Failed to enable transaction PIN:', error);
      return false;
    }
  }, [updateState]);

  const disableTransactionPin = useCallback(async (): Promise<boolean> => {
    try {
      // Remove PIN and disable
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.TRANSACTION_PIN);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.TRANSACTION_PIN);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTION_PIN_ENABLED, 'false');
      
      updateState({ isEnabled: false, hasPin: false });
      console.log('Transaction PIN disabled successfully');
      return true;
    } catch (error) {
      console.error('Failed to disable transaction PIN:', error);
      return false;
    }
  }, [updateState]);

  const verifyTransactionPin = useCallback(async (pin: string): Promise<boolean> => {
    const sanitizedPin = pin?.trim();
    if (!sanitizedPin || sanitizedPin.length !== 4) {
      console.log('Invalid transaction PIN format for verification');
      return false;
    }

    try {
      const storedPin = Platform.OS !== 'web' ? 
        await SecureStore.getItemAsync(STORAGE_KEYS.TRANSACTION_PIN) :
        await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTION_PIN);
      
      const isValid = storedPin === sanitizedPin;
      console.log('Transaction PIN verification:', isValid ? 'success' : 'failed');
      return isValid;
    } catch (error) {
      console.error('Failed to verify transaction PIN:', error);
      return false;
    }
  }, []);

  const changeTransactionPin = useCallback(async (oldPin: string, newPin: string): Promise<boolean> => {
    const sanitizedOldPin = oldPin?.trim();
    const sanitizedNewPin = newPin?.trim();
    
    if (!sanitizedOldPin || !sanitizedNewPin || sanitizedNewPin.length !== 4 || !/^\d{4}$/.test(sanitizedNewPin)) {
      console.log('Invalid transaction PIN format');
      return false;
    }

    try {
      // Verify old PIN first
      const isValid = await verifyTransactionPin(sanitizedOldPin);
      if (!isValid) {
        console.log('Old transaction PIN is incorrect');
        return false;
      }

      // Set new PIN
      return await enableTransactionPin(sanitizedNewPin);
    } catch (error) {
      console.error('Failed to change transaction PIN:', error);
      return false;
    }
  }, [enableTransactionPin, verifyTransactionPin]);

  const checkTransactionPinRequired = useCallback((): boolean => {
    return state.isEnabled && state.hasPin;
  }, [state.isEnabled, state.hasPin]);

  return useMemo(() => ({
    ...state,
    enableTransactionPin,
    disableTransactionPin,
    changeTransactionPin,
    verifyTransactionPin,
    checkTransactionPinRequired,
  }), [state, enableTransactionPin, disableTransactionPin, changeTransactionPin, verifyTransactionPin, checkTransactionPinRequired]);
});

export default useTransactionPin;
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import Loader from '@/components/ui/Loader';

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  console.log('IndexScreen rendered', { isAuthenticated, isLoading });

  useEffect(() => {
    console.log('IndexScreen useEffect', { isAuthenticated, isLoading });
    if (!isLoading) {
      if (isAuthenticated) {
        console.log('User is authenticated, navigating to dashboard');
        router.replace('/(tabs)/dashboard');
      } else {
        console.log('User is not authenticated, navigating to login');
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Add a timeout to force navigation if stuck
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isLoading) {
        console.log('Timeout reached, forcing navigation based on auth state:', { isAuthenticated });
        if (isAuthenticated) {
          router.replace('/(tabs)/dashboard');
        } else {
          router.replace('/login');
        }
      }
    }, 3000); // 3 second timeout

    return () => clearTimeout(timeout);
  }, [isAuthenticated, isLoading, router]);

  return (
    <View style={styles.container}>
      <Loader visible={true} size="large" overlay={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
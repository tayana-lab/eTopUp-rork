import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import SplashScreen from '@/components/ui/SplashScreen';
import Loader from '@/components/ui/Loader';

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState<boolean>(true);

  console.log('IndexScreen rendered', { isAuthenticated, isLoading, showSplash });

  const handleSplashFinish = () => {
    console.log('Splash screen finished');
    setShowSplash(false);
  };

  useEffect(() => {
    console.log('IndexScreen useEffect', { isAuthenticated, isLoading, showSplash });
    if (!showSplash && !isLoading) {
      if (isAuthenticated) {
        console.log('User is authenticated, navigating to dashboard');
        router.replace('/(tabs)/dashboard');
      } else {
        console.log('User is not authenticated, navigating to login');
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, showSplash, router]);

  // Add a timeout to force navigation if stuck
  useEffect(() => {
    if (!showSplash) {
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
    }
  }, [isAuthenticated, isLoading, showSplash, router]);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

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
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

interface SplashScreenProps {
  onFinish?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { colors } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      } else {
        router.replace('/login');
      }
    }, 2000); // 2 seconds duration

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primary }]}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <View style={[styles.content, { backgroundColor: colors.primary }]}>
        <Image
          source={{ uri: 'https://unomessaging.tayana.in/images/cws-logo.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.text, { color: colors.textInverse }]}>
          Welcome to CWS
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 60,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
  },
});
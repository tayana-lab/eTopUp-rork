import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useMemo } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { TransactionPinProvider } from "@/contexts/TransactionPinContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { colorScheme, colors } = useTheme();
  
  return (
    <>
      <StatusBar 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background}
      />
      <Stack screenOptions={{ headerBackTitle: "Back" }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="topup" options={{ presentation: "card" }} />
        <Stack.Screen name="sim-sale" options={{ presentation: "card", headerShown:false }} />
        <Stack.Screen name="digital-onboard" options={{ presentation: "card" }} />
        <Stack.Screen name="sim-inventory" options={{ headerShown: false }} />
        <Stack.Screen name="job-card" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="purchase-package" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding-success" options={{ headerShown: false }} />
        <Stack.Screen name="bill-pay" options={{ headerShown: false }} />
        <Stack.Screen name="fund-request" options={{ headerShown: false }} />
        <Stack.Screen name="purchase-packages" options={{ headerShown: false }} />
        <Stack.Screen name="postpaid-packages" options={{ headerShown: false }} />
        <Stack.Screen name="broadband-packages" options={{ headerShown: false }} />
        <Stack.Screen name="tourist-packages" options={{ headerShown: false }} />
        <Stack.Screen name="total-sale" options={{ headerShown: false }} />
        <Stack.Screen name="total-transactions" options={{ headerShown: false }} />
        <Stack.Screen name="earnings" options={{ headerShown: false }} />
        <Stack.Screen name="sim-stock" options={{ headerShown: false }} />
        <Stack.Screen name="airtime-purchase" options={{ headerShown: false }} />
        <Stack.Screen name="balance" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const queryClient = useMemo(() => new QueryClient(), []);
  
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TransactionPinProvider>
            <FavoritesProvider>
              <GestureHandlerRootView style={styles.container}>
                <RootLayoutNav />
              </GestureHandlerRootView>
            </FavoritesProvider>
          </TransactionPinProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

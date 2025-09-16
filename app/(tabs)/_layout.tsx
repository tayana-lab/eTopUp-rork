import { Tabs } from "expo-router";
import { Home, Wallet, CreditCard, BarChart3, Phone } from "lucide-react-native";
import React from "react";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme } from "@/constants/theme";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const TabLabel = ({ title, focused }: { title: string; focused: boolean }) => (
    <Text
      style={{
        fontSize: 10,
        fontWeight: Theme.Typography.fontWeight.medium,
        color: focused ? Theme.Colors.primary : Theme.Colors.gray400,
        textAlign: 'center',
        lineHeight: 12,
        marginTop: 2,
      }}
      numberOfLines={2}
    >
      {title}
    </Text>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.Colors.primary,
        tabBarInactiveTintColor: Theme.Colors.gray400,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Theme.Colors.surface,
          borderTopColor: Theme.Colors.borderLight,
          borderTopWidth: 1,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 4,
          height: 65 + (insets.bottom > 0 ? insets.bottom : 4),
          paddingTop: 4,
          ...Theme.Shadows.lg,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: Theme.Typography.fontWeight.medium,
          marginTop: 2,
          lineHeight: 12,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="my-wallet"
        options={{
          title: "My Wallets",
          tabBarLabel: ({ focused }) => <TabLabel title="My Wallet" focused={focused} />,
          tabBarIcon: ({ color, size }) => <Wallet color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="topup"
        options={{
          title: "TopUp",
          tabBarIcon: ({ color, size }) => <CreditCard color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="contact-us"
        options={{
          title: "Contact",
          tabBarLabel: ({ focused }) => <TabLabel title="Contact" focused={focused} />,
          tabBarIcon: ({ color, size }) => <Phone color={color} size={20} />,
        }}
      />
    </Tabs>
  );
}
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette, Droplets } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemesScreen() {
  const { currentTheme, colorScheme, setTheme, setColorScheme, colors, theme } = useTheme();
  const insets = useSafeAreaInsets();

  const themes = [
    { id: 'blue' as const, name: 'Ocean Blue', icon: Droplets, color: '#0584dc' },
    { id: 'purple' as const, name: 'Royal Purple', icon: Palette, color: '#6366F1' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    section: {
      paddingHorizontal: theme.Spacing.md,
      paddingVertical: theme.Spacing.sm,
    },
    sectionTitle: {
      fontSize: theme.Typography.fontSize.sm,
      fontWeight: theme.Typography.fontWeight.semiBold,
      color: colors.textSecondary,
      marginBottom: theme.Spacing.md,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    toggleItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.Spacing.md,
      paddingHorizontal: theme.Spacing.md,
      backgroundColor: colors.surface,
      borderRadius: theme.BorderRadius.md,
      ...theme.Shadows.sm,
    },
    toggleLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    toggleTitle: {
      fontSize: theme.Typography.fontSize.base,
      color: colors.textPrimary,
      marginLeft: theme.Spacing.sm,
    },
    themeItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.Spacing.md,
      paddingHorizontal: theme.Spacing.md,
      backgroundColor: colors.surface,
      borderRadius: theme.BorderRadius.md,
      marginBottom: theme.Spacing.sm,
      borderWidth: 2,
      borderColor: 'transparent',
      ...theme.Shadows.sm,
    },
    themeItemSelected: {
      borderColor: colors.primary,
    },
    themeLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    themeIcon: {
      width: 40,
      height: 40,
      borderRadius: theme.BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    themeTitle: {
      fontSize: theme.Typography.fontSize.base,
      color: colors.textPrimary,
      marginLeft: theme.Spacing.sm,
    },
    selectedIndicator: {
      width: 20,
      height: 20,
      borderRadius: theme.BorderRadius.full,
      backgroundColor: colors.primary,
    },
    comingSoon: {
      padding: theme.Spacing.lg,
      backgroundColor: colors.surfaceSecondary,
      borderRadius: theme.BorderRadius.md,
      alignItems: 'center',
    },
    comingSoonText: {
      fontSize: theme.Typography.fontSize.lg,
      fontWeight: theme.Typography.fontWeight.semiBold,
      color: colors.textPrimary,
      marginBottom: theme.Spacing.xs,
    },
    comingSoonSubtext: {
      fontSize: theme.Typography.fontSize.sm,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Stack.Screen
        options={{
          title: 'Themes',
          headerStyle: { 
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Dark Mode Toggle 
        <View style={styles.section}>
          <View style={styles.toggleItem}>
            <View style={styles.toggleLeft}>
              <Palette size={20} color={colors.textSecondary} />
              <Text style={styles.toggleTitle}>Dark Mode</Text>
            </View>
            <Switch
              value={colorScheme === 'dark'}
              onValueChange={(value) => setColorScheme(value ? 'dark' : 'light')}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={colorScheme === 'dark' ? colors.white : colors.gray400}
            />
          </View>
        </View> */}

        {/* Theme Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Theme</Text>
          {themes.map((theme) => {
            const IconComponent = theme.icon;
            const isSelected = currentTheme === theme.id;
            
            return (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeItem,
                  isSelected && styles.themeItemSelected,
                ]}
                onPress={() => setTheme(theme.id)}
                activeOpacity={0.7}
              >
                <View style={styles.themeLeft}>
                  <View style={[styles.themeIcon, { backgroundColor: theme.color }]}>
                    <IconComponent size={20} color={colors.white} />
                  </View>
                  <Text style={styles.themeTitle}>{theme.name}</Text>
                </View>
                {isSelected && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Themes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Themes</Text>
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
            <Text style={styles.comingSoonSubtext}>
              Custom theme creation will be available in future updates
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
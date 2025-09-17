import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { setTheme as setGlobalTheme, setColorScheme as setGlobalColorScheme, getColors, getTheme } from '@/constants/theme';

type ThemeType = 'blue' | 'purple';
type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
  currentTheme: ThemeType;
  colorScheme: ColorScheme;
  setTheme: (theme: ThemeType) => Promise<void>;
  setColorScheme: (scheme: ColorScheme) => Promise<void>;
  isLoading: boolean;
  colors: ReturnType<typeof getColors>;
  theme: ReturnType<typeof getTheme>;
}

const THEME_STORAGE_KEY = 'app_theme';
const COLOR_SCHEME_STORAGE_KEY = 'app_color_scheme';

const isValidTheme = (theme: string): theme is ThemeType => {
  return theme === 'blue' || theme === 'purple';
};

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('blue');
  const [colorScheme, setCurrentColorScheme] = useState<ColorScheme>('light');
  const [isLoading, setIsLoading] = useState(true);

  const setTheme = useCallback(async (theme: ThemeType) => {
    if (!isValidTheme(theme)) {
      console.warn('Invalid theme provided:', theme);
      return;
    }
    
    try {
      setCurrentTheme(theme);
      setGlobalTheme(theme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  }, []);

  const setColorScheme = useCallback(async (scheme: ColorScheme) => {
    try {
      setCurrentColorScheme(scheme);
      setGlobalColorScheme(scheme);
      await AsyncStorage.setItem(COLOR_SCHEME_STORAGE_KEY, scheme);
    } catch (error) {
      console.log('Error saving color scheme:', error);
    }
  }, []);

  const loadTheme = useCallback(async () => {
    try {
      const [savedTheme, savedColorScheme] = await Promise.all([
        AsyncStorage.getItem(THEME_STORAGE_KEY),
        AsyncStorage.getItem(COLOR_SCHEME_STORAGE_KEY)
      ]);
      
      if (savedTheme && isValidTheme(savedTheme)) {
        setCurrentTheme(savedTheme);
        setGlobalTheme(savedTheme);
      }
      
      if (savedColorScheme && (savedColorScheme === 'light' || savedColorScheme === 'dark')) {
        setCurrentColorScheme(savedColorScheme as ColorScheme);
        setGlobalColorScheme(savedColorScheme as ColorScheme);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load theme from storage on app start
  useEffect(() => {
    loadTheme();
  }, []);

  const colors = useMemo(() => getColors(colorScheme, currentTheme), [colorScheme, currentTheme]);
  const theme = useMemo(() => getTheme(colorScheme, currentTheme), [colorScheme, currentTheme]);

  return useMemo(() => ({
    currentTheme,
    colorScheme,
    setTheme,
    setColorScheme,
    isLoading,
    colors,
    theme,
  }), [currentTheme, colorScheme, setTheme, setColorScheme, isLoading, colors, theme]);
});
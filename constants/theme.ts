// Base color palettes
const BaseColors = {
  // Blue theme colors
  blue: {
    primary: '#0584dc',
    primaryDark: '#0470c4',
    primaryLight: '#2196f3',
    secondary: '#10B981',
    secondaryDark: '#059669',
    accent: '#F59E0B',
  },
  // Royal Purple theme colors
  purple: {
    primary: '#663399',
    primaryDark: '#552288',
    primaryLight: '#7B68EE',
    secondary: '#10B981',
    secondaryDark: '#059669',
    accent: '#F59E0B',
  },
};

// Current active theme and color scheme (can be changed dynamically)
let currentTheme: 'blue' | 'purple' = 'blue';
let currentColorScheme: 'light' | 'dark' = 'light';

export const setTheme = (theme: 'blue' | 'purple') => {
  currentTheme = theme;
};

export const setColorScheme = (scheme: 'light' | 'dark') => {
  currentColorScheme = scheme;
};

export const getColorScheme = () => currentColorScheme;

export const getCurrentTheme = () => currentTheme;

export const getThemeColors = (theme?: 'blue' | 'purple') => {
  const activeTheme = theme || currentTheme;
  return BaseColors[activeTheme];
};

// Function to get colors based on current theme and color scheme
export const getColors = (colorScheme?: 'light' | 'dark', theme?: 'blue' | 'purple') => {
  const activeColorScheme = colorScheme || currentColorScheme;
  const activeTheme = theme || currentTheme;
  const themeColors = BaseColors[activeTheme];
  
  return {
    // Dynamic theme colors
    primary: themeColors.primary,
    primaryDark: themeColors.primaryDark,
    primaryLight: themeColors.primaryLight,
    secondary: themeColors.secondary,
    secondaryDark: themeColors.secondaryDark,
    accent: themeColors.accent,
    
    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    errorLight: '#FEF2F2',
    info: '#3B82F6',
    
    // Background colors (dynamic based on color scheme)
    background: activeColorScheme === 'dark' ? '#111827' : '#FFFFFF',
    backgroundSecondary: activeColorScheme === 'dark' ? '#1F2937' : '#F9FAFB',
    surface: activeColorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
    surfaceSecondary: activeColorScheme === 'dark' ? '#374151' : '#F3F4F6',
    
    // Text colors (dynamic based on color scheme)
    textPrimary: activeColorScheme === 'dark' ? '#F9FAFB' : '#111827',
    textSecondary: activeColorScheme === 'dark' ? '#D1D5DB' : '#6B7280',
    textTertiary: activeColorScheme === 'dark' ? '#9CA3AF' : '#9CA3AF',
    textInverse: activeColorScheme === 'dark' ? '#111827' : '#FFFFFF',
    
    // Border colors (dynamic based on color scheme)
    border: activeColorScheme === 'dark' ? '#374151' : '#E5E7EB',
    borderLight: activeColorScheme === 'dark' ? '#4B5563' : '#F3F4F6',
    borderDark: activeColorScheme === 'dark' ? '#6B7280' : '#D1D5DB',
  };
};

// Legacy Colors object for backward compatibility (but will be static)
export const Colors = {
  // Dynamic theme colors
  get primary() { return getThemeColors().primary; },
  get primaryDark() { return getThemeColors().primaryDark; },
  get primaryLight() { return getThemeColors().primaryLight; },
  get secondary() { return getThemeColors().secondary; },
  get secondaryDark() { return getThemeColors().secondaryDark; },
  get accent() { return getThemeColors().accent; },
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  info: '#3B82F6',
  
  // Background colors (dynamic based on color scheme)
  get background() { 
    return currentColorScheme === 'dark' ? '#111827' : '#FFFFFF'; 
  },
  get backgroundSecondary() { 
    return currentColorScheme === 'dark' ? '#1F2937' : '#F9FAFB'; 
  },
  get surface() { 
    return currentColorScheme === 'dark' ? '#1F2937' : '#FFFFFF'; 
  },
  get surfaceSecondary() { 
    return currentColorScheme === 'dark' ? '#374151' : '#F3F4F6'; 
  },
  
  // Text colors (dynamic based on color scheme)
  get textPrimary() { 
    return currentColorScheme === 'dark' ? '#F9FAFB' : '#111827'; 
  },
  get textSecondary() { 
    return currentColorScheme === 'dark' ? '#D1D5DB' : '#6B7280'; 
  },
  get textTertiary() { 
    return currentColorScheme === 'dark' ? '#9CA3AF' : '#9CA3AF'; 
  },
  get textInverse() { 
    return currentColorScheme === 'dark' ? '#111827' : '#FFFFFF'; 
  },
  
  // Border colors (dynamic based on color scheme)
  get border() { 
    return currentColorScheme === 'dark' ? '#374151' : '#E5E7EB'; 
  },
  get borderLight() { 
    return currentColorScheme === 'dark' ? '#4B5563' : '#F3F4F6'; 
  },
  get borderDark() { 
    return currentColorScheme === 'dark' ? '#6B7280' : '#D1D5DB'; 
  },
} as const;

export const Typography = {
  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Font weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const Layout = {
  // Screen padding
  screenPadding: Spacing.md,
  
  // Header heights
  headerHeight: 56,
  tabBarHeight: 80,
  
  // Touch targets
  minTouchTarget: 44,
  
  // Common dimensions
  buttonHeight: 48,
  inputHeight: 48,
  cardPadding: Spacing.md,
  
  // Grid system
  gridGutter: Spacing.sm,
  containerMaxWidth: 400,
} as const;

export const Animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// Function to get complete theme based on current settings
export const getTheme = (colorScheme?: 'light' | 'dark', theme?: 'blue' | 'purple') => {
  return {
    Colors: getColors(colorScheme, theme),
    Typography,
    Spacing,
    BorderRadius,
    Shadows,
    Layout,
    Animation,
  };
};

export const Theme = {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Layout,
  Animation,
} as const;

export default Theme;
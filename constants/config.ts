export const AppConfig = {
  // App Information
  appName: 'MyApp',
  version: '1.0.0',
  
  // API Configuration
  apiBaseUrl: 'https://api.example.com',
  apiTimeout: 10000,
  
  // UI Configuration
  backgroundImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=800&fit=crop',
  
  // Dashboard Configuration
  dashboard: {
    marketingAds: {
      autoScrollInterval: 5000, // 5 seconds
      showIndicators: true,
    },
  },
  
  menuIcons: {
    itemsPerRow: 3,
    showNotificationBadge: true,
  },
  
  // Navigation Configuration
  bottomNavigation: {
    iconCount: 5,
    showLabels: true,
  },
  
  // Loading Configuration
  loadingTimeout: 1000, // Show loader after 1 second
  
  // Regular Expressions
  regex: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[\d\s\-\(\)]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    name: /^[a-zA-Z\s]{2,50}$/,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    numeric: /^\d+$/,
    pin: /^\d{6}$/,
    otp: /^\d{4,6}$/,
  },
  
  // Validation Messages
  validation: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    invalidPhone: 'Please enter a valid phone number',
    weakPassword: 'Password must be at least 8 characters with uppercase, lowercase, and number',
    invalidName: 'Name must be 2-50 characters and contain only letters',
    invalidPin: 'PIN must be exactly 6 digits',
    invalidOtp: 'OTP must be 4-6 digits',
    pinMismatch: 'PINs do not match',
  },
  
  // Feature Flags
  features: {
    notifications: true,
    darkMode: false,
    biometricAuth: true,
    analytics: true,
  },
  
  // Authentication Configuration
  auth: {
    pinLength: 6,
    otpLength: 6,
    otpExpiryMinutes: 5,
    maxLoginAttempts: 3,
    lockoutDurationMinutes: 15,
    biometricPromptTitle: 'Authenticate',
    biometricPromptSubtitle: 'Use your biometric to access the app',
    biometricPromptDescription: 'Place your finger on the sensor or look at the camera',
    biometricFallbackLabel: 'Use PIN',
  },
  
  // Marketing Ads Data
  marketingAdsData: [
    {
      id: '1',
      title: 'Special Offer',
      description: 'Get 20% off on your first order',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop',
      action: 'offer-details',
      actionData: { offerId: 'FIRST20' },
    },
    {
      id: '2',
      title: 'New Features',
      description: 'Discover our latest updates',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
      action: 'feature-tour',
      actionData: { tourId: 'latest-features' },
    },
    {
      id: '3',
      title: 'Premium Membership',
      description: 'Unlock exclusive benefits',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop',
      action: 'premium-signup',
      actionData: { plan: 'premium' },
    },
  ],
  
  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  
  // Cache Configuration
  cache: {
    userDataTTL: 24 * 60 * 60 * 1000, // 24 hours
    appDataTTL: 60 * 60 * 1000, // 1 hour
  },
} as const;

export default AppConfig;
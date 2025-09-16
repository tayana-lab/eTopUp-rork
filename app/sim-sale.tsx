import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { 
  Users,
  Shield,
  Plane,
  ArrowRight,
  Zap,
  Star,
  Plus,
  Heart,
} from 'lucide-react-native';

import { useTheme } from '@/contexts/ThemeContext';
import BackgroundImage from '@/components/ui/BackgroundImage';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import StandardLayout from '@/components/layout/StandardLayout';

interface CustomerType {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string[];
  bgColor: string;
}

const customerTypes: CustomerType[] = [
  {
    id: 'local',
    title: 'Local',
    subtitle: 'Seychelles Citizen',
    description: 'Citizens and permanent residents of Seychelles with full access to all services',
    icon: Users,
    color: '#4F46E5',
    gradient: ['#4F46E5', '#7C3AED'],
    bgColor: 'rgba(79, 70, 229, 0.1)'
  },
  {
    id: 'gop',
    title: 'GOP Holder',
    subtitle: 'Gainful Occupation Permit',
    description: 'Foreign nationals with valid work permits and authorized employment',
    icon: Shield,
    color: '#059669',
    gradient: ['#059669', '#0D9488'],
    bgColor: 'rgba(5, 150, 105, 0.1)'
  },
  {
    id: 'tourist',
    title: 'Tourist',
    subtitle: 'Visitor Package',
    description: 'Short-term visitors and tourists with temporary connectivity needs',
    icon: Plane,
    color: '#DC2626',
    gradient: ['#DC2626', '#EA580C'],
    bgColor: 'rgba(220, 38, 38, 0.1)'
  },
];

export default function SimSaleScreen() {
  const { colors } = useTheme();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnims = useRef(customerTypes.map(() => new Animated.Value(1))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);
  
  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Continuous pulse animation for the header
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    
    return () => pulseAnimation.stop();
  }, [fadeAnim, slideAnim, pulseAnim]);

  const handleCustomerTypeSelect = (customerType: CustomerType, index: number) => {
    if (isAnimating) return;
    
    setSelectedType(customerType.id);
    setIsAnimating(true);
    
    console.log('Selected customer type:', customerType.title);
    
    // Animate the selected card
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Navigate after animation
    setTimeout(() => {
      router.push({
        pathname: '/digital-onboard' as any,
        params: { 
          customerType: customerType.id,
          customerTitle: customerType.title
        }
      });
      setIsAnimating(false);
      setSelectedType(null);
    }, 600);
  };

  const handleFavoritePress = async (customerType: CustomerType) => {
    let favoriteTitle = '';
    switch (customerType.id) {
      case 'local':
        favoriteTitle = 'Local SIM';
        break;
      case 'gop':
        favoriteTitle = 'GOP SIM';
        break;
      case 'tourist':
        favoriteTitle = 'Tourist SIM';
        break;
      default:
        favoriteTitle = `${customerType.title} SIM`;
    }
    
    const favoriteItem = {
      id: `sim-sale-${customerType.id}`,
      title: favoriteTitle,
      icon: 'creditcard',
      type: 'sim-sale' as const,
      onPress: () => {
        router.push({
          pathname: '/digital-onboard' as any,
          params: { 
            customerType: customerType.id,
            customerTitle: customerType.title
          }
        });
      },
    };

    const itemId = `sim-sale-${customerType.id}`;
    if (isFavorite(itemId)) {
      await removeFromFavorites(itemId);
    } else {
      await addToFavorites(favoriteItem);
    }
  };

  const renderCustomerTypeCard = (customerType: CustomerType, index: number, dynamicStyles: any) => {
    const IconComponent = customerType.icon;
    const isSelected = selectedType === customerType.id;
    const iconSize = isTablet ? 36 : 28;
    const starSize = isTablet ? 16 : 12;
    const arrowSize = isTablet ? 24 : 18;
    const zapSize = isTablet ? 20 : 16;
    
    return (
      <Animated.View
        key={customerType.id}
        style={[
          styles.cardWrapper,
          dynamicStyles.cardWrapper,
          {
            transform: [{ scale: scaleAnims[index] }],
            opacity: isAnimating && !isSelected ? 0.4 : 1,
          }
        ]}
      >
        <TouchableOpacity 
          style={[
            styles.customerTypeCard,
            dynamicStyles.customerTypeCard,
            { backgroundColor: customerType.bgColor },
            isSelected && styles.customerTypeCardSelected,
            isSelected && { 
              borderColor: customerType.color,
              borderWidth: 3
            }
          ]}
          onPress={() => handleCustomerTypeSelect(customerType, index)}
          activeOpacity={0.8}
          disabled={isAnimating}
        >
          <View style={[styles.cardContent, dynamicStyles.cardContent]}>
            <View style={[styles.cardHeader, dynamicStyles.cardHeader]}>
              <View style={[styles.iconContainer, dynamicStyles.iconContainer, { backgroundColor: customerType.color }]}>
                <IconComponent size={iconSize} color="white" />
                <View style={styles.iconGlow}>
                  <Star size={starSize} color="rgba(255,255,255,0.8)" style={styles.starIcon} />
                </View>
              </View>
              
              <View style={[styles.titleContainer, dynamicStyles.titleContainer]}>
                <Text style={[styles.customerTypeTitle, dynamicStyles.customerTypeTitle, { color: customerType.color }]}>
                  {customerType.title}
                </Text>
                <Text style={[styles.customerTypeSubtitle, dynamicStyles.customerTypeSubtitle]}>{customerType.subtitle}</Text>
              </View>
              
              <View style={[styles.headerActions, dynamicStyles.headerActions]}>
                <View style={[styles.arrowContainer, dynamicStyles.arrowContainer, { backgroundColor: customerType.color + '20' }]}>
                  <ArrowRight size={arrowSize} color={customerType.color} />
                </View>
              </View>
            </View>
            
            <Text style={[styles.customerTypeDescription, dynamicStyles.customerTypeDescription]}>{customerType.description}</Text>
            
            <View style={[styles.actionContainer, dynamicStyles.actionContainer]}>
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={[styles.favoriteButtonBottom, dynamicStyles.favoriteButtonBottom]}
                  onPress={() => handleFavoritePress(customerType)}
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                >
                  {isFavorite(`sim-sale-${customerType.id}`) ? (
                    <Star size={starSize} color={colors.error} fill={colors.error} />
                  ) : (
                    <Star size={starSize} color={customerType.color} />
                  )}
                </TouchableOpacity>
                
                <View style={[styles.actionButton, dynamicStyles.actionButton, { backgroundColor: customerType.color }]}>
                  <Zap size={zapSize} color="white" />
                  <Text style={[styles.actionText, dynamicStyles.actionText]}>Start Onboarding</Text>
                </View>
              </View>
            </View>
          </View>
          
          {isSelected && (
            <View style={[styles.selectedOverlay, dynamicStyles.selectedOverlay]}>
              <View style={[styles.selectedIndicator, dynamicStyles.selectedIndicator, { backgroundColor: customerType.color }]}>
                <Animated.View style={styles.rotatingIcon}>
                  <Zap size={isTablet ? 24 : 20} color="white" />
                </Animated.View>
                <Text style={[styles.selectedText, dynamicStyles.selectedText]}>Initializing...</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const insets = useSafeAreaInsets();
  const isTablet = screenData.width >= 768;
  const isLandscape = screenData.width > screenData.height;
  const dynamicStyles = getResponsiveStyles(screenData, isTablet, isLandscape, insets, { Colors: colors, Typography, Spacing, BorderRadius });

  return (
    
    <StandardLayout 
      title="SIM Inventory" 

    >
      <BackgroundImage style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          dynamicStyles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={[styles.customerTypesContainer, dynamicStyles.customerTypesContainer]}>
          {customerTypes.map((customerType, index) => renderCustomerTypeCard(customerType, index, dynamicStyles))}
        </View>
        
        <View style={[styles.footerSection, dynamicStyles.footerSection]}>
          <View style={styles.footerContent}>
            <Star size={isTablet ? 20 : 16} color={colors.primary} />
            <Text style={[styles.footerText, dynamicStyles.footerText]}>Tap to start your onboarding experience</Text>
          </View>
        </View>
      </Animated.View>
            </BackgroundImage>
      </StandardLayout>

  );
}

const getResponsiveStyles = (screenData: any, isTablet: boolean, isLandscape: boolean, insets: any, theme: any) => {
  const { width } = screenData;
  const isSmallScreen = width < 375;
  const { Colors, Typography, Spacing, BorderRadius } = theme;
  
  return StyleSheet.create({
    content: {
      flex: 1,
      paddingHorizontal: isSmallScreen ? Spacing.md : isTablet ? Spacing.xl : Spacing.md,
      //paddingTop: (isTablet ? Spacing['2xl'] : Spacing.xl) + (insets.top > 0 ? 0 : Spacing.md),
      paddingBottom: isTablet ? Spacing.xl : Spacing.lg,
      maxWidth: isTablet ? 800 : '100%',
      alignSelf: 'center',
      width: '100%',
    },
    customerTypesContainer: {
      flex: 1,
      gap: isTablet ? Spacing.lg : Spacing.md,
      justifyContent: 'center',
    },
    cardWrapper: {
      marginHorizontal: isLandscape && !isTablet ? Spacing.lg : 0,
    },
    customerTypeCard: {
      minHeight: isTablet ? 200 : isSmallScreen ? 140 : 160,
      borderRadius: isTablet ? BorderRadius['2xl'] : BorderRadius.xl,
    },
    cardContent: {
      padding: isTablet ? Spacing.xl : isSmallScreen ? Spacing.md : Spacing.lg,
      paddingBottom: isTablet ? Spacing.lg : Spacing.md,
    },
    cardHeader: {
      marginBottom: isTablet ? Spacing.lg : Spacing.md,
    },
    iconContainer: {
      width: isTablet ? 72 : isSmallScreen ? 48 : 56,
      height: isTablet ? 72 : isSmallScreen ? 48 : 56,
      marginRight: isTablet ? Spacing.lg : Spacing.md,
    },
    titleContainer: {
      flex: 1,
      marginRight: Spacing.sm,
    },
    customerTypeTitle: {
      fontSize: isTablet ? Typography.fontSize['2xl'] : isSmallScreen ? Typography.fontSize.lg : Typography.fontSize.xl,
      marginBottom: isTablet ? Spacing.sm : Spacing.xs,
    },
    customerTypeSubtitle: {
      fontSize: isTablet ? Typography.fontSize.base : Typography.fontSize.sm,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: isTablet ? Spacing.sm : Spacing.xs,
    },
    favoriteButton: {
      width: isTablet ? 32 : 24,
      height: isTablet ? 32 : 24,
      borderRadius: isTablet ? 16 : 12,
      backgroundColor: Colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        },
        android: {
          elevation: 0,
          borderWidth: 0.5,
          borderColor: 'rgba(0,0,0,0.06)',
        },
      }),
    },
    arrowContainer: {
      width: isTablet ? 40 : 32,
      height: isTablet ? 40 : 32,
    },
    customerTypeDescription: {
      fontSize: isTablet ? Typography.fontSize.base : Typography.fontSize.sm,
      marginBottom: isTablet ? Spacing.xl : Spacing.lg,
      marginTop: isTablet ? Spacing.md : Spacing.sm,
    },
    actionContainer: {
      alignItems: 'flex-end',
      marginTop: 'auto',
      paddingTop: isTablet ? Spacing.md : Spacing.sm,
    },
    favoriteButtonBottom: {
      width: isTablet ? 32 : 24,
      height: isTablet ? 32 : 24,
      borderRadius: isTablet ? 16 : 12,
      backgroundColor: Colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        },
        android: {
          elevation: 0,
          borderWidth: 0.5,
          borderColor: 'rgba(0,0,0,0.06)',
        },
      }),
    },
    actionButton: {
      paddingHorizontal: isTablet ? Spacing.lg : Spacing.md,
      paddingVertical: isTablet ? Spacing.md : Spacing.sm,
    },
    actionText: {
      fontSize: isTablet ? Typography.fontSize.sm : Typography.fontSize.xs,
      marginLeft: isTablet ? Spacing.sm : Spacing.xs,
    },
    selectedOverlay: {
      borderRadius: isTablet ? BorderRadius['2xl'] : BorderRadius.xl,
    },
    selectedIndicator: {
      paddingHorizontal: isTablet ? Spacing.xl : Spacing.lg,
      paddingVertical: isTablet ? Spacing.lg : Spacing.md,
    },
    selectedText: {
      fontSize: isTablet ? Typography.fontSize.base : Typography.fontSize.sm,
      marginLeft: isTablet ? Spacing.md : Spacing.sm,
    },
    footerSection: {
      //paddingBottom: Spacing.lg,
    },
    footerText: {
      fontSize: isTablet ? Typography.fontSize.base : Typography.fontSize.sm,
      marginLeft: isTablet ? Spacing.md : Spacing.sm,
    },
  });
};

// Create a function to get styles with theme
const createStyles = (theme: any) => {
  const { Colors, Typography, Spacing, BorderRadius } = theme;
  
  return StyleSheet.create({
    container: {
      flex: 1,
    },

    content: {
      flex: 1,
    },
    headerSection: {
      marginBottom: Spacing.xl * 1.5,
      alignItems: 'center',
    },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  titleIcon: {
    marginRight: Spacing.sm,
  },
  mainTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    paddingHorizontal: Spacing.md,
  },
  customerTypesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardWrapper: {},
  customerTypeCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 0,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.08)',
      },
    }),
  },

  customerTypeCardSelected: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 0,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.12)',
      },
    }),
  },
  cardContent: {},
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  iconGlow: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  starIcon: {
    opacity: 0.9,
  },
  titleContainer: {
    flex: 1,
  },
  customerTypeTitle: {
    fontWeight: Typography.fontWeight.bold,
  },
  customerTypeSubtitle: {
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  favoriteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 0,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.06)',
      },
    }),
  },
  arrowContainer: {
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerTypeDescription: {
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  actionContainer: {
    alignItems: 'flex-end',
    marginTop: 'auto',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  favoriteButtonBottom: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 0,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.06)',
      },
    }),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  actionText: {
    color: 'white',
    fontWeight: Typography.fontWeight.semiBold,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  selectedText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
  },
  footerSection: {
    alignItems: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
    rotatingIcon: {
      transform: [{ rotate: '360deg' }],
    },
  });
};

// Use the theme to create styles
const styles = createStyles({ Colors: { white: '#FFFFFF', textSecondary: '#6B7280' }, Typography, Spacing, BorderRadius });
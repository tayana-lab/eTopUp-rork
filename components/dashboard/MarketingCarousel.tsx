import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Theme } from '@/constants/theme';
import { AppConfig } from '@/constants/config';

interface MarketingAd {
  id: string;
  image: string;
  title: string;
  description?: string;
  actionUrl?: string;
}

interface MarketingCarouselProps {
  ads: MarketingAd[];
  onAdPress: (ad: MarketingAd) => void;
  autoScroll?: boolean;
  testID?: string;
}

interface ImageState {
  loading: boolean;
  error: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth - (Theme.Spacing.md * 2);

export default function MarketingCarousel({
  ads,
  onAdPress,
  autoScroll = true,
  testID,
}: MarketingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageStates, setImageStates] = useState<Record<string, ImageState>>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoScroll && ads.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % ads.length;
          scrollViewRef.current?.scrollTo({
            x: nextIndex * cardWidth,
            animated: true,
          });
          return nextIndex;
        });
      }, AppConfig.dashboard.marketingAds.autoScrollInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [ads.length, autoScroll]);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / cardWidth);
    setCurrentIndex(index);
  };

  const handleImageLoadStart = (adId: string) => {
    setImageStates(prev => ({
      ...prev,
      [adId]: { loading: true, error: false }
    }));
  };

  const handleImageLoad = (adId: string) => {
    setImageStates(prev => ({
      ...prev,
      [adId]: { loading: false, error: false }
    }));
  };

  const handleImageError = (adId: string) => {
    console.log('Image failed to load:', adId);
    setImageStates(prev => ({
      ...prev,
      [adId]: { loading: false, error: true }
    }));
  };

  if (ads.length === 0) return null;

  return (
    <View style={styles.container} testID={testID}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={styles.scrollContent}
      >
        {ads.map((ad) => {
          const imageState = imageStates[ad.id] || { loading: false, error: false };
          
          return (
            <TouchableOpacity
              key={ad.id}
              style={styles.adCard}
              onPress={() => onAdPress(ad)}
              activeOpacity={0.9}
            >
              {imageState.error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>Image not available</Text>
                  <Text style={styles.adTitle}>{ad.title}</Text>
                </View>
              ) : (
                <>
                  <Image 
                    source={{ 
                      uri: ad.image,
                      cache: Platform.OS === 'ios' ? 'default' : 'force-cache'
                    }} 
                    style={styles.adImage}
                    onLoadStart={() => handleImageLoadStart(ad.id)}
                    onLoad={() => handleImageLoad(ad.id)}
                    onError={() => handleImageError(ad.id)}
                    resizeMode="cover"
                  />
                  {imageState.loading && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color={Theme.Colors.primary} />
                    </View>
                  )}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {AppConfig.dashboard.marketingAds.showIndicators && ads.length > 1 && (
        <View style={styles.indicators}>
          {ads.map((ad, index) => (
            <View
              key={ad.id}
              style={[
                styles.indicator,
                index === currentIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Theme.Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Theme.Spacing.md,
  },
  adCard: {
    width: cardWidth,
    height: 160,
    marginRight: Theme.Spacing.md,
    borderRadius: Theme.BorderRadius.lg,
    overflow: 'hidden',
    ...Theme.Shadows.md,
  },
  adImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Theme.Spacing.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.Colors.gray300,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: Theme.Colors.primary,
    width: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.Colors.surfaceSecondary,
    padding: Theme.Spacing.md,
  },
  errorText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.Spacing.xs,
  },
  adTitle: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});
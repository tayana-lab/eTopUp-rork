import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StandardHeader from './StandardHeader';
import Loader from '../ui/Loader';
import BackgroundImage from '../ui/BackgroundImage';
import { useTheme } from '@/contexts/ThemeContext';
import { AppConfig } from '@/constants/config';

interface StandardLayoutProps {
  title: string;
  children: React.ReactNode;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  bottomComponent?: React.ReactNode;
  backgroundColor?: string;
  testID?: string;
}

export default function StandardLayout({
  title,
  children,
  onBackPress,
  rightComponent,
  loading = false,
  loadingText,
  bottomComponent,
  backgroundColor,
  testID,
}: StandardLayoutProps) {
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [showLoader, setShowLoader] = useState(false);
  
  const defaultBackgroundColor = backgroundColor || colors.background;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    if (loading) {
      timeout = setTimeout(() => {
        setShowLoader(true);
      }, AppConfig.loadingTimeout);
    } else {
      setShowLoader(false);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [loading]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.Layout.screenPadding,
    },
    bottomContainer: {
      paddingHorizontal: theme.Layout.screenPadding,
      paddingTop: theme.Spacing.md,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: defaultBackgroundColor }]} testID={testID}>
      <BackgroundImage style={styles.container}>
      <StandardHeader
        title={title}
        onBackPress={onBackPress}
        rightComponent={rightComponent}
      />
      
      <View style={styles.content}>
        {children}
      </View>
      
      {bottomComponent && (
        <View style={[styles.bottomContainer, { paddingBottom: insets.bottom }]}>
          {bottomComponent}
        </View>
      )}
      
      <Loader visible={showLoader} text={loadingText} />
      </BackgroundImage>
    </View>
  );
}
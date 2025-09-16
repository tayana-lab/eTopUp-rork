import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  Switch,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  User,
  Palette,
  Wallet,
  MessageSquare,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Theme } from '@/constants/theme';

interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
  testID?: string;
}

export default function HamburgerMenu({
  visible,
  onClose,
  testID,
}: HamburgerMenuProps) {
  const { logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const slideAnim = useState(new Animated.Value(-Dimensions.get('window').width * 0.75))[0];
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -Dimensions.get('window').width * 0.75,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleThemes = () => {
    onClose();
    router.push('/themes');
  };

  const handleProfileSettings = () => {
    onClose();
    router.push('/profile-settings');
  };

  const handleMyWallets = () => {
    onClose();
    router.push('/my-wallets');
  };

  const handleFeedback = () => {
    onClose();
    router.push('/feedback');
  };

  const handleHelpSupport = () => {
    onClose();
    router.push('/help-support');
  };

  const handleAbout = () => {
    onClose();
    router.push('/about');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            onClose();
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const MenuItem = ({ icon: Icon, title, onPress, rightElement }: {
    icon: any;
    title: string;
    onPress: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <Icon size={20} color={Theme.Colors.textSecondary} />
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      {rightElement || <ChevronRight size={16} color={Theme.Colors.textTertiary} />}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
      testID={testID}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <Animated.View 
          style={[
            styles.container,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
        <View style={[styles.header, { paddingTop: insets.top + Theme.Spacing.md }]}>
          <Text style={styles.headerTitle}>Menu</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={24} color={Theme.Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Settings Section */}
          <View style={styles.section}>
            <MenuItem
              icon={User}
              title="Profile Settings"
              onPress={handleProfileSettings}
            />
          </View>

          {/* Themes Section */}
          <View style={styles.section}>
            <MenuItem
              icon={Palette}
              title="Themes"
              onPress={handleThemes}
              rightElement={
                <View style={styles.themeToggle}>
                  <Text style={styles.themeText}>Dark</Text>
                  <Switch
                    value={isDarkMode}
                    onValueChange={setIsDarkMode}
                    trackColor={{ false: Theme.Colors.gray300, true: Theme.Colors.primary }}
                    thumbColor={isDarkMode ? Theme.Colors.white : Theme.Colors.gray400}
                  />
                </View>
              }
            />
          </View>

          {/* My Wallets Section */}
          <View style={styles.section}>
            <MenuItem
              icon={Wallet}
              title="My Wallets"
              onPress={handleMyWallets}
            />
          </View>

          {/* Other Options */}
          <View style={styles.section}>
            <MenuItem
              icon={MessageSquare}
              title="Feedback"
              onPress={handleFeedback}
            />
            
            <MenuItem
              icon={HelpCircle}
              title="Help & Support"
              onPress={handleHelpSupport}
            />
            
            <MenuItem
              icon={Info}
              title="About"
              onPress={handleAbout}
            />
          </View>

          {/* Logout */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <LogOut size={20} color={Theme.Colors.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  overlayTouchable: {
    flex: 1,
  },
  container: {
    width: '75%',
    height: '100%',
    backgroundColor: Theme.Colors.background,
    borderTopRightRadius: Theme.BorderRadius.xl,
    borderBottomRightRadius: Theme.BorderRadius.xl,
    position: 'absolute',
    left: 0,
    top: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.Spacing.md,
    paddingBottom: Theme.Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.borderLight,
  },
  headerTitle: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textPrimary,
  },
  closeButton: {
    width: Theme.Layout.minTouchTarget,
    height: Theme.Layout.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
  },
  sectionTitle: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.textSecondary,
    marginBottom: Theme.Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
    marginLeft: Theme.Spacing.sm,
  },

  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textSecondary,
    marginRight: Theme.Spacing.sm,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.Spacing.md,
    borderRadius: Theme.BorderRadius.md,
    backgroundColor: Theme.Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Theme.Colors.error,
  },
  logoutText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semiBold,
    color: Theme.Colors.error,
    marginLeft: Theme.Spacing.sm,
  },
});
import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useAdsContext } from '../context/AdsContext';
import { styles } from '../styles/MenuScreenStyles';
import SettingItem from '../components/SettingItem';

type RootStackParamList = {
  Home: undefined;
  Menu: undefined;
  Settings: undefined;
  HabitDetails: undefined;
  EditHabitsList: undefined;
  PrivacyPolicy: undefined;
  TermsOfUse: undefined;
  HowToUse: undefined; // Added How To Use Screen
};

type MenuScreenProps = NativeStackScreenProps<RootStackParamList, 'Menu'>;

const MenuScreen = ({ navigation }: MenuScreenProps) => {
  const { theme } = useTheme();
  const { adsRemoved, refreshAdsStatus } = useAdsContext();
  
  const handlePurchase = useCallback(() => {
    Alert.alert('Coming Soon', 'In-app purchases are temporarily disabled.');
  }, []);
  
  const handleRestore = useCallback(() => {
    Alert.alert('Coming Soon', 'Purchase restoration is temporarily disabled.');
  }, []);
  
  // Placeholder action for Rate this app
  const handleRateApp = useCallback(() => {
    console.log('Rate this app pressed');
    // Implementation for rating app
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        {/* Title: "Menu", matching Settings font size (24, bold), color blue (#007AFF) */}
        <Text style={[styles.headerTitle, { color: '#007AFF' }]}>Menu</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView>
        <SettingItem
          icon="cog"
          iconBackgroundColor="#007AFF"
          title="Settings"
          onPress={() => navigation.navigate('Settings')}
        />
        <SettingItem
          icon="pencil"
          iconBackgroundColor="#FF9500"
          title="Edit Habits"
          onPress={() => navigation.navigate('EditHabitsList')}
        />
        
        <SettingItem
          icon="help-circle" // Icon for How To Use
          iconBackgroundColor="#2196F3" // Blue color for help/info
          title="How to Use"
          onPress={() => navigation.navigate('HowToUse')}
        />

        {/* RevenueCat Integration: Remove Ads Button */}
        <SettingItem
          icon="crown" // Using 'crown' as the logo for premium/remove ads
          iconBackgroundColor="#FFD60A" // Gold/Yellow color
          title="Remove Ads"
          onPress={handlePurchase}
        />
        
        <SettingItem
          icon="restore"
          iconBackgroundColor="#007AFF"
          title="Restore Purchases"
          onPress={handleRestore}
        />
        
        {/* About Section */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={[styles.sectionHeaderText, { color: theme.subtleText }]}>About</Text>
        </View>
        <SettingItem
          icon="lock"
          iconBackgroundColor="#FF2D55"
          title="Privacy Policy"
          onPress={() => navigation.navigate('PrivacyPolicy')}
        />
        <SettingItem
          icon="file-document"
          iconBackgroundColor="#FF9500"
          title="Terms of Use"
          onPress={() => navigation.navigate('TermsOfUse')}
        />
        <SettingItem
          icon="star"
          iconBackgroundColor="#FFD60A"
          title="Rate the app"
          onPress={handleRateApp}
        />
        <SettingItem
          icon="home"
          iconBackgroundColor="#22c55e"
          title="Home"
          onPress={() => navigation.navigate('Home')}
        />
      </ScrollView>
    </View>
  );
};

export default MenuScreen;
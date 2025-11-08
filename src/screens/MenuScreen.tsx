import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
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
};

type MenuScreenProps = NativeStackScreenProps<RootStackParamList, 'Menu'>;

const MenuScreen = ({ navigation }: MenuScreenProps) => {
  const { theme } = useTheme();
  
  // Placeholder action for Rate this app
  const handleRateApp = () => {
    console.log('Rate this app pressed');
    // Implementation for rating app
  };

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
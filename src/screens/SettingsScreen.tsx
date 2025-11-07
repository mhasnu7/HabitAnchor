import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SettingItem from '../components/SettingItem';
import { styles } from '../styles/SettingsScreenStyles';
import { useTheme } from '../context/ThemeContext';

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  GeneralSettings: undefined;
  ThemeSelection: undefined;
  DailyCheckInReminder: undefined;
  ArchivedHabits: undefined; // New route for archived habits
  PrivacyPolicy: undefined; // New route for Privacy Policy
  TermsOfUse: undefined; // New route for Terms of Use
};

type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: SettingsScreenProps) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#22c55e' }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView>
        <View style={styles.section}>
          <SettingItem icon="theme-light-dark" iconBackgroundColor="#007AFF" title="Theme" onPress={() => navigation.navigate('ThemeSelection')} />
          <SettingItem icon="cog" iconBackgroundColor="#8e8e93" title="General" onPress={() => navigation.navigate('GeneralSettings')} />
          <SettingItem icon="archive" iconBackgroundColor="#5856D6" title="Archived Habits" onPress={() => navigation.navigate('ArchivedHabits')} />
          <SettingItem icon="bell" iconBackgroundColor="#FF9500" title="Reminders" onPress={() => navigation.navigate('DailyCheckInReminder')} />
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.subtleText }]}>About</Text>
          <SettingItem icon="shield-lock" iconBackgroundColor="#FF2D55" title="Privacy Policy" onPress={() => navigation.navigate('PrivacyPolicy')} />
          <SettingItem icon="file-document" iconBackgroundColor="#FF3B30" title="Terms of Use" onPress={() => navigation.navigate('TermsOfUse')} />
          <SettingItem icon="star" iconBackgroundColor="#FFD60A" title="Rate the app" onPress={() => {}} />
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
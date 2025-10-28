import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
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
};

type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: SettingsScreenProps) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
      </View>
      <ScrollView>
        <View style={styles.section}>
          <SettingItem icon="settings-outline" iconBackgroundColor="#8e8e93" title="General" onPress={() => navigation.navigate('GeneralSettings')} />
          <SettingItem icon="notifications-outline" iconBackgroundColor="#FF9500" title="Daily Check-In Reminders" onPress={() => navigation.navigate('DailyCheckInReminder')} />
          <SettingItem icon="color-palette-outline" iconBackgroundColor="#007AFF" title="Theme" onPress={() => navigation.navigate('ThemeSelection')} />
          <SettingItem icon="archive-outline" iconBackgroundColor="#5856D6" title="Archived Habits" onPress={() => navigation.navigate('ArchivedHabits')} />
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.subtleText }]}>About</Text>
          <SettingItem icon="lock-closed-outline" iconBackgroundColor="#FF2D55" title="Privacy Policy" onPress={() => {}} />
          <SettingItem icon="document-text-outline" iconBackgroundColor="#FF3B30" title="Terms of Use" onPress={() => {}} />
          <SettingItem icon="star-outline" iconBackgroundColor="#FFD60A" title="Rate the app" onPress={() => {}} />
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
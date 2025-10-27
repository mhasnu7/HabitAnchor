import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { styles } from '../styles/GeneralSettingsScreenStyles';
import ToggleSwitch from '../components/ToggleSwitch';
import { useTheme } from '../context/ThemeContext';
import { useHabitStore } from '../store/habits';

type RootStackParamList = {
  Settings: undefined;
  GeneralSettings: undefined;
  DailyCheckInReminder: undefined;
};

type GeneralSettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'GeneralSettings'>;

const GeneralSettingsScreen = ({ navigation }: GeneralSettingsScreenProps) => {
  const { theme } = useTheme();
  const {
    weekStartsOnMonday,
    toggleWeekStartsOnMonday,
    highlightCurrentDay,
    toggleHighlightCurrentDay,
    showAnalytics,
    toggleShowAnalytics,
  } = useHabitStore();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>General</Text>
      </View>
      <ScrollView>
        <View style={styles.section}>
          <TouchableOpacity style={[styles.itemContainer, { backgroundColor: theme.cardBackground }]} onPress={() => navigation.navigate('DailyCheckInReminder')}>
            <Text style={[styles.itemTitle, { color: theme.text }]}>Daily Check-in Reminder</Text>
            <Icon name="chevron-forward" size={20} color={theme.arrow} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.itemContainer, { backgroundColor: theme.cardBackground }]} onPress={toggleWeekStartsOnMonday}>
            <Text style={[styles.itemTitle, { color: theme.text }]}>Week Starts On Monday</Text>
            <Icon name="chevron-forward" size={20} color={theme.arrow} />
          </TouchableOpacity>
          <View style={[styles.itemContainer, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.itemTitle, { color: theme.text }]}>Highlight current day</Text>
            <ToggleSwitch value={highlightCurrentDay} onValueChange={toggleHighlightCurrentDay} />
          </View>
          <View style={[styles.itemContainer, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.itemTitle, { color: theme.text }]}>Show Analytics</Text>
            <ToggleSwitch value={showAnalytics} onValueChange={toggleShowAnalytics} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default GeneralSettingsScreen;
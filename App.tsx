/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import mobileAds from 'react-native-google-mobile-ads';
import HomeScreen from './src/screens/HomeScreen';
import AddHabitScreen from './src/screens/AddHabitScreen';
import HabitCalendarScreen from './src/screens/HabitCalendarScreen';
import HabitDetailScreen from './src/screens/HabitDetailScreen';
import IconPickerScreen from './src/screens/IconPickerScreen';
import ColorPickerScreen from './src/screens/ColorPickerScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import GeneralSettingsScreen from './src/screens/GeneralSettingsScreen';
import MenuScreen from './src/screens/MenuScreen';
import DailyCheckInReminderScreen from './src/screens/DailyCheckInReminderScreen';
import ArchivedHabitsScreen from './src/screens/ArchivedHabitsScreen';
import HabitInsightsScreen from './src/screens/HabitInsightsScreen';
import HowToUseScreen from './src/screens/HowToUseScreen'; // Import HowToUseScreen
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import TermsOfUseScreen from './src/screens/TermsOfUseScreen';
import EditHabitsListScreen from './src/screens/EditHabitsListScreen';
import EditHabitDetailScreen from './src/screens/EditHabitDetailScreen';
import { AdsProvider, useAdsContext } from './src/context/AdsContext'; // Import Ads Context
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHabitStore } from './src/store/habits';
import { ThemeProvider } from './src/context/ThemeContext';
import ThemeSelectionScreen from './src/screens/ThemeSelectionScreen';
import SplashScreen from './src/components/SplashScreen';

export type RootStackParamList = {
  Home: undefined;
  AddHabit: { selectedIcon?: string; selectedColor?: string } | undefined;
  IconPicker: { onSelectIcon: (icon: string) => void };
  HabitCalendar: undefined;
  HabitDetails: undefined;
  Menu: undefined;
  Settings: undefined;
  GeneralSettings: undefined;
  DailyCheckInReminder: undefined;
  ThemeSelection: undefined;
  ArchivedHabits: undefined;
  HabitInsights: undefined;
  PrivacyPolicy: undefined;
  TermsOfUse: undefined;
  EditHabitsList: undefined;
  EditHabitDetail: { habitId: string };
  ColorPicker: { onSelectColor: (color: string) => void };
  HowToUse: undefined; // New screen for instructions
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainAppContent() {
  const { habits } = useHabitStore();
  const { loadingAdsStatus, refreshAdsStatus } = useAdsContext();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    // Initialize Google Mobile Ads
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('AdMob initialized:', adapterStatuses);
      })
      .catch(error => {
        console.error('AdMob initialization failed:', error);
      });

    // RevenueCat initialization and listener setup are disabled/removed.
    
    const loadAndLogHabits = async () => {
      try {
        const storedData = await AsyncStorage.getItem('habit-storage');
        console.log('AsyncStorage Content (habit-storage):', storedData);
        console.log('Zustand Habits State:', habits);
      } catch (error) {
        console.error('Error reading AsyncStorage:', error);
      }
    };
    loadAndLogHabits();
  }, [habits]);

  const handleSplashAnimationFinish = () => {
    setIsSplashVisible(false);
  };

  // Wait for both splash screen and ads status to load before showing main content
  if (isSplashVisible || loadingAdsStatus) {
    return (
      <ThemeProvider>
        <SplashScreen onAnimationFinish={handleSplashAnimationFinish} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="HabitCalendar" component={HabitCalendarScreen} />
            <Stack.Screen name="HabitDetails" component={HabitDetailScreen} />
            <Stack.Screen name="Menu" component={MenuScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="GeneralSettings" component={GeneralSettingsScreen} />
            <Stack.Screen name="DailyCheckInReminder" component={DailyCheckInReminderScreen} />
            <Stack.Screen name="ThemeSelection" component={ThemeSelectionScreen} />
            <Stack.Screen name="ArchivedHabits" component={ArchivedHabitsScreen} />
            <Stack.Screen name="HabitInsights" component={HabitInsightsScreen} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            <Stack.Screen name="TermsOfUse" component={TermsOfUseScreen} />
            <Stack.Screen name="EditHabitsList" component={EditHabitsListScreen} />
            <Stack.Screen name="EditHabitDetail" component={EditHabitDetailScreen} />
            <Stack.Screen name="HowToUse" component={HowToUseScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="AddHabit" component={AddHabitScreen} />
            <Stack.Screen name="IconPicker" component={IconPickerScreen} />
            <Stack.Screen name="ColorPicker" component={ColorPickerScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AdsProvider>
      <MainAppContent />
    </AdsProvider>
  );
}

export default App;

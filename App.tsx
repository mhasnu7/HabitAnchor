/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import AddHabitScreen from './src/screens/AddHabitScreen';
import HabitCalendarScreen from './src/screens/HabitCalendarScreen';
import HabitDetailScreen from './src/screens/HabitDetailScreen';
import IconPickerScreen from './src/screens/IconPickerScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHabitStore } from './src/store/habits';

export type RootStackParamList = {
  Home: undefined;
  AddHabit: { selectedIcon?: string } | undefined;
  IconPicker: { onSelectIcon: (icon: string) => void };
  HabitCalendar: undefined;
  HabitDetails: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const { habits } = useHabitStore();

  useEffect(() => {
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

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Group>
          <Stack.Screen name="HabitCalendar" component={HabitCalendarScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="HabitDetails" component={HabitDetailScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="AddHabit" component={AddHabitScreen} />
          <Stack.Screen name="IconPicker" component={IconPickerScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

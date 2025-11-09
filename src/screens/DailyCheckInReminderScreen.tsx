import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, Alert, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/DailyCheckInReminderScreenStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DailyCheckInReminderScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DailyCheckInReminder'
>;

const REMINDER_KEY = 'dailyCheckInReminderTime';

const DailyCheckInReminderScreen = ({
  navigation,
}: DailyCheckInReminderScreenProps) => {
  const [reminderTime, setReminderTime] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    const loadReminderTime = async () => {
      try {
        const storedTime = await AsyncStorage.getItem(REMINDER_KEY);
        if (storedTime) {
          setReminderTime(new Date(storedTime));
        }
      } catch (error) {
        console.error('Error loading reminder time:', error);
      }
    };
    loadReminderTime();
  }, []);

  const handleSetReminder = async (time: Date) => {
    try {
      await AsyncStorage.setItem(REMINDER_KEY, time.toISOString());
      setReminderTime(time);
      Alert.alert('Success', `Daily reminder time saved: ${time.toLocaleTimeString()}`);
    } catch (error) {
      console.error('Error saving reminder time:', error);
      Alert.alert('Error', 'Failed to save daily reminder time.');
    }
  };

  const handleCancelReminder = async () => {
    try {
      await AsyncStorage.removeItem(REMINDER_KEY);
      setReminderTime(null);
      Alert.alert('Success', 'Daily reminder time cancelled.');
    } catch (error) {
      console.error('Error cancelling reminder:', error);
      Alert.alert('Error', 'Failed to cancel daily reminder time.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Check-in Reminder</Text>
      </View>

      <Button title="Set Reminder Time" onPress={() => setIsDatePickerOpen(true)} />

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.infoText}>*Full Feature coming soon*</Text>
      </View>

      {reminderTime && (
        <Text style={styles.selectedTime}>
          Reminder set for: {reminderTime.toLocaleTimeString()}
        </Text>
      )}

      {reminderTime && (
        <Button title="Cancel Reminder" onPress={handleCancelReminder} color="red" />
      )}

      <DatePicker
        modal
        open={isDatePickerOpen}
        date={reminderTime || new Date()}
        mode="time"
        onConfirm={(selectedDate) => {
          setIsDatePickerOpen(false);
          handleSetReminder(selectedDate);
        }}
        onCancel={() => {
          setIsDatePickerOpen(false);
        }}
      />
    </View>
  );
};

export default DailyCheckInReminderScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHabitStore } from '../store/habits';
import { generateLastNDays } from '../utils/date';
import { useTheme } from '../context/ThemeContext';

type RootStackParamList = {
  Home: undefined;
  AddHabit: undefined;
  HabitCalendar: undefined;
  HabitDetails: undefined;
  Settings: undefined;
};

type HabitDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'HabitDetails'>;

const HabitDetailScreen = ({ navigation }: HabitDetailScreenProps) => {
  const { habits } = useHabitStore();
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [lastNDays, setLastNDays] = useState(generateLastNDays(7, currentDate));

  useEffect(() => {
    setLastNDays(generateLastNDays(7, currentDate));
  }, [currentDate]);

  const goToPreviousDays = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextDays = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.title}>
          <Text style={{ color: '#2AB574' }}>Habit</Text>
          <Text style={{ color: '#1A73E8' }}> Details</Text>
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('AddHabit')}>
            <Icon name="plus-circle" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={[styles.last5DaysButton, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.last5DaysButtonText, { color: theme.text }]}>Last 7 days</Text>
        </TouchableOpacity>
        <View style={styles.dateNavigationContainer}>
          <TouchableOpacity onPress={goToPreviousDays} style={styles.arrowButton}>
            <Icon name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
          <View style={styles.daysHeader}>
            {lastNDays.map((day, index) => (
              <View key={index} style={styles.dayContainer}>
                <Text style={[styles.dayHeaderText, { color: theme.text }]}>
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 2)}
                </Text>
                <Text style={[styles.dateHeaderText, { color: theme.subtleText }]}>
                  {new Date(day.date).getDate()}
                </Text>
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={goToNextDays} style={styles.arrowButton}>
            <Icon name="arrow-right" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollView}>
          {habits.map((habit) => (
            <View key={habit.id} style={[styles.habitRow, { backgroundColor: theme.cardBackground }]}>
              <View style={[styles.habitIconContainer, { backgroundColor: habit.color }]}>
                <Icon name={habit.icon} size={20} color="#fff" />
              </View>
              <Text style={[styles.habitName, { color: '#2AB574' }]}>{habit.name}</Text>
              <View style={styles.calendarBoxes}>
                {lastNDays.map((day, index) => {
                  const habitDayProgress = habit.progress.find(p => p.date === day.date);
                  const isCompleted = habitDayProgress ? habitDayProgress.completed : false;
                  return (
                    <View
                      key={index}
                      style={[
                        styles.calendarBox,
                        isCompleted ? { ...styles.calendarBoxCompleted, backgroundColor: habit.color } : { ...styles.calendarBoxIncomplete, backgroundColor: theme.subtleText },
                      ]}
                    />
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.bottomNavBarContainer}>
        <View style={[styles.bottomNavBar, { backgroundColor: theme.cardBackground, shadowColor: theme.background }]}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
            <Icon name="home" size={24} color={theme.subtleText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Settings')}>
            <Icon name="cog" size={24} color={theme.text === '#fff' ? '#8a2be2' : '#8a2be2'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingRight: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  last5DaysButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  last5DaysButtonText: {
    fontSize: 14,
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    marginBottom: 10,
  },
  dayContainer: {
    alignItems: 'center',
    width: 25,
  },
  dayHeaderText: {
    fontSize: 12,
    textAlign: 'center',
  },
  dateHeaderText: {
    fontSize: 10,
    textAlign: 'center',
  },
  dateNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  arrowButton: {
    padding: 2,
  },
  scrollView: {
    flex: 1,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  habitIconContainer: {
    borderRadius: 5,
    padding: 4,
    marginRight: 8,
  },
  habitName: {
    fontSize: 15,
    marginRight: 8,
  },
  calendarBoxes: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  calendarBox: {
    width: 25,
    height: 25,
    borderRadius: 4,
  },
  calendarBoxCompleted: {
    // backgroundColor: '#8a2be2', // Example color for completed
  },
  calendarBoxIncomplete: {
    // backgroundColor: '#555', // Example color for incomplete
  },
  bottomNavBarContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomNavBar: {
    flexDirection: 'row',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'space-around',
    width: '80%',
  },
  navButton: {
    padding: 8,
  },
});

export default HabitDetailScreen; // Minor change to trigger TS re-evaluation
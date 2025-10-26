import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  AddHabit: undefined;
  HabitCalendar: undefined;
};

type HabitCalendarScreenProps = NativeStackScreenProps<RootStackParamList, 'HabitCalendar'>;

const HabitCalendarScreen = ({ navigation }: HabitCalendarScreenProps) => {
  // Placeholder data and functions to match the new structure
  const weekDays = [
    { short: 'Th', date: '23', dateString: '2025-10-23' },
    { short: 'Fr', date: '24', dateString: '2025-10-24' },
    { short: 'Sa', date: '25', dateString: '2025-10-25' },
    { short: 'Su', date: '26', dateString: '2025-10-26' },
    { short: 'Mo', date: '27', dateString: '2025-10-27' },
  ];

  const habits = [
    { id: '1', name: 'Happy', color: '#FF6347', completedDates: ['2025-10-26'] },
    // Add more placeholder habits as needed
  ];

  const handlePrevWeek = () => {
    console.log('Navigate to previous week');
  };

  const handleNextWeek = () => {
    console.log('Navigate to next week');
  };

  const toggleHabit = (habitId: string, dateString: string) => {
    console.log(`Toggle habit ${habitId} on ${dateString}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="settings" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>HabitKit</Text>
        <View style={styles.headerRight}>
          <Text style={styles.proBadge}>PRO</Text>
          <Icon name="bar-chart-2" size={24} color="#fff" />
          <TouchableOpacity>
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.last5DaysButton}>
          <Text style={styles.last5DaysButtonText}>Last 5 days</Text>
        </TouchableOpacity>

        <View style={styles.calendarContainer}>
          {/* Top navigation row with arrows */}
          <View style={styles.navArrowsRow}>
            <TouchableOpacity onPress={handlePrevWeek}>
              <Icon name="chevron-left" size={22} color="#ccc" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNextWeek}>
              <Icon name="chevron-right" size={22} color="#ccc" />
            </TouchableOpacity>
          </View>

          {/* Calendar content: days and habit rows */}
          <View style={styles.calendarContentGrid}>
            {/* Header for week days + dates */}
            <View style={styles.daysHeader}>
              {weekDays.map((day, index) => (
                <View key={index} style={styles.dayColumn}>
                  <Text style={styles.weekdayText}>{day.short}</Text>
                  <Text style={styles.dateText}>{day.date}</Text>
                </View>
              ))}
            </View>

            {/* Habit rows */}
            {habits.map((habit) => (
              <View key={habit.id} style={styles.habitRow}>
                {weekDays.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => toggleHabit(habit.id, day.dateString)}
                    style={[
                      styles.habitBox,
                      habit.completedDates?.includes(day.dateString)
                        ? { backgroundColor: habit.color }
                        : styles.habitBoxEmpty,
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.bottomNavBarContainer}>
        <View style={styles.bottomNavBar}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
            <Icon name="grid" size={24} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Icon name="check-square" size={24} color="#8a2be2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Icon name="align-justify" size={24} color="#888" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HabitCalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: '#1c1c1c',
  },
  title: {
    color: '#8a2be2',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  proBadge: {
    backgroundColor: '#8a2be2',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  last5DaysButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginLeft: 10, // Align with calendarContainer padding
  },
  last5DaysButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  calendarContainer: {
    width: '100%',
    // Removed paddingHorizontal here, will be applied to children
  },
  navArrowsRow: { // New style for just the arrows
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10, // Apply padding here
  },
  calendarContentGrid: { // New style for the grid of days and habit boxes
    paddingHorizontal: 10, // Apply padding here to align with arrows
  },
  daysHeader: { // Renamed from headerWrapper
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute days evenly
    alignItems: 'center',
    // No fixed width here, let it flex within calendarContentGrid
    // The dayColumn will define the width
  },
  dayColumn: {
    alignItems: 'center',
    width: 28, // Adjusted width to match habitBox
    marginHorizontal: 2, // Added margin to match habitBox
  },
  weekdayText: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  habitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // No paddingHorizontal here, as dayColumn and habitBox have marginHorizontal
    alignItems: 'center',
    marginTop: 8,
  },
  habitBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  habitBoxEmpty: {
    backgroundColor: '#333',
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
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
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
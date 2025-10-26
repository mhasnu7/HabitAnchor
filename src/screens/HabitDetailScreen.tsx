import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHabitStore } from '../store/habits';
import { generateLastNDays } from '../utils/date';

type RootStackParamList = {
  Home: undefined;
  AddHabit: undefined;
  HabitCalendar: undefined;
  HabitDetails: undefined;
};

type HabitDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'HabitDetails'>;

const HabitDetailScreen = ({ navigation }: HabitDetailScreenProps) => {
  const { habits } = useHabitStore();
  const last5Days = generateLastNDays(5);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Habit Details</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('AddHabit')}>
            <Icon name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.last5DaysButton}>
          <Text style={styles.last5DaysButtonText}>Last 5 days</Text>
        </TouchableOpacity>
        <View style={styles.daysHeader}>
          {last5Days.map((day, index) => (
            <View key={index} style={styles.dayContainer}>
              <Text style={styles.dayHeaderText}>
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 2)}
              </Text>
              <Text style={styles.dateHeaderText}>
                {new Date(day.date).getDate()}
              </Text>
            </View>
          ))}
        </View>
        <ScrollView style={styles.scrollView}>
          {habits.map(habit => (
            <View key={habit.id} style={styles.habitRow}>
              <View style={[styles.habitIconContainer, { backgroundColor: habit.color }]}>
                <Icon name={habit.icon} size={20} color="#fff" />
              </View>
              <Text style={styles.habitName}>{habit.name}</Text>
              <View style={styles.calendarBoxes}>
                {last5Days.map((day, index) => {
                  const habitDayProgress = habit.progress.find(p => p.date === day.date);
                  const isCompleted = habitDayProgress ? habitDayProgress.completed : false;
                  return (
                    <View
                      key={index}
                      style={[
                        styles.calendarBox,
                        isCompleted ? { ...styles.calendarBoxCompleted, backgroundColor: habit.color } : styles.calendarBoxIncomplete,
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
        <View style={styles.bottomNavBar}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
            <Icon name="grid" size={24} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('HabitDetails')}>
            <Icon name="settings-outline" size={24} color="#8a2be2" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  last5DaysButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  last5DaysButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    gap: 5,
    paddingRight: 15,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayHeaderText: {
    color: '#fff',
    fontSize: 14,
    width: 30,
    textAlign: 'center',
  },
  dateHeaderText: {
    color: '#aaa',
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  habitIconContainer: {
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  habitName: {
    color: '#fff',
    fontSize: 18,
    flex: 1,
  },
  calendarBoxes: {
    flexDirection: 'row',
    gap: 5,
  },
  calendarBox: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  calendarBoxCompleted: {
    backgroundColor: '#8a2be2', // Example color for completed
  },
  calendarBoxIncomplete: {
    backgroundColor: '#555', // Example color for incomplete
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

export default HabitDetailScreen;
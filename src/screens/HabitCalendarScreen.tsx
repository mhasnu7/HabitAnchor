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
  const days = ['Th', 'Fr', 'Sa', 'Su', 'Mo'];
  const dates = ['9', '10', '11', '12', '13'];

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

        <View style={styles.habitRow}>
          <View style={styles.habitIconContainer}>
            <Icon name="activity" size={20} color="#fff" />
          </View>
          <Text style={styles.habitName}>Happy</Text>
          <View style={styles.calendarBoxes}>
            {days.map((day, index) => (
              <View key={index} style={styles.calendarBox} />
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
    backgroundColor: '#555',
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
    backgroundColor: '#555',
    borderRadius: 5,
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

export default HabitCalendarScreen;
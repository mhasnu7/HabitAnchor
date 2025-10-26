import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useHabitStore } from '../store/habits';
import HabitCard from '../components/HabitCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  AddHabit: undefined;
  HabitCalendar: undefined;
  HabitDetails: undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { habits } = useHabitStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="settings" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Habit Anchor</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Icon name="bar-chart-2" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AddHabit')}>
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      {habits.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>Click + button to add habit</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              id={habit.id}
              name={habit.name}
              subtitle={habit.subtitle}
              color={habit.color}
              icon={habit.icon}
            />
          ))}
        </ScrollView>
      )}
      <View style={styles.bottomNavBarContainer}>
        <View style={styles.bottomNavBar}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
            <Icon name="grid" size={24} color="#8a2be2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('HabitDetails')}>
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
    backgroundColor: '#000000',
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
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
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

export default HomeScreen;
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

const HomeScreen = ({ navigation }) => {
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
      <ScrollView style={styles.scrollView}>
        {habits.map(habit => (
          <HabitCard
            key={habit.id}
            id={habit.id}
            name={habit.name}
            subtitle={habit.subtitle}
            color={habit.color}
          />
        ))}
      </ScrollView>
      <View style={styles.navBar}>
        <TouchableOpacity>
          <Icon name="grid" size={24} color="#8a2be2" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="list" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="bar-chart" size={24} color="#888" />
        </TouchableOpacity>
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
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingVertical: 16,
  },
});

export default HomeScreen;
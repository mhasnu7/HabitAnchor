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
import { useTheme } from '../context/ThemeContext';

type RootStackParamList = {
  Home: undefined;
  AddHabit: undefined;
  HabitCalendar: undefined;
  HabitDetails: undefined;
  Settings: undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { habits, showAnalytics } = useHabitStore();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Habit Anchor</Text>
        <View style={styles.headerRight}>
          {showAnalytics && (
            <TouchableOpacity>
              <Icon name="bar-chart-2" size={24} color={theme.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('AddHabit')}>
            <Icon name="plus" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
      {habits.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={[styles.emptyStateText, { color: theme.text }]}>Click + button to add habit</Text>
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
        <View style={[styles.bottomNavBar, { backgroundColor: theme.cardBackground, shadowColor: theme.background }]}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
            <Icon name="grid" size={24} color={theme.text === '#fff' ? '#8a2be2' : '#8a2be2'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('HabitDetails')}>
            <Icon name="align-justify" size={24} color={theme.subtleText} />
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
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'space-around',
    width: '80%',
    // For Android, elevation creates a shadow. For iOS, shadow properties are used.
    // To remove the shadow, we can set elevation to 0 and shadowOpacity to 0.
    // However, since we want a shadow that changes color with the theme,
    // we'll adjust the shadowColor in the component itself.
  },
  navButton: {
    padding: 8,
  },
});

export default HomeScreen;
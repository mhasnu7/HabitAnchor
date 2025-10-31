import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '../context/ThemeContext';
import { useHabitStore, Habit } from '../store/habits';
import {
  calculateOverallCompletionRate,
  calculateCurrentStreak,
  calculateBestStreak,
  calculateMonthlyConsistency,
  calculateWeeklyCompletionRate,
} from '../utils/habitAnalysis';
import MonthlyConsistencyChart from '../components/MonthlyConsistencyChart';

// Component to display weekly completion rate
interface WeeklyConsistencyChartProps {
  habit: Habit;
}

const WeeklyConsistencyChart: React.FC<WeeklyConsistencyChartProps> = ({ habit }) => {
  const { theme } = useTheme();
  const weeklyData = calculateWeeklyCompletionRate(habit.progress);

  return (
    <View style={[styles.chartContainer, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.chartTitle, { color: theme.text }]}>Weekly Consistency</Text>
      <View style={styles.weeklyChart}>
        {weeklyData.map(({ day, rate }) => (
          <View key={day} style={styles.weeklyBarWrapper}>
            <Text style={[styles.weeklyDayLabel, { color: theme.subtleText }]}>{day}</Text>
            <View style={styles.weeklyBarBackground}>
              <View style={[styles.weeklyBar, { width: `${rate}%`, backgroundColor: habit.color }]} />
            </View>
            <Text style={[styles.weeklyRateLabel, { color: theme.text }]}>{rate}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Component to display key metrics for a single habit
interface HabitMetricsProps {
  habit: Habit;
}

const HabitMetrics: React.FC<HabitMetricsProps> = ({ habit }) => {
  const { theme } = useTheme();
  const overallRate = calculateOverallCompletionRate(habit.progress);
  const currentStreak = calculateCurrentStreak(habit.progress);
  const bestStreak = calculateBestStreak(habit.progress);
  const monthlyData = calculateMonthlyConsistency(habit.progress);

  return (
    <View style={[styles.habitCard, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.habitName, { color: habit.color }]}>{habit.name}</Text>
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: theme.text }]}>{overallRate}%</Text>
          <Text style={[styles.metricLabel, { color: theme.subtleText }]}>Overall Rate</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: theme.text }]}>{currentStreak}</Text>
          <Text style={[styles.metricLabel, { color: theme.subtleText }]}>Current Streak</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: theme.text }]}>{bestStreak}</Text>
          <Text style={[styles.metricLabel, { color: theme.subtleText }]}>Best Streak</Text>
        </View>
      </View>
      
      <MonthlyConsistencyChart data={monthlyData} habitColor={habit.color} />
      <WeeklyConsistencyChart habit={habit} />
    </View>
  );
};

const HabitInsightsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const habits = useHabitStore(state => state.habits);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="times-circle" size={24} color={theme.text} solid />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Habit Insights</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {habits.length === 0 ? (
          <Text style={[styles.noHabitsText, { color: theme.subtleText }]}>
            No habits to analyze. Add a habit to see insights!
          </Text>
        ) : (
          habits.map(habit => (
            <HabitMetrics key={habit.id} habit={habit} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingBottom: 32,
  },
  habitCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20, // Added margin to separate metrics from charts
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  chartContainer: { // Added style for chart containers
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: { // Added style for chart titles
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  weeklyChart: { // Added style for weekly chart layout
    flexDirection: 'column',
    gap: 8,
  },
  weeklyBarWrapper: { // Added style for individual weekly bar row
    flexDirection: 'row',
    alignItems: 'center',
  },
  weeklyDayLabel: { // Added style for day labels
    width: 30,
    fontSize: 12,
  },
  weeklyBarBackground: { // Added style for the bar track
    flex: 1,
    height: 10,
    backgroundColor: '#333', // Dark background for the bar track
    borderRadius: 5,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  weeklyBar: { // Added style for the actual progress bar
    height: '100%',
    borderRadius: 5,
  },
  weeklyRateLabel: { // Added style for rate percentage
    width: 30,
    fontSize: 12,
    textAlign: 'right',
  },
  noHabitsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});

export default HabitInsightsScreen;
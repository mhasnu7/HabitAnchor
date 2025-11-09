import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
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
  const [isNavBarVisible, setIsNavBarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<number | null>(null);
  
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

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';
    const scrollSpeedThreshold = 10; // Minimum scroll distance to register change
    const scrollStopTimeout = 500; // ms to wait before showing nav bar if scrolling stops

    if (currentScrollY > 0) { // Only apply logic if not at the very top
      if (scrollDirection === 'down' && currentScrollY > lastScrollY.current + scrollSpeedThreshold && isNavBarVisible) {
        setIsNavBarVisible(false);
      } else if (scrollDirection === 'up' && currentScrollY < lastScrollY.current - scrollSpeedThreshold && !isNavBarVisible) {
        setIsNavBarVisible(true);
      }
    } else {
      // If scrolling up to the top, ensure it's visible
      if (!isNavBarVisible) {
        setIsNavBarVisible(true);
      }
    }

    // Reset timeout to show nav bar if scrolling stops
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      // If scrolling stops, show nav bar after timeout
      setIsNavBarVisible(true);
    }, scrollStopTimeout);

    lastScrollY.current = currentScrollY;
  }, [isNavBarVisible]);

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
        <Text style={[styles.last7DaysDataText, { color: theme.text }]}>Last 7 Days Data</Text>
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
        <ScrollView
          style={styles.scrollView}
          onScroll={handleScroll}
          scrollEventThrottle={16} // Important for frequent updates
        >
          {habits.map((habit) => (
            <View key={habit.id} style={[styles.habitRow, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.habitTopRow}>
                <View style={[styles.habitIconContainer, { backgroundColor: habit.color }]}>
                  <Icon name={habit.icon} size={20} color="#fff" />
                </View>
                <View style={styles.calendarBoxes}>
                  {lastNDays.map((day, index) => {
                    const habitDayProgress = habit.progress.find(p => p.date === day.date);
                    const isCompleted = habitDayProgress ? habitDayProgress.completed : false;
                    return (
                      <View key={index} style={styles.calendarBoxWrapper}>
                        <View
                          style={[
                            styles.calendarBox,
                            isCompleted ? { ...styles.calendarBoxCompleted, backgroundColor: habit.color } : { ...styles.calendarBoxIncomplete, backgroundColor: theme.subtleText },
                          ]}
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
              <View style={styles.habitBottomRow}>
                <Text style={[styles.habitName, { color: '#2AB574' }]}>{habit.name}</Text>
                <Text style={[styles.targetDateText, { color: theme.subtleText }]}>
                  {habit.targetCompletionDate
                    ? `Target Date: ${new Date(habit.targetCompletionDate).toLocaleDateString()}`
                    : 'No target date selected'}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      {isNavBarVisible && (
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
      )}
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
  last7DaysDataText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  daysHeader: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: 32,
    marginRight: 12,
    marginBottom: 10,
  },
  dayContainer: {
    alignItems: 'center',
    flex: 1,
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
    paddingHorizontal: 0,
    paddingVertical: 2,
  },
  scrollView: {
    flex: 1,
  },
  habitRow: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  habitTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  habitBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  habitIconContainer: {
    borderRadius: 14,
    padding: 4,
    marginRight: 8,
  },
  habitName: {
    fontSize: 15,
  },
  targetDateText: {
    fontSize: 12,
  },
  calendarBoxes: {
    flexDirection: 'row',
    flex: 1,
  },
  calendarBoxWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  calendarBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
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

export default HabitDetailScreen;
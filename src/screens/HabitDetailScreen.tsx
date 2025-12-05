import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHabitStore } from '../store/habits';
import { generateLastNDays } from '../utils/date';
import { useTheme } from '../context/ThemeContext';

// ✅ Emoji detection
const isEmoji = (str: string) => /\p{Emoji}/u.test(str);

// ✅ Predefined lighter palette for gradients
const LIGHTER_COLOR_MAP: Record<string, string> = {
  '#ef4444': '#fca5a5',
  '#f97316': '#fdba74',
  '#f59e0b': '#fcd34d',
  '#eab308': '#fde047',
  '#84cc16': '#bef264',
  '#22c55e': '#86efac',
  '#10b981': '#6ee7b7',
  '#14b8a6': '#5eead4',
  '#06b6d4': '#67e8f9',
  '#0ea5e9': '#7dd3fc',
  '#3b82f6': '#93c5fd',
  '#6366f1': '#a5b4fc',
  '#8b5cf6': '#c4b5fd',
  '#a855f7': '#e9d5ff',
  '#d946ef': '#f9a8ff',
  '#ec4899': '#f9a8d4',
  '#f43f5e': '#fecaca',
  '#a01e5a': '#ec4899', // your default base color
};

const getLighterColor = (color: string) => {
  const key = color.toLowerCase();
  return LIGHTER_COLOR_MAP[key] || color;
};

type RootStackParamList = {
  Home: undefined;
  AddHabit: undefined;
  HabitCalendar: undefined;
  HabitDetails: undefined;
  Settings: undefined;
};

type HabitDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'HabitDetails'
>;

const HabitDetailScreen = ({ navigation }: HabitDetailScreenProps) => {
  const { habits, toggleCompletion } = useHabitStore();
  const { theme } = useTheme();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [lastNDays, setLastNDays] = useState(generateLastNDays(7, currentDate));
  const [isNavBarVisible, setIsNavBarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<number | null>(null);

  // 🔥 Animation for bouncing the last tapped circle
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [lastTapped, setLastTapped] = useState<{ habitId: string; date: string } | null>(null);

  useEffect(() => {
    setLastNDays(generateLastNDays(7, currentDate));
  }, [currentDate]);

  const weekRangeLabel = useMemo(() => {
    if (!lastNDays.length) return '';
    const first = new Date(lastNDays[0].date);
    const last = new Date(lastNDays[lastNDays.length - 1].date);
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(first)} - ${fmt(last)}`;
  }, [lastNDays]);

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

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const scrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';
      const scrollSpeedThreshold = 10;
      const scrollStopTimeout = 500;

      if (currentScrollY > 0) {
        if (
          scrollDirection === 'down' &&
          currentScrollY > lastScrollY.current + scrollSpeedThreshold &&
          isNavBarVisible
        ) {
          setIsNavBarVisible(false);
        } else if (
          scrollDirection === 'up' &&
          currentScrollY < lastScrollY.current - scrollSpeedThreshold &&
          !isNavBarVisible
        ) {
          setIsNavBarVisible(true);
        }
      } else {
        if (!isNavBarVisible) {
          setIsNavBarVisible(true);
        }
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsNavBarVisible(true);
      }, scrollStopTimeout);

      lastScrollY.current = currentScrollY;
    },
    [isNavBarVisible]
  );

  const today = new Date();

  const handleDayPress = (habitId: string, date: string) => {
    const dateObj = new Date(date);
    if (dateObj > today) return; // prevent toggling future days

    toggleCompletion(habitId, date);

    setLastTapped({ habitId, date });
    scaleAnim.setValue(0.5);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const getWeekStats = (habitId: string, habitColor: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return { completedThisWeek: 0, currentStreak: 0 };

    // Completed days in this 7-day window
    let completedThisWeek = 0;
    lastNDays.forEach(day => {
      const progress = habit.progress.find(p => p.date === day.date);
      if (progress?.completed) completedThisWeek += 1;
    });

    // Streak counting backwards from the last day in this window
    let currentStreak = 0;
    for (let i = lastNDays.length - 1; i >= 0; i--) {
      const d = lastNDays[i];
      const progress = habit.progress.find(p => p.date === d.date);
      if (progress?.completed) {
        currentStreak += 1;
      } else {
        break;
      }
    }

    return { completedThisWeek, currentStreak };
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Main screen header */}
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
        {/* Section title */}
        <Text style={[styles.last7DaysDataText, { color: theme.text }]}>
          Last 7 Days Data
        </Text>

        {/* Week navigation with range label */}
        <View style={styles.dateNavigationContainer}>
          <TouchableOpacity onPress={goToPreviousDays} style={styles.arrowButton}>
            <Icon name="chevron-left" size={24} color={theme.text} />
          </TouchableOpacity>

          <Text style={[styles.weekRangeText, { color: theme.subtleText }]}>
            {weekRangeLabel}
          </Text>

          <TouchableOpacity onPress={goToNextDays} style={styles.arrowButton}>
            <Icon name="chevron-right" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {habits.map(habit => {
            const lighter = getLighterColor(habit.color);
            const { completedThisWeek, currentStreak } = getWeekStats(
              habit.id,
              habit.color
            );

            return (
              <View key={habit.id} style={styles.habitBlock}>
                {/* Gradient mini-header per habit */}
                <LinearGradient
                  colors={[habit.color, lighter]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.habitHeaderCard}
                >
                  <View style={styles.habitHeaderRow}>
                    <View
                      style={[
                        styles.habitIconContainer,
                        { backgroundColor: 'rgba(0,0,0,0.15)' },
                      ]}
                    >
                      {isEmoji(habit.icon) ? (
                        <Text style={{ fontSize: 20, color: '#fff' }}>
                          {habit.icon}
                        </Text>
                      ) : (
                        <Icon name={habit.icon} size={20} color="#fff" />
                      )}
                    </View>

                    <View style={styles.habitHeaderTextContainer}>
                      <Text style={styles.habitHeaderName}>{habit.name}</Text>
                      {habit.subtitle ? (
                        <Text style={styles.habitHeaderSubtitle}>
                          {habit.subtitle}
                        </Text>
                      ) : null}
                      <View style={styles.habitHeaderStatsRow}>
                        <Text style={styles.habitHeaderStat}>
                          This week: {completedThisWeek}/7 days
                        </Text>
                        <Text style={styles.habitHeaderStat}>
                          Streak: {currentStreak} day
                          {currentStreak === 1 ? '' : 's'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {habit.targetCompletionDate && (
                    <View style={styles.targetPill}>
                      <Icon
                        name="calendar"
                        size={14}
                        color="rgba(255,255,255,0.9)"
                      />
                      <Text style={styles.targetPillText}>
                        Target: {new Date(habit.targetCompletionDate).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </LinearGradient>

                {/* 7-day aligned row */}
                <View style={styles.weekRow}>
                  {lastNDays.map((day, index) => {
                    const dateObj = new Date(day.date);
                    const weekdayLabel = dateObj
                      .toLocaleDateString('en-US', { weekday: 'short' })
                      .substring(0, 2);
                    const dayOfMonth = dateObj.getDate();
                    const progress = habit.progress.find(p => p.date === day.date);
                    const isCompleted = progress?.completed ?? false;
                    const isToday =
                      dateObj.toDateString() === today.toDateString();
                    const isFuture = dateObj > today;
                    const isActiveTapped =
                      lastTapped &&
                      lastTapped.habitId === habit.id &&
                      lastTapped.date === day.date;

                    const circleTransform = isActiveTapped
                      ? [{ scale: scaleAnim }]
                      : [{ scale: 1 }];

                    return (
                      <View key={index} style={styles.dayStack}>
                        <Text
                          style={[
                            styles.dayHeaderText,
                            { color: theme.subtleText },
                          ]}
                        >
                          {weekdayLabel}
                        </Text>
                        <Text
                          style={[
                            styles.dateHeaderText,
                            { color: theme.subtleText },
                          ]}
                        >
                          {dayOfMonth}
                        </Text>

                        <TouchableOpacity
                          style={styles.dayCircleTouch}
                          activeOpacity={0.8}
                          onPress={() =>
                            !isFuture && handleDayPress(habit.id, day.date)
                          }
                        >
                          <Animated.View
                            style={[
                              styles.dayCircle,
                              {
                                borderColor: isCompleted
                                  ? lighter
                                  : theme.subtleText,
                                backgroundColor: isCompleted
                                  ? habit.color
                                  : 'transparent',
                                opacity: isFuture ? 0.3 : 1,
                              },
                              isToday && {
                                borderWidth: 2,
                                borderColor: '#ffffff',
                                shadowColor: habit.color,
                                shadowOpacity: 0.7,
                                shadowRadius: 6,
                                shadowOffset: { width: 0, height: 0 },
                                elevation: 6,
                              },
                              { transform: circleTransform },
                            ]}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>

                {/* Separator */}
                <View style={styles.separatorWrapper}>
                  <View style={[styles.separator, { backgroundColor: lighter }]} />
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {isNavBarVisible && (
        <View style={styles.bottomNavBarContainer}>
          <View
            style={[
              styles.bottomNavBar,
              {
                backgroundColor: theme.cardBackground,
                shadowColor: theme.background,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Icon name="home" size={24} color={theme.subtleText} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Icon
                name="cog"
                size={24}
                color={theme.text === '#fff' ? '#8a2be2' : '#8a2be2'}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingRight: 10 },

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  last7DaysDataText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },

  dateNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekRangeText: {
    fontSize: 13,
    textAlign: 'center',
  },
  arrowButton: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },

  scrollView: { flex: 1 },

  habitBlock: {
    marginBottom: 16,
  },

  // Gradient mini header per habit
  habitHeaderCard: {
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  habitHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  habitHeaderTextContainer: { flex: 1 },
  habitHeaderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  habitHeaderSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  habitHeaderStatsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  habitHeaderStat: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    marginRight: 10,
  },
  targetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  targetPillText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.95)',
    marginLeft: 6,
  },

  // Week row with aligned day / date / circle
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  dayStack: {
    alignItems: 'center',
    flex: 1,
  },
  dayHeaderText: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 2,
  },
  dateHeaderText: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 4,
  },
  dayCircleTouch: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },

  separatorWrapper: {
    alignItems: 'center',
    marginTop: 10,
  },
  separator: {
    width: '40%',
    height: 2,
    borderRadius: 999,
    opacity: 0.4,
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
  navButton: { padding: 8 },
});

export default HabitDetailScreen;

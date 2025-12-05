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

const isEmoji = (str: string) => /\p{Emoji}/u.test(str);

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
  '#a01e5a': '#ec4899',
};

const getLighterColor = (c: string) =>
  LIGHTER_COLOR_MAP[c.toLowerCase()] || c;

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

  const today = new Date();

  /** ⭐ Navbar Animation State */
  const navbarTranslate = useRef(new Animated.Value(0)).current;
  const navbarOpacity = useRef(new Animated.Value(1)).current;
  const lastScrollY = useRef(0);

  const hideNavbar = () => {
    Animated.parallel([
      Animated.timing(navbarTranslate, {
        toValue: 100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(navbarOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const showNavbar = () => {
    Animated.parallel([
      Animated.timing(navbarTranslate, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(navbarOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = e.nativeEvent.contentOffset.y;

    if (currentY > lastScrollY.current + 12) hideNavbar();     // scroll down
    if (currentY < lastScrollY.current - 12) showNavbar();     // scroll up

    lastScrollY.current = currentY;
  };

  /** Bounce scaling animation for tapping day circles */
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [lastTapped, setLastTapped] = useState<{ habitId: string; date: string } | null>(null);

  const handleTap = (habitId: string, date: string) => {
    const d = new Date(date);
    if (d > today) return;

    toggleCompletion(habitId, date);

    setLastTapped({ habitId, date });
    scaleAnim.setValue(0.5);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

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

  const getWeekStats = (habitId: string, habitColor: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return { completedThisWeek: 0, currentStreak: 0 };

    let completedThisWeek = 0;
    lastNDays.forEach(day => {
      const prog = habit.progress.find(p => p.date === day.date);
      if (prog?.completed) completedThisWeek++;
    });

    let currentStreak = 0;
    for (let i = lastNDays.length - 1; i >= 0; i--) {
      const prog = habit.progress[i]
        ? habit.progress.find(p => p.date === lastNDays[i].date)
        : null;

      if (prog?.completed) currentStreak++;
      else break;
    }

    return { completedThisWeek, currentStreak };
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={styles.title}>
          <Text style={{ color: '#2AB574' }}>Habit</Text>
          <Text style={{ color: '#1A73E8' }}> Details</Text>
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate('AddHabit')}>
          <Icon name="plus-circle" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Section title */}
        <Text style={[styles.last7DaysDataText, { color: theme.text }]}>
          Last 7 Days Data
        </Text>

        {/* Week navigation */}
        <View style={styles.dateNavigationContainer}>
          <TouchableOpacity onPress={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))} >
            <Icon name="chevron-left" size={24} color={theme.text} />
          </TouchableOpacity>

          <Text style={[styles.weekRangeText, { color: theme.subtleText }]}>
            {weekRangeLabel}
          </Text>

          <TouchableOpacity onPress={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))} >
            <Icon name="chevron-right" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 200 }}  // ⭐ ensures last habit visible
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {habits.map(habit => {
            const lighter = getLighterColor(habit.color);
            const { completedThisWeek, currentStreak } = getWeekStats(habit.id, habit.color);

            return (
              <View key={habit.id} style={styles.habitBlock}>
                {/* Gradient header */}
                <LinearGradient
                  colors={[habit.color, lighter]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.habitHeaderCard}
                >
                  <View style={styles.habitHeaderRow}>
                    <View style={[styles.habitIconContainer, { backgroundColor: 'rgba(0,0,0,0.15)' }]}>
                      {isEmoji(habit.icon) ?
                        <Text style={{ fontSize: 20, color: '#fff' }}>{habit.icon}</Text> :
                        <Icon name={habit.icon} size={20} color="#fff" />}
                    </View>

                    <View style={styles.habitHeaderTextContainer}>
                      <Text style={styles.habitHeaderName}>{habit.name}</Text>

                      {habit.subtitle ? (
                        <Text style={styles.habitHeaderSubtitle}>{habit.subtitle}</Text>
                      ) : null}

                      <View style={styles.habitHeaderStatsRow}>
                        <Text style={styles.habitHeaderStat}>This week: {completedThisWeek}/7</Text>
                        <Text style={styles.habitHeaderStat}>Streak: {currentStreak} day{currentStreak !== 1 ? 's' : ''}</Text>
                      </View>
                    </View>
                  </View>

                </LinearGradient>

                {/* 7-Day Rows */}
                <View style={styles.weekRow}>
                  {lastNDays.map(day => {
                    const dateObj = new Date(day.date);
                    const dayText = dateObj
                      .toLocaleDateString('en-US', { weekday: 'short' })
                      .slice(0, 2);

                    const progress = habit.progress.find(p => p.date === day.date);
                    const completed = progress?.completed ?? false;
                    const isFuture = dateObj > today;
                    const isActive =
                      lastTapped?.habitId === habit.id &&
                      lastTapped?.date === day.date;

                    return (
                      <View key={day.date} style={styles.dayStack}>
                        <Text style={[styles.dayHeaderText, { color: theme.subtleText }]}>{dayText}</Text>
                        <Text style={[styles.dateHeaderText, { color: theme.subtleText }]}>
                          {dateObj.getDate()}
                        </Text>

                        <TouchableOpacity
                          disabled={isFuture}
                          onPress={() => handleTap(habit.id, day.date)}
                          activeOpacity={0.8}
                        >
                          <Animated.View
                            style={[
                              styles.dayCircle,
                              {
                                backgroundColor: completed ? habit.color : 'transparent',
                                borderColor: completed ? lighter : theme.subtleText,
                                opacity: isFuture ? 0.3 : 1,
                                transform: isActive ? [{ scale: scaleAnim }] : [{ scale: 1 }],
                              },
                            ]}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>

                <View style={styles.separatorWrapper}>
                  <View style={[styles.separator, { backgroundColor: lighter }]} />
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* ⭐ Animated Navbar */}
      <Animated.View
        style={[
          styles.bottomNavBarContainer,
          {
            opacity: navbarOpacity,
            transform: [{ translateY: navbarTranslate }],
          },
        ]}
      >
        <View
          style={[
            styles.bottomNavBar,
            { backgroundColor: theme.cardBackground, shadowColor: theme.background },
          ]}
        >
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Icon name="home" size={24} color={theme.subtleText} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Icon name="cog" size={24} color={'#8a2be2'} />
          </TouchableOpacity>
        </View>
      </Animated.View>
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

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },

  last7DaysDataText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },

  dateNavigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  weekRangeText: { fontSize: 13 },

  scrollView: { flex: 1 },

  habitBlock: { marginBottom: 16 },

  habitHeaderCard: {
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    elevation: 4,
  },

  habitHeaderRow: { flexDirection: 'row', alignItems: 'center' },

  habitIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  habitHeaderTextContainer: { flex: 1 },

  habitHeaderName: { fontSize: 16, fontWeight: '600', color: '#fff' },

  habitHeaderSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 },

  habitHeaderStatsRow: { flexDirection: 'row', marginTop: 4 },

  habitHeaderStat: { fontSize: 11, color: 'rgba(255,255,255,0.9)', marginRight: 10 },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dayStack: {
    alignItems: 'center',
    flex: 1,
  },

  dayHeaderText: { fontSize: 11 },

  dateHeaderText: { fontSize: 10, marginBottom: 4 },

  dayCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
  },

  separatorWrapper: { alignItems: 'center', marginTop: 10 },

  separator: {
    width: '40%',
    height: 2,
    opacity: 0.4,
    borderRadius: 999,
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
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 999,
    width: '75%',
    justifyContent: 'space-between',
    elevation: 6,
  },
});

export default HabitDetailScreen;

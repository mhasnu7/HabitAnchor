import { FONTS } from '../theme/constants';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useHabitStore } from '../store/habits';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  eachDayOfInterval,
  getDay,
  isFuture,
  isToday,
  isSameDay,
  isSameMonth,
  subDays,
  addDays,
} from 'date-fns';
import { useTheme } from '../context/ThemeContext';

interface MiniCalendarGridProps {
  habitId: string;
  color: string;
}

const screenWidth = Dimensions.get('window').width;

// Left column width for weekday labels (SU/MO/TU...)
const DAY_LABEL_WIDTH = 28;

// Total width available for the 3 months (rest of the row)
const usableWidth = screenWidth - DAY_LABEL_WIDTH - 32; // ~16 padding each side
const perMonthWidth = usableWidth / 3;
const MONTH_COLUMN_WIDTH = perMonthWidth;
const MONTHS_CONTAINER_WIDTH = MONTH_COLUMN_WIDTH * 3;

// Dot size that fits 3 months × up to 6 weeks each
const DOT_SIZE = Math.min(16, Math.floor(perMonthWidth / 6) - 2);

type DayCell = {
  date: Date;
  inCurrentMonth: boolean;
};

const MiniCalendarGrid: React.FC<MiniCalendarGridProps> = ({ habitId, color }) => {
  const { habits, toggleCompletion, weekStartsOnMonday, highlightCurrentDay } =
    useHabitStore();
  const { theme } = useTheme();
  const habit = habits.find(h => h.id === habitId);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [rippleScale] = useState(new Animated.Value(0));
  const [rippleOpacity] = useState(new Animated.Value(1));

  if (!habit) return null;

  const monthsToDisplay = useMemo(
    () => [subMonths(currentDate, 1), currentDate, addMonths(currentDate, 1)],
    [currentDate]
  );

  const handlePrevious = () => setCurrentDate(prev => subMonths(prev, 3));
  const handleNext = () => setCurrentDate(prev => addMonths(prev, 3));

  const handleDayPress = (date: Date) => {
    if (isFuture(date)) return;

    toggleCompletion(habit.id, format(date, 'yyyy-MM-dd'));

    rippleScale.setValue(0);
    rippleOpacity.setValue(1);

    Animated.parallel([
      Animated.timing(rippleScale, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  /** Build month grid (6×7), then filter out weeks with no current-month days */
  const buildMonthRows = (month: Date): DayCell[][] => {
    const monthStart = startOfMonth(month);
    const nativeFirstDow = getDay(monthStart);

    const firstIndex = weekStartsOnMonday
      ? nativeFirstDow === 0
        ? 6
        : nativeFirstDow - 1
      : nativeFirstDow;

    const gridStart = subDays(monthStart, firstIndex);
    const gridEnd = addDays(gridStart, 6 * 7 - 1);

    const allDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

    const weeks: Date[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }

    const filteredWeeks = weeks.filter(week =>
      week.some(d => isSameMonth(d, month))
    );

    const rows: DayCell[][] = Array.from({ length: 7 }, () => []);

    filteredWeeks.forEach(week => {
      week.forEach((d, colIndex) => {
        rows[colIndex].push({
          date: d,
          inCurrentMonth: isSameMonth(d, month),
        });
      });
    });

    return rows;
  };

  const monthRowsArray: DayCell[][][] = useMemo(
    () => monthsToDisplay.map(m => buildMonthRows(m)),
    [monthsToDisplay, weekStartsOnMonday]
  );

  const dayNames = weekStartsOnMonday
    ? ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
    : ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handlePrevious}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="chevron-left" size={22} color={theme.subtleText} />
        </TouchableOpacity>

        {/* Center header with placeholder for weekday column + 3 month headers */}
        <View style={styles.headerCenter}>
          <View style={{ width: DAY_LABEL_WIDTH }} />
          <View style={styles.monthNames}>
            {monthsToDisplay.map(m => (
              <View key={m.toString()} style={styles.monthHeader}>
                <Text
                  style={[styles.monthName, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {format(m, 'MMM yy')}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleNext}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="chevron-right" size={22} color={theme.subtleText} />
        </TouchableOpacity>
      </View>

      {/* Rows */}
      {dayNames.map((dayLabel, rowIndex) => (
        <View key={dayLabel} style={styles.row}>
          <Text
            style={[
              styles.dayLabel,
              { color: theme.subtleText, width: DAY_LABEL_WIDTH },
            ]}
          >
            {dayLabel}
          </Text>

          {monthRowsArray.map((monthRows, monthIndex) => {
            const cellsForRow = monthRows[rowIndex];
            const monthDate = monthsToDisplay[monthIndex];
            const isCurrentMonthView = isSameMonth(monthDate, new Date());

            return (
              <View
                key={`${monthIndex}-${dayLabel}`}
                style={[
                  styles.monthColumn,
                  monthIndex === 0 && { borderLeftWidth: 0 }, // no left border on first month
                  isCurrentMonthView && {
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderRadius: 8,
                  },
                ]}
              >
                <View style={styles.datesRow}>
                  {cellsForRow.map(cell => {
                    const { date, inCurrentMonth } = cell;

                    // Keep spacing, hide extra dates
                    if (!inCurrentMonth) {
                      return (
                        <View
                          key={format(date, 'yyyy-MM-dd')}
                          style={[styles.dateDot, { opacity: 0 }]}
                        />
                      );
                    }

                    const dateString = format(date, 'yyyy-MM-dd');
                    const isCompleted = habit.progress.some(
                      p => p.date === dateString && p.completed
                    );
                    const completedToday =
                      isCompleted && isSameDay(date, new Date());
                    const isTodayCell = isToday(date);

                    return (
                      <TouchableOpacity
                        key={dateString}
                        onPress={() => handleDayPress(date)}
                        activeOpacity={0.8}
                      >
                        <View
                          style={[
                            styles.dateDot,
                            {
                              backgroundColor: isCompleted
                                ? color
                                : 'transparent',
                              borderColor: isCompleted
                                ? color
                                : 'transparent',
                            },
                            isTodayCell &&
                              highlightCurrentDay && {
                                borderColor: theme.text,
                                borderWidth: 1,
                              },
                          ]}
                        >
                          <Text
                            style={[
                              styles.dateText,
                              {
                                color: isCompleted ? '#000' : theme.text,
                                opacity: isCompleted ? 1 : 0.8,
                              },
                            ]}
                          >
                            {format(date, 'd')}
                          </Text>

                          {completedToday && (
                            <Animated.View
                              pointerEvents="none"
                              style={[
                                styles.ripple,
                                {
                                  backgroundColor: color,
                                  opacity: rippleOpacity,
                                  transform: [{ scale: rippleScale }],
                                },
                              ]}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  // Center area with weekday placeholder + month labels
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  monthNames: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: MONTHS_CONTAINER_WIDTH,
  },

  monthHeader: {
    width: MONTH_COLUMN_WIDTH,
    alignItems: 'center',
  },

  monthName: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: -2,
  },

  dayLabel: {
    fontSize: 11,
    fontFamily: FONTS.body,
  },

  monthColumn: {
    width: MONTH_COLUMN_WIDTH,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderLeftWidth: 0.5,
    borderLeftColor: 'rgba(255,255,255,0.08)', // very subtle divider
  },

  datesRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dateDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
    // subtle depth on completed days
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  dateText: {
    fontSize: 9,
    fontFamily: FONTS.body,
  },

  ripple: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
});

export default MiniCalendarGrid;

import { FONTS } from '../theme/constants';
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Changed to MaterialCommunityIcons
import { useHabitStore } from '../store/habits';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, getDay, isSameDay } from 'date-fns';
import { useTheme } from '../context/ThemeContext';
import { SIZES, COLORS } from '../theme/constants';

interface MiniCalendarGridProps {
  habitId: string;
  color: string;
}

const MiniCalendarGrid: React.FC<MiniCalendarGridProps> = ({ habitId, color }) => {
  const { habits, toggleCompletion, weekStartsOnMonday, highlightCurrentDay } = useHabitStore();
  const { theme } = useTheme();
  const habit = habits.find(h => h.id === habitId);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rippleAnimation] = useState(new Animated.Value(0));
  const [rippleScale] = useState(new Animated.Value(0));
  const [rippleOpacity] = useState(new Animated.Value(1));

  const monthsToDisplay = useMemo(() => {
    return [subMonths(currentDate, 1), currentDate, addMonths(currentDate, 1)];
  }, [currentDate]);

  const handlePrevious = () => {
    setCurrentDate(prev => subMonths(prev, 3));
  };

  const handleNext = () => {
    setCurrentDate(prev => addMonths(prev, 3));
  };

  const handleDayPress = (date: Date) => {
    if (habit) {
      toggleCompletion(habit.id, format(date, 'yyyy-MM-dd'));
      // Start ripple animation
      rippleAnimation.setValue(0);
      rippleScale.setValue(0);
      rippleOpacity.setValue(1);
      Animated.parallel([
        Animated.timing(rippleAnimation, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rippleScale, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rippleOpacity, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const renderMonth = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Create a 7-row grid for the days of the week
    const weekGrid: (Date | null)[][] = Array.from({ length: 7 }, () => Array(6).fill(null));
    
    // Populate the grid
    days.forEach(day => {
      const dayOfWeek = getDay(day);
      const adjustedDayOfWeek = weekStartsOnMonday ? (dayOfWeek === 0 ? 6 : dayOfWeek - 1) : dayOfWeek;
      const weekOfMonth = Math.floor((day.getDate() + startOfMonth(day).getDay() - 1) / 7);
      if (weekGrid[adjustedDayOfWeek]) {
        weekGrid[adjustedDayOfWeek][weekOfMonth] = day;
      }
    });

    const dayNames = weekStartsOnMonday ? ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'] : ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

    return weekGrid.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.weekRow}>
        {/* Day Name Label - only display for the first month in the three-month view */}
        {monthsToDisplay.findIndex(m => m.getTime() === month.getTime()) === 0 && (
          <Text style={[styles.dayName, { color: theme.subtleText }]}>
            {dayNames[rowIndex]}
          </Text>
        )}
        {row.map((day, dayIndex) => {
          if (!day) {
            return <View key={`empty-${rowIndex}-${dayIndex}`} style={styles.cell} />;
          }
          const dateString = format(day, 'yyyy-MM-dd');
          const isCompleted = habit?.progress.some(p => p.date === dateString && p.completed);
          return (
            <TouchableOpacity key={dateString} onPress={() => handleDayPress(day)} activeOpacity={1}>
              <View
                style={[
                  styles.cell,
                  styles.dayCell,
                  { backgroundColor: isCompleted ? color : theme.cardBackground },
                  isToday(day) && highlightCurrentDay && { borderColor: theme.text, borderWidth: 1 },
                ]}
              >
                <Text style={[styles.dayText, { color: theme.text }]}>{format(day, 'd')}</Text>
                {isCompleted && isSameDay(day, new Date()) && ( // Only show ripple for today's completed habit
                  <Animated.View
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
    ));
  };

  if (!habit) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevious} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name="chevron-left" size={SIZES.icon} color={theme.subtleText} />
        </TouchableOpacity>
        <View style={styles.monthNames}>
          {monthsToDisplay.map(m => (
            <Text key={m.toString()} style={[styles.monthName, { color: theme.text }]}>
              {format(m, 'MMM')}
            </Text>
          ))}
        </View>
        <TouchableOpacity onPress={handleNext} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name="chevron-right" size={SIZES.icon} color={theme.subtleText} />
        </TouchableOpacity>
      </View>
      <View style={styles.calendarGrid}>
        <View style={styles.monthsGrid}>
          {monthsToDisplay.map(month => (
            <View key={month.toString()} style={styles.monthContainer}>
              {renderMonth(month)}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthNames: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  monthName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  calendarGrid: {
    flexDirection: 'column',
  },
  dayName: {
    fontSize: 10,
    height: 16,
    width: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 2, // Reduced spacing to fix overflow
  },
  monthsGrid: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  monthContainer: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 5,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  cell: {
    width: SIZES.circularBox / 2.5, // Adjusted for circular boxes
    height: SIZES.circularBox / 2.5, // Adjusted for circular boxes
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Clip ripple animation
  },
  dayCell: {
    borderRadius: SIZES.circularBox / 2.5 / 2, // Make it circular
  },
  todayCell: {
    // borderColor: '#FFFFFF',
    // borderWidth: 1,
  },
  dayText: {
    fontSize: 10,
    fontFamily: FONTS.body,
  },
  ripple: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: SIZES.circularBox / 2.5 / 2,
  },
});

export default MiniCalendarGrid;
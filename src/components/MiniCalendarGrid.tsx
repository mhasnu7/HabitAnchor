import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useHabitStore } from '../store/habits';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, getDay } from 'date-fns';

interface MiniCalendarGridProps {
  habitId: string;
  color: string;
}

const MiniCalendarGrid: React.FC<MiniCalendarGridProps> = ({ habitId, color }) => {
  const { habits, toggleCompletion } = useHabitStore();
  const habit = habits.find(h => h.id === habitId);
  const [currentDate, setCurrentDate] = useState(new Date());

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
      const weekOfMonth = Math.floor((day.getDate() + startOfMonth(day).getDay() - 1) / 7);
      if (weekGrid[dayOfWeek]) {
        weekGrid[dayOfWeek][weekOfMonth] = day;
      }
    });

    return weekGrid.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.weekRow}>
        {row.map((day, dayIndex) => {
          if (!day) {
            return <View key={`empty-${rowIndex}-${dayIndex}`} style={styles.cell} />;
          }
          const dateString = format(day, 'yyyy-MM-dd');
          const isCompleted = habit?.progress.some(p => p.date === dateString && p.completed);
          return (
            <TouchableOpacity key={dateString} onPress={() => handleDayPress(day)}>
              <View
                style={[
                  styles.cell,
                  styles.dayCell,
                  { backgroundColor: isCompleted ? color : '#2E2E2E' },
                  isToday(day) && styles.todayCell,
                ]}
              >
                <Text style={styles.dayText}>{format(day, 'd')}</Text>
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
        <TouchableOpacity onPress={handlePrevious}>
          <Icon name="chevron-left" size={24} color="#888" />
        </TouchableOpacity>
        <View style={styles.monthNames}>
          {monthsToDisplay.map(m => (
            <Text key={m.toString()} style={styles.monthName}>
              {format(m, 'MMM')}
            </Text>
          ))}
        </View>
        <TouchableOpacity onPress={handleNext}>
          <Icon name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
      </View>
      <View style={styles.calendarGrid}>
        <View style={styles.daysOfWeek}>
          {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => (
            <Text key={day} style={styles.dayName}>
              {day}
            </Text>
          ))}
        </View>
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
    justifyContent: 'space-around',
    flex: 1,
  },
  monthName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  calendarGrid: {
    flexDirection: 'row',
  },
  daysOfWeek: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginRight: 8,
  },
  dayName: {
    color: '#888',
    fontSize: 10,
    height: 22, // Cell height + margin
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  monthsGrid: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  monthContainer: {
    flex: 1,
    flexDirection: 'column', // Changed to column for vertical weeks
  },
  weekRow: {
    flexDirection: 'row', // Each row is now a day of the week
    justifyContent: 'flex-start',
    height: 22, // Cell height + margin
  },
  cell: {
    width: 18,
    height: 18,
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCell: {
    borderRadius: 4,
  },
  todayCell: {
    borderColor: '#FFFFFF',
    borderWidth: 1,
  },
  dayText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
});

export default MiniCalendarGrid;
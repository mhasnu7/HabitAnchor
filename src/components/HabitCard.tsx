import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MiniCalendarGrid from './MiniCalendarGrid';
import { useHabitStore } from '../store/habits';
import { useTheme } from '../context/ThemeContext';

import { Habit } from '../store/habits'; // Import Habit interface

interface HabitCardProps {
  habit: Habit; // Use the Habit interface directly
  onPress: (habitId: string) => void;
  onDelete: (habitId: string) => void;
  showRestoreButton?: boolean; // Optional prop for restore button
  onRestore?: (habitId: string) => void; // Optional restore handler
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onPress, onDelete, showRestoreButton, onRestore }) => {
  const { toggleCompletion, archiveHabit } = useHabitStore();
  const { theme } = useTheme();
  const today = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  const isCompletedToday = habit?.progress.find(d => d.date === today)?.completed ?? false;

  const handleCheck = () => {
    toggleCompletion(habit.id, today);
  };

  const handlePress = () => {
    onPress(habit.id);
  };

  const handleDelete = () => {
    onDelete(habit.id);
  };

  const handleRestore = () => {
    if (onRestore) {
      onRestore(habit.id);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: habit.color }]}>
          <Icon name={habit.icon} size={24} color="#fff" />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: theme.text }]}>{habit.name}</Text>
          <Text style={[styles.subtitle, { color: theme.subtleText }]}>{habit.subtitle}</Text>
        </View>
        {!showRestoreButton && (
          <TouchableOpacity
            style={[styles.checkButton, { backgroundColor: isCompletedToday ? habit.color : theme.subtleText }]}
            onPress={handleCheck}
          >
            <Icon name="checkmark" size={20} color="#fff" />
          </TouchableOpacity>
        )}
        {showRestoreButton && onRestore && (
          <TouchableOpacity
            style={[styles.restoreButton, { backgroundColor: habit.color }]}
            onPress={handleRestore}
          >
            <Icon name="refresh-circle-outline" size={20} color="#fff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: habit.color }]}
          onPress={handleDelete}
        >
          <Icon name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <MiniCalendarGrid habitId={habit.id} color={habit.color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    color: '#fff',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  restoreButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default HabitCard;
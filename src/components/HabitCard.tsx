import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MiniCalendarGrid from './MiniCalendarGrid';
import { useHabitStore } from '../store/habits';

interface HabitCardProps {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  icon: string;
}

const HabitCard: React.FC<HabitCardProps> = ({ id, name, subtitle, color, icon }) => {
  const { toggleCompletion, deleteHabit } = useHabitStore();
  const habit = useHabitStore(state => state.habits.find(h => h.id === id));
  const today = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  const isCompletedToday = habit?.progress.find(d => d.date === today)?.completed ?? false;

  const handleCheck = () => {
    toggleCompletion(id, today);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Icon name={icon} size={24} color="#fff" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkButton, {backgroundColor: isCompletedToday ? color : '#333'}]}
          onPress={handleCheck}
        >
          <Icon name="checkmark" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: color }]}
          onPress={() => deleteHabit(id)}
        >
          <Icon name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <MiniCalendarGrid habitId={id} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
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
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#333',
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
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default HabitCard;
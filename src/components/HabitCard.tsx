import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import ProgressGrid from './ProgressGrid';
import { useHabitStore } from '../store/habits';

interface HabitCardProps {
  id: string;
  name: string;
  subtitle: string;
  color: string;
}

const HabitCard: React.FC<HabitCardProps> = ({ id, name, subtitle, color }) => {
  const { toggleCompletion } = useHabitStore();
  const habit = useHabitStore(state => state.habits.find(h => h.id === id));
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit?.progress.find(d => d.date === today)?.completed ?? false;

  const handleCheck = () => {
    toggleCompletion(id, today);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Icon name="activity" size={24} color="#fff" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkButton, {backgroundColor: isCompletedToday ? color : '#333'}]}
          onPress={handleCheck}
        >
          <Icon name="check" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ProgressGrid habitId={id} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderColor: '#222',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
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
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HabitCard;
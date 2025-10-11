import React from 'react';
import { View, StyleSheet, TouchableOpacity, LayoutAnimation } from 'react-native';
import { useHabitStore } from '../store/habits';

interface ProgressGridProps {
  habitId: string;
  color: string;
}

const ProgressGrid: React.FC<ProgressGridProps> = ({ habitId, color }) => {
  const { habits, toggleCompletion } = useHabitStore();
  const habit = habits.find(h => h.id === habitId);

  const handlePress = (date: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleCompletion(habitId, date);
  };

  return (
    <View style={styles.container}>
      {habit?.progress.map(({ date, completed }) => (
        <TouchableOpacity key={date} onPress={() => handlePress(date)}>
          <View
            style={[
              styles.cell,
              { backgroundColor: completed ? color : '#222' },
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: 14,
    height: 14,
    borderRadius: 4,
    margin: 3,
  },
});

export default ProgressGrid;
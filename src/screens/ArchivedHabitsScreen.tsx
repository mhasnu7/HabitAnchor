import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useHabitStore } from '../store/habits';
import HabitCard from '../components/HabitCard';
import { styles } from '../styles/SettingsScreenStyles'; // Reusing some styles

type RootStackParamList = {
  Settings: undefined;
  ArchivedHabits: undefined;
};

type ArchivedHabitsScreenProps = NativeStackScreenProps<RootStackParamList, 'ArchivedHabits'>;

const ArchivedHabitsScreen = ({ navigation }: ArchivedHabitsScreenProps) => {
  const { theme } = useTheme();
  const { archivedHabits, restoreHabit, permanentlyDeleteHabit } = useHabitStore();

  useEffect(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    archivedHabits.forEach(habit => {
      if (habit.archivedAt) {
        const archivedDate = new Date(habit.archivedAt);
        if (archivedDate < thirtyDaysAgo) {
          permanentlyDeleteHabit(habit.id);
        }
      }
    });
  }, [archivedHabits, permanentlyDeleteHabit]);

  const handleRestoreHabit = (habitId: string) => {
    restoreHabit(habitId);
    Alert.alert('Habit Restored', 'Your habit has been restored to your active habits.');
  };

  const handleDeletePermanently = (habitId: string) => {
    Alert.alert(
      'Delete Permanently',
      'Are you sure you want to permanently delete this habit? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            permanentlyDeleteHabit(habitId);
            Alert.alert('Habit Deleted', 'The habit has been permanently deleted.');
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Archived Habits</Text>
      </View>
      <ScrollView>
        {archivedHabits.length === 0 ? (
          <Text style={[styles.sectionTitle, { color: theme.subtleText, textAlign: 'center', marginTop: 20 }]}>
            No deleted Habits.
          </Text>
        ) : (
          archivedHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onPress={() => {}} // Archived habits are not editable from here
              onDelete={() => handleDeletePermanently(habit.id)}
              showRestoreButton={true}
              onRestore={() => handleRestoreHabit(habit.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default ArchivedHabitsScreen;
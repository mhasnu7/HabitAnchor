import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHabitStore, Habit } from '../store/habits';
import { useTheme } from '../context/ThemeContext';

// Define RootStackParamList locally for type safety, or import if available globally
type RootStackParamList = {
  Menu: undefined;
  EditHabitsList: undefined;
  EditHabitDetail: { habitId: string };
};

type EditHabitsListScreenProps = NativeStackScreenProps<RootStackParamList, 'EditHabitsList'>;

const HabitListItem = ({ habit, index, navigation, theme }: { habit: Habit, index: number, navigation: EditHabitsListScreenProps['navigation'], theme: any }) => {
  return (
    <TouchableOpacity
      style={[styles.listItem, { backgroundColor: theme.cardBackground }]}
      onPress={() => navigation.navigate('EditHabitDetail', { habitId: habit.id })}
    >
      <View style={styles.leftContent}>
        <Text style={[styles.indexText, { color: theme.subtleText }]}>{index + 1}.</Text>
        <View style={[styles.habitIconContainer, { backgroundColor: habit.color, borderRadius: 14 }]}>
          <Icon name={habit.icon} size={20} color="#fff" />
        </View>
        <Text style={[styles.habitName, { color: theme.text }]}>{habit.name}</Text>
      </View>
      <Icon name="chevron-right" size={24} color={theme.subtleText} />
    </TouchableOpacity>
  );
};

const EditHabitsListScreen = ({ navigation }: EditHabitsListScreenProps) => {
  const { habits } = useHabitStore();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Edit Habits</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <HabitListItem habit={item} index={index} navigation={navigation} theme={theme} />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRightPlaceholder: {
    width: 24, // Placeholder to balance the back arrow
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indexText: {
    fontSize: 16,
    marginRight: 10,
  },
  habitIconContainer: {
    padding: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EditHabitsListScreen;
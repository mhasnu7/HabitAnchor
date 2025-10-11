import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import HabitItem from '../components/HabitItem';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';

const habits = [
  { id: '1', name: 'Learn', description: 'Learning', color: '#e0ffe0' },
  { id: '2', name: 'Workout', description: 'Gym', color: '#ffe0e0' },
];

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        style={styles.list}
        data={habits}
        renderItem={({ item }) => (
          <HabitItem
            name={item.name}
            description={item.description}
            color={item.color}
          />
        )}
        keyExtractor={item => item.id}
      />
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    paddingHorizontal: 16,
  }
});

export default HomeScreen;
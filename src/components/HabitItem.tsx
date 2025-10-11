import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface HabitItemProps {
  name: string;
  description: string;
  color: string;
}

const HabitItem: React.FC<HabitItemProps> = ({ name, description, color }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.habitInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <TouchableOpacity style={styles.checkButton}>
          <Text>✓</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.gridContainer}>
        {Array.from({ length: 365 }).map((_, index) => (
          <View key={index} style={[styles.gridCell, { backgroundColor: color }]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  habitInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#888',
  },
  checkButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridCell: {
    width: 10,
    height: 10,
    borderRadius: 2,
    margin: 2,
  },
});

export default HabitItem;
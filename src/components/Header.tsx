import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Header = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Text style={styles.icon}>⚙️</Text>
      </TouchableOpacity>
      <Text style={styles.title}>HabitKit</Text>
      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.proButton}>
          <Text style={styles.proText}>PRO</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.icon}>📊</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.icon}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginLeft: 16,
  },
  proButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  proText: {
    fontWeight: 'bold',
  },
});

export default Header;
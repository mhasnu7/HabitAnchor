import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const BottomNavBar = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab}>
        <Text style={styles.icon}>▦</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab}>
        <Text style={styles.icon}>📊</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab}>
        <Text style={styles.icon}>≡</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    color: '#888',
  },
});

export default BottomNavBar;
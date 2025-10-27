import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { darkTheme, lightTheme } from '../styles/themes';

const ThemeSelectionScreen = () => {
  const navigation = useNavigation();
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (selectedTheme: 'dark' | 'light') => {
    setTheme(selectedTheme);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Theme</Text>
      </View>

      <View style={styles.themeOptionContainer}>
        <TouchableOpacity
          style={[
            styles.themeOption,
            { backgroundColor: theme.cardBackground },
            theme === darkTheme && styles.selectedTheme,
          ]}
          onPress={() => handleThemeChange('dark')}
        >
          <Text style={[styles.themeOptionText, { color: theme.text }]}>Dark Theme</Text>
          {theme === darkTheme && (
            <Icon name="checkmark-circle" size={24} color="#007AFF" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.themeOption,
            { backgroundColor: theme.cardBackground },
            theme === lightTheme && styles.selectedTheme,
          ]}
          onPress={() => handleThemeChange('light')}
        >
          <Text style={[styles.themeOptionText, { color: theme.text }]}>Light Theme</Text>
          {theme === lightTheme && (
            <Icon name="checkmark-circle" size={24} color="#007AFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  themeOptionContainer: {
    marginTop: 20,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  themeOptionText: {
    fontSize: 17,
  },
  selectedTheme: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
});

export default ThemeSelectionScreen;
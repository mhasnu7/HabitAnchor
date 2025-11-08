import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { DARK_THEME, LIGHT_THEME, CREAM_THEME, FONTS } from '../theme/constants';

const ThemeSelectionScreen = () => {
  const navigation = useNavigation();
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (selectedTheme: 'dark' | 'light' | 'cream') => {
    setTheme(selectedTheme);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text, fontFamily: FONTS.heading }]}>Theme</Text>
      </View>

      <View style={styles.themeOptionContainer}>
        <TouchableOpacity
          style={[
            styles.themeOption,
            { backgroundColor: theme.cardBackground },
            theme === DARK_THEME && styles.selectedTheme,
          ]}
          onPress={() => handleThemeChange('dark')}
        >
          <Text style={[styles.themeOptionText, { color: theme.text, fontFamily: FONTS.body }]}>Dark Theme</Text>
          {theme === DARK_THEME && (
            <Icon name="check-circle" size={24} color={DARK_THEME.primary} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.themeOption,
            { backgroundColor: theme.cardBackground },
            theme === LIGHT_THEME && styles.selectedTheme,
          ]}
          onPress={() => handleThemeChange('light')}
        >
          <Text style={[styles.themeOptionText, { color: theme.text, fontFamily: FONTS.body }]}>Light Theme</Text>
          {theme === LIGHT_THEME && (
            <Icon name="check-circle" size={24} color={LIGHT_THEME.primary} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.themeOption,
            { backgroundColor: theme.cardBackground },
            theme === CREAM_THEME && styles.selectedTheme,
          ]}
          onPress={() => handleThemeChange('cream')}
        >
          <Text style={[styles.themeOptionText, { color: theme.text, fontFamily: FONTS.body }]}>Cream Theme</Text>
          {theme === CREAM_THEME && (
            <Icon name="check-circle" size={24} color={CREAM_THEME.primary} />
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
    fontFamily: FONTS.heading,
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
    fontFamily: FONTS.body,
  },
  selectedTheme: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
});

export default ThemeSelectionScreen;
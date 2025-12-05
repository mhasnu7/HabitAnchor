import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHabitStore, Habit } from '../store/habits';
import { useTheme } from '../context/ThemeContext';

// Define RootStackParamList locally for type safety
type RootStackParamList = {
  EditHabitsList: undefined;
  EditHabitDetail: { habitId: string };
  IconPicker: { onSelectIcon: (icon: string) => void };
  ColorPicker: { onSelectColor: (color: string) => void };
};

type EditHabitDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'EditHabitDetail'
>;

// ⭐ Detect whether icon is emoji
const isEmoji = (char: string) => /\p{Extended_Pictographic}/u.test(char);

const EditHabitDetailScreen = ({ navigation, route }: EditHabitDetailScreenProps) => {
  const { habitId } = route.params;
  const { habits, editHabit } = useHabitStore();
  const { theme } = useTheme();

  const habitToEdit = habits.find(h => h.id === habitId);

  const [name, setName] = useState(habitToEdit?.name || '');
  const [color, setColor] = useState(habitToEdit?.color || '#000000');
  const [icon, setIcon] = useState(habitToEdit?.icon || 'run');
  const [targetCompletionDate, setTargetCompletionDate] = useState(
    habitToEdit?.targetCompletionDate || ''
  );

  useEffect(() => {
    if (!habitToEdit) {
      Alert.alert('Error', 'Habit not found.');
      navigation.goBack();
    }
  }, [habitToEdit, navigation]);

  const handleSave = () => {
    if (habitToEdit) {
      const updatedHabit: Partial<Habit> = {
        name,
        color,
        icon,
        targetCompletionDate: targetCompletionDate || undefined,
      };
      editHabit(habitId, updatedHabit);
      Alert.alert('Success', 'Habit updated successfully!');
      navigation.goBack();
    }
  };

  const handleIconSelect = (selectedIcon: string) => {
    setIcon(selectedIcon);
  };

  const handleColorSelect = (selectedColor: string) => {
    setColor(selectedColor);
  };

  if (!habitToEdit) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>
          Edit {habitToEdit.name}
        </Text>

        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Icon Preview */}
        <View style={styles.iconDisplayContainer}>
          <View
            style={[
              styles.habitIconContainer,
              { backgroundColor: color, borderRadius: 14 },
            ]}
          >
            {isEmoji(icon) ? (
              <Text style={{ fontSize: 36 }}>{icon}</Text>
            ) : (
              <Icon name={icon} size={32} color="#fff" />
            )}
          </View>
        </View>

        {/* Habit Name */}
        <View style={[styles.settingItem, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>Habit Name</Text>
          <TextInput
            style={[
              styles.textInput,
              { color: theme.text, borderBottomColor: theme.subtleText },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Enter habit name"
            placeholderTextColor={theme.subtleText}
          />
        </View>

        {/* Icon Picker */}
        <TouchableOpacity
          style={[styles.settingItem, styles.pickerItem, { backgroundColor: theme.cardBackground }]}
          onPress={() => navigation.navigate('IconPicker', { onSelectIcon: handleIconSelect })}
        >
          <Text style={[styles.settingLabel, { color: theme.text }]}>Change Icon</Text>
          <Icon name="chevron-right" size={24} color={theme.subtleText} />
        </TouchableOpacity>

        {/* Color Picker */}
        <TouchableOpacity
          style={[styles.settingItem, styles.pickerItem, { backgroundColor: theme.cardBackground }]}
          onPress={() => navigation.navigate('ColorPicker', { onSelectColor: handleColorSelect })}
        >
          <Text style={[styles.settingLabel, { color: theme.text }]}>Color</Text>
          <View style={[styles.colorPreview, { backgroundColor: color }]} />
          <Icon name="chevron-right" size={24} color={theme.subtleText} />
        </TouchableOpacity>

        {/* Target Completion Date */}
        <View style={[styles.settingItem, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>
            Target Completion Date (YYYY-MM-DD)
          </Text>
          <TextInput
            style={[
              styles.textInput,
              { color: theme.text, borderBottomColor: theme.subtleText },
            ]}
            value={targetCompletionDate}
            onChangeText={setTargetCompletionDate}
            placeholder="Optional: YYYY-MM-DD"
            placeholderTextColor={theme.subtleText}
          />
        </View>

        {/* Save */}
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: theme.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.editButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  headerRightPlaceholder: { width: 24 },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  iconDisplayContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  habitIconContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  textInput: {
    fontSize: 16,
    paddingVertical: 5,
    borderBottomWidth: 1,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
  },
  editButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditHabitDetailScreen;

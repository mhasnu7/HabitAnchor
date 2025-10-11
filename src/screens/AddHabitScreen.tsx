import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useHabitStore } from '../store/habits';

const colors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981',
  '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#ec4899', '#f43f5e',
];

const icons = [
  'american-football', 'basketball', 'beer', 'bicycle', 'book', 'build', 'cafe', 'camera',
  'car-sport', 'cloudy', 'desktop', 'fast-food', 'fitness', 'football', 'game-controller',
  'headset', 'heart', 'home', 'ice-cream', 'leaf', 'logo-bitcoin', 'musical-notes',
  'paw', 'pencil', 'pizza', 'rainy', 'school', 'star', 'sunny', 'walk', 'water',
];

const AddHabitScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedIcon, setSelectedIcon] = useState(icons[0]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const addHabit = useHabitStore(state => state.addHabit);

  const handleSave = () => {
    addHabit({
      name,
      subtitle: description,
      color: selectedColor,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>New Habit</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.label}>Icon</Text>
          <View style={styles.selectedIconContainer}>
            <Icon name={selectedIcon} size={48} color="#fff" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {icons.map(icon => (
              <TouchableOpacity key={icon} onPress={() => setSelectedIcon(icon)}>
                <Icon name={icon} size={32} color={selectedIcon === icon ? '#fff' : '#888'} style={styles.icon} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Read a book"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. For 30 minutes"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Color</Text>
          <View style={styles.colorGrid}>
            {colors.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCell,
                  { backgroundColor: color, borderColor: selectedColor === color ? '#fff' : color },
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.advancedButton}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Text style={styles.advancedText}>Advanced Options</Text>
          <Icon name={showAdvanced ? 'chevron-up' : 'chevron-down'} size={24} color="#fff" />
        </TouchableOpacity>

        {showAdvanced && (
          <View style={styles.advancedContent}>
            {/* Add advanced options here */}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  selectedIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    marginHorizontal: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorCell: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 8,
  },
  advancedButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  advancedText: {
    color: '#fff',
    fontSize: 16,
  },
  advancedContent: {
    // Styles for advanced options
  },
  saveButton: {
    backgroundColor: '#8a2be2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddHabitScreen;
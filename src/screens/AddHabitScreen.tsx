import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  LayoutChangeEvent,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useHabitStore } from '../store/habits';
import { RootStackParamList } from '../../App'; // Import RootStackParamList
 
type AddHabitScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddHabit'>;
type AddHabitScreenRouteProp = RouteProp<RootStackParamList, 'AddHabit'>;
 
const colors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981',
  '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#ec4899', '#f43f5e',
];
 
const AddHabitScreen = () => {
  const navigation = useNavigation<AddHabitScreenNavigationProp>();
  const route = useRoute<AddHabitScreenRouteProp>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedIcon, setSelectedIcon] = useState('american-football'); // Default icon
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const addHabit = useHabitStore(state => state.addHabit);
 
  // Effect to update selectedIcon if passed from IconPickerScreen
  React.useEffect(() => {
    if (route.params?.selectedIcon) {
      setSelectedIcon(route.params.selectedIcon);
    }
  }, [route.params?.selectedIcon]);


  const handleSave = () => {
    addHabit({
      name,
      subtitle: description,
      color: selectedColor,
      icon: selectedIcon,
      streakGoal: 'None', // Default value
      reminders: 0, // Default value
      categories: [], // Default value
      completionTracking: 'Step by Step', // Default value
      completionsPerDay: 1, // Default value
    });
    navigation.goBack();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
              <TouchableOpacity
                style={styles.selectedIconContainer}
                onPress={() => navigation.navigate('IconPicker', {
                  onSelectIcon: (icon: string) => {
                    navigation.setParams({ selectedIcon: icon });
                  },
                })}
              >
                <Icon name={selectedIcon} size={48} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Read a book"
                placeholderTextColor="#888"
                autoCorrect={false}
                spellCheck={false}
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
                autoCorrect={false}
                spellCheck={false}
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

          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
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
  completionTrackingOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  completionTrackingButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#222',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  completionTrackingButtonActive: {
    backgroundColor: '#8a2be2',
  },
  completionTrackingButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  completionTrackingDescription: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  completionsPerDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  completionsPerDayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  completionsPerDayButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  completionsPerDayInput: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
    minWidth: 40,
    textAlign: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 5,
  },
  completionsPerDayUnit: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  completionsPerDayEditButton: {
    padding: 8,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#8a2be2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddHabitScreen;
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
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useHabitStore } from '../store/habits';
import { RootStackParamList } from '../../App'; // Import RootStackParamList
import { useTheme } from '../context/ThemeContext';
 
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
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ef4444'); // Default color
  const [selectedIcon, setSelectedIcon] = useState('help-circle-outline'); // Default icon
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [targetCompletionDate, setTargetCompletionDate] = useState<Date | undefined>(undefined);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const addHabit = useHabitStore(state => state.addHabit);
 
  // Effect to update selectedIcon if passed from IconPickerScreen
  React.useEffect(() => {
    if (route.params?.selectedIcon) {
      setSelectedIcon(route.params.selectedIcon);
    }
  }, [route.params?.selectedIcon]);

  React.useEffect(() => {
    if (route.params?.selectedColor) {
      setSelectedColor(route.params.selectedColor);
    }
  }, [route.params?.selectedColor]);
 
 
  const handleSave = () => {
    if (name.trim() !== '') {
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
        targetCompletionDate: targetCompletionDate ? format(targetCompletionDate, 'yyyy-MM-dd') : undefined,
      });
      navigation.goBack();
    }
  };
 
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color={theme.text} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.title, { color: '#22c55e' }]}>Add </Text>
              <Text style={[styles.title, { color: '#3b82f6' }]}>Habit</Text>
            </View>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView>
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.text }]}>Habit Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter Habit Name"
                placeholderTextColor={theme.text}
                autoCorrect={false}
                spellCheck={false}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.text }]}>Habit Description</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter Habit Detail"
                placeholderTextColor={theme.text}
                autoCorrect={false}
                spellCheck={false}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.text }]}>Target Completion Date (Optional)</Text>
              <TouchableOpacity
                style={[styles.datePickerButton, { backgroundColor: theme.cardBackground }]}
                onPress={() => setIsDatePickerVisible(true)}
              >
                <Text style={[styles.datePickerButtonText, { color: theme.text }]}>
                  {targetCompletionDate ? format(targetCompletionDate, 'PPP') : 'Click to Select date'}
                </Text>
                {targetCompletionDate && (
                  <TouchableOpacity onPress={() => setTargetCompletionDate(undefined)} style={styles.clearDateButton}>
                    <Icon name="close-circle" size={20} color={theme.subtleText} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
              <DatePicker
                modal
                open={isDatePickerVisible}
                date={targetCompletionDate || new Date()}
                mode="date"
                minimumDate={new Date(new Date().setDate(new Date().getDate() + 1))} // Future dates only, excluding today
                onConfirm={(date) => {
                  setIsDatePickerVisible(false);
                  setTargetCompletionDate(date);
                }}
                onCancel={() => {
                  setIsDatePickerVisible(false);
                }}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.text }]}>Color</Text>
              <TouchableOpacity
                style={[styles.colorPickerButton, { backgroundColor: selectedColor }]}
                onPress={() => navigation.navigate('ColorPicker', {
                  onSelectColor: (color: string) => {
                    navigation.setParams({ selectedColor: color });
                  },
                })}
              >
                <Text style={styles.colorPickerButtonText}>Click here to select color</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <View style={styles.iconSelectionContainer}>
                <Text style={[styles.label, styles.iconSelectionText, { color: theme.text }]}>Click on the icon to select different icons from the list</Text>
                <TouchableOpacity
                  style={[styles.selectedIconContainer, { backgroundColor: theme.cardBackground }]}
                  onPress={() => navigation.navigate('IconPicker', {
                    onSelectIcon: (icon: string) => {
                      navigation.setParams({ selectedIcon: icon });
                    },
                  })}
                >
                  <Icon name={selectedIcon} size={48} color={theme.text} />
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: name.trim() === '' ? theme.subtleText : '#3b82f6' }]}
            onPress={handleSave}
            disabled={name.trim() === ''}
          >
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center', // Center align the label
  },
  input: {
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  iconSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconSelectionText: {
    fontSize: 14, // Increased font size
    flex: 1, // Allow text to take up available space
    marginRight: 10, // Add some space between text and icon
  },
  selectedIconContainer: {
    borderRadius: 8,
    padding: 16,
  },
  icon: {
    marginHorizontal: 8,
  },
  colorPickerButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  colorPickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerButtonText: {
    fontSize: 16,
  },
  clearDateButton: {
    padding: 5,
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
    alignItems: 'center',
    marginHorizontal: 4,
  },
  completionTrackingButtonActive: {
    backgroundColor: '#8a2be2',
  },
  completionTrackingButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  completionTrackingDescription: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  completionsPerDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  completionsPerDayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  completionsPerDayButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completionsPerDayInput: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
    minWidth: 40,
    textAlign: 'center',
    borderRadius: 8,
    paddingVertical: 5,
  },
  completionsPerDayUnit: {
    fontSize: 16,
    marginRight: 10,
  },
  completionsPerDayEditButton: {
    padding: 8,
    borderRadius: 8,
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 2,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddHabitScreen;
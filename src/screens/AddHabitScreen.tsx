import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
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
import { RootStackParamList } from '../../App';
import { useTheme } from '../context/ThemeContext';

const isEmoji = (str: string) => /\p{Emoji}/u.test(str); // ✅ Emoji detection

type AddHabitScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AddHabit'
>;
type AddHabitScreenRouteProp = RouteProp<RootStackParamList, 'AddHabit'>;

const MAX_LENGTH = 20;

const AddHabitScreen = () => {
  const navigation = useNavigation<AddHabitScreenNavigationProp>();
  const route = useRoute<AddHabitScreenRouteProp>();
  const { theme } = useTheme();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#a01e5a');
  const [selectedIcon, setSelectedIcon] = useState('bike');
  const [targetCompletionDate, setTargetCompletionDate] = useState<
    Date | undefined
  >(undefined);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const addHabit = useHabitStore(state => state.addHabit);

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
        streakGoal: 'None',
        reminders: 0,
        categories: [],
        completionTracking: 'Step by Step',
        completionsPerDay: 1,
        targetCompletionDate: targetCompletionDate
          ? format(targetCompletionDate, 'yyyy-MM-dd')
          : undefined,
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

          {/* Header */}
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

            {/* Habit Name */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.text }]}>
                Habit Name *
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.cardBackground,
                    color: theme.text,
                    fontWeight: '400',
                    fontStyle: 'italic',
                  },
                ]}
                value={name}
                onChangeText={text => setName(text)}
                placeholder="Enter Habit Name"
                placeholderTextColor={'#aaaaaa'}
                autoCorrect={false}
                spellCheck={false}
                maxLength={MAX_LENGTH}
              />

              <Text style={[styles.charCount, { color: theme.subtleText }]}>
                {name.length}/{MAX_LENGTH}
              </Text>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.text }]}>
                Habit Description
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.cardBackground,
                    color: theme.text,
                    fontWeight: '400',
                    fontStyle: 'italic',
                  },
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter Habit Detail"
                placeholderTextColor={'#aaaaaa'}
                autoCorrect={false}
                spellCheck={false}
              />
            </View>

            {/* Target Date */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.text }]}>
                Target Completion Date (Optional)
              </Text>

              <TouchableOpacity
                style={[
                  styles.datePickerButton,
                  { backgroundColor: theme.cardBackground },
                ]}
                onPress={() => setIsDatePickerVisible(true)}
              >
                <Text
                  style={[styles.datePickerButtonText, { color: theme.text }]}
                >
                  {targetCompletionDate
                    ? format(targetCompletionDate, 'PPP')
                    : 'Click to Select date'}
                </Text>

                {targetCompletionDate && (
                  <TouchableOpacity
                    onPress={() => setTargetCompletionDate(undefined)}
                    style={styles.clearDateButton}
                  >
                    <Icon
                      name="close-circle"
                      size={20}
                      color={theme.subtleText}
                    />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              <DatePicker
                modal
                open={isDatePickerVisible}
                date={targetCompletionDate || new Date()}
                mode="date"
                minimumDate={
                  new Date(new Date().setDate(new Date().getDate() + 1))
                }
                onConfirm={date => {
                  setIsDatePickerVisible(false);
                  setTargetCompletionDate(date);
                }}
                onCancel={() => setIsDatePickerVisible(false)}
              />
            </View>

            {/* Color Picker */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.text }]}>Color</Text>

              <TouchableOpacity
                style={[
                  styles.colorPickerButton,
                  { backgroundColor: selectedColor },
                ]}
                onPress={() =>
                  navigation.navigate('ColorPicker', {
                    onSelectColor: (color: string) => {
                      navigation.setParams({ selectedColor: color });
                    },
                  })
                }
              >
                <Text style={styles.colorPickerButtonText}>
                  Click here to select color
                </Text>
              </TouchableOpacity>
            </View>

            {/* Icon Picker */}
            <View style={styles.section}>
              <View style={styles.iconSelectionContainer}>
                <Text
                  style={[
                    styles.label,
                    styles.iconSelectionText,
                    { color: theme.text },
                  ]}
                >
                  Click on the Icon to select from the list
                </Text>

                <TouchableOpacity
                  style={[
                    styles.selectedIconContainer,
                    { backgroundColor: theme.cardBackground },
                  ]}
                  onPress={() =>
                    navigation.navigate('IconPicker', {
                      onSelectIcon: (icon: string) => {
                        navigation.setParams({ selectedIcon: icon });
                      },
                    })
                  }
                >
                  {/* ⭐ FIXED: Show emoji OR icon */}
                  {isEmoji(selectedIcon) ? (
                    <Text style={{ fontSize: 48 }}>{selectedIcon}</Text>
                  ) : (
                    <Icon name={selectedIcon} size={48} color={theme.text} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                backgroundColor:
                  name.trim() === '' ? theme.subtleText : '#3b82f6',
              },
            ]}
            disabled={name.trim() === ''}
            onPress={handleSave}
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
    textAlign: 'center',
  },
  input: {
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  charCount: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'right',
  },
  iconSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconSelectionText: {
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  selectedIconContainer: {
    borderRadius: 8,
    padding: 16,
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

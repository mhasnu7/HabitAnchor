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
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useHabitStore } from '../store/habits';
import CategorySelectionModal from '../components/CategorySelectionModal';

type RootStackParamList = {
  Home: undefined;
  AddHabit: undefined;
};

type AddHabitScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddHabit'>;

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

const AddHabitScreen = () => {
  const navigation = useNavigation<AddHabitScreenNavigationProp>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedIcon, setSelectedIcon] = useState(icons[0]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [streakGoal, setStreakGoal] = useState('None');
  const [reminders, setReminders] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [completionTracking, setCompletionTracking] = useState('Step by Step');
  const [completionsPerDay, setCompletionsPerDay] = useState(1);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const addHabit = useHabitStore(state => state.addHabit);

  const advancedOptionsHeight = useSharedValue(0);
  const advancedOptionsOpacity = useSharedValue(0);
  const advancedContentMaxHeight = useSharedValue(-1); // Initialize with -1 to indicate not measured yet

  const onAdvancedContentLayout = useCallback((event: LayoutChangeEvent) => {
    // Only set the max height once
    if (advancedContentMaxHeight.value === -1) {
      advancedContentMaxHeight.value = event.nativeEvent.layout.height;
    }
  }, [advancedContentMaxHeight]);

  const animatedAdvancedOptionsStyle = useAnimatedStyle(() => {
    return {
      height: advancedOptionsHeight.value,
      opacity: advancedOptionsOpacity.value,
      // Ensure content is visible when expanded
      display: advancedOptionsHeight.value === 0 ? 'none' : 'flex',
    };
  });

  const toggleAdvancedOptions = () => {
    setShowAdvanced((prev: boolean) => {
      if (prev) {
        advancedOptionsHeight.value = withTiming(0, { duration: 300 });
        advancedOptionsOpacity.value = withTiming(0, { duration: 200 });
      } else {
        // If max height hasn't been measured, set a temporary large value
        // and then adjust after layout. This is a common pattern for
        // expand/collapse animations where content height is dynamic.
        advancedOptionsHeight.value = withTiming(advancedContentMaxHeight.value === -1 ? 500 : advancedContentMaxHeight.value, { duration: 300 });
        advancedOptionsOpacity.value = withTiming(1, { duration: 400 });
      }
      return !prev;
    });
  };

  const handleSave = () => {
    addHabit({
      name,
      subtitle: description,
      color: selectedColor,
      icon: selectedIcon,
      streakGoal,
      reminders,
      categories: selectedCategories,
      completionTracking,
      completionsPerDay,
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

            <TouchableOpacity
              style={styles.advancedButton}
              onPress={toggleAdvancedOptions}
            >
              <Text style={styles.advancedText}>Advanced Options</Text>
              <Icon name={showAdvanced ? 'chevron-up' : 'chevron-down'} size={24} color="#fff" />
            </TouchableOpacity>

            <Animated.View
              style={[styles.advancedContent, animatedAdvancedOptionsStyle]}
              onLayout={onAdvancedContentLayout}
            >
              <View style={styles.advancedOptionItem}>
                <Text style={styles.label}>Streak Goal</Text>
                <TouchableOpacity style={styles.advancedOptionValueContainer}>
                  <Text style={styles.advancedOptionValue}>{streakGoal}</Text>
                  <Icon name="chevron-forward" size={20} color="#888" />
                </TouchableOpacity>
              </View>

              <View style={styles.advancedOptionItem}>
                <Text style={styles.label}>Reminder</Text>
                <TouchableOpacity style={styles.advancedOptionValueContainer}>
                  <Text style={styles.advancedOptionValue}>{reminders} Active Reminders</Text>
                  <Icon name="chevron-forward" size={20} color="#888" />
                </TouchableOpacity>
              </View>

              <View style={styles.advancedOptionItem}>
                <Text style={styles.label}>Categories</Text>
                <TouchableOpacity
                  style={styles.advancedOptionValueContainer}
                  onPress={() => setIsCategoryModalVisible(true)}
                >
                  <Text style={styles.advancedOptionValue}>{selectedCategories.length > 0 ? selectedCategories.join(', ') : 'None'}</Text>
                  <Icon name="chevron-forward" size={20} color="#888" />
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>How should completions be tracked?</Text>
                <View style={styles.completionTrackingOptions}>
                  <TouchableOpacity
                    style={[
                      styles.completionTrackingButton,
                      completionTracking === 'Step by Step' && styles.completionTrackingButtonActive,
                    ]}
                    onPress={() => setCompletionTracking('Step by Step')}
                  >
                    <Text style={styles.completionTrackingButtonText}>Step By Step</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.completionTrackingButton,
                      completionTracking === 'Custom Value' && styles.completionTrackingButtonActive,
                    ]}
                    onPress={() => setCompletionTracking('Custom Value')}
                  >
                    <Text style={styles.completionTrackingButtonText}>Custom Value</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.completionTrackingDescription}>
                  {completionTracking === 'Step by Step'
                    ? 'Increment by 1 with each completion'
                    : 'Enter a custom value for each completion'}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Completions Per Day</Text>
                <View style={styles.completionsPerDayContainer}>
                  <TouchableOpacity
                    style={styles.completionsPerDayButton}
                    onPress={() => setCompletionsPerDay(Math.max(1, completionsPerDay - 1))}
                  >
                    <Text style={styles.completionsPerDayButtonText}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.completionsPerDayInput}
                    value={String(completionsPerDay)}
                    onChangeText={(text) => setCompletionsPerDay(Number(text) || 1)}
                    keyboardType="numeric"
                  />
                  <Text style={styles.completionsPerDayUnit}>/ Day</Text>
                  <TouchableOpacity
                    style={styles.completionsPerDayButton}
                    onPress={() => setCompletionsPerDay(completionsPerDay + 1)}
                  >
                    <Text style={styles.completionsPerDayButtonText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.completionsPerDayEditButton}>
                    <Icon name="pencil" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.completionTrackingDescription}>
                  The square will be filled completely when this number is met
                </Text>
              </View>
            </Animated.View>
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
    marginTop: 16,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  },
  advancedOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  advancedOptionValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  advancedOptionValue: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
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
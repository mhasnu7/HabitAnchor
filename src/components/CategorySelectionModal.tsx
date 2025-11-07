import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SNAP_POINTS = [0, SCREEN_HEIGHT * 0.8]; // Collapsed, ~80% of screen height

const categories = [
  { name: 'Art', icon: 'brush' },
  { name: 'Finances', icon: 'wallet' },
  { name: 'Fitness', icon: 'dumbbell' },
  { name: 'Health', icon: 'heart' },
  { name: 'Nutrition', icon: 'food-apple' },
  { name: 'Social', icon: 'account-group' },
  { name: 'Study', icon: 'book' },
  { name: 'Work', icon: 'briefcase' },
  { name: 'Other', icon: 'dots-horizontal' },
  { name: 'Morning', icon: 'weather-sunny' },
  { name: 'Day', icon: 'weather-cloudy' },
  { name: 'Evening', icon: 'weather-night' },
];

interface CategorySelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (selected: string[]) => void;
  initialSelectedCategories: string[];
}

const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({
  isVisible,
  onClose,
  onSave,
  initialSelectedCategories,
}) => {
  const { theme } = useTheme(); // Use theme context
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialSelectedCategories);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const toggleCategory = useCallback((categoryName: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(cat => cat !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  }, []);

  const handleSave = useCallback(() => {
    onSave(selectedCategories);
    onClose();
  }, [onSave, selectedCategories, onClose]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, -SNAP_POINTS[1]);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT * 0.2) {
        translateY.value = withSpring(0); // Snap to collapsed
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(-SNAP_POINTS[1]); // Snap to expanded
      }
    });

  useMemo(() => {
    if (isVisible) {
      translateY.value = withSpring(-SNAP_POINTS[1]); // Open to half screen
    } else {
      translateY.value = withTiming(0, { duration: 300 }); // Close
    }
  }, [isVisible, translateY]);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.modalContainer, { backgroundColor: theme.cardBackground }, animatedStyle]}>
          <View style={[styles.handleBar, { backgroundColor: theme.subtleText }]} />
          <Text style={[styles.modalTitle, { color: theme.text }]}>Categories</Text>
          <Text style={[styles.modalSubtitle, { color: theme.subtleText }]}>Pick one or multiple categories that your habit fits in</Text>

          <ScrollView contentContainerStyle={styles.chipsContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.chip,
                  { backgroundColor: theme.cardBackground },
                  selectedCategories.includes(category.name) && { backgroundColor: theme.primary },
                ]}
                onPress={() => toggleCategory(category.name)}
              >
                {category.icon && <Icon name={category.icon} size={16} color={selectedCategories.includes(category.name) ? theme.background : theme.text} style={styles.chipIcon} />}
                <Text style={[styles.chipText, { color: theme.text }, selectedCategories.includes(category.name) && { color: theme.background }]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.createOwnChip, { backgroundColor: theme.cardBackground, borderColor: theme.subtleText }]}>
              <Icon name="plus" size={16} color={theme.text} style={styles.chipIcon} />
              <Text style={[styles.chipText, { color: theme.text }]}>Create your own</Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={handleSave}>
            <Text style={[styles.saveButtonText, { color: theme.background }]}>Save</Text>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    height: SCREEN_HEIGHT * 0.8, // Make it take up more screen height
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingBottom: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedChip: {
  },
  chipIcon: {
    marginRight: 5,
  },
  chipText: {
    fontSize: 14,
  },
  selectedChipText: {
  },
  createOwnChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto', // Pushes the button to the bottom
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CategorySelectionModal;
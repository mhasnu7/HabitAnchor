import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SNAP_POINTS = [0, SCREEN_HEIGHT * 0.8]; // Collapsed, ~80% of screen height

const categories = [
  { name: 'Art', icon: 'brush' },
  { name: 'Finances', icon: 'wallet' },
  { name: 'Fitness', icon: 'fitness' },
  { name: 'Health', icon: 'heart' },
  { name: 'Nutrition', icon: 'nutrition' },
  { name: 'Social', icon: 'people' },
  { name: 'Study', icon: 'book' },
  { name: 'Work', icon: 'briefcase' },
  { name: 'Other', icon: 'ellipsis-horizontal' },
  { name: 'Morning', icon: 'sunny' },
  { name: 'Day', icon: 'cloudy' },
  { name: 'Evening', icon: 'moon' },
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
        <Animated.View style={[styles.modalContainer, animatedStyle]}>
          <View style={styles.handleBar} />
          <Text style={styles.modalTitle}>Categories</Text>
          <Text style={styles.modalSubtitle}>Pick one or multiple categories that your habit fits in</Text>

          <ScrollView contentContainerStyle={styles.chipsContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.chip,
                  selectedCategories.includes(category.name) && styles.selectedChip,
                ]}
                onPress={() => toggleCategory(category.name)}
              >
                {category.icon && <Icon name={category.icon} size={16} color={selectedCategories.includes(category.name) ? '#111' : '#fff'} style={styles.chipIcon} />}
                <Text style={[styles.chipText, selectedCategories.includes(category.name) && styles.selectedChipText]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.createOwnChip}>
              <Icon name="add" size={16} color="#fff" style={styles.chipIcon} />
              <Text style={styles.chipText}>Create your own</Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
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
    backgroundColor: '#1a1a1a',
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
    backgroundColor: '#444',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalSubtitle: {
    color: '#888',
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
    backgroundColor: '#222',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedChip: {
    backgroundColor: '#8a2be2',
  },
  chipIcon: {
    marginRight: 5,
  },
  chipText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedChipText: {
    color: '#111',
  },
  createOwnChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#555',
  },
  saveButton: {
    backgroundColor: '#8a2be2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto', // Pushes the button to the bottom
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CategorySelectionModal;
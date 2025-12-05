import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MiniCalendarGrid from './MiniCalendarGrid';
import { useHabitStore } from '../store/habits';
import { useTheme } from '../context/ThemeContext';
import { SIZES, FONTS } from '../theme/constants';

import { Habit } from '../store/habits';

// ✅ Emoji detection helper
const isEmoji = (str: string) => /\p{Emoji}/u.test(str);

interface HabitCardProps {
  habit: Habit;
  onPress: (habitId: string) => void;
  onDelete: (habitId: string) => void;
  showRestoreButton?: boolean;
  onRestore?: (habitId: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onPress,
  onDelete,
  showRestoreButton,
  onRestore,
}) => {
  const { toggleCompletion } = useHabitStore();
  const { theme } = useTheme();

  const today = new Date()
    .toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, '-');

  const isCompletedToday =
    habit?.progress.find((d) => d.date === today)?.completed ?? false;

  const handleCheck = () => toggleCompletion(habit.id, today);
  const handlePress = () => onPress(habit.id);
  const handleDelete = () => onDelete(habit.id);
  const handleRestore = () => onRestore && onRestore(habit.id);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, { backgroundColor: theme.cardBackground }]}
    >
      <View style={styles.header}>
        
        {/* 🟪 FIX: Icon OR Emoji */}
        <View style={[styles.iconContainer, { backgroundColor: habit.color }]}>
          {isEmoji(habit.icon) ? (
            <Text style={{ fontSize: SIZES.icon, color: '#fff' }}>
              {habit.icon}
            </Text>
          ) : (
            <Icon name={habit.icon} size={SIZES.icon} color="#fff" />
          )}
        </View>

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.name,
              { color: theme.text, fontFamily: FONTS.heading },
            ]}
          >
            {habit.name}
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.subtleText, fontFamily: FONTS.body },
            ]}
          >
            {habit.subtitle}
          </Text>
        </View>

        {/* ✔ FIXED CHECK BUTTON COLOR LOGIC */}
        {!showRestoreButton && (
          <TouchableOpacity
            style={[
              styles.checkButton,
              {
                backgroundColor: isCompletedToday
                  ? habit.color      // Completed → colored circle
                  : '#fff',          // Not completed → white circle
              },
            ]}
            onPress={handleCheck}
          >
            <Icon
              name="check"
              size={SIZES.icon - 4}
              color={isCompletedToday ? '#fff' : '#000'} 
              // ✔ White tick on colored circle
              // ✔ Black tick on white circle
            />
          </TouchableOpacity>
        )}

        {showRestoreButton && onRestore && (
          <TouchableOpacity
            style={[styles.restoreButton, { backgroundColor: habit.color }]}
            onPress={handleRestore}
          >
            <Icon name="restore" size={SIZES.icon - 4} color="#fff" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: habit.color }]}
          onPress={handleDelete}
        >
          <Icon name="delete" size={SIZES.icon - 4} color="#fff" />
        </TouchableOpacity>
      </View>

      <MiniCalendarGrid habitId={habit.id} color={habit.color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 5,
    marginBottom: 4,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconContainer: {
    width: SIZES.circularBox,
    height: SIZES.circularBox,
    borderRadius: SIZES.circularBox / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
  },
  checkButton: {
    width: SIZES.icon + 12,
    height: SIZES.icon + 12,
    borderRadius: (SIZES.icon + 12) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  deleteButton: {
    width: SIZES.icon + 12,
    height: SIZES.icon + 12,
    borderRadius: (SIZES.icon + 12) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  restoreButton: {
    width: SIZES.icon + 12,
    height: SIZES.icon + 12,
    borderRadius: (SIZES.icon + 12) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default HabitCard;

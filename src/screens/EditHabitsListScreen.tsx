import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHabitStore, Habit } from '../store/habits';
import { useTheme } from '../context/ThemeContext';

// Define RootStackParamList locally
type RootStackParamList = {
  Menu: undefined;
  EditHabitsList: undefined;
  EditHabitDetail: { habitId: string };
};

// Detect emoji (Unicode)
const isEmoji = (value: string) => /\p{Emoji}/u.test(value);

// Animated row component for habits
const AnimatedHabitRow = ({
  habit,
  index,
  navigation,
  theme,
  animatedValues,
}: {
  habit: Habit;
  index: number;
  navigation: any;
  theme: any;
  animatedValues: any;
}) => {
  return (
    <Animated.View
      style={{
        opacity: animatedValues[index].opacity,
        transform: [{ translateY: animatedValues[index].translateY }],
      }}
    >
      <TouchableOpacity
        style={[styles.listItem, { backgroundColor: theme.cardBackground }]}
        onPress={() =>
          navigation.navigate('EditHabitDetail', { habitId: habit.id })
        }
      >
        <View style={styles.leftContent}>
          <Text style={[styles.indexText, { color: theme.subtleText }]}>
            {index + 1}.
          </Text>

          <View
            style={[
              styles.habitIconContainer,
              { backgroundColor: habit.color, borderRadius: 14 },
            ]}
          >
            {isEmoji(habit.icon) ? (
              <Text style={styles.emoji}>{habit.icon}</Text>
            ) : (
              <Icon name={habit.icon} size={20} color="#fff" />
            )}
          </View>

          <Text style={[styles.habitName, { color: theme.text }]}>
            {habit.name}
          </Text>
        </View>

        <Icon name="chevron-right" size={24} color={theme.subtleText} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const EditHabitsListScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'EditHabitsList'>['navigation']) => {
  const { habits } = useHabitStore();
  const { theme } = useTheme();

  // Prepare animation values — one per row
  const animatedValues = useRef(
    habits.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(-20),
    }))
  ).current;

  useEffect(() => {
    const animations = habits.map((_, index) =>
      Animated.parallel([
        Animated.timing(animatedValues[index].opacity, {
          toValue: 1,
          duration: 350,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[index].translateY, {
          toValue: 0,
          duration: 350,
          delay: index * 100,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(80, animations).start();
  }, [habits]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>Edit Habits</Text>

        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* HABIT LIST */}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <AnimatedHabitRow
            habit={item}
            index={index}
            navigation={navigation}
            theme={theme}
            animatedValues={animatedValues}
          />
        )}
      />
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
  title: { fontSize: 20, fontWeight: 'bold' },
  headerRightPlaceholder: { width: 24 },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indexText: {
    fontSize: 16,
    marginRight: 10,
  },
  habitIconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  emoji: {
    fontSize: 20,
    color: '#fff',
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EditHabitsListScreen;

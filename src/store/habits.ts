import { create } from 'zustand';
import { generateLastNDays } from '../utils/date';

interface DayProgress {
  date: string;
  completed: boolean;
}

interface Habit {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  icon: string;
  streakGoal: string;
  reminders: number;
  categories: string[];
  completionTracking: string;
  completionsPerDay: number;
  progress: DayProgress[];
}

interface HabitState {
  habits: Habit[];
  toggleCompletion: (habitId: string, date: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'progress'>) => void;
}

export const useHabitStore = create<HabitState>((set) => ({
  habits: [
    {
      id: '1',
      name: 'Learn',
      subtitle: 'Learning',
      color: '#4ade80',
      icon: 'book',
      streakGoal: 'None',
      reminders: 0,
      categories: ['Study'],
      completionTracking: 'Step by Step',
      completionsPerDay: 1,
      progress: generateLastNDays(90),
    },
    {
      id: '2',
      name: 'Workout',
      subtitle: 'Gym',
      color: '#ef4444',
      icon: 'fitness',
      streakGoal: 'None',
      reminders: 0,
      categories: ['Fitness'],
      completionTracking: 'Step by Step',
      completionsPerDay: 1,
      progress: generateLastNDays(90),
    },
  ],
  toggleCompletion: (habitId, date) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              progress: h.progress.map((d) =>
                d.date === date ? { ...d, completed: !d.completed } : d
              ),
            }
          : h
      ),
    })),
  addHabit: (habit) =>
    set((state) => ({
      habits: [
        ...state.habits,
        {
          ...habit,
          id: Math.random().toString(),
          progress: generateLastNDays(90),
        },
      ],
    })),
}));
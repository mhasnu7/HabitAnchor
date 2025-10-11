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
      progress: generateLastNDays(90),
    },
    {
      id: '2',
      name: 'Workout',
      subtitle: 'Gym',
      color: '#ef4444',
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
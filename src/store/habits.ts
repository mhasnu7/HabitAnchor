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
  deleteHabit: (habitId: string) => void;
}

export const useHabitStore = create<HabitState>((set) => ({
  habits: [],
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
  deleteHabit: (habitId) =>
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== habitId),
    })),
}));
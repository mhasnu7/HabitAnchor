import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  targetCompletionDate?: string; // Optional target completion date
}

interface HabitState {
  habits: Habit[];
  weekStartsOnMonday: boolean;
  highlightCurrentDay: boolean;
  showAnalytics: boolean;
  toggleCompletion: (habitId: string, date: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'progress'>) => void;
  deleteHabit: (habitId: string) => void;
  toggleWeekStartsOnMonday: () => void;
  toggleHighlightCurrentDay: () => void;
  toggleShowAnalytics: () => void;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],
      weekStartsOnMonday: false,
      highlightCurrentDay: true,
      showAnalytics: true,
      toggleCompletion: (habitId, date) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id === habitId) {
              let updatedProgress = h.progress;
              const dateExists = h.progress.some(d => d.date === date);

              if (!dateExists) {
                updatedProgress = [...h.progress, { date, completed: true }];
              } else {
                updatedProgress = h.progress.map((d) =>
                  d.date === date ? { ...d, completed: !d.completed } : d
                );
              }
              return { ...h, progress: updatedProgress };
            }
            return h;
          }),
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
      toggleWeekStartsOnMonday: () => set((state) => ({ weekStartsOnMonday: !state.weekStartsOnMonday })),
      toggleHighlightCurrentDay: () => set((state) => ({ highlightCurrentDay: !state.highlightCurrentDay })),
      toggleShowAnalytics: () => set((state) => ({ showAnalytics: !state.showAnalytics })),
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
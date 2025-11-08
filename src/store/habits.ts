import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateLastNDays } from '../utils/date';

export interface DayProgress {
  date: string;
  completed: boolean;
}

export interface Habit {
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
  archivedAt?: string; // Timestamp when the habit was archived
}

interface HabitState {
  habits: Habit[];
  archivedHabits: Habit[]; // New state for archived habits
  weekStartsOnMonday: boolean;
  highlightCurrentDay: boolean;
  showAnalytics: boolean;
  toggleCompletion: (habitId: string, date: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'progress'>) => void;
  editHabit: (habitId: string, updatedFields: Partial<Habit>) => void;
  archiveHabit: (habitId: string) => void; // New function to archive a habit
  restoreHabit: (habitId: string) => void; // New function to restore a habit
  permanentlyDeleteHabit: (habitId: string) => void; // New function for permanent deletion
  toggleWeekStartsOnMonday: () => void;
  toggleHighlightCurrentDay: () => void;
  toggleShowAnalytics: () => void;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],
      archivedHabits: [], // Initialize archived habits
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
      editHabit: (habitId, updatedFields) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === habitId ? { ...h, ...updatedFields } : h
          ),
        })),
      archiveHabit: (habitId) =>
        set((state) => {
          const habitToArchive = state.habits.find((h) => h.id === habitId);
          if (habitToArchive) {
            return {
              habits: state.habits.filter((h) => h.id !== habitId),
              archivedHabits: [...state.archivedHabits, { ...habitToArchive, archivedAt: new Date().toISOString() }],
            };
          }
          return state;
        }),
      restoreHabit: (habitId) =>
        set((state) => {
          const habitToRestore = state.archivedHabits.find((h) => h.id === habitId);
          if (habitToRestore) {
            const { archivedAt, ...rest } = habitToRestore; // Remove archivedAt
            return {
              habits: [...state.habits, rest],
              archivedHabits: state.archivedHabits.filter((h) => h.id !== habitId),
            };
          }
          return state;
        }),
      permanentlyDeleteHabit: (habitId) =>
        set((state) => ({
          archivedHabits: state.archivedHabits.filter((h) => h.id !== habitId),
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
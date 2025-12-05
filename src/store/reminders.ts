import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  scheduleDailyReminder,
  cancelDailyReminder,
} from '../utils/notifications';

// Types
export type ReminderRepeat = 'DAILY' | 'WEEKDAYS' | 'WEEKENDS';

export interface Reminder {
  id: string;
  timeISO: string;
  enabled: boolean;
  repeat: ReminderRepeat;
  sound: string; // new field
}

interface ReminderStore {
  reminders: Reminder[];

  loadReminders: () => Promise<void>;
  addReminder: (date: Date, sound: string) => Promise<void>;
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  toggleReminder: (id: string) => Promise<void>;
}

const STORAGE_KEY = 'habit_reminders_v1';

// Zustand Store
export const useReminderStore = create<ReminderStore>((set, get) => ({
  reminders: [],

  // Load from storage
  loadReminders: async () => {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) {
      set({ reminders: JSON.parse(saved) });
    }
  },

  // Add a new reminder
  addReminder: async (date, sound) => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      timeISO: date.toISOString(),
      enabled: true,
      repeat: 'DAILY',
      sound, // store the tone
    };

    const updated = [...get().reminders, newReminder];
    set({ reminders: updated });

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // schedule notification
    scheduleDailyReminder(date, sound);
  },

  // Update reminder fields (time, sound, repeat, enabled)
  updateReminder: async (id, updates) => {
    const updated = get().reminders.map(r =>
      r.id === id ? { ...r, ...updates } : r
    );

    set({ reminders: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const target = updated.find(r => r.id === id);
    if (!target) return;

    if (target.enabled) {
      scheduleDailyReminder(new Date(target.timeISO), target.sound);
    }
  },

  // Delete a reminder
  deleteReminder: async id => {
    const updated = get().reminders.filter(r => r.id !== id);
    set({ reminders: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    cancelDailyReminder(); // optional — only cancels if using single reminder
  },

  // Toggle on/off
  toggleReminder: async id => {
    const updated = get().reminders.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );

    set({ reminders: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const target = updated.find(r => r.id === id);
    if (!target) return;

    if (target.enabled) {
      scheduleDailyReminder(new Date(target.timeISO), target.sound);
    } else {
      cancelDailyReminder();
    }
  },
}));

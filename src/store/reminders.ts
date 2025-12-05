// src/store/reminders.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  scheduleDailyReminder,
  cancelDailyReminder,
} from '../utils/notifications';

const STORAGE_KEY = 'habit_reminders_v1';

// 0 = Sunday ... 6 = Saturday
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Reminder {
  id: string;
  timeISO: string;        // time (date part ignored by scheduler)
  enabled: boolean;
  sound: string;          // 'morning_chime' | 'softbell' | 'default'
  title?: string;         // optional custom label
  repeatDays?: WeekdayIndex[]; // which weekdays this reminder applies to
}

interface ReminderStore {
  reminders: Reminder[];

  loadReminders: () => Promise<void>;
  addReminder: (
    date: Date,
    sound: string,
    title?: string,
    repeatDays?: WeekdayIndex[],
  ) => Promise<void>;
  updateReminder: (
    id: string,
    updates: Partial<Reminder>,
  ) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  toggleReminder: (id: string) => Promise<void>;
}

export const useReminderStore = create<ReminderStore>((set, get) => ({
  reminders: [],

  // Load from storage
  loadReminders: async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Reminder[] = JSON.parse(saved);
        set({ reminders: parsed });
      }
    } catch (e) {
      console.error('Error loading reminders', e);
    }
  },

  // Add new reminder
  addReminder: async (date, sound, title, repeatDays) => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      timeISO: date.toISOString(),
      enabled: true,
      sound,
      title: title?.trim() ? title.trim() : undefined,
      repeatDays: repeatDays && repeatDays.length ? repeatDays : undefined,
    };

    const updated = [...get().reminders, newReminder];
    set({ reminders: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // ⚠️ Currently schedules as simple daily alarm.
    // repeatDays are stored for UI / future enhancements.
    scheduleDailyReminder(date, sound);
  },

  // Update existing reminder (time, sound, title, repeatDays, enabled)
  updateReminder: async (id, updates) => {
    const updated = get().reminders.map(r =>
      r.id === id ? { ...r, ...updates } : r,
    );

    set({ reminders: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const target = updated.find(r => r.id === id);
    if (!target) return;

    // Re-schedule if still enabled
    if (target.enabled) {
      scheduleDailyReminder(new Date(target.timeISO), target.sound);
    }
  },

  deleteReminder: async id => {
    const updated = get().reminders.filter(r => r.id !== id);
    set({ reminders: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // For now we just cancel all – simple model: one active alarm at a time
    cancelDailyReminder();
  },

  toggleReminder: async id => {
    const updated = get().reminders.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r,
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

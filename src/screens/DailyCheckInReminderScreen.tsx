// src/screens/DailyCheckInReminderScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Switch,
  TextInput,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../App';
import { useReminderStore } from '../store/reminders';
import { useTheme } from '../context/ThemeContext';
import type { WeekdayIndex } from '../store/reminders';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'DailyCheckInReminder'
>;

const sounds = [
  { id: 'morning_chime', label: 'Morning Chime' },
  { id: 'softbell', label: 'Soft Bell' },
  { id: 'default', label: 'Default Tone' },
];

const WEEKDAYS: { idx: WeekdayIndex; label: string }[] = [
  { idx: 0, label: 'S' }, // Sun
  { idx: 1, label: 'M' },
  { idx: 2, label: 'T' },
  { idx: 3, label: 'W' },
  { idx: 4, label: 'T' },
  { idx: 5, label: 'F' },
  { idx: 6, label: 'S' }, // Sat
];

const DailyCheckInReminderScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();

  const {
    reminders,
    loadReminders,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
  } = useReminderStore();

  // ───── Editor State ─────
  const [editorVisible, setEditorVisible] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSound, setSelectedSound] = useState<string>('default');
  const [title, setTitle] = useState('');
  const [repeatDays, setRepeatDays] = useState<WeekdayIndex[]>([
    0, 1, 2, 3, 4, 5, 6,
  ]); // default = every day

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const openCreateEditor = () => {
    setEditingId(null);
    setSelectedDate(new Date());
    setSelectedSound('default');
    setTitle('');
    setRepeatDays([0, 1, 2, 3, 4, 5, 6]);
    setEditorVisible(true);
    setTimePickerOpen(true);
  };

  const openEditEditor = (id: string) => {
    const r = reminders.find(rem => rem.id === id);
    if (!r) return;

    setEditingId(r.id);
    setSelectedDate(new Date(r.timeISO));
    setSelectedSound(r.sound || 'default');
    setTitle(r.title || '');
    setRepeatDays(
      r.repeatDays && r.repeatDays.length ? r.repeatDays : [0, 1, 2, 3, 4, 5, 6],
    );
    setEditorVisible(true);
    setTimePickerOpen(true);
  };

  const closeEditor = () => {
    setEditorVisible(false);
    setTimePickerOpen(false);
    setEditingId(null);
  };

  const toggleDay = (dayIdx: WeekdayIndex) => {
    setRepeatDays(prev => {
      const exists = prev.includes(dayIdx);
      if (exists) {
        const next = prev.filter(d => d !== dayIdx) as WeekdayIndex[];
        return next.length ? next : prev; // avoid empty selection
      } else {
        return [...prev, dayIdx].sort() as WeekdayIndex[];
      }
    });
  };

  const handleSaveReminder = async () => {
    const trimmedTitle = title.trim();
    const safeDays = repeatDays.length ? repeatDays : [0, 1, 2, 3, 4, 5, 6];

    if (editingId) {
      await updateReminder(editingId, {
        timeISO: selectedDate.toISOString(),
        sound: selectedSound,
        title: trimmedTitle || undefined,
        repeatDays: safeDays,
      });
    } else {
      await addReminder(
        selectedDate,
        selectedSound,
        trimmedTitle || undefined,
        safeDays,
      );
    }

    closeEditor();
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  const labelForDays = (days?: WeekdayIndex[]) => {
    if (!days || days.length === 7) return 'Every day';
    if (days.length === 5 && !days.includes(0) && !days.includes(6)) {
      return 'Weekdays';
    }
    if (days.length === 2 && days.includes(0) && days.includes(6)) {
      return 'Weekends';
    }
    return days
      .sort()
      .map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d])
      .join(', ');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Reminders
        </Text>

        <TouchableOpacity onPress={openCreateEditor}>
          <Icon name="plus-circle" size={26} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {reminders.map(r => (
          <View
            key={r.id}
            style={[styles.card, { backgroundColor: theme.cardBackground }]}
          >
            <TouchableOpacity onPress={() => openEditEditor(r.id)}>
              <Text style={[styles.time, { color: theme.text }]}>
                {formatTime(r.timeISO)}
              </Text>
              {r.title ? (
                <Text
                  style={[styles.titleLabel, { color: theme.subtleText }]}
                  numberOfLines={1}
                >
                  {r.title}
                </Text>
              ) : null}
              <Text
                style={[styles.subtitle, { color: theme.subtleText }]}
                numberOfLines={1}
              >
                Sound:{' '}
                {sounds.find(s => s.id === r.sound)?.label || 'Default Tone'}
              </Text>
              <Text
                style={[styles.subtitle, { color: theme.subtleText }]}
                numberOfLines={1}
              >
                Repeat: {labelForDays(r.repeatDays)}
              </Text>
            </TouchableOpacity>

            <View style={styles.row}>
              <Switch
                value={r.enabled}
                onValueChange={() => toggleReminder(r.id)}
                trackColor={{ false: '#444', true: '#22c55e55' }}
                thumbColor={r.enabled ? '#22c55e' : '#888'}
              />

              <TouchableOpacity
                onPress={() =>
                  Alert.alert('Delete?', 'Remove this reminder?', [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => deleteReminder(r.id),
                    },
                  ])
                }
              >
                <Icon name="delete" size={22} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {reminders.length === 0 && (
          <Text style={{ color: theme.subtleText, textAlign: 'center' }}>
            No reminders yet. Tap + to add one.
          </Text>
        )}
      </ScrollView>

      {/* TIME PICKER MODAL */}
      <DatePicker
        modal
        open={timePickerOpen}
        mode="time"
        date={selectedDate}
        onConfirm={date => {
          setSelectedDate(date);
          setTimePickerOpen(false);
        }}
        onCancel={() => setTimePickerOpen(false)}
      />

      {/* EDITOR BOTTOM SHEET */}
      {editorVisible && (
        <View
          style={[
            styles.editorSheet,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          <View style={styles.editorHeaderRow}>
            <Text style={[styles.editorTitle, { color: theme.text }]}>
              {editingId ? 'Edit Reminder' : 'New Reminder'}
            </Text>

            <TouchableOpacity onPress={closeEditor}>
              <Icon name="close" size={22} color={theme.subtleText} />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={[styles.label, { color: theme.subtleText }]}>
            Reminder Name (optional)
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Evening walk, Drink water"
            placeholderTextColor={theme.subtleText}
            style={[
              styles.textInput,
              {
                color: theme.text,
                borderColor: theme.subtleText,
              },
            ]}
          />

          {/* Time row */}
          <View style={styles.sectionRow}>
            <Text style={[styles.label, { color: theme.subtleText }]}>
              Time
            </Text>
            <TouchableOpacity onPress={() => setTimePickerOpen(true)}>
              <Text style={[styles.timeInline, { color: theme.primary }]}>
                {selectedDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Repeat days */}
          <Text style={[styles.label, { color: theme.subtleText, marginTop: 8 }]}>
            Repeat on
          </Text>
          <View style={styles.weekRow}>
            {WEEKDAYS.map(d => {
              const active = repeatDays.includes(d.idx);
              return (
                <TouchableOpacity
                  key={d.idx}
                  style={[
                    styles.dayChip,
                    {
                      backgroundColor: active
                        ? theme.primary
                        : theme.background,
                      borderColor: theme.subtleText,
                    },
                  ]}
                  onPress={() => toggleDay(d.idx)}
                >
                  <Text
                    style={{
                      color: active ? '#fff' : theme.text,
                      fontWeight: '600',
                    }}
                  >
                    {d.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Sound selection */}
          <Text style={[styles.label, { color: theme.subtleText, marginTop: 8 }]}>
            Select Sound
          </Text>
          {sounds.map(s => (
            <TouchableOpacity
              key={s.id}
              style={styles.soundRow}
              onPress={() => setSelectedSound(s.id)}
            >
              <Text style={{ color: theme.text }}>{s.label}</Text>
              {selectedSound === s.id && (
                <Icon name="check" size={20} color={theme.primary} />
              )}
            </TouchableOpacity>
          ))}

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: theme.subtleText }]}
              onPress={closeEditor}
            >
              <Text style={{ color: theme.subtleText }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={handleSaveReminder}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                {editingId ? 'Save' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default DailyCheckInReminderScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  listContent: { paddingHorizontal: 16, paddingBottom: 120 },
  card: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  time: { fontSize: 24, fontWeight: '700' },
  titleLabel: { marginTop: 2, fontSize: 14 },
  subtitle: { fontSize: 12, marginTop: 2 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  // Editor sheet
  editorSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 20,
  },
  editorHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  editorTitle: { fontSize: 16, fontWeight: '700' },
  label: { fontSize: 12, marginBottom: 4 },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    marginBottom: 8,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timeInline: { fontSize: 16, fontWeight: '600' },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dayChip: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  soundRow: {
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionsRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  primaryButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
});

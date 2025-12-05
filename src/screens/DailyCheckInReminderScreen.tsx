import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Switch,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

import { useReminderStore } from '../store/reminders';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'DailyCheckInReminder'>;

const sounds = [
  { id: 'morning_chime', label: 'Morning Chime' },
  { id: 'softbell', label: 'Soft Bell' },
  { id: 'default', label: 'Default Tone' },
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

  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSound, setSelectedSound] = useState('default');

  useEffect(() => {
    loadReminders();
  }, []);

  const handleAdd = async () => {
    await addReminder(selectedDate, selectedSound);
    setPickerOpen(false);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

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

        <TouchableOpacity onPress={() => setPickerOpen(true)}>
          <Icon name="plus-circle" size={26} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {reminders.map((r) => (
          <View
            key={r.id}
            style={[styles.card, { backgroundColor: theme.cardBackground }]}
          >
            <TouchableOpacity
              onPress={() => {
                setSelectedDate(new Date(r.timeISO));
                setSelectedSound(r.sound);
                setPickerOpen(true);
              }}
            >
              <Text style={[styles.time, { color: theme.text }]}>
                {formatTime(r.timeISO)}
              </Text>

              <Text style={{ color: theme.subtleText, marginTop: 4 }}>
                Sound: {sounds.find((s) => s.id === r.sound)?.label}
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

      {/* TIME PICKER */}
      <DatePicker
        modal
        open={pickerOpen}
        mode="time"
        date={selectedDate}
        onConfirm={(date) => {
          setSelectedDate(date);
          handleAdd();
        }}
        onCancel={() => setPickerOpen(false)}
      />

      {/* SOUND PICKER (Simple UI Below Picker) */}
      {pickerOpen && (
        <View style={[styles.soundBox, { backgroundColor: theme.cardBackground }]}>
          <Text style={{ color: theme.text, marginBottom: 8 }}>Select Sound:</Text>

          {sounds.map((s) => (
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
  card: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  time: { fontSize: 26, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  soundBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 6,
  },
  soundRow: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

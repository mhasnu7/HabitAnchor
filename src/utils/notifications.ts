// src/utils/notifications.ts

import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
  RepeatFrequency,
} from '@notifee/react-native';

// 🔔 DEFAULT custom sound name (without extension)
// Put morning_chime.wav in android/app/src/main/res/raw/
const DEFAULT_SOUND = 'morning_chime';

/**
 * Call once on app startup (e.g. inside App.tsx useEffect)
 */
export async function configureNotifications() {
  // Ask for permission (Android & iOS)
  await notifee.requestPermission();

  // Create / update Android channel
  await notifee.createChannel({
    id: 'habit-reminders',
    name: 'Habit Reminders',
    description: 'Reminders for daily habit check-ins',
    sound: DEFAULT_SOUND, // must exist in res/raw
    importance: AndroidImportance.HIGH,
    vibration: true,
  });
}

/**
 * Optional explicit permission helper.
 */
export async function requestNotificationPermissions() {
  try {
    await notifee.requestPermission();
    console.log('Notification permissions granted');
  } catch (e) {
    console.log('Notification permissions error', e);
  }
}

/**
 * Schedule a DAILY reminder at the given time.
 * `soundName` is optional – defaults to our custom sound.
 *
 * Example:
 *   scheduleDailyReminder(date, 'softbell'); // softbell.mp3 in res/raw
 */
export async function scheduleDailyReminder(
  date: Date,
  soundName: string = DEFAULT_SOUND,
) {
  const now = new Date();
  let scheduledDate = new Date(date);

  // If time already passed today, move to tomorrow
  if (scheduledDate.getTime() <= now.getTime()) {
    scheduledDate.setDate(scheduledDate.getDate() + 1);
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: scheduledDate.getTime(),
    repeatFrequency: RepeatFrequency.DAILY,
    alarmManager: true,
  };

  await notifee.createTriggerNotification(
    {
      title: 'Habit Anchor',
      body: 'Time to check in on your daily habits!',
      android: {
        channelId: 'habit-reminders',
        sound: soundName || DEFAULT_SOUND,
        smallIcon: 'ic_launcher', // make sure this exists (default app icon)
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
    },
    trigger,
  );

  console.log(
    'Daily reminder scheduled for:',
    scheduledDate.toLocaleTimeString(),
    'with sound:',
    soundName,
  );
}

/**
 * Cancel all scheduled habit reminders.
 */
export async function cancelDailyReminder() {
  await notifee.cancelAllNotifications();
  console.log('Daily reminder(s) cancelled.');
}

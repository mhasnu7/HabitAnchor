import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

// Must be called on startup
export const configureNotifications = () => {
  PushNotification.configure({
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },

    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
      // required on iOS only.
      if (notification.finish) {
        notification.finish('default'); // Use a string value for completion status
      }
    },

    onAction: function (notification) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);
    },

    onRegistrationError: function (err) {
      console.error(err.message, err);
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios', // Request permissions on iOS only, Android handles it via manifest
  });

  // Create a default channel for Android
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: 'habit-reminders',
        channelName: 'Habit Reminders',
        channelDescription: 'Reminders for daily habit check-ins',
        soundName: 'default',
        importance: 4, // ImportanceHigh
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`),
    );
  }
};

export const requestNotificationPermissions = () => {
  // This function is now primarily for Android 13+ POST_NOTIFICATIONS permission if not handled by configure
  // Since configure sets requestPermissions: Platform.OS === 'ios', we only need to ensure Android permissions are requested.
  // The library documentation suggests calling requestPermissions() for Android 13+.
  if (Platform.OS === 'android') {
    PushNotification.requestPermissions().then(
      (permissions) => {
        console.log('Notification permissions granted:', permissions);
      },
      (error) => {
        console.error('Notification permissions denied:', error);
      },
    );
  }
};

export const scheduleDailyReminder = (date: Date) => {
  // Cancel any existing daily reminder to ensure only one is active
  PushNotification.cancelAllLocalNotifications();

  const now = new Date();
  let scheduledDate = new Date(date);

  // If the scheduled time is already passed today, schedule it for tomorrow
  if (scheduledDate.getTime() < now.getTime()) {
    scheduledDate.setDate(scheduledDate.getDate() + 1);
  }

  PushNotification.localNotificationSchedule({
    channelId: 'habit-reminders',
    title: 'Habit Anchor',
    message: 'Time to check in on your daily habits!',
    date: scheduledDate,
    repeatType: 'day',
    allowWhileIdle: true,
    id: 1, // Use a fixed ID for the daily reminder
  });

  console.log('Daily reminder scheduled for:', scheduledDate.toLocaleTimeString());
};

export const cancelDailyReminder = () => {
  PushNotification.cancelAllLocalNotifications();
  console.log('Daily reminder cancelled.');
};
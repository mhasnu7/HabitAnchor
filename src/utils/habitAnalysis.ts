import { DayProgress, Habit } from '../store/habits';
import { isSameDay, subDays, format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isYesterday } from 'date-fns';

// Helper function to get sorted and filtered progress data
const getSortedProgress = (progress: DayProgress[]) => {
  // Filter out non-completed entries and sort by date descending
  return progress
    .filter(p => p.completed)
    .map(p => parseISO(p.date))
    .sort((a, b) => b.getTime() - a.getTime());
};

/**
 * Calculates the overall completion rate of a habit.
 * @param progress The progress array of the habit.
 * @returns The completion rate as a percentage (0-100).
 */
export const calculateOverallCompletionRate = (progress: DayProgress[]): number => {
  if (progress.length === 0) return 0;

  const completedDays = progress.filter(p => p.completed).length;
  const totalDays = progress.length;

  return Math.round((completedDays / totalDays) * 100);
};

/**
 * Calculates the current consecutive completion streak.
 * @param progress The progress array of the habit.
 * @returns The current streak length.
 */
export const calculateCurrentStreak = (progress: DayProgress[]): number => {
  const completedDates = getSortedProgress(progress);
  if (completedDates.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Check if today or yesterday was completed
  const todayCompleted = completedDates.some(date => isSameDay(date, currentDate));
  const yesterdayCompleted = completedDates.some(date => isSameDay(date, subDays(currentDate, 1)));

  if (!todayCompleted && !yesterdayCompleted) {
    return 0;
  }

  // If today is completed, start checking from today
  if (todayCompleted) {
    streak = 1;
  } else if (yesterdayCompleted) {
    // If today is missed but yesterday was completed, start checking from yesterday
    streak = 1;
    currentDate = subDays(currentDate, 1);
  } else {
    return 0;
  }

  let expectedDate = subDays(currentDate, 1);

  for (let i = 0; i < completedDates.length; i++) {
    const completedDate = completedDates[i];

    if (isSameDay(completedDate, expectedDate)) {
      streak++;
      expectedDate = subDays(expectedDate, 1);
    } else if (completedDate.getTime() < expectedDate.getTime()) {
      // If the completed date is older than the expected date, the streak is broken
      break;
    }
  }

  return streak;
};

/**
 * Calculates the best consecutive completion streak.
 * @param progress The progress array of the habit.
 * @returns The best streak length.
 */
export const calculateBestStreak = (progress: DayProgress[]): number => {
  const completedDates = progress
    .filter(p => p.completed)
    .map(p => parseISO(p.date))
    .sort((a, b) => a.getTime() - b.getTime()); // Sort ascending for easier iteration

  if (completedDates.length === 0) return 0;

  let maxStreak = 0;
  let currentStreak = 0;
  let lastDate: Date | null = null;

  for (const date of completedDates) {
    if (lastDate === null) {
      currentStreak = 1;
    } else {
      const expectedNextDate = subDays(date, 1);
      if (isSameDay(lastDate, expectedNextDate)) {
        currentStreak++;
      } else if (lastDate.getTime() < expectedNextDate.getTime()) {
        // If there's a gap of more than one day, reset the streak
        currentStreak = 1;
      }
      // If lastDate and date are the same day (due to data structure), do nothing
    }

    maxStreak = Math.max(maxStreak, currentStreak);
    lastDate = date;
  }

  return maxStreak;
};

/**
 * Calculates monthly consistency data for charting.
 * @param progress The progress array of the habit.
 * @returns An array of objects with month name and completed days count.
 */
export const calculateMonthlyConsistency = (progress: DayProgress[]): { month: string; completedDays: number }[] => {
  const monthlyData: { [key: string]: number } = {};

  progress.forEach(p => {
    if (p.completed) {
      const date = parseISO(p.date);
      const monthKey = format(date, 'MMM yyyy');
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    }
  });

  // Convert to array and sort by date (oldest first)
  return Object.keys(monthlyData)
    .map(monthKey => ({
      month: monthKey,
      completedDays: monthlyData[monthKey],
      date: parseISO(monthKey.replace(/(\w{3}) (\d{4})/, '$2-$1-01')), // Create a sortable date
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(({ month, completedDays }) => ({ month, completedDays }));
};

/**
 * Calculates weekly completion rate by day of the week.
 * @param progress The progress array of the habit.
 * @returns An array of objects with day name and completion rate (0-100).
 */
export const calculateWeeklyCompletionRate = (progress: DayProgress[]): { day: string; rate: number }[] => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayStats: { [key: number]: { completed: number; total: number } } = {};

  // Initialize stats
  for (let i = 0; i < 7; i++) {
    dayStats[i] = { completed: 0, total: 0 };
  }

  progress.forEach(p => {
    const date = parseISO(p.date);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

    dayStats[dayOfWeek].total += 1;
    if (p.completed) {
      dayStats[dayOfWeek].completed += 1;
    }
  });

  return dayNames.map((day, index) => {
    const stats = dayStats[index];
    const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    return { day, rate };
  });
};
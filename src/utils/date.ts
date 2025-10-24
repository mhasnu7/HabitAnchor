export const generateLastNDays = (n: number) => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.unshift({ date: d.toISOString().split('T')[0], completed: false });
  }
  return days;
};
export function generateMonthWeeks(year: number, month: number) {
  const weeks: ({ day: number; dateStr: string } | null)[][] = [];
  let week: ({ day: number; dateStr: string } | null)[] = new Array(7).fill(null);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const weekday = d.getDay(); // 0 = Sun, 6 = Sat
    const dateStr = d.toISOString().slice(0, 10);
    week[weekday] = { day, dateStr };

    if (weekday === 6) {
      weeks.push(week);
      week = new Array(7).fill(null);
    }
  }

  if (week.some((c) => c)) weeks.push(week);
  return weeks;
}
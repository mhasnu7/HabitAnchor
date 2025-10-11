export const generateLastNDays = (n: number) => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.unshift({ date: d.toISOString().split('T')[0], completed: Math.random() < 0.5 });
  }
  return days;
};
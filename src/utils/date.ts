const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
] as const;

export function formatDisplayDate(date: Date) {
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${day} ${monthShortNames[date.getMonth()]} ${date.getFullYear()}`;
}

export function parseDisplayDate(value: string) {
  const match = value.trim().match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (!match) return null;

  const [, dayText, monthText, yearText] = match;
  const monthIndex = monthShortNames.findIndex((month) => month === monthText);
  if (monthIndex < 0) return null;

  return {
    day: Number(dayText),
    monthIndex,
    year: Number(yearText)
  };
}

export function isDateInMonthYear(value: string, monthIndex: number, year: number) {
  const parsed = parseDisplayDate(value);
  return Boolean(parsed && parsed.monthIndex === monthIndex && parsed.year === year);
}

export function getRecentPeriods(monthIndex: number, year: number, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(year, monthIndex - (count - 1 - index), 1);
    return {
      monthIndex: date.getMonth(),
      year: date.getFullYear(),
      shortLabel: monthShortNames[date.getMonth()]
    };
  });
}

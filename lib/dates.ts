export function getTodayString(): string {
  return new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local timezone
}

export function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

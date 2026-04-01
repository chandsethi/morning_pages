import { STORAGE_PREFIX } from "./constants";

export interface JournalEntry {
  pages: [string, string, string];
  updatedAt: string;
}

function getKey(date: string): string {
  return `${STORAGE_PREFIX}${date}`;
}

export function loadEntry(date: string): JournalEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getKey(date));
    if (!raw) return null;
    return JSON.parse(raw) as JournalEntry;
  } catch {
    return null;
  }
}

export function saveEntry(date: string, entry: JournalEntry): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getKey(date), JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

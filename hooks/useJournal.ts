"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { loadEntry, saveEntry, JournalEntry } from "@/lib/storage";
import { getTodayString } from "@/lib/dates";
import { DEBOUNCE_MS } from "@/lib/constants";

type Pages = [string, string, string];

export function useJournal(selectedDate: string) {
  const [pages, setPages] = useState<Pages>(["", "", ""]);
  const isToday = selectedDate === getTodayString();
  const pagesRef = useRef(pages);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dateRef = useRef(selectedDate);

  // Keep refs in sync
  pagesRef.current = pages;
  dateRef.current = selectedDate;

  // Load entry when date changes
  useEffect(() => {
    const entry = loadEntry(selectedDate);
    setPages(entry?.pages ?? ["", "", ""]);
  }, [selectedDate]);

  // Debounced save
  const scheduleSave = useCallback(() => {
    if (!isToday) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const entry: JournalEntry = {
        pages: pagesRef.current,
        updatedAt: new Date().toISOString(),
      };
      saveEntry(dateRef.current, entry);
    }, DEBOUNCE_MS);
  }, [isToday]);

  // Save on beforeunload
  useEffect(() => {
    if (!isToday) return;
    const flush = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const entry: JournalEntry = {
        pages: pagesRef.current,
        updatedAt: new Date().toISOString(),
      };
      saveEntry(dateRef.current, entry);
    };
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, [isToday]);

  const setPageContent = useCallback(
    (index: number, content: string) => {
      setPages((prev) => {
        const next = [...prev] as Pages;
        next[index] = content;
        return next;
      });
      scheduleSave();
    },
    [scheduleSave]
  );

  return { pages, setPageContent, isToday };
}

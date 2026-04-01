"use client";

import { useState, useCallback } from "react";
import { getTodayString, formatDisplayDate } from "@/lib/dates";

interface ToolbarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  pages: [string, string, string];
}

export default function Toolbar({ selectedDate, onDateChange, pages }: ToolbarProps) {
  const [copied, setCopied] = useState(false);
  const isToday = selectedDate === getTodayString();

  const handleCopy = useCallback(async () => {
    const text = pages
      .map((p, i) => `--- Page ${i + 1} ---\n${p}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  }, [pages]);

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value) {
        onDateChange(e.target.value);
      }
    },
    [onDateChange]
  );

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 h-14 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-serif text-ink font-medium tracking-tight">
          Morning Pages
        </h1>
        {!isToday && (
          <span className="text-sm text-accent italic">
            {formatDisplayDate(selectedDate)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="date"
          value={selectedDate}
          max={getTodayString()}
          onChange={handleDateChange}
          className="bg-transparent text-ink text-sm border border-accent/30 rounded-md px-2 py-1 outline-none focus:border-accent transition-colors cursor-pointer font-serif"
        />
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-sm text-ink border border-accent/30 rounded-md px-3 py-1 hover:bg-accent/10 transition-colors font-serif cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          {copied ? "Copied!" : "Copy all"}
        </button>
      </div>
    </header>
  );
}

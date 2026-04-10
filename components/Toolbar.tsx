"use client";

import { useState, useCallback, useRef } from "react";
import { getTodayString, formatDisplayDate } from "@/lib/dates";

interface ToolbarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  pages: [string, string, string];
}

function formatShortDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Toolbar({ selectedDate, onDateChange, pages }: ToolbarProps) {
  const [copied, setCopied] = useState(false);
  const isToday = selectedDate === getTodayString();
  const dateInputRef = useRef<HTMLInputElement>(null);

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
        <span className="text-xs text-ink/70 hidden lg:inline">
          Write three pages of free flowing thoughts. No backspace allowed. Completely private.
        </span>
        {!isToday && (
          <span className="text-sm text-accent italic">
            {formatDisplayDate(selectedDate)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => dateInputRef.current?.showPicker()}
          className="relative flex items-center gap-1.5 text-sm text-ink border border-accent/30 rounded-md px-2 py-1 hover:bg-accent/10 transition-colors font-serif cursor-pointer"
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
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{formatShortDate(selectedDate)}</span>
          <input
            ref={dateInputRef}
            type="date"
            value={selectedDate}
            max={getTodayString()}
            onChange={handleDateChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            tabIndex={-1}
          />
        </button>
        <button
          onClick={handleCopy}
          title={copied ? "Copied!" : "Copy all"}
          className="flex items-center text-sm text-ink border border-accent/30 rounded-md px-2 py-1 hover:bg-accent/10 transition-colors font-serif cursor-pointer"
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
        </button>
      </div>
    </header>
  );
}

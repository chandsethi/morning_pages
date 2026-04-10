"use client";

import { useState, useRef, useCallback } from "react";
import { useJournal } from "@/hooks/useJournal";
import { getTodayString } from "@/lib/dates";
import PageCard from "@/components/PageCard";
import Toolbar from "@/components/Toolbar";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(getTodayString);
  const { pages, setPageContent, isToday } = useJournal(selectedDate);

  const page1Ref = useRef<HTMLTextAreaElement>(null);
  const page2Ref = useRef<HTMLTextAreaElement>(null);
  const page3Ref = useRef<HTMLTextAreaElement>(null);
  const refs = [page1Ref, page2Ref, page3Ref];

  const handlePageFull = useCallback(
    (pageIndex: number) => {
      const nextRef = refs[pageIndex + 1];
      if (nextRef?.current) {
        nextRef.current.focus();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="flex flex-col h-full">
      <Toolbar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        pages={pages}
      />
      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6 p-4 lg:p-6 overflow-y-auto lg:overflow-hidden hide-scrollbar">
        {pages.map((content, i) => (
          <PageCard
            key={i}
            ref={refs[i]}
            pageIndex={i}
            content={content}
            onChange={(val) => setPageContent(i, val)}
            readOnly={!isToday}
            onPageFull={() => handlePageFull(i)}
          />
        ))}
      </main>
    </div>
  );
}

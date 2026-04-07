"use client";

import { forwardRef, useCallback, useEffect, useRef } from "react";

interface PageCardProps {
  pageIndex: number;
  content: string;
  onChange: (content: string) => void;
  readOnly: boolean;
  onPageFull?: () => void;
}

const PageCard = forwardRef<HTMLTextAreaElement, PageCardProps>(
  function PageCard({ pageIndex, content, onChange, readOnly, onPageFull }, ref) {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement | null>) || internalRef;

    // Check if page is full after content changes
    useEffect(() => {
      const el = textareaRef.current;
      if (el && el.scrollHeight > el.clientHeight && onPageFull) {
        onPageFull();
      }
    }, [content, onPageFull, textareaRef]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (readOnly) return;
        // Block deletion keys
        if (e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault();
          return;
        }
        // Block cut, undo, redo
        if (e.ctrlKey || e.metaKey) {
          const key = e.key.toLowerCase();
          if (key === "x" || key === "z") {
            e.preventDefault();
            return;
          }
        }
      },
      [readOnly]
    );

    const handleBeforeInput = useCallback(
      (e: React.FormEvent<HTMLTextAreaElement>) => {
        const inputEvent = e as unknown as InputEvent;
        if (inputEvent.inputType?.startsWith("delete")) {
          e.preventDefault();
        }
      },
      []
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        // Safety net: only allow content to grow
        if (newValue.length >= content.length) {
          onChange(newValue);
        } else {
          // Reject deletion — restore content
          e.target.value = content;
        }
      },
      [content, onChange]
    );

    const handleCut = useCallback((e: React.ClipboardEvent) => {
      e.preventDefault();
    }, []);

    return (
      <div className="flex flex-col bg-paper rounded-lg shadow-md overflow-hidden min-h-[70vh] lg:min-h-0 lg:h-full">
        <div className="px-6 pt-4 pb-2">
          <span className="text-sm text-accent tracking-wide uppercase">
            Page {pageIndex + 1}
          </span>
        </div>
        <div className="flex-1 px-6 pb-4 overflow-hidden">
          <textarea
            ref={textareaRef}
            className="w-full h-full resize-none bg-transparent text-ink font-serif text-base leading-relaxed outline-none overflow-hidden placeholder:text-accent/50"
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBeforeInput={handleBeforeInput}
            onCut={handleCut}
            readOnly={readOnly}
            placeholder={readOnly ? "" : "Just start writing..."}
            spellCheck={false}
            autoCapitalize="sentences"
          />
        </div>
      </div>
    );
  }
);

export default PageCard;

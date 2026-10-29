"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { formatGrade, parseGrade } from "@/lib/utils/format-grade";

type GradeCellProps = {
  value: number | null;
  label: string;
  onChange: (value: number | null) => void;
  onPaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
};

export function GradeCell({ value, label, onChange, onPaste }: GradeCellProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const editing = draft !== null;
  const invalid = editing && parseGrade(draft) === undefined;

  const commit = () => {
    if (draft === null) return;
    const parsed = parseGrade(draft);
    if (parsed !== undefined && parsed !== value) onChange(parsed);
    setDraft(null);
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      aria-label={label}
      aria-invalid={invalid || undefined}
      value={editing ? draft : value === null ? "—" : formatGrade(value)}
      onFocus={(event) => {
        setDraft(value === null ? "" : formatGrade(value));
        requestAnimationFrame(() => event.target.select());
      }}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
        if (event.key === "Escape") {
          setDraft(null);
          event.currentTarget.blur();
        }
      }}
      onPaste={onPaste}
      className={cn(
        "h-9 w-[76px] rounded-md border bg-card px-2.5 text-right font-mono text-sm outline-none transition-colors",
        "focus:border-2 focus:border-primary focus:px-[9px]",
        invalid
          ? "border-2 border-destructive focus:border-destructive"
          : value === null && !editing
            ? "border-dashed border-[#d8c59d] text-catalog-faint"
            : "border-catalog-border text-catalog-text",
      )}
    />
  );
}

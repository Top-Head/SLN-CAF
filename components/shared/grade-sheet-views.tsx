"use client";

import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

export type GradeSheetView<T extends string> = {
  key: T;
  label: string;
  count: number;
  badge?: boolean;
};

type GradeSheetViewsProps<T extends string> = {
  views: GradeSheetView<T>[];
  value: T;
  onChange: (value: T) => void;
  query: string;
  onQueryChange: (value: string) => void;
};

export function GradeSheetViews<T extends string>({
  views,
  value,
  onChange,
  query,
  onQueryChange,
}: GradeSheetViewsProps<T>) {
  return (
    <div className="flex h-[62px] items-center justify-between gap-4 border-b border-catalog-border px-5">
      <div role="tablist" className="flex h-full gap-6">
        {views.map(({ key, label, count, badge }) => {
          const active = value === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(key)}
              className={cn(
                "flex h-full items-center gap-[7px] border-b-2 text-[13px] transition-colors",
                active
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent text-catalog-muted hover:text-catalog-text",
              )}
            >
              {label}
              {badge ? (
                <span className="rounded-sm bg-[#fff8ea] px-1.5 py-0.5 text-[10px] font-semibold text-attention">
                  {count}
                </span>
              ) : (
                <span className="text-[11px] font-normal">{count}</span>
              )}
            </button>
          );
        })}
      </div>
      <label className="flex h-[34px] w-[242px] items-center gap-2 rounded-md border border-catalog-border px-2.5">
        <Search className="size-[15px] shrink-0 text-catalog-faint" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Pesquisar nome ou processo"
          className="w-full bg-transparent text-[11px] outline-none placeholder:text-catalog-faint"
        />
      </label>
    </div>
  );
}

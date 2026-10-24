"use client";

import { cn } from "@/lib/utils";

import { TONES, type Tone } from "./tone";

export type ListTab<T extends string> = {
  key: T;
  label: string;
  count: number;
  tone: Tone;
};

type ListTabsProps<T extends string> = {
  tabs: ListTab<T>[];
  value: T;
  onChange: (value: T) => void;
  children?: React.ReactNode;
};

export function ListTabs<T extends string>({
  tabs,
  value,
  onChange,
  children,
}: ListTabsProps<T>) {
  return (
    <div className="flex h-[60px] items-center gap-6 overflow-x-auto border-b px-6">
      <div role="tablist" className="flex h-full gap-6">
        {tabs.map(({ key, label, count, tone }) => {
          const active = value === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(key)}
              className={cn(
                "flex h-full items-center gap-1.5 border-b-2 text-[13px] whitespace-nowrap transition-colors",
                active
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent text-neutral hover:text-foreground",
              )}
            >
              {label}
              <span
                className={cn(
                  "rounded-lg px-1.5 py-px text-[11px] font-semibold",
                  TONES[tone],
                )}
              >
                {count.toLocaleString("pt-PT").replace(/\s/g, "")}
              </span>
            </button>
          );
        })}
      </div>
      {children}
    </div>
  );
}

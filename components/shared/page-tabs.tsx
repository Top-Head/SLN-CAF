"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type PageTab = {
  key: string;
  label: string;
  render: () => ReactNode;
};

/** Separadores de página (mesmo estilo da estrutura académica em Turmas). */
export function PageTabs({
  tabs,
  label,
  defaultTab,
}: {
  tabs: PageTab[];
  label: string;
  defaultTab?: string;
}) {
  const [tab, setTab] = useState(defaultTab ?? tabs[0]?.key);
  const active = tabs.find((t) => t.key === tab) ?? tabs[0];

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label={label}
        className="flex h-12 gap-6 overflow-x-auto border-b"
      >
        {tabs.map(({ key, label: text }) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`tab-${key}`}
            aria-selected={active.key === key}
            aria-controls={`panel-${key}`}
            onClick={() => setTab(key)}
            className={cn(
              "flex h-full items-center border-b-2 text-[13px] whitespace-nowrap transition-colors",
              active.key === key
                ? "border-primary font-semibold text-primary"
                : "border-transparent text-neutral hover:text-foreground",
            )}
          >
            {text}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${active.key}`} aria-labelledby={`tab-${active.key}`}>
        {active.render()}
      </div>
    </div>
  );
}

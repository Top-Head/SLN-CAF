"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import {
  CoursesManager,
  SchoolClassesManager,
  SchoolYearsManager,
} from "./structure-managers";
import { TurmasList } from "./turmas-list";

const TABS = [
  { key: "turmas", label: "Turmas", Panel: TurmasList },
  { key: "cursos", label: "Cursos", Panel: CoursesManager },
  { key: "classes", label: "Classes", Panel: SchoolClassesManager },
  { key: "anos", label: "Anos letivos", Panel: SchoolYearsManager },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/** Turmas e a estrutura académica de que dependem (cursos, classes, anos). */
export function AcademicStructure() {
  const [tab, setTab] = useState<TabKey>("turmas");
  const active = TABS.find((t) => t.key === tab) ?? TABS[0];

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label="Estrutura académica"
        className="flex h-12 gap-6 overflow-x-auto border-b"
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`tab-${key}`}
            aria-selected={tab === key}
            aria-controls={`panel-${key}`}
            onClick={() => setTab(key)}
            className={cn(
              "flex h-full items-center border-b-2 text-[13px] whitespace-nowrap transition-colors",
              tab === key
                ? "border-primary font-semibold text-primary"
                : "border-transparent text-neutral hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${active.key}`} aria-labelledby={`tab-${active.key}`}>
        <active.Panel />
      </div>
    </div>
  );
}

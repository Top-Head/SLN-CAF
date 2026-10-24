"use client";

import { Calendar, Download } from "lucide-react";
import { useState } from "react";

import { FilterSelect } from "@/components/shared/filter-select";
import { PageContext } from "@/components/shared/page-context";

import { CLASS_OPTIONS, SUBJECT_OPTIONS, TRIMESTERS, YEARS } from "../_lib/mock-data";

export function StatisticsFilters() {
  const [year, setYear] = useState(YEARS[0]);
  const [trimester, setTrimester] = useState(TRIMESTERS[0]);
  const [className, setClassName] = useState(CLASS_OPTIONS[0]);
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <PageContext
        title="Visão geral"
        subtitle={`Ano lectivo ${year} · ${trimester.toLowerCase()}`}
      />
      <FilterSelect label="Ano lectivo" icon={Calendar} value={year} options={YEARS} onChange={setYear} />
      <FilterSelect label="Trimestre" value={trimester} options={TRIMESTERS} onChange={setTrimester} />
      <FilterSelect label="Turma" value={className} options={CLASS_OPTIONS} onChange={setClassName} />
      <FilterSelect label="Disciplina" value={subject} options={SUBJECT_OPTIONS} onChange={setSubject} />
      <button
        type="button"
        className="flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Download className="size-4" />
        Exportar relatório
      </button>
    </div>
  );
}

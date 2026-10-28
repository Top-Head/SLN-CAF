"use client";

import { Calendar, CircleAlert, FileDown, Printer, Send } from "lucide-react";
import { useState } from "react";

import {
  summarizeReport,
  type ReportStudent,
  type ReportView,
} from "@/components/shared/class-report/report";
import { ReportInfo } from "@/components/shared/class-report/report-info";
import { ReportSheet } from "@/components/shared/class-report/report-sheet";
import { FilterSelect } from "@/components/shared/filter-select";
import { PageContext } from "@/components/shared/page-context";
import { StatusBadge } from "@/components/shared/status-badge";

import { CLASSES, REPORT_INFO, TRIMESTERS, YEARS } from "../_lib/mock-data";

export function ClassReport({ students }: { students: ReportStudent[] }) {
  const [year, setYear] = useState(YEARS[0]);
  const [trimester, setTrimester] = useState(TRIMESTERS[0]);
  const [className, setClassName] = useState(REPORT_INFO.className);
  const [view, setView] = useState<ReportView>("all");

  const { summaries, counts, classMean } = summarizeReport(students);
  const pending = counts.pending;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <PageContext title="Pauta trimestral" subtitle={`Ano lectivo ${year}`} />
        <FilterSelect label="Ano lectivo" icon={Calendar} value={year} options={YEARS} onChange={setYear} />
        <FilterSelect label="Trimestre" value={trimester} options={TRIMESTERS} onChange={setTrimester} />
        <FilterSelect label="Turma" value={className} options={CLASSES} onChange={setClassName} />
        <button
          type="button"
          onClick={() => window.print()}
          className="flex h-10 items-center gap-2 rounded-md border bg-card pr-4 pl-3.5 text-[13px] transition-colors hover:bg-muted"
        >
          <Printer className="size-4 text-muted-foreground" />
          Imprimir
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex h-10 items-center gap-2 rounded-md bg-primary pr-4 pl-3.5 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <FileDown className="size-4" />
          Exportar PDF
        </button>
      </div>

      <ReportInfo
        className={className}
        course={REPORT_INFO.course}
        director={REPORT_INFO.director}
        period={REPORT_INFO.period}
        classMean={classMean}
        status={
          pending > 0 ? (
            <StatusBadge tone="pending">Em revisão</StatusBadge>
          ) : (
            <StatusBadge tone="positive">Pronta</StatusBadge>
          )
        }
      />

      <ReportSheet
        students={students}
        summaries={summaries}
        counts={counts}
        view={view}
        onViewChange={setView}
      />

      {pending > 0 && (
        <section className="flex flex-wrap items-center gap-4 rounded-lg border bg-card px-6 py-4 print:hidden">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-pending-soft">
            <CircleAlert className="size-[18px] text-pending" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <p className="text-[13px] font-semibold">
              {pending} {pending === 1 ? "estudante" : "estudantes"} com notas em falta
            </p>
            <p className="text-xs text-muted-foreground">
              A pauta só pode ser publicada depois de todas as notas do trimestre estarem lançadas.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setView("pending")}
            className="h-10 rounded-md border bg-card px-4 text-[13px] font-medium transition-colors hover:bg-muted"
          >
            Ver pendências
          </button>
          <button
            type="button"
            disabled
            className="flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground disabled:opacity-50"
          >
            <Send className="size-4" />
            Publicar pauta
          </button>
        </section>
      )}
    </div>
  );
}

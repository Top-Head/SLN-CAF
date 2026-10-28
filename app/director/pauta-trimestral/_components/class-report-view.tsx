"use client";

import { Calendar, ChartColumn, Eye, FileDown, Printer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { summarizeReport, type ReportView } from "@/components/shared/class-report/report";
import { ReportInfo } from "@/components/shared/class-report/report-info";
import { ReportSheet } from "@/components/shared/class-report/report-sheet";
import { FilterSelect } from "@/components/shared/filter-select";
import { PageContext } from "@/components/shared/page-context";
import { StatusBadge } from "@/components/shared/status-badge";

import { CLASS_INFO, CLASS_STUDENTS } from "../../_lib/class-data";

const YEARS = ["2025/2026", "2024/2025"];
const TRIMESTERS = ["1.º Trimestre", "2.º Trimestre", "3.º Trimestre"];

/** Pauta trimestral da turma, só de leitura para o director de turma. */
export function ClassReportView() {
  const [year, setYear] = useState(YEARS[0]);
  const [trimester, setTrimester] = useState(TRIMESTERS[0]);
  const [view, setView] = useState<ReportView>("all");

  const { summaries, counts, classMean } = summarizeReport(CLASS_STUDENTS);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <PageContext
          title={`${CLASS_INFO.name} · ${CLASS_INFO.course}`}
          subtitle={`Ano lectivo ${year} · consulta só de leitura`}
        />
        <FilterSelect label="Ano lectivo" icon={Calendar} value={year} options={YEARS} onChange={setYear} />
        <FilterSelect label="Trimestre" value={trimester} options={TRIMESTERS} onChange={setTrimester} />
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
        className={CLASS_INFO.name}
        course={CLASS_INFO.course}
        director={CLASS_INFO.director}
        period={CLASS_INFO.period}
        classMean={classMean}
        status={
          counts.pending > 0 ? (
            <StatusBadge tone="pending">Em lançamento</StatusBadge>
          ) : (
            <StatusBadge tone="positive">Concluída</StatusBadge>
          )
        }
      />

      <ReportSheet
        students={CLASS_STUDENTS}
        summaries={summaries}
        counts={counts}
        view={view}
        onViewChange={setView}
      />

      <section className="flex flex-wrap items-center gap-4 rounded-lg border bg-card px-6 py-4 print:hidden">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-neutral-soft">
          <Eye className="size-[18px] text-neutral" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <p className="text-[13px] font-semibold">Pauta em modo de consulta</p>
          <p className="text-xs text-muted-foreground">
            Pode consultar e exportar, mas não alterar notas. Notas em falta são lançadas por cada
            professor.
          </p>
        </div>
        {counts.pending > 0 && (
          <button
            type="button"
            onClick={() => setView("pending")}
            className="h-10 rounded-md border bg-card px-4 text-[13px] font-medium transition-colors hover:bg-muted"
          >
            Ver pendentes ({counts.pending})
          </button>
        )}
        <Link
          href="/director/estatistica-da-turma"
          className="flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ChartColumn className="size-4" />
          Ver estatística da turma
        </Link>
      </section>
    </div>
  );
}

"use client";

import {
  Calendar,
  ChevronRight,
  CircleAlert,
  FileDown,
  Printer,
  Search,
  Send,
} from "lucide-react";
import { useState } from "react";

import { FilterSelect } from "@/components/shared/filter-select";
import { ListPagination } from "@/components/shared/list-pagination";
import { ListTabs } from "@/components/shared/list-tabs";
import { PageContext } from "@/components/shared/page-context";
import { StatusBadge } from "@/components/shared/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { paginate } from "@/hooks/use-catalog-state";
import { cn } from "@/lib/utils";
import { averageOf, formatGrade, PASS_GRADE } from "@/lib/utils/format-grade";
import { matchesSearch } from "@/lib/utils/matches-search";

import {
  CLASSES,
  REPORT_INFO,
  SUBJECTS,
  TRIMESTERS,
  YEARS,
  type ReportStudent,
} from "../_lib/mock-data";

type Result = "passed" | "failed" | "pending";
type View = "all" | Result;

const PAGE_SIZE = 8;

const RESULTS: Record<Result, { label: string; tone: "positive" | "primary" | "pending" }> = {
  passed: { label: "Aprovado", tone: "positive" },
  failed: { label: "Reprovado", tone: "primary" },
  pending: { label: "Pendente", tone: "pending" },
};

function summarize(student: ReportStudent) {
  const mean = averageOf(SUBJECTS.map(({ key }) => student.grades[key]));
  const result: Result =
    mean === null ? "pending" : mean >= PASS_GRADE ? "passed" : "failed";
  return { mean, result };
}

const gradeColor = (value: number | null) =>
  value === null
    ? "text-pending"
    : value < PASS_GRADE
      ? "text-primary"
      : "text-foreground";

export function ClassReport({ students }: { students: ReportStudent[] }) {
  const [year, setYear] = useState(YEARS[0]);
  const [trimester, setTrimester] = useState(TRIMESTERS[0]);
  const [className, setClassName] = useState(REPORT_INFO.className);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("all");
  const [page, setPage] = useState(1);

  const summaries = new Map(students.map((s) => [s.id, summarize(s)]));
  const countOf = (result: Result) =>
    students.filter((s) => summaries.get(s.id)!.result === result).length;
  const pending = countOf("pending");
  const classMean = averageOf(
    students.map((s) => summaries.get(s.id)!.mean).filter((m) => m !== null),
  );

  const searched = students.filter((s) => matchesSearch(query, s.name, s.process));
  const filtered =
    view === "all"
      ? searched
      : searched.filter((s) => summaries.get(s.id)!.result === view);
  const rows = paginate(filtered, page, PAGE_SIZE);

  const changeView = (next: View) => {
    setView(next);
    setPage(1);
  };

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

      <dl className="flex flex-wrap items-center gap-y-3 rounded-lg border bg-card px-6 py-[18px]">
        {[
          { label: "Turma", value: className, className: "w-[90px] pl-0" },
          { label: "Curso", value: REPORT_INFO.course, className: "flex-1" },
          { label: "Director de turma", value: REPORT_INFO.director, className: "w-[150px]" },
          { label: "Período", value: REPORT_INFO.period, className: "flex-1" },
          {
            label: "Média da turma",
            value: (
              <span className={cn(classMean !== null && classMean < PASS_GRADE && "text-primary")}>
                {formatGrade(classMean)}
              </span>
            ),
            className: "w-[110px]",
          },
        ].map(({ label, value, className: itemClass }, i) => (
          <div
            key={label}
            className={cn(
              "flex min-w-0 flex-col gap-1 pl-5 whitespace-nowrap",
              i > 0 && "border-l",
              itemClass,
            )}
          >
            <dt className="text-[11px] text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium">{value}</dd>
          </div>
        ))}
        <div className="flex flex-col gap-1 border-l pl-5">
          <dt className="text-[11px] text-muted-foreground">Estado</dt>
          <dd>
            {pending > 0 ? (
              <StatusBadge tone="pending">Em revisão</StatusBadge>
            ) : (
              <StatusBadge tone="positive">Pronta</StatusBadge>
            )}
          </dd>
        </div>
      </dl>

      <section className="overflow-hidden rounded-lg border bg-card">
        <ListTabs
          value={view}
          onChange={changeView}
          tabs={[
            { key: "all", label: "Todos", count: students.length, tone: "primary" },
            { key: "passed", label: "Aprovados", count: countOf("passed"), tone: "positive" },
            { key: "failed", label: "Reprovados", count: countOf("failed"), tone: "primary" },
            { key: "pending", label: "Pendentes", count: pending, tone: "pending" },
          ]}
        >
          <label className="ml-auto flex h-9 w-60 shrink-0 items-center gap-2 rounded-md border bg-card px-3 print:hidden">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Pesquisar nome ou processo"
              className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
          </label>
        </ListTabs>

        <div className="px-6 pt-4">
          <Table>
            <TableHeader className="[&_tr]:border-0">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-11 w-11 rounded-l-md bg-table-head pl-4 text-[11px] font-medium text-muted-foreground">
                  N.º
                </TableHead>
                <TableHead className="bg-table-head text-[11px] font-medium text-muted-foreground uppercase">
                  Estudante
                </TableHead>
                {SUBJECTS.map(({ key, short, name }) => (
                  <TableHead key={key} className="w-[74px] bg-table-head text-center">
                    <span className="flex flex-col items-center gap-px leading-tight">
                      <abbr title={name} className="text-[11px] font-semibold text-foreground no-underline">
                        {short}
                      </abbr>
                      <span className="text-[10px] font-normal text-muted-foreground">{name}</span>
                    </span>
                  </TableHead>
                ))}
                <TableHead className="w-20 bg-table-head text-center text-[11px] font-medium text-muted-foreground">
                  MÉDIA
                </TableHead>
                <TableHead className="w-[116px] bg-table-head text-center text-[11px] font-medium text-muted-foreground">
                  RESULTADO
                </TableHead>
                <TableHead className="w-10 rounded-r-md bg-table-head pr-4">
                  <span className="sr-only">Detalhes</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((student, i) => {
                const { mean, result } = summaries.get(student.id)!;
                return (
                  <TableRow
                    key={student.id}
                    className={cn(
                      "h-14 text-[13px] last:border-0",
                      result === "pending" && "bg-pending-soft/35",
                    )}
                  >
                    <TableCell className="pl-4 text-xs text-muted-foreground">
                      {String((page - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
                    </TableCell>
                    <TableCell>
                      <span className="flex flex-col gap-0.5">
                        <span className="font-medium">{student.name}</span>
                        <span className="text-[11px] text-muted-foreground">{student.process}</span>
                      </span>
                    </TableCell>
                    {SUBJECTS.map(({ key }) => (
                      <TableCell key={key} className={cn("text-center", gradeColor(student.grades[key]))}>
                        {formatGrade(student.grades[key], 0)}
                      </TableCell>
                    ))}
                    <TableCell
                      className={cn(
                        "text-center font-bold",
                        mean === null ? "text-muted-foreground" : gradeColor(mean),
                      )}
                    >
                      {formatGrade(mean)}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge tone={RESULTS[result].tone}>{RESULTS[result].label}</StatusBadge>
                    </TableCell>
                    <TableCell className="pr-4">
                      <ChevronRight
                        aria-label={`Ver notas de ${student.name}`}
                        className="mx-auto size-4 text-primary"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={SUBJECTS.length + 5} className="h-24 text-center text-muted-foreground">
                    Nenhum estudante encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <ListPagination
          page={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          noun="estudantes"
          note="Notas abaixo de 10 a vermelho · — nota em falta"
          onPageChange={setPage}
        />
      </section>

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
            onClick={() => changeView("pending")}
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

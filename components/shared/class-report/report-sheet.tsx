"use client";

import { ChevronRight, Search } from "lucide-react";
import { useState } from "react";

import { ListPagination } from "@/components/shared/list-pagination";
import { ListTabs } from "@/components/shared/list-tabs";
import { StatusBadge } from "@/components/shared/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { paginate } from "@/hooks/use-catalog-state";
import { cn } from "@/lib/utils";
import { formatGrade, PASS_GRADE } from "@/lib/utils/format-grade";
import { matchesSearch } from "@/lib/utils/matches-search";

import {
  RESULTS,
  SUBJECTS,
  type ReportResult,
  type ReportStudent,
  type ReportView,
  type StudentSummary,
} from "./report";

const PAGE_SIZE = 8;

const gradeColor = (value: number | null) =>
  value === null
    ? "text-pending"
    : value < PASS_GRADE
      ? "text-primary"
      : "text-foreground";

type ReportSheetProps = {
  students: ReportStudent[];
  summaries: Map<string, StudentSummary>;
  counts: Record<ReportResult, number>;
  view: ReportView;
  onViewChange: (view: ReportView) => void;
};

export function ReportSheet({ students, summaries, counts, view, onViewChange }: ReportSheetProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const searched = students.filter((s) => matchesSearch(query, s.name, s.process));
  const filtered =
    view === "all" ? searched : searched.filter((s) => summaries.get(s.id)!.result === view);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
  const rows = paginate(filtered, currentPage, PAGE_SIZE);

  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <ListTabs
        value={view}
        onChange={(next) => {
          onViewChange(next);
          setPage(1);
        }}
        tabs={[
          { key: "all", label: "Todos", count: students.length, tone: "primary" },
          { key: "passed", label: "Aprovados", count: counts.passed, tone: "positive" },
          { key: "failed", label: "Reprovados", count: counts.failed, tone: "primary" },
          { key: "pending", label: "Pendentes", count: counts.pending, tone: "pending" },
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
                    {String((currentPage - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
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
        page={currentPage}
        pageSize={PAGE_SIZE}
        total={filtered.length}
        noun="estudantes"
        note="Notas abaixo de 10 a vermelho · — nota em falta"
        onPageChange={setPage}
      />
    </section>
  );
}

"use client";

import { Check, CircleDashed, ClipboardPaste, Keyboard, Lock, MessageSquare } from "lucide-react";
import { useState } from "react";

import { GradeCell } from "@/components/shared/grade-cell";
import {
  GRADE_SHEET_PAGE_SIZES,
  GradeSheetPagination,
} from "@/components/shared/grade-sheet-pagination";
import { GradeSheetViews } from "@/components/shared/grade-sheet-views";
import { paginate } from "@/hooks/use-catalog-state";
import { cn } from "@/lib/utils";
import { formatGrade, parseGrade } from "@/lib/utils/format-grade";
import { matchesSearch } from "@/lib/utils/matches-search";
import { isSheetText, parseSheet } from "@/lib/utils/parse-sheet";

import { ASSESSMENTS, AVERAGE_COLUMN, isPositive, type Evaluation } from "../_lib/grading";
import type { GradeKey, Grades, Sheet } from "../_lib/mock-data";

export type SheetView = "all" | "pending";

export type GradeChange = { id: string; key: GradeKey; value: number | null };

type SheetTableProps = {
  sheet: Sheet;
  grades: Record<string, Grades>;
  evaluations: Record<string, Evaluation>;
  view: SheetView;
  onViewChange: (view: SheetView) => void;
  onChange: (changes: GradeChange[]) => void;
};

function LockedGrade({ value, label }: { value: number | null; label: string }) {
  return (
    <span
      aria-label={`${label}: ${value === null ? "sem nota" : formatGrade(value)}`}
      className={cn(
        "inline-flex h-9 w-[76px] items-center justify-end rounded-md bg-grade-locked px-2.5 font-mono text-sm",
        value === null ? "text-[#b4b8c2]" : "text-grade-locked-text",
      )}
    >
      {formatGrade(value)}
    </span>
  );
}

function FinalGrade({ mfd, final }: { mfd: number | null; final: number }) {
  const positive = isPositive(final);
  return (
    <span className="flex items-center gap-2.5 font-mono text-[11px] text-catalog-muted">
      {formatGrade(mfd, 0)}
      <span className="font-sans text-[#b4b8c2]">→</span>
      <span
        className={cn(
          "rounded-sm px-2 py-[3px] text-[13px] font-semibold",
          positive ? "bg-grade-pass-soft text-grade-pass" : "bg-grade-fail-soft text-grade-fail",
        )}
      >
        {formatGrade(final, 0)}
      </span>
    </span>
  );
}

/** Grelha de notas de uma mini-pauta: editável com o prazo aberto, só leitura depois. */
export function SheetTable({
  sheet,
  grades,
  evaluations,
  view,
  onViewChange,
  onChange,
}: SheetTableProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(GRADE_SHEET_PAGE_SIZES[0]);

  const { students, mode } = sheet;
  const locked = sheet.period.status !== "open";
  const assessments = ASSESSMENTS[mode];
  const decimals = mode === "exam" ? 0 : 1;

  const isPending = (id: string) => evaluations[id].missing.length > 0;
  const pendingCount = students.filter((s) => isPending(s.id)).length;
  const searched = students.filter((s) => matchesSearch(query, s.name, s.process));
  const filtered = view === "pending" ? searched.filter((s) => isPending(s.id)) : searched;
  // Ao trocar de vista a página actual pode deixar de existir.
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize)));
  const rows = paginate(filtered, currentPage, pageSize);

  /** Preenche a partir da célula (linha, coluna) com uma grelha colada. */
  const applySheet = (text: string, rowIndex: number, colIndex: number) => {
    const changes: GradeChange[] = [];
    parseSheet(text).forEach((cells, r) => {
      const student = rows[rowIndex + r];
      if (!student) return;
      cells.forEach((cell, c) => {
        const assessment = assessments[colIndex + c];
        const value = parseGrade(cell);
        if (assessment && value !== undefined) {
          changes.push({ id: student.id, key: assessment.key, value });
        }
      });
    });
    onChange(changes);
  };

  const handleCellPaste =
    (rowIndex: number, colIndex: number) => (event: React.ClipboardEvent<HTMLInputElement>) => {
      const text = event.clipboardData.getData("text");
      if (!isSheetText(text)) return;
      event.preventDefault();
      applySheet(text, rowIndex, colIndex);
      event.currentTarget.blur();
    };

  const pasteFromClipboard = async () => {
    try {
      applySheet(await navigator.clipboard.readText(), 0, 0);
    } catch {
      // Sem permissão para ler a área de transferência: resta colar numa célula.
    }
  };

  const average = AVERAGE_COLUMN[mode];

  return (
    <section className="overflow-hidden rounded-[10px] border border-catalog-border bg-card">
      <GradeSheetViews
        views={[
          { key: "all", label: "Todos", count: searched.length },
          {
            key: "pending",
            label: locked ? "Sem nota" : "Pendentes",
            count: pendingCount,
            badge: true,
          },
        ]}
        value={view}
        onChange={(key: SheetView) => {
          onViewChange(key);
          setPage(1);
        }}
        query={query}
        onQueryChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
      />

      <div className="flex h-[54px] items-center justify-between gap-4 px-5">
        {locked ? (
          <p className="flex items-center gap-2 text-[11px] text-catalog-muted">
            <Lock className="size-3.5" />
            Só leitura · o período de lançamento terminou
          </p>
        ) : (
          <>
            <p className="flex items-center gap-2 text-[11px] text-catalog-muted">
              <Keyboard className="size-4" />
              {mode === "exam"
                ? "Notas de 0 a 20 · No 3.º trimestre das classes de exame não há PT"
                : "Notas de 0 a 20 · Tab avança para a próxima célula"}
            </p>
            <button
              type="button"
              onClick={pasteFromClipboard}
              className="flex h-[34px] items-center gap-2 rounded-md border border-catalog-border bg-card px-3 text-[13px] font-medium text-catalog-text transition-colors hover:bg-muted"
            >
              <ClipboardPaste className="size-4 text-catalog-muted" />
              Colar da folha de cálculo
            </button>
          </>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse">
          <thead>
            <tr className="h-[62px] border-y border-catalog-border bg-[#f6f7f9] text-left text-catalog-muted">
              <th className="w-14 pl-4 text-[10px] font-medium">N.º</th>
              <th className="text-[11px] font-semibold">Estudante ↑</th>
              {assessments.map(({ key, label, description }) => (
                <th key={key} className="w-[108px] text-center">
                  <span className="flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-catalog-text">{label}</span>
                    <span className="text-[9px] font-normal">{description}</span>
                  </span>
                </th>
              ))}
              <th className="w-[90px] text-center">
                <span className="flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-catalog-text">{average.label}</span>
                  <span className="text-[9px] font-normal">{average.description}</span>
                </span>
              </th>
              <th className="w-[142px] text-[11px] font-medium">
                {mode === "exam" ? "MFD → MF" : "Preenchimento"}
              </th>
              <th className="w-12 pr-4">
                <MessageSquare aria-label="Observações" className="mx-auto size-3.5" />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((student, rowIndex) => {
              const studentGrades = grades[student.id];
              const { missing, average: mean, mfd, final } = evaluations[student.id];
              const number = (currentPage - 1) * pageSize + rowIndex + 1;

              return (
                <tr
                  key={student.id}
                  className="h-[60px] border-b border-catalog-border transition-colors focus-within:bg-[#fff9fa]"
                >
                  <td className="pl-4 font-mono text-[11px] text-catalog-faint">
                    {String(number).padStart(2, "0")}
                  </td>
                  <td>
                    <span className="flex flex-col gap-[3px]">
                      <span className="text-xs font-medium text-catalog-text">{student.name}</span>
                      <span className="text-[10px] text-catalog-faint">{student.process}</span>
                    </span>
                  </td>
                  {assessments.map(({ key, label }, colIndex) => {
                    const value = studentGrades[key] ?? null;
                    const cellLabel = `${label} de ${student.name}`;
                    return (
                      <td key={key} className="text-center">
                        {locked ? (
                          <LockedGrade value={value} label={cellLabel} />
                        ) : (
                          <GradeCell
                            label={cellLabel}
                            value={value}
                            onChange={(next) => onChange([{ id: student.id, key, value: next }])}
                            onPaste={handleCellPaste(rowIndex, colIndex)}
                          />
                        )}
                      </td>
                    );
                  })}
                  <td
                    className={cn(
                      "text-center font-mono text-sm font-semibold",
                      mean === null
                        ? "text-catalog-faint"
                        : isPositive(mean)
                          ? "text-catalog-text"
                          : "text-primary",
                    )}
                  >
                    {formatGrade(mean, decimals)}
                  </td>
                  <td>
                    {missing.length > 0 ? (
                      <span
                        className={cn(
                          "flex items-center gap-1.5 text-[11px]",
                          locked ? "text-grade-fail" : "text-attention",
                        )}
                      >
                        <CircleDashed className="size-3.5" />
                        {locked ? "Sem nota" : "Falta"} {missing.join(", ")}
                      </span>
                    ) : mode === "exam" && final !== null ? (
                      <FinalGrade mfd={mfd} final={final} />
                    ) : (
                      <span className="flex items-center gap-1.5 text-[11px] text-catalog-muted">
                        <Check className="size-3.5 text-grade-pass" />
                        Completo
                      </span>
                    )}
                  </td>
                  <td className="pr-4 text-center">
                    <button
                      type="button"
                      aria-label={`Observações de ${student.name}`}
                      className="rounded-sm p-1 text-catalog-muted transition-colors hover:bg-muted hover:text-catalog-text"
                    >
                      <MessageSquare className="size-[15px]" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="h-24 text-center text-[13px] text-catalog-muted">
                  {view === "pending" && query === ""
                    ? "Todos os estudantes têm as notas completas."
                    : "Nenhum estudante encontrado."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex h-12 items-center justify-between gap-4 bg-[#fafbfc] px-5 text-[10px] text-catalog-muted">
        <p>— Nota em falta · 0,0 é uma nota válida</p>
        <p>
          {mode === "exam"
            ? "MF = 0,4 × MFD + 0,6 × Exame · décimas ≥ 0,5 sobem"
            : "MT = (MAC + PP + PT) ÷ 3 · 1 decimal"}
        </p>
      </div>

      <GradeSheetPagination
        total={filtered.length}
        page={currentPage}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </section>
  );
}

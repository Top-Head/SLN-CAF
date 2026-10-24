"use client";

import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  ClipboardPaste,
  CloudCheck,
  Keyboard,
  MessageSquare,
  Search,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ListHeader } from "@/components/shared/list-header";
import { SearchCard } from "@/components/shared/search-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { paginate } from "@/hooks/use-catalog-state";
import { cn } from "@/lib/utils";
import { averageOf, formatGrade, parseGrade } from "@/lib/utils/format-grade";
import { matchesSearch } from "@/lib/utils/matches-search";

import {
  ASSESSMENTS,
  type AssessmentKey,
  type GradeStudent,
  type StudentGrades,
} from "../_lib/mock-data";
import { GradeCell } from "./grade-cell";

type View = "all" | "pending";

const PAGE_SIZES = [8, 16, 32];

const missingOf = (grades: StudentGrades) =>
  ASSESSMENTS.filter(({ key }) => grades[key] === null).map(({ label }) => label);

const meanOf = (grades: StudentGrades) =>
  averageOf(ASSESSMENTS.map(({ key }) => grades[key]));

/** Converte texto colado de uma folha de cálculo em linhas e colunas. */
function parseSheet(text: string) {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split("\t"));
}

const currentTime = () =>
  new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });

export function GradeEntry({ students }: { students: GradeStudent[] }) {
  const [grades, setGrades] = useState<Record<string, StudentGrades>>(() =>
    Object.fromEntries(students.map((s) => [s.id, s.grades])),
  );
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [savedAt, setSavedAt] = useState("10:42");

  const pendingCount = students.filter((s) => missingOf(grades[s.id]).length > 0).length;
  const searched = students.filter((s) => matchesSearch(query, s.name, s.process));
  const filtered =
    view === "pending"
      ? searched.filter((s) => missingOf(grades[s.id]).length > 0)
      : searched;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = paginate(filtered, page, pageSize);
  const first = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;

  const updateGrades = (
    changes: { id: string; key: AssessmentKey; value: number | null }[],
  ) => {
    if (changes.length === 0) return;
    setGrades((current) => {
      const next = { ...current };
      for (const { id, key, value } of changes) {
        next[id] = { ...next[id], [key]: value };
      }
      return next;
    });
    setSavedAt(currentTime());
  };

  /** Preenche a partir da célula (linha, coluna) com uma grelha colada. */
  const applySheet = (text: string, rowIndex: number, colIndex: number) => {
    const changes: { id: string; key: AssessmentKey; value: number | null }[] = [];
    parseSheet(text).forEach((cells, r) => {
      const student = rows[rowIndex + r];
      if (!student) return;
      cells.forEach((cell, c) => {
        const assessment = ASSESSMENTS[colIndex + c];
        const value = parseGrade(cell);
        if (assessment && value !== undefined) {
          changes.push({ id: student.id, key: assessment.key, value });
        }
      });
    });
    updateGrades(changes);
  };

  const handleCellPaste =
    (rowIndex: number, colIndex: number) =>
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      const text = event.clipboardData.getData("text");
      if (!/[\t\n]/.test(text.trim())) return;
      event.preventDefault();
      applySheet(text, rowIndex, colIndex);
      event.currentTarget.blur();
    };

  const pasteFromClipboard = async () => {
    try {
      applySheet(await navigator.clipboard.readText(), 0, 0);
    } catch {
      // 
    }
  };

  const changeQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <ListHeader
        title="Lista de estudantes"
        count={students.length}
        addLabel="Importar notas"
        addIcon={Upload}
      />

      <SearchCard placeholder="Pesquise por estudante aqui!." onSearch={changeQuery} />

      <section className="overflow-hidden rounded-[10px] border border-catalog-border bg-card">
        <div className="flex h-[62px] items-center justify-between gap-4 border-b border-catalog-border px-5">
          <div role="tablist" className="flex h-full gap-6">
            {(
              [
                ["all", "Todos", searched.length],
                ["pending", "Pendentes", pendingCount],
              ] as const
            ).map(([key, label, count]) => {
              const active = view === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setView(key);
                    setPage(1);
                  }}
                  className={cn(
                    "flex h-full items-center gap-[7px] border-b-2 text-[13px] transition-colors",
                    active
                      ? "border-primary font-semibold text-primary"
                      : "border-transparent text-catalog-muted hover:text-catalog-text",
                  )}
                >
                  {label}
                  {key === "pending" ? (
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
              onChange={(event) => changeQuery(event.target.value)}
              placeholder="Pesquisar nome ou processo"
              className="w-full bg-transparent text-[11px] outline-none placeholder:text-catalog-faint"
            />
          </label>
        </div>

        <div className="flex h-[54px] items-center justify-between gap-4 px-5">
          <p className="flex items-center gap-2 text-[11px] text-catalog-muted">
            <Keyboard className="size-4" />
            Notas de 0 a 20 · Tab avança para a próxima célula
          </p>
          <button
            type="button"
            onClick={pasteFromClipboard}
            className="flex h-[34px] items-center gap-2 rounded-md border border-catalog-border bg-card px-3 text-[13px] font-medium text-catalog-text transition-colors hover:bg-muted"
          >
            <ClipboardPaste className="size-4 text-catalog-muted" />
            Colar da folha de cálculo
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse">
            <thead>
              <tr className="h-[62px] border-y border-catalog-border bg-[#f6f7f9] text-left text-catalog-muted">
                <th className="w-14 pl-4 text-[10px] font-medium">N.º</th>
                <th className="text-[11px] font-semibold">Estudante ↑</th>
                {ASSESSMENTS.map(({ key, label, description }) => (
                  <th key={key} className="w-[108px] text-center">
                    <span className="flex flex-col items-center gap-1">
                      <span className="text-xs font-semibold text-catalog-text">{label}</span>
                      <span className="text-[9px] font-normal">{description}</span>
                    </span>
                  </th>
                ))}
                <th className="w-[90px] text-center">
                  <span className="flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-catalog-text">MT</span>
                    <span className="text-[9px] font-normal">Automática</span>
                  </span>
                </th>
                <th className="w-[142px] text-[11px] font-medium">Preenchimento</th>
                <th className="w-12 pr-4">
                  <MessageSquare aria-label="Observações" className="mx-auto size-3.5" />
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((student, rowIndex) => {
                const studentGrades = grades[student.id];
                const missing = missingOf(studentGrades);
                const mean = meanOf(studentGrades);
                const number = (page - 1) * pageSize + rowIndex + 1;

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
                        <span className="text-xs font-medium text-catalog-text">
                          {student.name}
                        </span>
                        <span className="text-[10px] text-catalog-faint">
                          {student.process}
                        </span>
                      </span>
                    </td>
                    {ASSESSMENTS.map(({ key, label }, colIndex) => (
                      <td key={key} className="text-center">
                        <GradeCell
                          label={`${label} de ${student.name}`}
                          value={studentGrades[key]}
                          onChange={(value) =>
                            updateGrades([{ id: student.id, key, value }])
                          }
                          onPaste={handleCellPaste(rowIndex, colIndex)}
                        />
                      </td>
                    ))}
                    <td
                      className={cn(
                        "text-center font-mono text-sm font-semibold",
                        mean === null ? "text-catalog-faint" : "text-catalog-text",
                      )}
                    >
                      {formatGrade(mean)}
                    </td>
                    <td>
                      {missing.length === 0 ? (
                        <span className="flex items-center gap-1.5 text-[11px] text-catalog-muted">
                          <Check className="size-3.5 text-[#007352]" />
                          Completo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[11px] text-attention">
                          <CircleDashed className="size-3.5" />
                          Falta {missing.join(", ")}
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
                    Nenhum estudante encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex h-12 items-center justify-between gap-4 bg-[#fafbfc] px-5 text-[10px] text-catalog-muted">
          <p>— Nota em falta · 0,0 é uma nota válida</p>
          <p>MT = (MAC + PP + PT) ÷ 3 · 1 decimal</p>
        </div>

        <div className="flex h-[52px] items-center justify-between gap-4 border-t border-catalog-border px-5 text-[11px] text-catalog-muted">
          <p>
            {first}–{Math.min(page * pageSize, filtered.length)} de {filtered.length}{" "}
            estudantes
          </p>
          <div className="flex items-center gap-3.5">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3.5 hover:text-catalog-text">
                {pageSize} por página
                <ChevronDown className="size-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-0">
                <DropdownMenuRadioGroup
                  value={String(pageSize)}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setPage(1);
                  }}
                >
                  {PAGE_SIZES.map((size) => (
                    <DropdownMenuRadioItem key={size} value={String(size)} className="text-xs">
                      {size} por página
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <nav aria-label="Paginação" className="flex items-center gap-3.5">
              <button
                type="button"
                aria-label="Página anterior"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="text-catalog-faint disabled:opacity-40"
              >
                <ChevronLeft className="size-[15px]" />
              </button>
              <span
                aria-current="page"
                className="flex size-[26px] items-center justify-center rounded-sm bg-catalog-active font-semibold text-primary"
              >
                {page}
              </span>
              <span>de {pageCount}</span>
              <button
                type="button"
                aria-label="Página seguinte"
                disabled={page >= pageCount}
                onClick={() => setPage(page + 1)}
                className="text-catalog-text disabled:opacity-40"
              >
                <ChevronRight className="size-[15px]" />
              </button>
            </nav>
          </div>
        </div>
      </section>

      <section className="flex min-h-[76px] flex-wrap items-center justify-between gap-4 rounded-[10px] border border-catalog-border bg-card px-5 py-4">
        <div className="flex items-center gap-2.5">
          <CloudCheck className="size-5 shrink-0 text-[#007352]" />
          <div className="flex flex-col gap-[3px]">
            <p aria-live="polite" className="text-xs font-medium text-catalog-text">
              Alterações guardadas automaticamente às {savedAt}
            </p>
            <p className="text-[11px] text-catalog-muted">
              As médias são calculadas apenas com as três notas preenchidas.
            </p>
          </div>
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => setSavedAt(currentTime())}
            className="h-[42px] rounded-md border border-catalog-border bg-card px-4 text-[13px] font-medium text-catalog-text transition-colors hover:bg-muted"
          >
            Guardar rascunho
          </button>
          <Link
            href="/pautas"
            className="flex h-[42px] items-center gap-2 rounded-md bg-primary px-4 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ArrowRight className="size-4" />
            Rever publicação
          </Link>
        </div>
      </section>
    </div>
  );
}

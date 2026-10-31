"use client";

import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileDown,
  History,
  Info,
  Pencil,
  Printer,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  ASSESSMENTS,
  AVERAGE_COLUMN,
  evaluate,
  summarize,
} from "@/app/(teacher)/teacher/lancamento-de-notas/_lib/grading";
import {
  getSheet,
  TEACHER_CLASSES,
  TRIMESTERS,
  type PeriodStatus,
  type Trimester,
} from "@/app/(teacher)/teacher/lancamento-de-notas/_lib/mock-data";
import { paginate } from "@/hooks/use-catalog-state";
import { cn } from "@/lib/utils";
import { formatGrade } from "@/lib/utils/format-grade";
import { matchesSearch } from "@/lib/utils/matches-search";

const PAGE_SIZE = 8;

const TRIMESTER_LABEL: Record<Trimester, string> = {
  1: "1.º Trimestre",
  2: "2.º Trimestre",
  3: "3.º Trimestre",
};

const PERIOD_STATUS: Record<PeriodStatus, { label: string; className: string; dot: string }> = {
  open: {
    label: "Em lançamento",
    className: "bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
  },
  closed: {
    label: "Concluída",
    className: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
  upcoming: {
    label: "Por iniciar",
    className: "bg-gray-100 text-gray-500",
    dot: "bg-gray-400",
  },
};

type View = "all" | "positive" | "negative" | "pending";

type Selection = { classId: string; subject: string; trimester: Trimester };

const INITIAL: Selection = { classId: "12-ib", subject: "Matemática", trimester: 1 };

const selectClass =
  "h-9 appearance-none rounded-xl border border-gray-200 bg-white pl-3 pr-8 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-rose-500";

function selectionFromSearch(searchParams: URLSearchParams): Selection {
  const classId = searchParams.get("classId") ?? INITIAL.classId;
  const subject = searchParams.get("subject") ?? INITIAL.subject;
  const rawTrimester = Number(searchParams.get("trimester") ?? INITIAL.trimester);
  const trimester = TRIMESTERS.includes(rawTrimester as Trimester)
    ? (rawTrimester as Trimester)
    : INITIAL.trimester;

  return { classId, subject, trimester };
}

export function MiniPautaView() {
  const searchParams = useSearchParams();
  const [selection, setSelection] = useState<Selection>(() => selectionFromSearch(searchParams));
  const [view, setView] = useState<View>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const sheet = useMemo(
    () => getSheet(selection.classId, selection.subject, selection.trimester),
    [selection],
  );

  const evaluations = useMemo(
    () =>
      Object.fromEntries(
        (sheet?.students ?? []).map((student) => [
          student.id,
          evaluate(student, student.grades, sheet!.mode),
        ]),
      ),
    [sheet],
  );

  const summary = useMemo(() => summarize(Object.values(evaluations)), [evaluations]);

  const counts = useMemo(() => {
    const values = Object.values(evaluations);
    return {
      all: values.length,
      positive: values.filter((e) => e.final !== null && e.final >= 10).length,
      negative: values.filter((e) => e.final !== null && e.final < 10).length,
      pending: values.filter((e) => e.missing.length > 0).length,
    };
  }, [evaluations]);

  const filtered = useMemo(() => {
    const students = sheet?.students ?? [];
    const searched = students.filter((student) => matchesSearch(query, student.name, student.process));

    if (view === "pending") {
      return searched.filter((student) => evaluations[student.id].missing.length > 0);
    }
    if (view === "positive") {
      const final = (id: string) => evaluations[id].final;
      return searched.filter((student) => {
        const value = final(student.id);
        return value !== null && value >= 10;
      });
    }
    if (view === "negative") {
      const final = (id: string) => evaluations[id].final;
      return searched.filter((student) => {
        const value = final(student.id);
        return value !== null && value < 10;
      });
    }
    return searched;
  }, [evaluations, query, sheet, view]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = paginate(filtered, currentPage, PAGE_SIZE);
  const firstRow = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastRow = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const changeClass = (classId: string) => {
    const subjects = TEACHER_CLASSES.find((item) => item.id === classId)?.subjects ?? [];
    setSelection((current) => ({
      ...current,
      classId,
      subject: subjects.includes(current.subject) ? current.subject : (subjects[0] ?? current.subject),
    }));
    setPage(1);
  };

  const changeTrimester = (trimester: Trimester) => {
    setSelection((current) => ({ ...current, trimester }));
    setPage(1);
  };

  const changeView = (next: View) => {
    setView(next);
    setPage(1);
  };

  const metadata = sheet
    ? [
        { label: "Turma", value: sheet.classInfo.name },
        { label: "Curso", value: sheet.classInfo.course },
        { label: "Disciplina", value: sheet.subject },
        {
          label: "Período",
          value: `${TRIMESTER_LABEL[sheet.trimester]} · até ${sheet.period.closesShort}`,
        },
        {
          label: "Média da turma",
          value:
            summary.average === null
              ? "—"
              : formatGrade(summary.average, sheet.mode === "exam" ? 0 : 1),
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Título e barra de ações */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {sheet ? `${sheet.subject} · ${sheet.classInfo.name}` : "Mini-pauta"}
          </h2>
          <p className="mt-0.5 text-xs text-gray-400">
            {sheet
              ? `Mini-pauta do ${TRIMESTER_LABEL[sheet.trimester]} · ${sheet.students.length} alunos`
              : "Sem mini-pauta disponível para esta seleção"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <Calendar className="size-3.5 text-gray-400" />
            <span>2025/2026</span>
            <ChevronDown className="ml-1 size-3.5 text-gray-400" />
          </button>

          <label className="relative">
            <span className="sr-only">Trimestre</span>
            <select
              value={selection.trimester}
              onChange={(event) => changeTrimester(Number(event.target.value) as Trimester)}
              className={selectClass}
            >
              {TRIMESTERS.map((trimester) => (
                <option key={trimester} value={trimester}>
                  {TRIMESTER_LABEL[trimester]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
          </label>

          <label className="relative">
            <span className="sr-only">Turma</span>
            <select
              value={selection.classId}
              onChange={(event) => changeClass(event.target.value)}
              className={selectClass}
            >
              {TEACHER_CLASSES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
          </label>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <Printer className="size-3.5 text-gray-500" />
            <span>Imprimir</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-rose-500 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-rose-600"
          >
            <FileDown className="size-3.5" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Banner com metadados */}
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-gray-100 bg-white p-4 text-xs shadow-sm md:grid-cols-6">
        {sheet ? (
          <>
            {metadata.map((item) => (
              <div key={item.label}>
                <p className="text-[10px] font-semibold uppercase text-gray-400">{item.label}</p>
                <p className="mt-1 truncate font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
            <div>
              <p className="text-[10px] font-semibold uppercase text-gray-400">Estado</p>
              <span
                className={cn(
                  "mt-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold",
                  PERIOD_STATUS[sheet.period.status].className,
                )}
              >
                <span className={cn("size-1.5 rounded-full", PERIOD_STATUS[sheet.period.status].dot)} />
                {PERIOD_STATUS[sheet.period.status].label}
              </span>
            </div>
          </>
        ) : (
          <p className="col-span-2 text-xs text-gray-400 md:col-span-6">
            Escolha outro trimestre ou turma para ver a mini-pauta.
          </p>
        )}
      </div>

      {/* Tabela */}
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium">
            <ViewTab label="Todos" count={counts.all} active={view === "all"} onClick={() => changeView("all")} />
            <ViewTab
              label="Positivos"
              count={counts.positive}
              active={view === "positive"}
              onClick={() => changeView("positive")}
              tone="positive"
            />
            <ViewTab
              label="Negativos"
              count={counts.negative}
              active={view === "negative"}
              onClick={() => changeView("negative")}
              tone="negative"
            />
            <ViewTab
              label="Pendentes"
              count={counts.pending}
              active={view === "pending"}
              onClick={() => changeView("pending")}
              tone="pending"
            />
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Pesquisar nome ou processo"
              className="w-full rounded-xl border border-gray-200 py-1.5 pl-9 pr-3 text-xs text-gray-700 placeholder:text-gray-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        {sheet ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="px-3 py-2.5">N.º</th>
                  <th className="px-3 py-2.5">Estudante</th>
                  <th className="px-3 py-2.5 text-center">Sexo</th>
                  {ASSESSMENTS[sheet.mode].map(({ key, label, description }) => (
                    <th key={key} className="px-3 py-2.5 text-center">
                      <div>{label}</div>
                      <div className="text-[8px] font-normal lowercase text-gray-400">
                        {description}
                      </div>
                    </th>
                  ))}
                  <th className="px-3 py-2.5 text-center">
                    {AVERAGE_COLUMN[sheet.mode].label}
                  </th>
                  <th className="px-3 py-2.5 text-center">Resultado</th>
                  <th className="px-3 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {rows.map((student) => {
                  const evaluation = evaluations[student.id];
                  const isPending = evaluation.missing.length > 0;
                  const isPositive = evaluation.final !== null && evaluation.final >= 10;
                  const isNegative = evaluation.final !== null && evaluation.final < 10;

                  return (
                    <tr
                      key={student.id}
                      className={cn(
                        "transition hover:bg-gray-50/50",
                        isPending && "bg-amber-50/20",
                      )}
                    >
                      <td className="px-3 py-3 font-semibold text-gray-400">
                        {student.id.split("-").at(-1)?.padStart(2, "0")}
                      </td>

                      <td className="px-3 py-3">
                        <p className="font-bold text-gray-900">{student.name}</p>
                        <p className="text-[10px] text-gray-400">{student.process}</p>
                      </td>

                      <td className="px-3 py-3 text-center font-medium text-gray-500">
                        {student.gender}
                      </td>

                      {ASSESSMENTS[sheet.mode].map(({ key }) => {
                        const value = student.grades[key] ?? null;
                        return (
                          <td key={key} className="px-3 py-3 text-center font-semibold">
                            {value === null ? (
                              <span className="text-gray-300">—</span>
                            ) : (
                              <span className={value < 10 ? "font-bold text-rose-500" : "text-gray-800"}>
                                {formatGrade(value, 0)}
                              </span>
                            )}
                          </td>
                        );
                      })}

                      <td className="px-3 py-3 text-center font-black">
                        {evaluation.average === null ? (
                          <span className="font-normal text-gray-300">—</span>
                        ) : (
                          <span
                            className={
                              evaluation.average < 10 ? "text-rose-500" : "text-gray-900"
                            }
                          >
                            {formatGrade(evaluation.average, sheet.mode === "exam" ? 0 : 1)}
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-3 text-center">
                        {isPositive && <ResultBadge tone="positive">Positivo</ResultBadge>}
                        {isNegative && <ResultBadge tone="negative">Negativo</ResultBadge>}
                        {isPending && <ResultBadge tone="pending">Pendente</ResultBadge>}
                      </td>

                      <td className="px-3 py-3 text-right">
                        <Link
                          href="/teacher/lancamento-de-notas"
                          className="inline-flex size-8 items-center justify-center rounded-lg text-gray-300 transition hover:bg-gray-100 hover:text-gray-600"
                          aria-label={`Ver lançamento de ${student.name}`}
                        >
                          <ChevronRight className="size-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {rows.length === 0 && (
              <p className="py-10 text-center text-xs text-gray-400">
                Nenhum estudante encontrado.
              </p>
            )}
          </div>
        ) : (
          <p className="py-10 text-center text-xs text-gray-400">
            Esta mini-pauta ainda não está disponível.
          </p>
        )}

        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-3 text-xs text-gray-400 sm:flex-row">
          <p>
            {firstRow}–{lastRow} de {filtered.length} estudantes · Negativas (abaixo de 10) a
            vermelho · — nota em falta
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="flex size-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:bg-gray-50 disabled:opacity-50"
              aria-label="Página anterior"
            >
              <ChevronLeft className="size-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setPage(value)}
                className={cn(
                  "flex size-7 items-center justify-center rounded-lg text-xs transition",
                  value === currentPage
                    ? "bg-rose-50 font-bold text-rose-600"
                    : "border border-gray-100 text-gray-600 hover:bg-gray-50",
                )}
              >
                {value}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className="flex size-7 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              aria-label="Página seguinte"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Alerta inferior */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-400">
            <Info className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">Mini-pauta só de leitura</p>
            <p className="text-[11px] text-gray-400">
              Para alterar notas, volte ao lançamento enquanto o período estiver aberto.
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-end gap-2.5 sm:w-auto">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <History className="size-3.5 text-gray-500" />
            <span>Ver histórico</span>
          </button>
          <Link
            href="/teacher/lancamento-de-notas"
            className="flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-600"
          >
            <Pencil className="size-3.5" />
            <span>Ir para lançamento</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ViewTab({
  label,
  count,
  active,
  onClick,
  tone = "all",
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  tone?: "all" | "positive" | "negative" | "pending";
}) {
  const badge = {
    all: "bg-rose-50 text-rose-600",
    positive: "bg-emerald-50 text-emerald-600",
    negative: "bg-rose-50 text-rose-600",
    pending: "bg-amber-50 text-amber-600",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 pb-1 transition",
        active
          ? "border-b-2 border-rose-500 font-semibold text-rose-500"
          : "text-gray-500 hover:text-gray-700",
      )}
    >
      <span>{label}</span>
      <span className={cn("rounded-full px-1.5 py-px text-[10px] font-bold", badge)}>
        {count}
      </span>
    </button>
  );
}

function ResultBadge({
  tone,
  children,
}: {
  tone: "positive" | "negative" | "pending";
  children: React.ReactNode;
}) {
  const styles = {
    positive: "bg-emerald-50 text-emerald-600 [&>span]:bg-emerald-500",
    negative: "bg-rose-50 text-rose-600 [&>span]:bg-rose-500",
    pending: "bg-amber-50 text-amber-600 [&>span]:bg-amber-500",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold",
        styles,
      )}
    >
      <span className="size-1.5 rounded-full" />
      {children}
    </span>
  );
}

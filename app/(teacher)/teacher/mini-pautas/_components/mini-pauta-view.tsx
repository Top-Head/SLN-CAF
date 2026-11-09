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
  useMiniPautas,
  useMiniPautasQuadro,
} from "@/hooks/assessments/use-mini-pautas";
import { paginate } from "@/hooks/catalog/use-catalog-state";
import { cn } from "@/lib/utils";
import { formatGrade } from "@/lib/utils/format-grade";
import { matchesSearch } from "@/lib/utils/matches-search";

const PAGE_SIZE = 8;

const TRIMESTERS = [1, 2, 3] as const;
type Trimester = (typeof TRIMESTERS)[number];

const TRIMESTER_LABEL: Record<Trimester, string> = {
  1: "1.º Trimestre",
  2: "2.º Trimestre",
  3: "3.º Trimestre",
};

type PeriodStatus = "open" | "closed" | "upcoming";

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

type ResultTone = "positive" | "negative" | "pending" | "unknown";

const selectClass =
  "h-9 appearance-none rounded-xl border border-gray-200 bg-white pl-3 pr-8 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-rose-500 disabled:cursor-not-allowed disabled:opacity-60";

function parseTrimester(value: string | null): Trimester {
  const number = Number(value);
  return TRIMESTERS.includes(number as Trimester)
    ? (number as Trimester)
    : 1;
}

function toGrade(value: string | null): number | null {
  if (value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function formatComponent(value: number | null) {
  if (value === null) return "—";
  return Number.isInteger(value)
    ? formatGrade(value, 0)
    : formatGrade(value, 1);
}

function resultTone(resultado: string): ResultTone {
  const normalized = resultado.trim().toLowerCase();
  if (normalized.startsWith("positiv")) return "positive";
  if (normalized.startsWith("negativ")) return "negative";
  if (normalized.startsWith("pend")) return "pending";
  return "unknown";
}

function periodStatus(estado: string): PeriodStatus {
  const normalized = estado.trim().toLowerCase();
  if (
    normalized.includes("aberto") ||
    normalized.includes("lançamento") ||
    normalized.includes("lancamento")
  ) {
    return "open";
  }
  if (normalized.includes("fechado") || normalized.includes("conclu")) {
    return "closed";
  }
  return "upcoming";
}

export function MiniPautaView() {
  const searchParams = useSearchParams();
  const quadro = useMiniPautasQuadro();

  const [selectedId, setSelectedId] = useState(
    () => searchParams.get("turma_disciplina_id") ?? "",
  );
  const [trimester, setTrimester] = useState<Trimester>(() =>
    parseTrimester(searchParams.get("trimestre")),
  );
  const [view, setView] = useState<View>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const turmaDisciplinaId = selectedId || quadro.items[0]?.id || "";

  const miniPautas = useMiniPautas(
    { turma_disciplina_id: turmaDisciplinaId, trimestre: trimester },
    { enabled: Boolean(turmaDisciplinaId) },
  );

  const sheet = useMemo(
    () =>
      miniPautas.items.find(
        (item) => item.turma_disciplina_id === turmaDisciplinaId,
      ) ?? null,
    [miniPautas.items, turmaDisciplinaId],
  );

  const filtered = useMemo(() => {
    const students = sheet?.alunos ?? [];
    const searched = students.filter((student) =>
      matchesSearch(query, student.aluno, student.numero_processo),
    );

    if (view === "pending") {
      return searched.filter(
        (student) => resultTone(student.resultado) === "pending",
      );
    }
    if (view === "positive") {
      return searched.filter(
        (student) => resultTone(student.resultado) === "positive",
      );
    }
    if (view === "negative") {
      return searched.filter(
        (student) => resultTone(student.resultado) === "negative",
      );
    }
    return searched;
  }, [sheet, query, view]);

  const counts = {
    all: sheet?.total ?? 0,
    positive: sheet?.positivas ?? 0,
    negative: sheet?.negativas ?? 0,
    pending: sheet?.pendentes ?? 0,
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = paginate(filtered, currentPage, PAGE_SIZE);
  const firstRow = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastRow = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const changeTurma = (id: string) => {
    setSelectedId(id);
    setPage(1);
  };

  const changeTrimester = (value: Trimester) => {
    setTrimester(value);
    setPage(1);
  };

  const changeView = (next: View) => {
    setView(next);
    setPage(1);
  };

  const metadata = sheet
    ? [
        { label: "Turma", value: sheet.turma },
        { label: "Curso", value: sheet.curso },
        { label: "Disciplina", value: sheet.disciplina },
        { label: "Período", value: sheet.periodo },
        {
          label: "Média da turma",
          value:
            sheet.media_turma === null
              ? "—"
              : formatGrade(toGrade(sheet.media_turma), 1),
        },
      ]
    : [];

  const status = sheet ? periodStatus(sheet.estado) : null;
  const anoLetivo = sheet?.ano_letivo ?? quadro.items[0]?.ano_letivo ?? "—";
  const isLoading =
    quadro.status === "loading" || miniPautas.status === "loading";
  const error = quadro.error ?? miniPautas.error;

  return (
    <div className="flex flex-col gap-6">
      {/* Título e barra de ações */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {sheet ? sheet.titulo : "Mini-pauta"}
          </h2>
          <p className="mt-0.5 text-xs text-gray-400">
            {sheet
              ? `${sheet.periodo} · ${sheet.total} alunos`
              : isLoading
                ? "A carregar mini-pauta..."
                : "Sem mini-pauta disponível para esta seleção"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <Calendar className="size-3.5 text-gray-400" />
            <span>{anoLetivo}</span>
            <ChevronDown className="ml-1 size-3.5 text-gray-400" />
          </button>

          <label className="relative">
            <span className="sr-only">Trimestre</span>
            <select
              value={trimester}
              onChange={(event) =>
                changeTrimester(Number(event.target.value) as Trimester)
              }
              className={selectClass}
            >
              {TRIMESTERS.map((value) => (
                <option key={value} value={value}>
                  {TRIMESTER_LABEL[value]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
          </label>

          <label className="relative">
            <span className="sr-only">Turma e disciplina</span>
            <select
              value={turmaDisciplinaId}
              onChange={(event) => changeTurma(event.target.value)}
              disabled={quadro.items.length === 0}
              className={selectClass}
            >
              {quadro.items.length === 0 ? (
                <option value="">
                  {quadro.status === "loading"
                    ? "A carregar..."
                    : "Sem turmas atribuídas"}
                </option>
              ) : (
                quadro.items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.disciplina} · {item.turma}
                  </option>
                ))
              )}
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
        {error ? (
          <p className="col-span-2 text-xs text-rose-500 md:col-span-6">
            {error}
          </p>
        ) : sheet && status ? (
          <>
            {metadata.map((item) => (
              <div key={item.label}>
                <p className="text-[10px] font-semibold uppercase text-gray-400">
                  {item.label}
                </p>
                <p className="mt-1 truncate font-bold text-gray-900">
                  {item.value}
                </p>
              </div>
            ))}
            <div>
              <p className="text-[10px] font-semibold uppercase text-gray-400">
                Estado
              </p>
              <span
                className={cn(
                  "mt-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold",
                  PERIOD_STATUS[status].className,
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    PERIOD_STATUS[status].dot,
                  )}
                />
                {PERIOD_STATUS[status].label}
              </span>
            </div>
          </>
        ) : (
          <p className="col-span-2 text-xs text-gray-400 md:col-span-6">
            {isLoading
              ? "A carregar mini-pauta..."
              : "Escolha outro trimestre ou turma para ver a mini-pauta."}
          </p>
        )}
      </div>

      {/* Tabela */}
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium">
            <ViewTab
              label="Todos"
              count={counts.all}
              active={view === "all"}
              onClick={() => changeView("all")}
            />
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
                  <th className="px-3 py-2.5 text-center">
                    <div>MAC</div>
                    <div className="text-[8px] font-normal lowercase text-gray-400">
                      Aval. contínua
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-center">
                    <div>PP</div>
                    <div className="text-[8px] font-normal lowercase text-gray-400">
                      Prova professor
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-center">
                    <div>PT</div>
                    <div className="text-[8px] font-normal lowercase text-gray-400">
                      Prova trimestre
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-center">MT</th>
                  <th className="px-3 py-2.5 text-center">Resultado</th>
                  <th className="px-3 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {rows.map((student) => {
                  const tone = resultTone(student.resultado);
                  const mt = toGrade(student.mt);

                  return (
                    <tr
                      key={student.enrollment_id}
                      className={cn(
                        "transition hover:bg-gray-50/50",
                        tone === "pending" && "bg-amber-50/20",
                      )}
                    >
                      <td className="px-3 py-3 font-semibold text-gray-400">
                        {String(student.numero).padStart(2, "0")}
                      </td>

                      <td className="px-3 py-3">
                        <p className="font-bold text-gray-900">
                          {student.aluno}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {student.numero_processo}
                        </p>
                      </td>

                      <td className="px-3 py-3 text-center font-medium text-gray-500">
                        {student.sexo}
                      </td>

                      <GradeCell value={toGrade(student.mac)} />
                      <GradeCell value={toGrade(student.pp)} />
                      <GradeCell value={toGrade(student.pt)} />

                      <td className="px-3 py-3 text-center font-black">
                        {mt === null ? (
                          <span className="font-normal text-gray-300">—</span>
                        ) : (
                          <span
                            className={
                              mt < 10 ? "text-rose-500" : "text-gray-900"
                            }
                          >
                            {formatGrade(mt, 1)}
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-3 text-center">
                        {tone === "unknown" ? (
                          <span className="text-gray-400">
                            {student.resultado || "—"}
                          </span>
                        ) : (
                          <ResultBadge tone={tone}>
                            {student.resultado}
                          </ResultBadge>
                        )}
                      </td>

                      <td className="px-3 py-3 text-right">
                        <Link
                          href="/teacher/lancamento-de-notas"
                          className="inline-flex size-8 items-center justify-center rounded-lg text-gray-300 transition hover:bg-gray-100 hover:text-gray-600"
                          aria-label={`Ver lançamento de ${student.aluno}`}
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
            {error
              ? error
              : isLoading
                ? "A carregar mini-pauta..."
                : "Esta mini-pauta ainda não está disponível."}
          </p>
        )}

        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-3 text-xs text-gray-400 sm:flex-row">
          <p>
            {firstRow}–{lastRow} de {filtered.length} estudantes · Negativas
            (abaixo de 10) a vermelho · — nota em falta
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

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (value) => (
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
              ),
            )}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setPage((value) => Math.min(totalPages, value + 1))
              }
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
            <p className="text-xs font-bold text-gray-800">
              Mini-pauta só de leitura
            </p>
            <p className="text-[11px] text-gray-400">
              Para alterar notas, volte ao lançamento enquanto o período estiver
              aberto.
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

function GradeCell({ value }: { value: number | null }) {
  return (
    <td className="px-3 py-3 text-center font-semibold">
      {value === null ? (
        <span className="text-gray-300">—</span>
      ) : (
        <span
          className={value < 10 ? "font-bold text-rose-500" : "text-gray-800"}
        >
          {formatComponent(value)}
        </span>
      )}
    </td>
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
      <span
        className={cn(
          "rounded-full px-1.5 py-px text-[10px] font-bold",
          badge,
        )}
      >
        {count}
      </span>
    </button>
  );
}

function ResultBadge({
  tone,
  children,
}: {
  tone: Exclude<ResultTone, "unknown">;
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

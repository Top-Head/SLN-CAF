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
import { useEffect, useState } from "react";

import { formatDecimal } from "@/components/shared/assessments/labels";
import { currentAccessToken } from "@/components/shared/resource/resource-manager";
import { useMiniPauta } from "@/hooks/teacher-dashboard/use-mini-pauta";
import { useTeacherClasses } from "@/hooks/teacher-dashboard/use-teacher-dashboard";
import { paginate } from "@/hooks/catalog/use-catalog-state";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import {
  downloadMiniPautaPdf,
  type MiniPautaResultFilter,
  type MiniPautaStudent,
} from "@/services/mini-pautas";

const PAGE_SIZE = 8;
const SEARCH_DELAY_MS = 400;
const TRIMESTERS = [1, 2, 3] as const;

type ResultTone = "positive" | "negative" | "pending";

const selectClass =
  "h-9 appearance-none rounded-xl border border-gray-200 bg-white pl-3 pr-8 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary";

/** "Positivo", "NEGATIVA", "pendente"… → tom do resultado devolvido pela API. */
function toneOf(resultado: string): ResultTone | null {
  const value = resultado.trim().toLowerCase();
  if (value.startsWith("posit") || value.startsWith("aprov")) return "positive";
  if (value.startsWith("negat") || value.startsWith("reprov")) return "negative";
  if (value.startsWith("pend") || value === "") return "pending";
  return null;
}

/** Estado da mini-pauta → estilo do selo. */
function estadoStyle(estado: string) {
  const value = estado.toLowerCase();
  if (value.includes("conclu") || value.includes("fechad")) {
    return { className: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" };
  }
  if (value.includes("inici") || value.includes("aguard")) {
    return { className: "bg-gray-100 text-gray-500", dot: "bg-gray-400" };
  }
  return { className: "bg-amber-50 text-amber-600", dot: "bg-amber-500" };
}

function GradeText({ value }: { value: string | null }) {
  if (value === null || value === "") return <span className="text-gray-300">—</span>;
  return (
    <span className={Number(value) < 10 ? "font-bold text-negative" : "text-gray-800"}>
      {formatDecimal(value)}
    </span>
  );
}

function saveFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Mini-pauta (só leitura) de uma turma-disciplina do professor:
 * `GET /api/teacher/mini-pautas/` e `GET /api/teacher/mini-pautas/pdf/`.
 */
export function MiniPautaView() {
  const searchParams = useSearchParams();
  const classes = useTeacherClasses();
  const [selectedId, setSelectedId] = useState(searchParams.get("turmaDisciplina") ?? "");
  const [trimestre, setTrimestre] = useState<number | "">(() => {
    const value = Number(searchParams.get("trimestre"));
    return TRIMESTERS.includes(value as 1 | 2 | 3) ? value : "";
  });
  const [view, setView] = useState<MiniPautaResultFilter>("todos");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [downloading, setDownloading] = useState(false);

  // Pesquisa no servidor depois de o professor parar de escrever.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const options = [...classes.items].sort(
    (a, b) =>
      a.classe - b.classe ||
      a.turma.localeCompare(b.turma, "pt", { numeric: true }) ||
      a.disciplina.localeCompare(b.disciplina, "pt"),
  );
  const turmaDisciplinaId = selectedId || options[0]?.id || "";
  const params = turmaDisciplinaId
    ? {
        turma_disciplina_id: turmaDisciplinaId,
        trimestre: trimestre || undefined,
        resultado: view === "todos" ? undefined : view,
        search: search || undefined,
      }
    : null;
  const { miniPauta, status, error } = useMiniPauta(params);

  const students: MiniPautaStudent[] = miniPauta?.alunos ?? [];
  const totalPages = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = paginate(students, currentPage, PAGE_SIZE);
  const firstRow = students.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastRow = Math.min(currentPage * PAGE_SIZE, students.length);
  const launchHref = turmaDisciplinaId
    ? `/teacher/lancamento-de-notas?turmaDisciplina=${turmaDisciplinaId}`
    : "/teacher/lancamento-de-notas";

  const loading =
    classes.status === "loading" || classes.status === "idle" || status === "loading";

  const changeView = (next: MiniPautaResultFilter) => {
    setView(next);
    setPage(1);
  };

  async function downloadPdf() {
    if (!params) return;
    setDownloading(true);
    try {
      const { turma_disciplina_id, trimestre: t, resultado, search: s } = params;
      const blob = await downloadMiniPautaPdf(
        { turma_disciplina_id, trimestre: t, resultado, search: s },
        currentAccessToken(),
      );
      const name = (miniPauta?.titulo || "mini-pauta").replace(/[^\p{L}\p{N}]+/gu, "-");
      saveFile(blob, `${name}.pdf`);
      notify.success("PDF da mini-pauta descarregado.");
    } catch (cause) {
      notify.error(cause, "Não foi possível gerar o PDF da mini-pauta.");
    } finally {
      setDownloading(false);
    }
  }

  const metadata = miniPauta
    ? [
        { label: "Turma", value: miniPauta.turma },
        { label: "Curso", value: miniPauta.curso || "—" },
        { label: "Disciplina", value: miniPauta.disciplina },
        { label: "Período", value: miniPauta.periodo || "—" },
        { label: "Média da turma", value: formatDecimal(miniPauta.media_turma) },
      ]
    : [];
  const estado = miniPauta ? estadoStyle(miniPauta.estado) : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Título e barra de ações */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {miniPauta ? miniPauta.titulo || `${miniPauta.disciplina} · ${miniPauta.turma}` : "Mini-pauta"}
          </h2>
          <p className="mt-0.5 text-xs text-gray-400">
            {miniPauta
              ? `${miniPauta.periodo || "Trimestre aberto"} · ${miniPauta.total} alunos`
              : loading
                ? "A carregar a mini-pauta..."
                : "Sem mini-pauta disponível para esta seleção"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 print:hidden">
          <span className="flex h-9 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 shadow-sm">
            <Calendar className="size-3.5 text-gray-400" />
            <span>{miniPauta?.ano_letivo || options[0]?.ano_letivo || "—"}</span>
          </span>

          <label className="relative">
            <span className="sr-only">Trimestre</span>
            <select
              value={trimestre}
              onChange={(event) => {
                setTrimestre(event.target.value ? Number(event.target.value) : "");
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="">Trimestre aberto</option>
              {TRIMESTERS.map((t) => (
                <option key={t} value={t}>
                  {t}.º Trimestre
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-gray-400" />
          </label>

          <label className="relative">
            <span className="sr-only">Turma e disciplina</span>
            <select
              value={turmaDisciplinaId}
              onChange={(event) => {
                setSelectedId(event.target.value);
                setPage(1);
              }}
              disabled={options.length === 0}
              className={selectClass}
            >
              {options.length === 0 && <option value="">Sem turmas atribuídas</option>}
              {options.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.turma} · {item.disciplina}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-gray-400" />
          </label>

          <button
            type="button"
            onClick={() => window.print()}
            disabled={!miniPauta}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
          >
            <Printer className="size-3.5 text-gray-500" />
            <span>Imprimir</span>
          </button>

          <button
            type="button"
            onClick={() => void downloadPdf()}
            disabled={!miniPauta || downloading}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
          >
            <FileDown className="size-3.5" />
            <span>{downloading ? "A gerar..." : "Exportar PDF"}</span>
          </button>
        </div>
      </div>

      {(error || classes.error) && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error ?? classes.error}
        </p>
      )}

      {/* Banner com metadados */}
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-gray-100 bg-white p-4 text-xs shadow-sm md:grid-cols-6">
        {miniPauta && estado ? (
          <>
            {metadata.map((item) => (
              <div key={item.label}>
                <p className="text-[10px] font-semibold text-gray-400 uppercase">{item.label}</p>
                <p className="mt-1 truncate font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase">Estado</p>
              <span
                className={cn(
                  "mt-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold",
                  estado.className,
                )}
              >
                <span className={cn("size-1.5 rounded-full", estado.dot)} />
                {miniPauta.estado || "—"}
              </span>
            </div>
          </>
        ) : (
          <p className="col-span-2 text-xs text-gray-400 md:col-span-6">
            {loading
              ? "A carregar..."
              : options.length === 0
                ? "Ainda não tem turmas e disciplinas atribuídas."
                : "Escolha outro trimestre ou turma para ver a mini-pauta."}
          </p>
        )}
      </div>

      {/* Tabela */}
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium">
            <ViewTab label="Todos" count={miniPauta?.total ?? 0} active={view === "todos"} onClick={() => changeView("todos")} />
            <ViewTab
              label="Positivos"
              count={miniPauta?.positivas ?? 0}
              active={view === "positivas"}
              onClick={() => changeView("positivas")}
              tone="positive"
            />
            <ViewTab
              label="Negativos"
              count={miniPauta?.negativas ?? 0}
              active={view === "negativas"}
              onClick={() => changeView("negativas")}
              tone="negative"
            />
            <ViewTab
              label="Pendentes"
              count={miniPauta?.pendentes ?? 0}
              active={view === "pendentes"}
              onClick={() => changeView("pendentes")}
              tone="pending"
            />
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Pesquisar nome ou processo"
              className="w-full rounded-xl border border-gray-200 py-1.5 pr-3 pl-9 text-xs text-gray-700 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                <th className="px-3 py-2.5">N.º</th>
                <th className="px-3 py-2.5">Estudante</th>
                <th className="px-3 py-2.5 text-center">Sexo</th>
                {[
                  ["MAC", "aval. contínua"],
                  ["PP", "prova professor"],
                  ["PT", "prova trimestre"],
                ].map(([label, description]) => (
                  <th key={label} className="px-3 py-2.5 text-center">
                    <div>{label}</div>
                    <div className="text-[8px] font-normal text-gray-400 lowercase">{description}</div>
                  </th>
                ))}
                <th className="px-3 py-2.5 text-center">MT</th>
                <th className="px-3 py-2.5 text-center">Resultado</th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {rows.map((student) => {
                const tone = toneOf(student.resultado);
                return (
                  <tr
                    key={student.enrollment_id}
                    className={cn("transition hover:bg-gray-50/50", tone === "pending" && "bg-amber-50/20")}
                  >
                    <td className="px-3 py-3 font-semibold text-gray-400">
                      {String(student.numero).padStart(2, "0")}
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-bold text-gray-900">{student.aluno}</p>
                      <p className="text-[10px] text-gray-400">{student.numero_processo}</p>
                    </td>
                    <td className="px-3 py-3 text-center font-medium text-gray-500">
                      {student.sexo || "—"}
                    </td>
                    <td className="px-3 py-3 text-center font-semibold"><GradeText value={student.mac} /></td>
                    <td className="px-3 py-3 text-center font-semibold"><GradeText value={student.pp} /></td>
                    <td className="px-3 py-3 text-center font-semibold"><GradeText value={student.pt} /></td>
                    <td className="px-3 py-3 text-center font-black"><GradeText value={student.mt} /></td>
                    <td className="px-3 py-3 text-center">
                      {tone ? (
                        <ResultBadge tone={tone}>{student.resultado || "Pendente"}</ResultBadge>
                      ) : (
                        <span className="text-gray-500">{student.resultado}</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Link
                        href={launchHref}
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
              {loading ? "A carregar estudantes..." : "Nenhum estudante encontrado."}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-3 text-xs text-gray-400 sm:flex-row">
          <p>
            {firstRow}–{lastRow} de {students.length} estudantes · Negativas (abaixo de 10) a
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
                    ? "bg-accent font-bold text-primary"
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
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row print:hidden">
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
          {/* Sem endpoint de histórico por mini-pauta: mantém-se como estava. */}
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <History className="size-3.5 text-gray-500" />
            <span>Ver histórico</span>
          </button>
          <Link
            href={launchHref}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-primary/90"
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
    all: "bg-accent text-primary",
    positive: "bg-emerald-50 text-emerald-600",
    negative: "bg-negative-soft text-negative",
    pending: "bg-amber-50 text-amber-600",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 pb-1 transition",
        active ? "border-b-2 border-primary font-semibold text-primary" : "text-gray-500 hover:text-gray-700",
      )}
    >
      <span>{label}</span>
      <span className={cn("rounded-full px-1.5 py-px text-[10px] font-bold", badge)}>{count}</span>
    </button>
  );
}

function ResultBadge({ tone, children }: { tone: ResultTone; children: React.ReactNode }) {
  const styles = {
    positive: "bg-emerald-50 text-emerald-600 [&>span]:bg-emerald-500",
    negative: "bg-negative-soft text-negative [&>span]:bg-negative",
    pending: "bg-amber-50 text-amber-600 [&>span]:bg-amber-500",
  }[tone];

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold", styles)}>
      <span className="size-1.5 rounded-full" />
      {children}
    </span>
  );
}

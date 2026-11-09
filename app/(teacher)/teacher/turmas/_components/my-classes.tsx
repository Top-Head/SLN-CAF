"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  HelpCircle,
  Pencil,
  Play,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { FilterSelect } from "@/components/shared/filter-select";
import { useMinhasTurmas } from "@/hooks/teachers/use-minhas-turmas";
import { cn } from "@/lib/utils";
import {
  normalizeClassStatus,
  type ClassStatus,
} from "@/lib/utils/class-status";
import { matchesSearch } from "@/lib/utils/matches-search";
import type { MinhaTurma } from "@/services/minhas-turmas";

type View = "all" | ClassStatus;

const STATUS_LABEL: Record<ClassStatus, string> = {
  in_progress: "Em curso",
  not_started: "Por iniciar",
  completed: "Concluído",
};

const STATUS_STYLES: Record<ClassStatus, { badge: string; dot: string }> = {
  in_progress: { badge: "bg-pending-soft text-pending", dot: "bg-pending" },
  not_started: { badge: "bg-neutral-soft text-neutral", dot: "bg-neutral" },
  completed: { badge: "bg-positive-soft text-positive", dot: "bg-positive" },
};

function statusOf(item: MinhaTurma) {
  return normalizeClassStatus(item.estado, item.progresso, item.completos);
}

function ClassCard({ item }: { item: MinhaTurma }) {
  const statusKey = statusOf(item);
  const isCompleted = statusKey === "completed";
  const percentage = Math.min(100, Math.max(0, Math.round(item.progresso)));
  const status = STATUS_STYLES[statusKey];
  const PrimaryIcon = statusKey === "in_progress" ? Play : Pencil;
  const primaryLabel =
    statusKey === "in_progress"
      ? "Continuar"
      : statusKey === "not_started"
        ? "Lançar notas"
        : "Editar notas";

  return (
    <article className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-neutral/40">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 flex-col items-center justify-center rounded-xl text-xs font-bold",
                isCompleted ? "bg-positive-soft text-positive" : "bg-accent text-primary",
              )}
            >
              <span>{item.classe}.ª</span>
              <span className="-mt-1 text-[9px] font-normal opacity-80">
                classe
              </span>
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm leading-tight font-bold text-foreground">
                {item.disciplina}
              </h3>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {item.turma} · {item.curso}
              </p>
            </div>
          </div>

          <span
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold",
              status.badge,
            )}
          >
            <span className={cn("size-1.5 rounded-full", status.dot)} />
            {STATUS_LABEL[statusKey]}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="size-3.5" />
            <span>{item.total_alunos} estudantes</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            <span>{item.ano_letivo}</span>
          </div>
          {item.is_classe_exame && (
            <span className="rounded bg-info-soft px-2 py-0.5 text-[10px] font-semibold text-info">
              Classe de exame
            </span>
          )}
        </div>

        <div className="mt-4 space-y-2 rounded-xl border bg-muted/60 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">Progresso</span>
            <span className="font-bold text-foreground">
              {item.completos}{" "}
              <span className="font-normal text-muted-foreground">
                / {item.total_alunos} completas
              </span>
            </span>
          </div>

          <div
            role="meter"
            aria-label={`Progresso de ${item.disciplina} da ${item.turma}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentage}
            className="h-1.5 w-full overflow-hidden rounded-full bg-border"
          >
            <div
              className={cn(
                "h-full rounded-full",
                isCompleted ? "bg-positive" : "bg-primary",
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
            {isCompleted ? (
              <CheckCircle className="size-3.5 shrink-0 text-positive" />
            ) : (
              <Clock className="size-3.5 shrink-0" />
            )}
            <span className="truncate">{percentage}% concluído</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Link
          href="/teacher/lancamento-de-notas"
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            isCompleted
              ? "border bg-card text-foreground hover:bg-muted"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          <PrimaryIcon className="size-3.5" />
          <span>{primaryLabel}</span>
        </Link>

        <Link
          href={`/teacher/mini-pautas?turma_disciplina_id=${item.id}`}
          className="flex items-center justify-center gap-1.5 rounded-lg border bg-card px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <FileText className="size-3.5 text-muted-foreground" />
          <span>{isCompleted ? "Ver mini-pauta" : "Mini-pauta"}</span>
        </Link>
      </div>
    </article>
  );
}

export function MyClasses() {
  const { items, status, error, refetch } = useMinhasTurmas();

  const [view, setView] = useState<View>("all");
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("Todos");

  const years = useMemo(
    () =>
      Array.from(new Set(items.map((item) => item.ano_letivo))).sort((a, b) =>
        b.localeCompare(a),
      ),
    [items],
  );

  const activeYear = years.includes(year) ? year : "Todos";

  const visible = useMemo(
    () =>
      items
        .filter((item) => activeYear === "Todos" || item.ano_letivo === activeYear)
        .filter((item) =>
          matchesSearch(
            query,
            item.disciplina,
            item.turma,
            item.curso,
            `${item.classe}.ª`,
          ),
        ),
    [items, query, activeYear],
  );

  const filtered =
    view === "all" ? visible : visible.filter((item) => statusOf(item) === view);

  const classCount = new Set(visible.map((item) => item.turma)).size;
  const subjectCount = new Set(visible.map((item) => item.disciplina)).size;

  const tabs: { key: View; label: string; count: number }[] = [
    { key: "all", label: "Todas", count: visible.length },
    {
      key: "in_progress",
      label: "Em curso",
      count: visible.filter((item) => statusOf(item) === "in_progress").length,
    },
    {
      key: "not_started",
      label: "Por iniciar",
      count: visible.filter((item) => statusOf(item) === "not_started").length,
    },
    {
      key: "completed",
      label: "Concluídas",
      count: visible.filter((item) => statusOf(item) === "completed").length,
    },
  ];

  const isLoading = status === "loading" && items.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">Minhas turmas</h1>

      <section className="space-y-6 rounded-xl border bg-card p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Turmas e disciplinas ({visible.length})
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Atribuídas pela direcção pedagógica · {classCount} turmas ·{" "}
              {subjectCount} disciplinas
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <FilterSelect
              label="Ano lectivo"
              value={activeYear}
              options={["Todos", ...years]}
              onChange={setYear}
              icon={Calendar}
            />

            <div className="relative min-w-[220px] flex-1 sm:w-64 sm:flex-none">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquisar turma ou disciplina"
                aria-label="Pesquisar turma ou disciplina"
                className="w-full rounded-md border bg-card py-2 pr-3 pl-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Filtrar turmas por estado"
          className="flex items-center gap-6 overflow-x-auto border-b text-xs font-medium"
        >
          {tabs.map(({ key, label, count }) => {
            const active = view === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setView(key)}
                className={cn(
                  "flex items-center gap-1.5 border-b-2 pb-3 whitespace-nowrap transition-colors",
                  active
                    ? "border-primary font-semibold text-primary"
                    : "border-transparent text-neutral hover:text-foreground",
                )}
              >
                <span>{label}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    active ? "bg-accent text-primary" : "bg-neutral-soft text-neutral",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {error ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-10 text-center">
            <p className="text-sm text-rose-500">{error}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="rounded-lg border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {isLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[260px] animate-pulse rounded-xl border bg-muted/40"
                />
              ))}

            {!isLoading &&
              filtered.map((item) => <ClassCard key={item.id} item={item} />)}

            {!isLoading && filtered.length === 0 && (
              <p className="col-span-full rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">
                Nenhuma turma encontrada para os filtros selecionados.
              </p>
            )}
          </div>
        )}

        <div className="flex items-start gap-3 rounded-xl border bg-muted/60 p-4 text-xs text-muted-foreground">
          <HelpCircle className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-semibold text-foreground">
              Falta alguma turma ou disciplina?
            </p>
            <p className="mt-0.5">
              As turmas e disciplinas são atribuídas pela direcção pedagógica. Só vê
              as mini-pautas das disciplinas que lecciona.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  HelpCircle,
  Pencil,
  Play,
  Ruler,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { FilterSelect } from "@/components/shared/filter-select";
import { cn } from "@/lib/utils";
import { matchesSearch } from "@/lib/utils/matches-search";

import {
  ACADEMIC_YEARS,
  STATUS_LABEL,
  TRIMESTERS,
  type ClassStatus,
  type TeacherClass,
} from "../_lib/mock-data";

type View = "all" | ClassStatus;

const STATUS_STYLES: Record<ClassStatus, { badge: string; dot: string }> = {
  in_progress: { badge: "bg-pending-soft text-pending", dot: "bg-pending" },
  not_started: { badge: "bg-neutral-soft text-neutral", dot: "bg-neutral" },
  completed: { badge: "bg-positive-soft text-positive", dot: "bg-positive" },
};

function ClassCard({ item }: { item: TeacherClass }) {
  const isCompleted = item.status === "completed";
  const percentage = Math.round((item.completed / item.total) * 100);
  const status = STATUS_STYLES[item.status];
  const PrimaryIcon =
    item.status === "in_progress" ? Play : item.status === "not_started" ? Pencil : Pencil;
  const primaryLabel =
    item.status === "in_progress"
      ? "Continuar"
      : item.status === "not_started"
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
              <span>{item.grade}</span>
              <span className="-mt-1 text-[9px] font-normal opacity-80">
                {item.subGroup}
              </span>
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm leading-tight font-bold text-foreground">
                {item.subject}
              </h3>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {item.course}
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
            {STATUS_LABEL[item.status]}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="size-3.5" />
            <span>{item.students} estudantes</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler className="size-3.5" />
            <span>{item.scale}</span>
          </div>
          {item.badge && (
            <span className="rounded bg-info-soft px-2 py-0.5 text-[10px] font-semibold text-info">
              {item.badge}
            </span>
          )}
        </div>

        <div className="mt-4 space-y-2 rounded-xl border bg-muted/60 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">{item.trimester}</span>
            <span className="font-bold text-foreground">
              {item.completed}{" "}
              <span className="font-normal text-muted-foreground">
                / {item.total} completas
              </span>
            </span>
          </div>

          <div
            role="meter"
            aria-label={`Progresso de ${item.subject} da ${item.grade} ${item.subGroup}`}
            aria-valuemin={0}
            aria-valuemax={item.total}
            aria-valuenow={item.completed}
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
            <span className="truncate">{item.deadline}</span>
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
          href="/teacher/mini-pautas"
          className="flex items-center justify-center gap-1.5 rounded-lg border bg-card px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <FileText className="size-3.5 text-muted-foreground" />
          <span>{isCompleted ? "Ver mini-pauta" : "Mini-pauta"}</span>
        </Link>
      </div>
    </article>
  );
}

export function MyClasses({ classes }: { classes: TeacherClass[] }) {
  const [view, setView] = useState<View>("all");
  const [query, setQuery] = useState("");
  const [year, setYear] = useState(ACADEMIC_YEARS[0]);
  const [trimester, setTrimester] = useState(TRIMESTERS[0]);

  const visible = useMemo(
    () =>
      classes
        .filter((item) => item.trimester === trimester)
        .filter((item) =>
          matchesSearch(
            query,
            item.subject,
            item.course,
            `${item.grade} ${item.subGroup}`,
          ),
        ),
    [classes, query, trimester],
  );

  const filtered =
    view === "all" ? visible : visible.filter((item) => item.status === view);

  const classCount = new Set(visible.map((item) => `${item.grade}${item.subGroup}`)).size;
  const subjectCount = new Set(visible.map((item) => item.subject)).size;

  const tabs: { key: View; label: string; count: number }[] = [
    { key: "all", label: "Todas", count: visible.length },
    {
      key: "in_progress",
      label: "Em curso",
      count: visible.filter((item) => item.status === "in_progress").length,
    },
    {
      key: "not_started",
      label: "Por iniciar",
      count: visible.filter((item) => item.status === "not_started").length,
    },
    {
      key: "completed",
      label: "Concluídas",
      count: visible.filter((item) => item.status === "completed").length,
    },
  ];

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
              value={year}
              options={ACADEMIC_YEARS}
              onChange={setYear}
              icon={Calendar}
            />
            <FilterSelect
              label="Trimestre"
              value={trimester}
              options={TRIMESTERS}
              onChange={setTrimester}
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

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ClassCard key={item.id} item={item} />
          ))}

          {filtered.length === 0 && (
            <p className="col-span-full rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">
              Nenhuma turma encontrada para os filtros selecionados.
            </p>
          )}
        </div>

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

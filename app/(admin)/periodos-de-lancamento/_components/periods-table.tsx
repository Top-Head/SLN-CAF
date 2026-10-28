"use client";

import { CalendarPlus, Lock, LockOpen, Pencil, Search } from "lucide-react";
import { useState } from "react";

import { IconActionButton } from "@/components/shared/icon-action-button";
import { ListPagination } from "@/components/shared/list-pagination";
import { ListTableHeader } from "@/components/shared/list-table-header";
import { ListTabs } from "@/components/shared/list-tabs";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Tone } from "@/components/shared/tone";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { paginate } from "@/hooks/use-catalog-state";
import { cn } from "@/lib/utils";
import { daysBetween, formatShortDate, plural } from "@/lib/utils/format-date";
import { matchesSearch } from "@/lib/utils/matches-search";

import type { SubjectPeriod } from "../_lib/mock-data";
import { remainingLabel, statusOf, type PeriodStatus } from "../_lib/period-status";

type View = "all" | PeriodStatus;

const PAGE_SIZE = 6;

const STATUS: Record<PeriodStatus, { label: string; tone: Tone }> = {
  open: { label: "Aberto", tone: "positive" },
  ending: { label: "A terminar", tone: "pending" },
  closed: { label: "Encerrado", tone: "neutral" },
  scheduled: { label: "Agendado", tone: "info" },
};

const REMAINING_COLOR: Record<PeriodStatus, string> = {
  open: "text-foreground",
  ending: "text-pending",
  closed: "text-muted-foreground",
  scheduled: "text-info",
};

const COLUMNS = [
  { label: "Disciplina" },
  { label: "Período", className: "w-[150px]" },
  { label: "Tempo restante", className: "w-[140px]" },
  { label: "Notas lançadas", className: "w-[170px]" },
  { label: "Estado", className: "w-[116px]" },
  { label: "Ações", className: "w-[112px] text-right" },
];

function progressColor(status: PeriodStatus, launched: number) {
  if (status === "ending") return "bg-pending";
  return launched >= 50 ? "bg-positive" : "bg-primary";
}

export type PeriodAction = "extend" | "close" | "reopen" | "openNow";

type PeriodsTableProps = {
  periods: SubjectPeriod[];
  today: Date;
  onAction: (id: string, action: PeriodAction) => void;
};

export function PeriodsTable({ periods, today, onAction }: PeriodsTableProps) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("all");
  const [page, setPage] = useState(1);

  const statuses = new Map(periods.map((p) => [p.id, statusOf(p, today)]));
  const countOf = (status: PeriodStatus) =>
    periods.filter((p) => statuses.get(p.id) === status).length;

  const searched = periods.filter((p) => matchesSearch(query, p.subject));
  const filtered =
    view === "all" ? searched : searched.filter((p) => statuses.get(p.id) === view);
  const rows = paginate(filtered, page, PAGE_SIZE);

  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <ListTabs
        value={view}
        onChange={(next) => {
          setView(next);
          setPage(1);
        }}
        tabs={[
          { key: "all", label: "Todas", count: periods.length, tone: "primary" },
          { key: "open", label: "Abertas", count: countOf("open"), tone: "positive" },
          { key: "ending", label: "A terminar", count: countOf("ending"), tone: "pending" },
          { key: "closed", label: "Encerradas", count: countOf("closed"), tone: "neutral" },
          { key: "scheduled", label: "Agendadas", count: countOf("scheduled"), tone: "info" },
        ]}
      >
        <label className="ml-auto flex h-9 w-[220px] shrink-0 items-center gap-2 rounded-md border bg-card px-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Pesquisar disciplina"
            className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
        </label>
      </ListTabs>

      <div className="px-6 pt-4">
        <Table>
          <ListTableHeader columns={COLUMNS} />
          <TableBody>
            {rows.map((period) => {
              const status = statuses.get(period.id)!;
              const length = daysBetween(period.start, period.end) + 1;
              const canExtend = status === "open" || status === "ending";

              return (
                <TableRow key={period.id} className="h-14 text-[13px] last:border-0">
                  <TableCell className="pl-4">
                    <span className="flex flex-col gap-0.5">
                      <span className="font-medium">{period.subject}</span>
                      <span className="text-[11px] text-muted-foreground">{period.scope}</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex flex-col gap-0.5">
                      <span>
                        {formatShortDate(period.start)} – {formatShortDate(period.end)}
                      </span>
                      {period.extendedBy > 0 ? (
                        <span className="text-[11px] text-pending">
                          Prolongado +{plural(period.extendedBy, "dia", "dias")}
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">
                          {plural(length, "dia", "dias")}
                        </span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className={cn("text-xs font-medium", REMAINING_COLOR[status])}>
                    {remainingLabel(period, today)}
                  </TableCell>
                  <TableCell>
                    {status === "scheduled" ? (
                      <span className="text-xs text-muted-foreground">Ainda não iniciado</span>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <div
                          role="meter"
                          aria-label={`Notas lançadas em ${period.subject}`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={period.launched}
                          className="h-1.5 w-[110px] overflow-hidden rounded-[3px] bg-[#f0f0f4]"
                        >
                          <div
                            className={cn("h-full rounded-[3px]", progressColor(status, period.launched))}
                            style={{ width: `${period.launched}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{period.launched}%</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge tone={STATUS[status].tone}>{STATUS[status].label}</StatusBadge>
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex justify-end gap-2">
                      <IconActionButton icon={Pencil} label={`Editar período de ${period.subject}`} />
                      <IconActionButton
                        icon={CalendarPlus}
                        label={`Prolongar prazo de ${period.subject} em 3 dias`}
                        variant={status === "ending" ? "warning" : "default"}
                        disabled={!canExtend}
                        onClick={() => onAction(period.id, "extend")}
                      />
                      {status === "closed" || status === "scheduled" ? (
                        <IconActionButton
                          icon={LockOpen}
                          label={
                            status === "closed"
                              ? `Reabrir ${period.subject}`
                              : `Abrir ${period.subject} agora`
                          }
                          onClick={() =>
                            onAction(period.id, status === "closed" ? "reopen" : "openNow")
                          }
                        />
                      ) : (
                        <IconActionButton
                          icon={Lock}
                          label={`Encerrar ${period.subject}`}
                          onClick={() => onAction(period.id, "close")}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={COLUMNS.length} className="h-24 text-center text-muted-foreground">
                  Nenhuma disciplina encontrada.
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
        noun="disciplinas"
        onPageChange={setPage}
      />
    </section>
  );
}

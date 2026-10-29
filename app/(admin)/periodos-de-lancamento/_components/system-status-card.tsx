"use client";

import { Calendar, Lock, LockOpen } from "lucide-react";
import { Fragment } from "react";

import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";
import { daysBetween, formatShortDate, plural } from "@/lib/utils/format-date";

import type { SYSTEM } from "../_lib/mock-data";

type SystemStatusCardProps = {
  system: typeof SYSTEM;
  today: Date;
  open: boolean;
  onToggle: () => void;
  openSubjects: number;
  totalSubjects: number;
};

export function SystemStatusCard({
  system,
  today,
  open,
  onToggle,
  openSubjects,
  totalSubjects,
}: SystemStatusCardProps) {
  const total = daysBetween(system.opensOn, system.closesOn);
  const elapsed = Math.min(total, Math.max(0, daysBetween(system.opensOn, today)));
  const left = total - elapsed;

  const indicators = [
    { label: "Disciplinas abertas", value: String(openSubjects), total: `de ${totalSubjects}` },
    {
      label: "Notas lançadas",
      value: `${system.gradesLaunched}%`,
      total: `de ${system.gradesTotal.toLocaleString("pt-PT")}`,
    },
    {
      label: "Professores com pendências",
      value: String(system.teachersWithPending),
      total: `de ${system.teachersTotal}`,
    },
  ];

  return (
    <section className="flex flex-col gap-5 rounded-[10px] border bg-card px-6 py-[22px]">
      <div className="flex flex-wrap items-center gap-4">
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-full",
            open ? "bg-positive-soft text-positive" : "bg-neutral-soft text-neutral",
          )}
        >
          {open ? <LockOpen className="size-[22px]" /> : <Lock className="size-[22px]" />}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[11px] font-medium text-muted-foreground">ESTADO DO SISTEMA</span>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-sans text-lg font-semibold">
              Lançamento de notas {open ? "aberto" : "fechado"}
            </h2>
            {open ? (
              <StatusBadge tone="positive">Aberto</StatusBadge>
            ) : (
              <StatusBadge tone="neutral">Fechado</StatusBadge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {system.trimester} · Ano lectivo {system.year} · Aberto por {system.openedBy} a{" "}
            {system.openedAt}
          </p>
        </div>
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-md border bg-card pr-4 pl-3.5 text-[13px] transition-colors hover:bg-muted"
        >
          <Calendar className="size-4 text-neutral" />
          Editar datas
        </button>
        <button
          type="button"
          onClick={onToggle}
          className="flex h-10 items-center gap-2 rounded-md bg-foreground pr-4 pl-3.5 text-[13px] font-medium text-background transition-colors hover:bg-foreground/90"
        >
          {open ? <Lock className="size-4" /> : <LockOpen className="size-4" />}
          {open ? "Fechar sistema" : "Abrir sistema"}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-y-4 border-t pt-[18px]">
        <div className="flex min-w-[260px] flex-1 flex-col gap-2 pr-8">
          <div className="flex justify-between gap-4 text-xs whitespace-nowrap">
            <span className="text-neutral">Abertura · {formatShortDate(system.opensOn)}</span>
            <span className="font-semibold">
              {left > 0 ? `Faltam ${plural(left, "dia", "dias")}` : "Prazo geral terminado"}
            </span>
            <span className="text-neutral">Fecho geral · {formatShortDate(system.closesOn)}</span>
          </div>
          <div
            role="progressbar"
            aria-label="Prazo geral decorrido"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={elapsed}
            className="h-2 overflow-hidden rounded-sm bg-[#f0f0f4]"
          >
            <div
              className="h-full rounded-sm bg-positive"
              style={{ width: `${(elapsed / total) * 100}%` }}
            />
          </div>
        </div>
        {indicators.map(({ label, value, total: of }) => (
          <Fragment key={label}>
            <div aria-hidden className="h-10 w-px bg-border" />
            <div className="flex flex-col gap-1 pr-2 pl-6 whitespace-nowrap">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="flex items-baseline gap-1.5">
                <span className="text-xl font-black">{value}</span>
                <span className="text-xs text-muted-foreground">{of}</span>
              </span>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}

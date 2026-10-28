import { Check, Info } from "lucide-react";
import Link from "next/link";

import { TONES } from "@/components/shared/tone";
import { cn } from "@/lib/utils";

import type { HistoryEvent } from "../_lib/mock-data";

export function HistoryAndRules({
  events,
  rules,
}: {
  events: HistoryEvent[];
  rules: string[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      <section className="flex flex-col gap-3.5 rounded-lg border bg-card px-6 py-5">
        <div className="flex items-center gap-4">
          <h2 className="flex-1 font-sans text-[15px] font-semibold">Histórico recente</h2>
          <Link
            href="/historico-de-alteracoes"
            className="text-[13px] font-medium text-primary hover:underline"
          >
            Ver histórico completo
          </Link>
        </div>
        <ul aria-live="polite" className="flex flex-col gap-3.5">
          {events.slice(0, 3).map((event) => (
            <li key={event.id} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                  TONES[event.tone],
                )}
              >
                {event.initials}
              </span>
              <p className="min-w-0 flex-1 text-[13px] text-neutral">
                <span className="font-semibold text-foreground">{event.author}</span>{" "}
                {event.action}
              </p>
              <span className="shrink-0 text-xs text-muted-foreground">{event.when}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border bg-table-head px-6 py-5">
        <h2 className="flex items-center gap-2 font-sans text-[15px] font-semibold">
          <Info className="size-4 text-neutral" />
          Como funcionam os períodos
        </h2>
        <ul className="flex flex-col gap-3">
          {rules.map((rule) => (
            <li key={rule} className="flex items-start gap-2 text-xs text-neutral">
              <Check className="mt-px size-3.5 shrink-0 text-positive" />
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

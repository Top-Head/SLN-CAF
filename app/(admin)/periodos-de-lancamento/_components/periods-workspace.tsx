"use client";

import { CalendarPlus } from "lucide-react";
import { useState } from "react";

import { FilterSelect } from "@/components/shared/filter-select";
import { PageContext } from "@/components/shared/page-context";
import { addDays, daysBetween, formatShortDate } from "@/lib/utils/format-date";

import {
  GRADE_FILTERS,
  HISTORY,
  PERIODS,
  RULES,
  SYSTEM,
  TODAY,
  TRIMESTERS,
  type HistoryEvent,
} from "../_lib/mock-data";
import { statusOf } from "../_lib/period-status";
import { HistoryAndRules } from "./history-and-rules";
import { PeriodsTable, type PeriodAction } from "./periods-table";
import { SystemStatusCard } from "./system-status-card";

const EXTENSION_DAYS = 3;
const REOPEN_DAYS = 7;

// TODO: substituir pelo utilizador da sessão quando a autenticação estiver pronta.
const CURRENT_USER = { name: "Edilson Capa", initials: "EC" };

export function PeriodsWorkspace() {
  const [systemOpen, setSystemOpen] = useState(true);
  const [periods, setPeriods] = useState(PERIODS);
  const [events, setEvents] = useState(HISTORY);
  const [trimester, setTrimester] = useState(TRIMESTERS[0]);
  const [grades, setGrades] = useState(GRADE_FILTERS[0]);

  const log = (action: string) =>
    setEvents((current): HistoryEvent[] => [
      {
        id: `event-${current.length + 1}`,
        author: CURRENT_USER.name,
        initials: CURRENT_USER.initials,
        tone: "primary",
        action,
        when: "agora",
      },
      ...current,
    ]);

  const handleAction = (id: string, action: PeriodAction) => {
    const period = periods.find((p) => p.id === id);
    if (!period) return;

    let next = period;
    let message = "";
    if (action === "extend") {
      next = { ...period, end: addDays(period.end, EXTENSION_DAYS), extendedBy: period.extendedBy + EXTENSION_DAYS };
      message = `prolongou o prazo de ${period.subject} até ${formatShortDate(next.end)} (+${EXTENSION_DAYS} dias)`;
    } else if (action === "close") {
      next = { ...period, closedManually: true };
      message = `encerrou ${period.subject} antes do fim do prazo`;
    } else if (action === "reopen") {
      const end = daysBetween(TODAY, period.end) < 0 ? addDays(TODAY, REOPEN_DAYS) : period.end;
      next = { ...period, closedManually: false, end };
      message = `reabriu ${period.subject} até ${formatShortDate(end)}`;
    } else {
      next = { ...period, start: TODAY };
      message = `abriu ${period.subject} antes da data agendada`;
    }

    setPeriods((all) => all.map((p) => (p.id === id ? next : p)));
    log(message);
  };

  const openSubjects = periods.filter((p) => {
    const status = statusOf(p, TODAY);
    return status === "open" || status === "ending";
  }).length;

  return (
    <div className="flex flex-col gap-6">
      <SystemStatusCard
        system={SYSTEM}
        today={TODAY}
        open={systemOpen}
        onToggle={() => {
          setSystemOpen(!systemOpen);
          log(systemOpen ? "fechou o sistema de lançamento de notas" : "reabriu o sistema de lançamento de notas");
        }}
        openSubjects={openSubjects}
        totalSubjects={periods.length}
      />

      <div className="flex flex-wrap items-center gap-3">
        <PageContext
          title="Prazos por disciplina"
          subtitle="Depois do prazo, os professores deixam de poder lançar notas na disciplina"
        />
        <FilterSelect label="Trimestre" value={trimester} options={TRIMESTERS} onChange={setTrimester} />
        <FilterSelect label="Classes" value={grades} options={GRADE_FILTERS} onChange={setGrades} />
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-md bg-primary pr-4 pl-3.5 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <CalendarPlus className="size-4" />
          Definir período
        </button>
      </div>

      <PeriodsTable periods={periods} today={TODAY} onAction={handleAction} />

      <HistoryAndRules events={events} rules={RULES} />
    </div>
  );
}

import { daysBetween, plural } from "@/lib/utils/format-date";

import type { SubjectPeriod } from "./mock-data";

export type PeriodStatus = "open" | "ending" | "closed" | "scheduled";

/** Dias de prazo a partir dos quais uma disciplina passa a "A terminar". */
const ENDING_THRESHOLD = 2;

export function statusOf(period: SubjectPeriod, today: Date): PeriodStatus {
  if (daysBetween(today, period.start) > 0) return "scheduled";
  const left = daysBetween(today, period.end);
  if (period.closedManually || left < 0) return "closed";
  return left <= ENDING_THRESHOLD ? "ending" : "open";
}

export function remainingLabel(period: SubjectPeriod, today: Date) {
  const status = statusOf(period, today);
  if (status === "scheduled") {
    return `Abre em ${plural(daysBetween(today, period.start), "dia", "dias")}`;
  }
  const left = daysBetween(today, period.end);
  if (status === "closed") {
    const ago = Math.max(0, -left);
    return ago === 0 ? "Encerrado hoje" : `Encerrado há ${plural(ago, "dia", "dias")}`;
  }
  if (left === 0) return "Termina hoje";
  if (left === 1) return "Termina amanhã";
  return `Faltam ${plural(left, "dia", "dias")}`;
}

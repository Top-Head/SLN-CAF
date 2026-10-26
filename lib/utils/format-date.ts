const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const DAY_MS = 24 * 60 * 60 * 1000;

/** Data local sem horas, para contas de dias sem surpresas de fuso horário. */
export function day(year: number, month: number, date: number) {
  return new Date(year, month - 1, date);
}

/** 2026-10-06 → "06 Out" */
export function formatShortDate(value: Date) {
  return `${String(value.getDate()).padStart(2, "0")} ${MONTHS[value.getMonth()]}`;
}

/** 2026-12-12 → "12/12/2026" */
export function formatNumericDate(value: Date) {
  return value.toLocaleDateString("pt-PT");
}

export function daysBetween(from: Date, to: Date) {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS);
}

export function addDays(value: Date, days: number) {
  return new Date(value.getTime() + days * DAY_MS);
}

export const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

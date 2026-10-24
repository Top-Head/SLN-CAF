/** Nota mínima de aprovação na escala de 0 a 20. */
export const PASS_GRADE = 10;

/** 12.5 vai equivaler a "12,5"; se for `null` vai retornar isso "—" */
export function formatGrade(value: number | null, decimals = 1) {
  if (value === null) return "—";
  return value.toLocaleString("pt-PT", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function parseGrade(text: string): number | null | undefined {
  const trimmed = text.trim().replace(",", ".");
  if (trimmed === "" || trimmed === "—" || trimmed === "-") return null;
  const number = Number(trimmed);
  if (!Number.isFinite(number) || number < 0 || number > 20) return undefined;
  return Math.round(number * 10) / 10;
}

/** Média com uma casa decimal; `null` se faltar alguma nota. */
export function averageOf(values: (number | null)[]) {
  if (values.length === 0 || values.some((v) => v === null)) return null;
  const sum = (values as number[]).reduce((total, v) => total + v, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

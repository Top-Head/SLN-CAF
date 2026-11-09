export type ClassStatus = "completed" | "in_progress" | "not_started";

/**
 * Normaliza o estado devolvido pela API (rótulo PT ou chave em inglês) para os
 * três estados usados na UI. Quando o texto não é reconhecido, recorre ao
 * progresso lançado para inferir o estado.
 */
export function normalizeClassStatus(
  estado: string,
  progresso?: number,
  completos?: number,
): ClassStatus {
  const normalized = estado.trim().toLowerCase();

  if (
    normalized.includes("conclu") ||
    normalized.includes("complet") ||
    normalized.includes("fechad")
  ) {
    return "completed";
  }

  if (
    normalized.includes("curso") ||
    normalized.includes("progress") ||
    normalized.includes("andamento") ||
    normalized.includes("abert")
  ) {
    return "in_progress";
  }

  if (
    normalized.includes("iniciar") ||
    normalized.includes("started") ||
    normalized.includes("pendente") ||
    normalized.includes("pending")
  ) {
    return "not_started";
  }

  if (typeof progresso === "number") {
    if (progresso >= 100) return "completed";
    if (progresso > 0) return "in_progress";
  }

  if (typeof completos === "number" && completos > 0) return "in_progress";

  return "not_started";
}

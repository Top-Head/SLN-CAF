/** Conversões dos dados de `/api/teacher/*` para os componentes do professor. */

export type LaunchStatus = "in_progress" | "not_started" | "completed";

/**
 * Estado de lançamento a partir do texto da API (ex.: "Em curso",
 * "Concluído", "Por iniciar") e, sem texto reconhecido, do progresso.
 */
export function launchStatusOf(estado: string, progresso: number): LaunchStatus {
  const value = estado.trim().toLowerCase();
  if (value.includes("conclu") || value.includes("complet")) return "completed";
  if (value.includes("inici") || value.includes("nao") || value.includes("não")) {
    return progresso > 0 ? "in_progress" : "not_started";
  }
  if (value.includes("curso") || value.includes("andamento")) return "in_progress";
  if (progresso >= 100) return "completed";
  return progresso > 0 ? "in_progress" : "not_started";
}

/** "12.ª IB" com classe 12 → "IB"; nomes sem prefixo ficam iguais. */
export function turmaSuffix(turma: string, classe: number) {
  const suffix = turma.replace(new RegExp(`^\s*${classe}\s*(\.ª|ª|º|\.º)?\s*`), "").trim();
  return suffix || turma;
}

/** Escala de 0–10 até à 6.ª classe e de 0–20 a partir da 7.ª. */
export const scaleLabel = (classe: number) => (classe <= 6 ? "Escala 0–10" : "Escala 0–20");

export const trimesterLabel = (numero?: number | null) =>
  numero ? `${numero}.º Trimestre` : "Trimestre aberto";

export const launchHref = (turmaDisciplinaId: string) =>
  `/teacher/lancamento-de-notas?turmaDisciplina=${encodeURIComponent(turmaDisciplinaId)}`;

export const miniPautaHref = (turmaDisciplinaId: string) =>
  `/teacher/mini-pautas?turmaDisciplina=${encodeURIComponent(turmaDisciplinaId)}`;

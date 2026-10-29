import { Clock, Eye, KeyRound, UserX } from "lucide-react";

import type { SummaryStat } from "@/components/shared/summary-cards";
import { seededAccessCode } from "@/lib/utils/access-code";

export const ACCESS_SUMMARY: SummaryStat[] = [
  { label: "Códigos activos", value: 96, icon: KeyRound, tone: "positive", iconSize: 20 },
  { label: "Acessos aos boletins", value: 342, icon: Eye, tone: "info", iconSize: 20 },
  { label: "Códigos expirados", value: 14, icon: Clock, tone: "pending", iconSize: 20 },
  { label: "Alunos sem código", value: 10, icon: UserX, tone: "primary", iconSize: 20 },
];

export const CLASSES = ["10.ª IA", "10.ª IB", "11.ª IF", "12.ª IB", "12.ª ID"];
export const TRIMESTERS = ["1.º Trimestre", "2.º Trimestre", "3.º Trimestre"];

/** Validade dos códigos gerados agora: fim do trimestre. */
export const CODE_VALID_UNTIL = "12/12/2026";

export type AccessCode = {
  id: string;
  student: string;
  process: string;
  guardian: string;
  phone: string;
  /** `null` quando o aluno ainda não tem código. */
  code: string | null;
  validUntil: string | null;
  expired: boolean;
  lastAccess: string | null;
};

type Seed = [string, string, string, "active" | "expired" | "none", string | null];

const SEED: Seed[] = [
  ["Ana Paula Domingos", "Maria Domingos", "923 412 118", "active", "Hoje, 09:14"],
  ["António José Manuel", "José Manuel", "912 334 560", "active", "Ontem, 18:40"],
  ["Beatriz da Costa", "Luísa da Costa", "931 220 874", "active", null],
  ["Carlos Alberto Miguel", "Alberto Miguel", "924 118 903", "expired", "28 Set, 20:02"],
  ["Daniela Luís Fernandes", "Rosa Fernandes", "923 905 441", "active", "14 Out, 11:27"],
  ["Edson Pedro Cassoma", "Pedro Cassoma", "917 662 038", "none", null],
  ["Elisa Teresa Mateus", "Teresa Mateus", "926 471 552", "expired", "02 Set, 07:51"],
  ["Francisco João Neto", "João Neto", "934 018 276", "active", "Hoje, 08:03"],
];

const EXTRA: [string, string][] = [
  ["Gabriel Mbala Sousa", "Marta Sousa"], ["Helena Kiame Lopes", "Kiame Lopes"],
  ["Isabel Ndala Fernandes", "Ndala Fernandes"], ["Joaquim Sebastião Nunes", "Sebastião Nunes"],
  ["Kátia Manuela Pinto", "Manuela Pinto"], ["Lucas Domingos Kiala", "Domingos Kiala"],
  ["Mariana Tchissola Lunda", "Tchissola Lunda"], ["Nelson Cassoma Tavares", "Ana Tavares"],
  ["Olga Lukeny Cabral", "Lukeny Cabral"], ["Paulo Bunga Miguel", "Bunga Miguel"],
  ["Quintino Ferreira Neto", "Ferreira Neto"], ["Rosa Maria Vunge", "Maria Vunge"],
  ["Samuel Kassoma Dias", "Kassoma Dias"], ["Teresa Ngola Matias", "Ngola Matias"],
  ["Ulisses Manuel Costa", "Manuel Costa"], ["Vânia Domingas Luís", "Domingas Luís"],
];

// Completa 19 activos, 3 expirados e 2 sem código com as linhas acima.
const EXTRA_STATUS = (i: number): Seed[3] => (i === 4 ? "expired" : i === 11 ? "none" : "active");

const rows: Seed[] = [
  ...SEED,
  ...EXTRA.map(([student, guardian], i): Seed => [
    student,
    guardian,
    `9${String(21 + i).padStart(2, "0")} ${String(300 + i * 17).padStart(3, "0")} ${String(100 + i * 23).slice(-3)}`,
    EXTRA_STATUS(i),
    i % 3 === 0 ? null : `${String(1 + (i % 17)).padStart(2, "0")} Out, ${String(8 + (i % 10)).padStart(2, "0")}:15`,
  ]),
];

export const ACCESS_CODES: AccessCode[] = rows.map(
  ([student, guardian, phone, status, lastAccess], i) => ({
    id: `code-${i + 1}`,
    student,
    process: `2026-${String(101 + i).padStart(4, "0")}`,
    guardian,
    phone,
    code: status === "none" ? null : i === 1 ? "K7QM-4X2P" : seededAccessCode(i),
    validUntil: status === "none" ? null : status === "expired" ? "30/09/2026" : CODE_VALID_UNTIL,
    expired: status === "expired",
    lastAccess: status === "none" ? null : lastAccess,
  }),
);

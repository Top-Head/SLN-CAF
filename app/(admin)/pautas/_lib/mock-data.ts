import { SUBJECTS, type ReportStudent } from "@/components/shared/class-report/report";

export const REPORT_INFO = {
  className: "12.ª IB",
  course: "Ciências Físicas e Biológicas",
  director: "Paulo Sanguli",
  period: "1.º trimestre · 15 Set – 12 Dez",
};

export const YEARS = ["2025/2026", "2024/2025"];
export const TRIMESTERS = ["1.º Trimestre", "2.º Trimestre", "3.º Trimestre"];
export const CLASSES = ["10.ª IA", "10.ª IB", "11.ª IF", "12.ª IB", "12.ª ID"];

type Row = [string, (number | null)[]];

const SEED: Row[] = [
  ["Ana Paula Domingos", [12, 14, 11, 10, 13, 15]],
  ["António José Manuel", [8, 11, 9, 7, 10, 12]],
  ["Beatriz da Costa", [13, null, 12, 11, 14, 13]],
  ["Carlos Alberto Miguel", [9, 10, 8, 9, 11, 10]],
  ["Daniela Luís Fernandes", [15, 16, 14, 13, 15, 17]],
  ["Edson Pedro Cassoma", [6, 9, 7, 8, 9, 11]],
  ["Elisa Teresa Mateus", [11, 12, 10, null, 12, 14]],
  ["Francisco João Neto", [10, 13, 11, 10, 12, 13]],
];

const PASSED = [12, 13, 11, 12, 14, 12];
const FAILED = [8, 9, 10, 7, 9, 11];
const PENDING = [11, 12, null, 10, 13, 12];

// A = aprovado, R = reprovado, P = pendente: completa 8 / 12 / 4 com as linhas acima.
const PATTERN = "ARRARPRARRARPRAR";

const EXTRA_NAMES = [
  "Gabriel Mbala Sousa", "Helena Kiame Lopes", "Isabel Ndala Fernandes",
  "Joaquim Sebastião Nunes", "Kátia Manuela Pinto", "Lucas Domingos Kiala",
  "Mariana Tchissola Lunda", "Nelson Cassoma Tavares", "Olga Lukeny Cabral",
  "Paulo Bunga Miguel", "Quintino Ferreira Neto", "Rosa Maria Vunge",
  "Samuel Kassoma Dias", "Teresa Ngola Matias", "Ulisses Manuel Costa",
  "Vânia Domingas Luís",
];

const rows: Row[] = [
  ...SEED,
  ...EXTRA_NAMES.map((name, i): Row => {
    const kind = PATTERN[i];
    return [name, kind === "A" ? PASSED : kind === "R" ? FAILED : PENDING];
  }),
];

export const REPORT_STUDENTS: ReportStudent[] = rows.map(([name, grades], i) => ({
  id: `report-${i + 1}`,
  name,
  process: `2026-${String(101 + i).padStart(4, "0")}`,
  grades: Object.fromEntries(
    SUBJECTS.map(({ key }, s) => [key, grades[s]]),
  ) as ReportStudent["grades"],
}));

export const ASSESSMENTS = [
  { key: "mac", label: "MAC", description: "Aval. contínua" },
  { key: "pp", label: "PP", description: "Prova professor" },
  { key: "pt", label: "PT", description: "Prova trimestre" },
] as const;

export type AssessmentKey = (typeof ASSESSMENTS)[number]["key"];

/** `null` = nota em falta (até porque 0 é uma nota válida). */
export type StudentGrades = Record<AssessmentKey, number | null>;

export type GradeStudent = {
  id: string;
  name: string;
  process: string;
  grades: StudentGrades;
};

const SEED: [string, StudentGrades][] = [
  ["Ana Paula Domingos", { mac: 14, pp: 16, pt: 15 }],
  ["António José Manuel", { mac: 12, pp: 13, pt: 14 }],
  ["Beatriz da Costa", { mac: 15, pp: null, pt: 16 }],
  ["Carlos Alberto Miguel", { mac: 10, pp: 12, pt: 11 }],
  ["Daniela Luís Fernandes", { mac: 16, pp: 15, pt: null }],
  ["Edson Pedro Cassoma", { mac: 0, pp: 8, pt: 10 }],
  ["Elisa Teresa Mateus", { mac: null, pp: 13, pt: 14 }],
  ["Francisco João Neto", { mac: 18, pp: 17, pt: 19 }],
];

const EXTRA_NAMES = [
  "Gabriel Mbala Sousa", "Helena Kiame Lopes", "Isabel Ndala Fernandes",
  "Joaquim Sebastião Nunes", "Kátia Manuela Pinto", "Lucas Domingos Kiala",
  "Mariana Tchissola Lunda", "Nelson Cassoma Tavares", "Olga Lukeny Cabral",
  "Paulo Bunga Miguel", "Quintino Ferreira Neto", "Rosa Maria Vunge",
  "Samuel Kassoma Dias", "Teresa Ngola Matias", "Ulisses Manuel Costa",
  "Vânia Domingas Luís", "Wilson Paulo Cardoso", "Xavier António Gomes",
  "Yara Celeste Mendes", "Zacarias João Pedro", "Adelina Muxima Rosa",
  "Bruno Eduardo Sapalo", "Cecília Nzinga Lopes", "Délcio Mavinga Santos",
  "Esperança Kalandula Paz", "Filipe Ngunza Tomás", "Graça Valentina Lemos",
];

// Notas determinísticas entre 8 e 18 para os restantes estudantes.
const gradeFor = (i: number, offset: number) => 8 + ((i * 7 + offset * 3) % 11);

export const STUDENTS: GradeStudent[] = [
  ...SEED.map(([name, grades], i) => ({ name, grades, index: i })),
  ...EXTRA_NAMES.map((name, i) => ({
    name,
    index: SEED.length + i,
    grades: { mac: gradeFor(i, 1), pp: gradeFor(i, 2), pt: gradeFor(i, 3) },
  })),
].map(({ name, grades, index }) => ({
  id: `student-${index + 1}`,
  name,
  process: `2026-${String(101 + index).padStart(4, "0")}`,
  grades,
}));

export type Trimester = 1 | 2 | 3;

export const TRIMESTERS: Trimester[] = [1, 2, 3];

export type PeriodStatus = "open" | "closed" | "upcoming";

export type Period = {
  status: PeriodStatus;
  /** "12 de Dezembro, 23:59" */
  closesAt: string;
  /** "12 Dez, 23:59" */
  closesShort: string;
  daysLeft: number;
};

export type TeacherClass = {
  id: string;
  name: string;
  course: string;
  subjects: string[];
  /** Classes de exame: no 3.º trimestre não há PT e a nota final inclui o exame. */
  examRule?: string;
};

export type GradeKey = "mac" | "pp" | "pt" | "exam";

/** `null` = nota em falta (0 é uma nota válida). */
export type Grades = Partial<Record<GradeKey, number | null>>;

export type SheetStudent = {
  id: string;
  name: string;
  process: string;
  gender: "M" | "F";
  grades: Grades;
  /** MT1 e MT2, usadas na MFD do 3.º trimestre das classes de exame. */
  previous?: [number, number];
};

export type SheetMode = "regular" | "exam";

export type Sheet = {
  key: string;
  classInfo: TeacherClass;
  subject: string;
  trimester: Trimester;
  period: Period;
  mode: SheetMode;
  students: SheetStudent[];
};

export const TEACHER_CLASSES: TeacherClass[] = [
  {
    id: "12-ib",
    name: "12.ª IB",
    course: "Ciências Físicas e Biológicas",
    subjects: ["Matemática", "Física"],
  },
  { id: "11-if", name: "11.ª IF", course: "Ciências Físicas e Biológicas", subjects: ["Matemática"] },
  { id: "10-ib", name: "10.ª IB", course: "Ciências Físicas e Biológicas", subjects: ["Física"] },
  {
    id: "9-a",
    name: "9.ª A",
    course: "Ensino geral",
    subjects: ["Matemática"],
    examRule: "9.ª classe: aprova sem nenhuma negativa.",
  },
];

const CLASS_SIZES: Record<string, number> = { "12-ib": 24, "11-if": 28, "10-ib": 35, "9-a": 20 };

const period = (
  status: PeriodStatus,
  closesAt: string,
  closesShort: string,
  daysLeft = 0,
): Period => ({ status, closesAt, closesShort, daysLeft });

const DEFAULT_PERIODS: Record<Trimester, Period> = {
  1: period("open", "12 de Dezembro, 23:59", "12 Dez, 23:59", 4),
  2: period("upcoming", "27 de Março, 23:59", "27 Mar, 23:59"),
  3: period("upcoming", "18 de Junho, 23:59", "18 Jun, 23:59"),
};

const PERIOD_OVERRIDES: Record<string, Partial<Record<Trimester, Period>>> = {
  "12-ib:Física": { 1: period("closed", "5 de Dezembro, 23:59", "05 Dez, 23:59") },
  "9-a:Matemática": {
    1: period("closed", "12 de Dezembro, 23:59", "12 Dez, 23:59"),
    2: period("closed", "27 de Março, 23:59", "27 Mar, 23:59"),
    3: period("open", "30 de Junho, 23:59", "30 Jun, 23:59", 6),
  },
};

/** Estado global do lançamento, mostrado na navegação do professor. */
export const LAUNCH_STATUS = {
  trimester: "1.º trimestre",
  period: DEFAULT_PERIODS[1],
  launchedPercent: 58,
};

export function periodOf(classId: string, subject: string, trimester: Trimester) {
  return PERIOD_OVERRIDES[`${classId}:${subject}`]?.[trimester] ?? DEFAULT_PERIODS[trimester];
}

const FIRST_NAMES = [
  "Gabriel", "Helena", "Isabel", "Joaquim", "Kátia", "Lucas", "Mariana", "Nelson",
  "Olga", "Paulo", "Quintino", "Rosa", "Samuel", "Teresa", "Ulisses", "Vânia",
  "Wilson", "Xavier", "Yara", "Zacarias", "Inácio", "Luzia", "Mateus", "Nádia",
];
const LAST_NAMES = [
  "Mbala", "Kiame", "Ndala", "Sebastião", "Pinto", "Kiala", "Tchissola", "Cassoma",
  "Lukeny", "Bunga", "Ferreira", "Vunge", "Kassoma", "Ngola", "Costa", "Domingos",
  "Cardoso", "Gomes", "Mendes", "Sapalo", "Mavinga", "Tomás", "Lemos", "Nunes",
];

const FEATURED: Record<string, { names: string[]; processPrefix: string }> = {
  "12-ib": {
    processPrefix: "2026-01",
    names: [
      "Ana Paula Domingos", "António José Manuel", "Beatriz da Costa", "Carlos Alberto Miguel",
      "Daniela Luís Fernandes", "Edson Pedro Cassoma", "Elisa Teresa Mateus", "Francisco João Neto",
    ],
  },
  "9-a": {
    processPrefix: "2026-09",
    names: [
      "Adelino Cassule", "Bernarda Nzinga", "Celestino Mbala", "Domingas Sebastião",
      "Eduardo Kiala", "Filomena Tchipa", "Gaspar Muteka", "Helena Quissanga",
    ],
  },
};

const FEATURED_GRADES: Record<string, Grades[]> = {
  "12-ib:Matemática:1": [
    { mac: 14, pp: 16, pt: 15 },
    { mac: 12, pp: 13, pt: 14 },
    { mac: 15, pp: null, pt: 16 },
    { mac: 10, pp: 12, pt: 11 },
    { mac: 16, pp: 15, pt: null },
    { mac: 0, pp: 8, pt: 10 },
    { mac: null, pp: 13, pt: 14 },
    { mac: 18, pp: 17, pt: 19 },
  ],
  "12-ib:Física:1": [
    { mac: 14, pp: 16, pt: 15 },
    { mac: 12, pp: 13, pt: 14 },
    { mac: 15, pp: 14, pt: 16 },
    { mac: 10, pp: 12, pt: 11 },
    { mac: 16, pp: 15, pt: null },
    { mac: 0, pp: 8, pt: 10 },
    { mac: null, pp: 13, pt: 14 },
    { mac: 18, pp: 17, pt: 19 },
  ],
  "9-a:Matemática:3": [
    { mac: 14, pp: 12, exam: 13 },
    { mac: 9, pp: 11, exam: 10 },
    { mac: 16, pp: 15, exam: null },
    { mac: 8, pp: 7, exam: 9 },
    { mac: 17, pp: 18, exam: 16 },
    { mac: 12, pp: null, exam: 11 },
    { mac: 13, pp: 14, exam: 15 },
    { mac: 10, pp: 9, exam: 8 },
  ],
};

const FEATURED_PREVIOUS: Record<string, [number, number][]> = {
  "9-a": [[13, 13], [10, 10], [15, 16], [8, 8], [17, 16], [12, 11], [13, 12], [10, 10]],
};

/** Quantos estudantes gerados ficam com notas em falta, por estado do período. */
const GENERATED_MISSING: Record<string, number> = { "9-a:Matemática:3": 4 };
const DEFAULT_MISSING: Record<PeriodStatus, number> = { open: 3, closed: 0, upcoming: 0 };

function hash(text: string) {
  let h = 2166136261;
  for (const char of text) h = Math.imul(h ^ char.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** Gerador pseudo-aleatório com semente (mulberry32). */
function seeded(seed: string) {
  let state = hash(seed);
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clampGrade = (value: number) => Math.min(20, Math.max(0, Math.round(value)));

const FEMININE_EXCEPTIONS = new Set(["Beatriz", "Isabel", "Raquel", "Esther", "Carmen", "Inês"]);

/** Heurística para o sexo enquanto não existe um cadastro de estudantes. */
function genderOf(name: string): "M" | "F" {
  const firstName = name.split(" ")[0];
  return /a$/i.test(firstName) || FEMININE_EXCEPTIONS.has(firstName) ? "F" : "M";
}

type RosterEntry = {
  id: string;
  name: string;
  process: string;
  gender: "M" | "F";
  level: number;
  previous: [number, number];
};

function rosterOf(classId: string): RosterEntry[] {
  const size = CLASS_SIZES[classId];
  const featured = FEATURED[classId];
  const random = seeded(classId);
  const featuredNames = featured?.names ?? [];
  // Os nomes gerados vêm depois dos destacados, para manter a ordem alfabética.
  const lastInitial = featuredNames.at(-1)?.[0] ?? "A";

  const generated = new Set<string>();
  while (featuredNames.length + generated.size < size) {
    const first = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)];
    if (first[0] > lastInitial) generated.add(`${first} ${last}`);
  }

  const names = [...featuredNames, ...[...generated].sort((a, b) => a.localeCompare(b, "pt"))];
  const prefix = featured?.processPrefix ?? `2026-${classId.split("-")[0].padStart(2, "0")}`;

  return names.map((name, i) => {
    const level = 7 + random() * 11;
    const previous =
      FEATURED_PREVIOUS[classId]?.[i] ??
      ([clampGrade(level + random() * 2 - 1), clampGrade(level + random() * 2 - 1)] as [number, number]);
    return {
      id: `${classId}-${i + 1}`,
      name,
      process: `${prefix}${String(i + 1).padStart(2, "0")}`,
      gender: genderOf(name),
      level,
      previous,
    };
  });
}

export function getSheet(classId: string, subject: string, trimester: Trimester): Sheet | null {
  const classInfo = TEACHER_CLASSES.find((c) => c.id === classId);
  if (!classInfo || !classInfo.subjects.includes(subject)) return null;

  const sheetPeriod = periodOf(classId, subject, trimester);
  if (sheetPeriod.status === "upcoming") return null;

  const key = `${classId}:${subject}:${trimester}`;
  const mode: SheetMode = classInfo.examRule && trimester === 3 ? "exam" : "regular";
  const keys: GradeKey[] = mode === "exam" ? ["mac", "pp", "exam"] : ["mac", "pp", "pt"];
  const random = seeded(key);
  const roster = rosterOf(classId);
  const featured = FEATURED_GRADES[key] ?? [];

  const missingTarget = GENERATED_MISSING[key] ?? DEFAULT_MISSING[sheetPeriod.status];
  const candidates = roster.map((_, i) => i).filter((i) => i >= featured.length);
  const missing = new Set<number>();
  while (missing.size < Math.min(missingTarget, candidates.length)) {
    missing.add(candidates[Math.floor(random() * candidates.length)]);
  }

  const students = roster.map(({ level, previous, ...student }, i): SheetStudent => {
    let grades: Grades;
    if (featured[i]) {
      grades = featured[i];
    } else if (classInfo.examRule && trimester < 3) {
      // Nas classes de exame, a MT de cada trimestre anterior bate com `previous`.
      const mt = previous[trimester - 1];
      grades = { mac: clampGrade(mt + 1), pp: clampGrade(mt - 1), pt: mt };
    } else {
      grades = Object.fromEntries(
        keys.map((k) => [k, clampGrade(level + random() * 6 - 3)]),
      ) as Grades;
    }
    if (missing.has(i)) grades = { ...grades, [keys[Math.floor(random() * keys.length)]]: null };
    return { ...student, grades, previous: mode === "exam" ? previous : undefined };
  });

  return { key, classInfo, subject, trimester, period: sheetPeriod, mode, students };
}

export type ClassStatus = "in_progress" | "not_started" | "completed";

export type TeacherClass = {
  id: string;
  grade: string;
  subGroup: string;
  subject: string;
  course: string;
  status: ClassStatus;
  students: number;
  scale: string;
  trimester: string;
  completed: number;
  total: number;
  deadline: string;
  badge?: string;
};

export const ACADEMIC_YEARS = ["2025/2026", "2024/2025"];

export const TRIMESTERS = ["1.º Trimestre", "2.º Trimestre", "3.º Trimestre"];

export const CLASSES: TeacherClass[] = [
  {
    id: "12-ib-matematica",
    grade: "12.ª",
    subGroup: "IB",
    subject: "Matemática",
    course: "Ciências Físicas e Biológicas",
    status: "in_progress",
    students: 34,
    scale: "Escola 0–20",
    trimester: "1.º Trimestre",
    completed: 18,
    total: 34,
    deadline: "Prazo 12 Dez, 23:59 · faltam 4 dias",
  },
  {
    id: "10-ib-fisica",
    grade: "10.ª",
    subGroup: "IB",
    subject: "Física",
    course: "Ciências Físicas e Biológicas",
    status: "not_started",
    students: 35,
    scale: "Escola 0–20",
    trimester: "1.º Trimestre",
    completed: 0,
    total: 35,
    deadline: "Prazo 08 Dez, 23:59 · faltam 2 dias",
  },
  {
    id: "9-a-matematica",
    grade: "9.ª",
    subGroup: "A",
    subject: "Matemática",
    course: "Ensino geral",
    status: "in_progress",
    students: 20,
    scale: "Escola 0–20",
    trimester: "1.º Trimestre",
    completed: 6,
    total: 20,
    deadline: "Prazo 12 Dez, 23:59 · faltam 4 dias",
    badge: "Classe de exame",
  },
  {
    id: "11-if-matematica",
    grade: "11.ª",
    subGroup: "IF",
    subject: "Matemática",
    course: "Ciências Físicas e Biológicas",
    status: "completed",
    students: 28,
    scale: "Escola 0–20",
    trimester: "1.º Trimestre",
    completed: 28,
    total: 28,
    deadline: "Concluído a 05 Dez · editável até 12 Dez",
  },
  {
    id: "12-ib-fisica",
    grade: "12.ª",
    subGroup: "IB",
    subject: "Física",
    course: "Ciências Físicas e Biológicas",
    status: "completed",
    students: 34,
    scale: "Escola 0–20",
    trimester: "1.º Trimestre",
    completed: 34,
    total: 34,
    deadline: "Concluído a 05 Dez · editável até 08 Dez",
  },
];

export const STATUS_LABEL: Record<ClassStatus, string> = {
  in_progress: "Em curso",
  not_started: "Por iniciar",
  completed: "Concluído",
};

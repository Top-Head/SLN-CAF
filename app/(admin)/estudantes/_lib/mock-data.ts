export type Student = {
  id: number;
  name: string;
  process: string;
  grade: string;
  className: string;
  course: string;
  hasAccessCode: boolean;
};

const NAMES = [
  "Maria da Conceição Kiala",
  "António Manuel Neto",
  "Luísa Domingos Pinto",
  "Carlos Alberto Mendes",
  "Helena Cassoma",
  "Rosa Tchissola Lunda",
  "Teresa Lukeny Cabral",
  "Joaquim Sebastião",
  "Pedro Bunga Miguel",
];

const GRADES = ["10.ª", "10.ª", "11.ª", "11.ª", "12.ª", "12.ª"];
const CLASSES = ["IA", "IB"];
const COURSES = ["Informática", "Electrónica"];

const TOTAL = 1235;
const WITHOUT_CODE = 55;

// Gera a lista completa a partir de poucos nomes para exercitar a paginação.
export const STUDENTS: Student[] = Array.from({ length: TOTAL }, (_, i) => ({
  id: i + 1,
  name: NAMES[i % NAMES.length],
  process: `2026-${String(101 + i).padStart(4, "0")}`,
  grade: GRADES[i % GRADES.length],
  className: CLASSES[i % CLASSES.length],
  course: COURSES[i % COURSES.length],
  hasAccessCode: i < TOTAL - WITHOUT_CODE,
}));

export type SchoolClass = {
  id: string;
  grade: string;
  letter: string;
  room: string;
  course: string;
  cycle: string;
  shift: "Manhã" | "Tarde";
  enrolled: number;
  capacity: number;
  director: string | null;
  subjectsAssigned: number;
  subjectsTotal: number;
};

const MORNING = "07:30–12:30";
const AFTERNOON = "13:00–18:00";

export const SHIFT_HOURS: Record<SchoolClass["shift"], string> = {
  Manhã: MORNING,
  Tarde: AFTERNOON,
};

export const CLASSES: SchoolClass[] = [
  { id: "7A", grade: "7.ª", letter: "A", room: "Sala 01", course: "Formação geral", cycle: "I ciclo", shift: "Manhã", enrolled: 32, capacity: 35, director: "Maria da Conceição Kiala", subjectsAssigned: 10, subjectsTotal: 10 },
  { id: "8B", grade: "8.ª", letter: "B", room: "Sala 03", course: "Formação geral", cycle: "I ciclo", shift: "Tarde", enrolled: 28, capacity: 35, director: "Rosa Tchissola Lunda", subjectsAssigned: 10, subjectsTotal: 10 },
  { id: "10A", grade: "10.ª", letter: "A", room: "Sala 05", course: "Informática", cycle: "II ciclo", shift: "Manhã", enrolled: 35, capacity: 35, director: "António Manuel Neto", subjectsAssigned: 12, subjectsTotal: 12 },
  { id: "10B", grade: "10.ª", letter: "B", room: "Sala 06", course: "Informática", cycle: "II ciclo", shift: "Tarde", enrolled: 30, capacity: 30, director: null, subjectsAssigned: 12, subjectsTotal: 12 },
  { id: "11A", grade: "11.ª", letter: "A", room: "Sala 07", course: "Informática", cycle: "II ciclo", shift: "Manhã", enrolled: 34, capacity: 35, director: "Luísa Domingos Pinto", subjectsAssigned: 12, subjectsTotal: 12 },
  { id: "11B", grade: "11.ª", letter: "B", room: "Sala 08", course: "Eletrónica", cycle: "II ciclo", shift: "Tarde", enrolled: 31, capacity: 35, director: "Carlos Alberto Mendes", subjectsAssigned: 10, subjectsTotal: 12 },
  { id: "12A", grade: "12.ª", letter: "A", room: "Sala 09", course: "Informática", cycle: "II ciclo", shift: "Manhã", enrolled: 29, capacity: 35, director: "Helena Cassoma", subjectsAssigned: 12, subjectsTotal: 12 },
  { id: "12B", grade: "12.ª", letter: "B", room: "Sala 10", course: "Eletrónica", cycle: "II ciclo", shift: "Tarde", enrolled: 33, capacity: 33, director: "Joaquim Sebastião", subjectsAssigned: 12, subjectsTotal: 12 },
];

export function classLabel(c: SchoolClass) {
  return `${c.grade} ${c.letter}`;
}

export function missingTeachers(c: SchoolClass) {
  return c.subjectsTotal - c.subjectsAssigned;
}

export function pendingCount(c: SchoolClass) {
  return (c.director ? 0 : 1) + (missingTeachers(c) > 0 ? 1 : 0);
}

export function isFull(c: SchoolClass) {
  return c.enrolled >= c.capacity;
}

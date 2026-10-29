export type TeacherStatus = "active" | "inactive";

export type Teacher = {
  id: number;
  name: string;
  course: string;
  subject: string;
  classes: string;
  status: TeacherStatus;
  registeredAt: string;
};

const BASE: Omit<Teacher, "id">[] = [
  { name: "Maria da Conceição Kiala", course: "Informática", subject: "Matemática", classes: "7.ª A, 8.ª B, 10.ª A, 12.ª A", status: "active", registeredAt: "02/09/2025" },
  { name: "António Manuel Neto", course: "Electrónica", subject: "Língua Portuguesa", classes: "7.ª A, 8.ª B, 10.ª A", status: "active", registeredAt: "02/09/2025" },
  { name: "Luísa Domingos Pinto", course: "Informática", subject: "Inglês", classes: "7.ª A, 8.ª B, 10.ª A", status: "active", registeredAt: "03/09/2025" },
  { name: "Carlos Alberto Mendes", course: "Electrónica", subject: "Física", classes: "8.ª B, 10.ª A, 12.ª A", status: "active", registeredAt: "03/09/2025" },
  { name: "Helena Cassoma", course: "Informática", subject: "Biologia", classes: "7.ª A, 8.ª B, 10.ª A, 12.ª A", status: "active", registeredAt: "04/09/2025" },
  { name: "Rosa Tchissola Lunda", course: "Electrónica", subject: "Língua Portuguesa", classes: "4.ª A", status: "active", registeredAt: "04/09/2025" },
  { name: "Teresa Lukeny Cabral", course: "Informática", subject: "Língua Portuguesa", classes: "6.ª A", status: "active", registeredAt: "05/09/2025" },
  { name: "Joaquim Sebastião", course: "Electrónica", subject: "História", classes: "7.ª A, 8.ª B, 10.ª A, 12.ª A", status: "active", registeredAt: "08/09/2025" },
  { name: "Pedro Bunga Miguel", course: "Informática", subject: "Educação Física", classes: "7.ª A, 8.ª B, 10.ª A, 12.ª A", status: "inactive", registeredAt: "01/10/2025" },
  { name: "Domingos Kiame Lopes", course: "Electrónica", subject: "Química", classes: "10.ª A, 11.ª B", status: "active", registeredAt: "08/09/2025" },
  { name: "Isabel Ndala Fernandes", course: "Informática", subject: "Programação", classes: "10.ª A, 11.ª A, 12.ª A", status: "active", registeredAt: "09/09/2025" },
  { name: "Manuel Kassoma Tavares", course: "Electrónica", subject: "Electrotecnia", classes: "11.ª B, 12.ª B", status: "active", registeredAt: "09/09/2025" },
];

// Repete a base até 23 registos para exercitar a paginação.
export const TEACHERS: Teacher[] = Array.from({ length: 23 }, (_, i) => ({
  ...BASE[i % BASE.length],
  id: i + 1,
  status: i === 8 ? "inactive" : "active",
}));

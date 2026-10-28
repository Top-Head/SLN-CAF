export type SubjectStatus = "active" | "inactive";

export type SubjectAssignment = {
  classes: string;
  teacher: string | null;
};

export type Subject = {
  id: string;
  code: string;
  name: string;
  area: string;
  courses: string;
  classCount: number;
  gradeRange: string;
  teacherCount: number;
  assignments: SubjectAssignment[];
  status: SubjectStatus;
};

type SubjectSeed = Omit<Subject, "id" | "code"> & { prefix: string };

const SEEDS: SubjectSeed[] = [
  {
    prefix: "LP", name: "Língua Portuguesa", area: "Formação geral", courses: "Todos os cursos",
    classCount: 18, gradeRange: "7.ª à 12.ª classe", teacherCount: 4, status: "active",
    assignments: [
      { classes: "7.ª A, 8.ª B, 10.ª A", teacher: "António Manuel Neto" },
      { classes: "11.ª A, 12.ª A", teacher: "Rosa Tchissola Lunda" },
    ],
  },
  {
    prefix: "MAT", name: "Matemática", area: "Formação geral", courses: "Todos os cursos",
    classCount: 18, gradeRange: "7.ª à 12.ª classe", teacherCount: 5, status: "active",
    assignments: [
      { classes: "7.ª A, 8.ª B, 10.ª A, 12.ª A", teacher: "Maria da Conceição Kiala" },
    ],
  },
  {
    prefix: "FIS", name: "Física", area: "Formação científica", courses: "Informática · Eletrónica",
    classCount: 8, gradeRange: "10.ª à 12.ª classe", teacherCount: 2, status: "active",
    assignments: [
      { classes: "10.ª A, 11.ª A, 12.ª A", teacher: "Carlos Alberto Mendes" },
      { classes: "10.ª B", teacher: null },
    ],
  },
  {
    prefix: "ING", name: "Inglês", area: "Formação geral", courses: "Todos os cursos",
    classCount: 12, gradeRange: "7.ª à 12.ª classe", teacherCount: 3, status: "active",
    assignments: [{ classes: "7.ª A, 8.ª B, 10.ª A", teacher: "Luísa Domingos Pinto" }],
  },
  {
    prefix: "TLP", name: "Técnicas de Programação", area: "Formação técnica", courses: "Informática",
    classCount: 6, gradeRange: "10.ª à 12.ª classe", teacherCount: 2, status: "active",
    assignments: [
      { classes: "10.ª A, 11.ª A", teacher: "Isabel Ndala Fernandes" },
      { classes: "12.ª B", teacher: null },
    ],
  },
  {
    prefix: "EF", name: "Educação Física", area: "Formação geral", courses: "Todos os cursos",
    classCount: 0, gradeRange: "", teacherCount: 0, status: "inactive", assignments: [],
  },
  {
    prefix: "QUI", name: "Química", area: "Formação científica", courses: "Informática · Eletrónica",
    classCount: 8, gradeRange: "10.ª à 12.ª classe", teacherCount: 2, status: "active",
    assignments: [{ classes: "10.ª A, 11.ª B", teacher: "Domingos Kiame Lopes" }],
  },
  {
    prefix: "BIO", name: "Biologia", area: "Formação científica", courses: "Todos os cursos",
    classCount: 10, gradeRange: "7.ª à 10.ª classe", teacherCount: 2, status: "active",
    assignments: [{ classes: "7.ª A, 8.ª B, 10.ª A", teacher: "Helena Cassoma" }],
  },
  {
    prefix: "HIS", name: "História", area: "Formação geral", courses: "Todos os cursos",
    classCount: 12, gradeRange: "7.ª à 12.ª classe", teacherCount: 3, status: "active",
    assignments: [{ classes: "7.ª A, 8.ª B, 10.ª A, 12.ª A", teacher: "Joaquim Sebastião" }],
  },
  {
    prefix: "ELT", name: "Electrotecnia", area: "Formação técnica", courses: "Eletrónica",
    classCount: 4, gradeRange: "10.ª à 12.ª classe", teacherCount: 1, status: "active",
    assignments: [
      { classes: "11.ª B", teacher: "Manuel Kassoma Tavares" },
      { classes: "12.ª B", teacher: null },
    ],
  },
];

const TOTAL = 50;

// Repete as sementes até 50 disciplinas; só as 10 primeiras podem ter pendências.
export const SUBJECTS: Subject[] = Array.from({ length: TOTAL }, (_, i) => {
  const { prefix, ...seed } = SEEDS[i % SEEDS.length];
  const repeated = i >= SEEDS.length;

  return {
    ...seed,
    id: `subject-${i + 1}`,
    code: `${prefix}-${String(i + 1).padStart(3, "0")}`,
    assignments: repeated
      ? seed.assignments.filter((a) => a.teacher !== null)
      : seed.assignments,
  };
});

export function pendingAssignments(subject: Subject) {
  return subject.assignments.filter((a) => a.teacher === null).length;
}

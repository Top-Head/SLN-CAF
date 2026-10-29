export type MiniPautaItem = {
  id: string;
  turma: {
    name: string;
    description: string;
  };
  disciplina: string;
  alunos: number;
  completedStudents: number;
  totalStudents: number;
  prazo: {
    date: string;
    subLabel?: string;
  };
  estado: "em_curso" | "concluido" | "por_iniciar";
  href: string;
};

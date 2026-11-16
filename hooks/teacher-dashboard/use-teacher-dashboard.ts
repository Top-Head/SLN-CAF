"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import {
  teacherActivityStore,
  teacherClassesStore,
  teacherDashboardStore,
  teacherMiniPautasBoardStore,
} from "@/stores/use-teacher-dashboard.store";
import type { TeacherClass } from "@/services/teacher-dashboard";

/** Cartões do dashboard (a API devolve uma lista com um único resumo). */
export function useTeacherDashboardSummary() {
  const list = useResourceList(teacherDashboardStore, {});
  return { ...list, summary: list.items[0] ?? null };
}

/** Primeira página da actividade recente. */
export function useTeacherActivity() {
  return useResourceList(teacherActivityStore, {});
}

/** Todas as mini-pautas do professor, com o progresso de lançamento. */
export function useTeacherMiniPautasBoard() {
  return useResourceAll(teacherMiniPautasBoardStore);
}

/**
 * Todas as turmas-disciplina do professor (`/api/teacher/minhas-turmas/`).
 * Se esse endpoint falhar, usa o quadro de mini-pautas
 * (`/dashboard/mini-pautas-data/`), que devolve as mesmas turmas-disciplina,
 * para o professor continuar a ver turmas, mini-pautas e a folha de notas.
 */
export function useTeacherClasses() {
  const classes = useResourceAll(teacherClassesStore);
  const board = useResourceAll(teacherMiniPautasBoardStore, {
    enabled: classes.status === "error",
  });

  if (classes.status !== "error" || board.status !== "success") return classes;

  const items: TeacherClass[] = board.items.map((b) => ({
    id: b.id,
    turma: b.turma,
    disciplina: b.disciplina,
    classe: b.classe,
    curso: b.curso,
    ano_letivo: b.ano_letivo,
    total_alunos: b.total_alunos,
    // O quadro conta notas (lançadas/esperadas), não alunos completos.
    completos: b.esperado > 0 && b.lancadas >= b.esperado ? b.total_alunos : 0,
    progresso: b.progresso,
    estado: b.estado,
    is_classe_exame: false,
  }));
  return { ...classes, items, status: "success" as const, error: null };
}

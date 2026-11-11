"use client";

import {
  useTeacherClasses,
  useTeacherDashboardSummary,
} from "@/hooks/teacher-dashboard/use-teacher-dashboard";

import {
  launchHref,
  launchStatusOf,
  miniPautaHref,
  scaleLabel,
  trimesterLabel,
  turmaSuffix,
} from "../../_lib/teacher-api";
import { TRIMESTERS, type TeacherClass } from "../_lib/mock-data";
import { MyClasses } from "./my-classes";

/** "Minhas turmas" com os dados de `GET /api/teacher/minhas-turmas/`. */
export function TeacherClassesView() {
  const classes = useTeacherClasses();
  const { summary } = useTeacherDashboardSummary();
  const trimester = trimesterLabel(summary?.trimestre);

  const items: TeacherClass[] = classes.items.map((item) => {
    const status = launchStatusOf(item.estado, item.progresso);
    return {
      id: item.id,
      grade: `${item.classe}.ª`,
      subGroup: turmaSuffix(item.turma, item.classe),
      subject: item.disciplina,
      course: item.curso,
      status,
      students: item.total_alunos,
      scale: scaleLabel(item.classe),
      trimester,
      completed: item.completos,
      total: item.total_alunos,
      // A API ainda não devolve prazos por disciplina.
      deadline:
        status === "completed"
          ? `Concluído · ${item.progresso}% das notas lançadas`
          : `${item.progresso}% das notas lançadas`,
      badge: item.is_classe_exame ? "Classe de exame" : undefined,
      year: item.ano_letivo || undefined,
      launchHref: launchHref(item.id),
      miniPautaHref: miniPautaHref(item.id),
    };
  });

  const years = [...new Set(classes.items.map((c) => c.ano_letivo).filter(Boolean))]
    .sort()
    .reverse();
  const trimesters = TRIMESTERS.includes(trimester) ? TRIMESTERS : [trimester, ...TRIMESTERS];

  const status =
    classes.status === "loading" || classes.status === "idle"
      ? "A carregar as suas turmas..."
      : classes.status === "error"
        ? classes.error
        : items.length === 0
          ? "Ainda não tem turmas e disciplinas atribuídas."
          : null;

  return (
    <MyClasses
      key={`${years.join()}-${trimester}`}
      classes={items}
      years={years.length > 0 ? years : ["—"]}
      trimesters={trimesters}
      initialTrimester={trimester}
      status={status}
    />
  );
}

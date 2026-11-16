"use client";

import { useAllGrades } from "@/hooks/assessments/use-grades";
import { useAllTrimesters } from "@/hooks/assessments/use-trimesters";
import { useAllEnrollments } from "@/hooks/academic/use-enrollments";
import { useAllTurmaDisciplinas } from "@/hooks/academic/use-turma-disciplinas";
import { useResourceList } from "@/hooks/resources/use-resource";
import { matchesSearch } from "@/lib/utils/matches-search";
import type { Grade, GradeComponent } from "@/services/grades";
import type { MiniPauta, MiniPautaParams, MiniPautaStudent } from "@/services/mini-pautas";
import { miniPautasStore } from "@/stores/use-mini-pautas.store";

const valueOf = (grades: Grade[], component: GradeComponent) =>
  grades.find((g) => (g.component ?? "MAC") === component)?.value ?? null;

/**
 * Mini-pauta de uma turma-disciplina; não pede nada sem `turma_disciplina_id`.
 *
 * Se `/api/teacher/mini-pautas/` falhar (ex.: erro 500 no servidor), monta a
 * mesma lista a partir das matrículas ativas da turma, da turma-disciplina e
 * das notas lançadas. Nesse modo `fallback` é `true` e a MT fica em branco,
 * porque é calculada pela API.
 */
export function useMiniPauta(params: MiniPautaParams | null) {
  const enabled = Boolean(params?.turma_disciplina_id);
  const list = useResourceList(miniPautasStore, params ?? { turma_disciplina_id: "" }, {
    enabled,
  });
  const failed = enabled && list.status === "error";

  const turmaDisciplinas = useAllTurmaDisciplinas({ enabled: failed });
  const enrollments = useAllEnrollments({ enabled: failed });
  const grades = useAllGrades({ enabled: failed });
  const trimesters = useAllTrimesters({ enabled: failed });

  if (!params) return { ...list, miniPauta: null, fallback: false };
  if (!failed) return { ...list, miniPauta: list.items[0] ?? null, fallback: false };

  const sources = [turmaDisciplinas, enrollments, grades, trimesters];
  if (sources.some((s) => s.status === "loading" || s.status === "idle")) {
    return { ...list, status: "loading" as const, error: null, miniPauta: null, fallback: true };
  }
  const td = turmaDisciplinas.items.find((t) => t.id === params.turma_disciplina_id);
  if (!td) {
    // Sem a turma-disciplina não há alternativa: mostra o erro original.
    return { ...list, miniPauta: null, fallback: false };
  }

  const yearTrimesters = trimesters.items.filter((t) => t.school_year === td.school_year);
  const numero =
    params.trimestre ?? yearTrimesters.find((t) => t.status !== "FECHADO")?.numero ?? 1;
  const trimester = yearTrimesters.find((t) => t.numero === numero);

  const active = enrollments.items
    .filter((e) => e.turma === td.turma && (e.status ?? "ATIVA") === "ATIVA")
    .sort(
      (a, b) =>
        (a.numero_ordem ?? 9999) - (b.numero_ordem ?? 9999) ||
        a.student_nome.localeCompare(b.student_nome, "pt"),
    );

  const allStudents: MiniPautaStudent[] = active.map((e, index) => {
    const own = grades.items.filter(
      (g) => g.enrollment === e.id && g.turma_disciplina === td.id && g.trimester === trimester?.id,
    );
    const mac = valueOf(own, "MAC");
    const pp = valueOf(own, "PP");
    const pt = valueOf(own, "PT");
    return {
      enrollment_id: e.id,
      numero: e.numero_ordem ?? index + 1,
      aluno: e.student_nome,
      numero_processo: e.student_numero_processo,
      sexo: "",
      mac,
      pp,
      pt,
      mt: null,
      resultado: "Pendente",
    };
  });

  const students = allStudents.filter((s) =>
    params.search ? matchesSearch(params.search, s.aluno, s.numero_processo) : true,
  );

  const miniPauta: MiniPauta = {
    turma_disciplina_id: td.id,
    titulo: `${td.subject_nome} · ${td.turma_nome}`,
    turma: td.turma_nome,
    curso: td.course_nome,
    disciplina: td.subject_nome,
    periodo: `${numero}.º Trimestre`,
    ano_letivo: td.school_year_label,
    media_turma: null,
    estado: "Em curso",
    total: allStudents.length,
    positivas: 0,
    negativas: 0,
    pendentes: allStudents.length,
    // Sem a API não há resultado calculado: os filtros só mostram "todos" e "pendentes".
    alunos:
      params.resultado === "positivas" || params.resultado === "negativas" ? [] : students,
  };

  return {
    ...list,
    status: "success" as const,
    error: null,
    miniPauta,
    fallback: true,
  };
}

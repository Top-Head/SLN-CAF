"use client";

import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Hash,
  Layers,
  ListChecks,
  School,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useState } from "react";

import { ResourceManager, currentAccessToken } from "@/components/shared/resource/resource-manager";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Tone } from "@/components/shared/tone";
import { useAllCourses } from "@/hooks/academic/use-courses";
import { useAllCurriculumSubjects } from "@/hooks/academic/use-curriculum-subjects";
import { useAllEnrollments } from "@/hooks/academic/use-enrollments";
import { useAllSchoolClasses } from "@/hooks/academic/use-school-classes";
import { useStudentOptions } from "@/hooks/academic/use-student-options";
import { useAllSubjects } from "@/hooks/academic/use-subjects";
import { useAllTurmas } from "@/hooks/academic/use-turmas";
import { useTeacherOptions } from "@/hooks/teachers/use-teacher-options";
import {
  createCurriculumSubject,
  deleteCurriculumSubject,
  getCurriculumSubjectById,
  patchCurriculumSubject,
  type CurriculumSubject,
} from "@/services/curriculum-subjects";
import {
  createEnrollment,
  deleteEnrollment,
  getEnrollmentById,
  patchEnrollment,
  type Enrollment,
  type EnrollmentStatus,
} from "@/services/enrollments";
import {
  createTurmaDisciplina,
  deleteTurmaDisciplina,
  getTurmaDisciplinaById,
  patchTurmaDisciplina,
  type TurmaDisciplina,
} from "@/services/turma-disciplinas";
import type { Turma } from "@/services/turmas";
import { curriculumSubjectsStore } from "@/stores/use-curriculum-subjects.store";
import { enrollmentsStore } from "@/stores/use-enrollments.store";
import { turmaDisciplinasStore } from "@/stores/use-turma-disciplinas.store";

import { BulkEnrollDialog } from "./bulk-enroll-dialog";

export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  ATIVA: "Ativa",
  TRANSFERIDA: "Transferida",
  CONCLUIDA: "Concluída",
  ANULADA: "Anulada",
};

const ENROLLMENT_TONES: Record<EnrollmentStatus, Tone> = {
  ATIVA: "positive",
  TRANSFERIDA: "info",
  CONCLUIDA: "neutral",
  ANULADA: "negative",
};

const statusOptions = (Object.keys(ENROLLMENT_STATUS_LABELS) as EnrollmentStatus[]).map(
  (value) => ({ value, label: ENROLLMENT_STATUS_LABELS[value] }),
);

export const turmaOptionLabel = (t: Pick<Turma, "nome" | "school_year_label">) =>
  t.school_year_label ? `${t.nome} · ${t.school_year_label}` : t.nome;

const byLabel = (a: { label: string }, b: { label: string }) =>
  a.label.localeCompare(b.label, "pt", { numeric: true });

function useTurmaOptions() {
  const turmas = useAllTurmas();
  return {
    turmas: turmas.items,
    loading: turmas.status === "loading",
    options: turmas.items.map((t) => ({ value: t.id, label: turmaOptionLabel(t) })).sort(byLabel),
  };
}

/* ───────────────────────────── Matrículas ───────────────────────────── */

/**
 * Matrículas (`/api/academico/enrollments/`): liga o aluno à turma e ao ano
 * letivo da turma. Só matrículas ATIVA entram em mini-pautas, cálculos e
 * códigos, e cada aluno só pode ter uma ativa.
 */
export function EnrollmentsManager() {
  const { turmas, options: turmaOptions, loading: turmasLoading } = useTurmaOptions();
  const students = useStudentOptions();
  const enrollments = useAllEnrollments();
  const [bulkOpen, setBulkOpen] = useState(false);

  const studentOptions = students.items
    .map((s) => ({ value: s.id, label: `${s.nome} · ${s.numero_processo}` }))
    .sort(byLabel);
  const turmaOf = (id: string) => turmas.find((t) => t.id === id);
  const activeStudents = new Set(
    enrollments.items.filter((e) => (e.status ?? "ATIVA") === "ATIVA").map((e) => e.student),
  );

  return (
    <>
      <ResourceManager<Enrollment>
        title="Matrículas"
        noun="matrículas"
        addLabel="Nova matrícula"
        icon={ClipboardList}
        searchPlaceholder="Pesquise por aluno, n.º de processo ou turma"
        emptyMessage="Ainda não existem matrículas. Matricule os alunos nas turmas para poderem ter notas."
        store={enrollmentsStore}
        toolbar={
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-5 py-3 text-xs text-muted-foreground">
            <span>
              {activeStudents.size} de {students.items.length} estudantes com matrícula ativa. Cada
              aluno só pode ter uma matrícula ativa.
            </span>
            <button
              type="button"
              onClick={() => setBulkOpen(true)}
              className="flex h-9 items-center gap-2 rounded-md border bg-card px-3.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              <UsersRound className="size-4 text-primary" />
              Matricular vários numa turma
            </button>
          </div>
        }
        columns={[
          {
            label: "Ordem",
            className: "w-[70px]",
            render: (e) => (e.numero_ordem ?? "—"),
          },
          {
            label: "Estudante",
            render: (e) => (
              <span className="flex flex-col">
                <span className="font-medium">{e.student_nome}</span>
                <span className="text-xs text-muted-foreground">{e.student_numero_processo}</span>
              </span>
            ),
          },
          { label: "Turma", className: "w-[120px]", render: (e) => e.turma_nome },
          { label: "Ano letivo", className: "w-[110px]", render: (e) => e.school_year_label },
          {
            label: "Estado",
            className: "w-[120px]",
            render: (e) => (
              <StatusBadge tone={ENROLLMENT_TONES[e.status ?? "ATIVA"]}>
                {ENROLLMENT_STATUS_LABELS[e.status ?? "ATIVA"]}
              </StatusBadge>
            ),
          },
        ]}
        getLabel={(e) => `a matrícula de ${e.student_nome}`}
        searchText={(e) => [e.student_nome, e.student_numero_processo, e.turma_nome]}
        compare={(a, b) =>
          a.turma_nome.localeCompare(b.turma_nome, "pt", { numeric: true }) ||
          (a.numero_ordem ?? 9999) - (b.numero_ordem ?? 9999) ||
          a.student_nome.localeCompare(b.student_nome, "pt")
        }
        dialog={{
          titles: { create: "Nova matrícula", edit: "Editar matrícula", view: "Dados da matrícula" },
          descriptions: {
            create: "Matricule o aluno numa turma. O ano letivo é o da turma.",
            edit: "Altere a turma, o n.º de ordem ou o estado (ex.: transferida, anulada).",
            view: "Consulte a matrícula.",
          },
          submitLabel: "Matricular",
          fields: [
            {
              name: "student",
              label: "Estudante",
              type: "select",
              icon: UserRound,
              required: true,
              wide: true,
              options: studentOptions,
              optionsLoading: students.status === "loading",
              placeholder: studentOptions.length ? "Selecione o estudante" : "Sem estudantes",
            },
            {
              name: "turma",
              label: "Turma",
              type: "select",
              icon: School,
              required: true,
              wide: true,
              options: turmaOptions,
              optionsLoading: turmasLoading,
            },
            {
              name: "numero_ordem",
              label: "N.º de ordem na pauta",
              type: "number",
              icon: Hash,
              min: 1,
              max: 200,
              placeholder: "Opcional",
            },
            {
              name: "status",
              label: "Estado",
              type: "select",
              icon: ListChecks,
              required: true,
              options: statusOptions,
            },
          ],
          emptyValues: { student: "", turma: "", numero_ordem: "", status: "ATIVA" },
          toValues: (e) => ({
            student: e.student,
            turma: e.turma,
            numero_ordem: e.numero_ordem === null ? "" : String(e.numero_ordem),
            status: e.status ?? "ATIVA",
          }),
          validate: (values) => {
            if (!values.student || !values.turma) return "Selecione o estudante e a turma.";
            if (values.numero_ordem && !/^\d+$/.test(values.numero_ordem)) {
              return "O n.º de ordem deve ser um número inteiro.";
            }
            return null;
          },
        }}
        messages={{
          created: () => "Aluno matriculado com sucesso.",
          updated: (e) => `Matrícula de ${e.student_nome} atualizada.`,
          deleted: (e) => `Matrícula de ${e.student_nome} eliminada.`,
        }}
        fetchOne={getEnrollmentById}
        onCreate={(values, token) => {
          const turma = turmaOf(values.turma);
          if (!turma) throw new Error("Turma não encontrada.");
          return createEnrollment(
            {
              student: values.student,
              turma: turma.id,
              school_year: turma.school_year,
              numero_ordem: values.numero_ordem ? Number(values.numero_ordem) : null,
              status: values.status as EnrollmentStatus,
            },
            token,
          );
        }}
        onUpdate={(e, values, token) => {
          const turma = turmaOf(values.turma);
          return patchEnrollment(
            e.id,
            {
              student: values.student,
              turma: values.turma,
              school_year: turma?.school_year ?? e.school_year,
              numero_ordem: values.numero_ordem ? Number(values.numero_ordem) : null,
              status: values.status as EnrollmentStatus,
            },
            token,
          );
        }}
        onDelete={(e, token) => deleteEnrollment(e.id, token)}
      />

      <BulkEnrollDialog
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        turmas={turmas}
        students={students.items.filter((s) => !activeStudents.has(s.id))}
        accessToken={currentAccessToken}
      />
    </>
  );
}

/* ─────────────────────────── Turma-disciplina ─────────────────────────── */

/**
 * Disciplinas por turma (`/api/avaliacoes/turma-disciplinas/`): que professor
 * lecciona cada disciplina em cada turma. É o que dá ao professor acesso à
 * mini-pauta e ao lançamento de notas dessa turma.
 */
export function TurmaDisciplinasManager() {
  const { turmas, options: turmaOptions, loading: turmasLoading } = useTurmaOptions();
  const subjects = useAllSubjects();
  const teachers = useTeacherOptions();
  const curriculum = useAllCurriculumSubjects();

  const subjectOptions = subjects.items.map((s) => ({ value: s.id, label: s.nome })).sort(byLabel);
  const teacherOptions = teachers.items.map((t) => ({ value: t.id, label: t.nome })).sort(byLabel);
  const turmaOf = (id: string) => turmas.find((t) => t.id === id);

  function payloadOf(values: Record<string, string>) {
    const turma = turmaOf(values.turma);
    if (!turma) throw new Error("Turma não encontrada.");
    // Fluxo académico: curso, classe e ano letivo têm de ser os da turma.
    return {
      turma: turma.id,
      course: turma.course,
      school_class: turma.school_class,
      school_year: turma.school_year,
      subject: values.subject,
      teacher: values.teacher,
    };
  }

  return (
    <ResourceManager<TurmaDisciplina>
      title="Disciplinas por turma"
      noun="disciplinas por turma"
      addLabel="Atribuir disciplina"
      icon={BookOpen}
      searchPlaceholder="Pesquise por turma, disciplina ou professor"
      emptyMessage="Ainda não há disciplinas atribuídas às turmas. Sem isto os professores não podem lançar notas."
      store={turmaDisciplinasStore}
      columns={[
        { label: "Turma", className: "w-[120px]", render: (td) => <span className="font-medium">{td.turma_nome}</span> },
        { label: "Disciplina", render: (td) => td.subject_nome },
        { label: "Professor", render: (td) => td.teacher_nome || "—" },
        { label: "Classe", className: "w-[90px]", render: (td) => `${td.school_class_numero}.ª` },
        { label: "Ano letivo", className: "w-[110px]", render: (td) => td.school_year_label },
      ]}
      getLabel={(td) => `${td.subject_nome} da turma ${td.turma_nome}`}
      searchText={(td) => [td.turma_nome, td.subject_nome, td.teacher_nome, td.course_nome]}
      compare={(a, b) =>
        a.turma_nome.localeCompare(b.turma_nome, "pt", { numeric: true }) ||
        a.subject_nome.localeCompare(b.subject_nome, "pt")
      }
      dialog={{
        titles: {
          create: "Atribuir disciplina à turma",
          edit: "Editar disciplina da turma",
          view: "Disciplina da turma",
        },
        descriptions: {
          create: "Escolha a turma, a disciplina e o professor que a lecciona. A disciplina deve fazer parte do plano curricular do curso e classe da turma.",
          edit: "Mude o professor ou a disciplina.",
          view: "Consulte a atribuição.",
        },
        submitLabel: "Atribuir",
        fields: [
          {
            name: "turma",
            label: "Turma",
            type: "select",
            icon: School,
            required: true,
            wide: true,
            options: turmaOptions,
            optionsLoading: turmasLoading,
          },
          {
            name: "subject",
            label: "Disciplina",
            type: "select",
            icon: BookOpen,
            required: true,
            options: subjectOptions,
            optionsLoading: subjects.status === "loading",
          },
          {
            name: "teacher",
            label: "Professor",
            type: "select",
            icon: UserRound,
            required: true,
            options: teacherOptions,
            optionsLoading: teachers.status === "loading",
          },
        ],
        emptyValues: { turma: "", subject: "", teacher: "" },
        toValues: (td) => ({ turma: td.turma, subject: td.subject, teacher: td.teacher }),
        validate: (values) => {
          if (!values.turma || !values.subject || !values.teacher) {
            return "Selecione a turma, a disciplina e o professor.";
          }
          const turma = turmaOf(values.turma);
          // Só valida contra o plano curricular quando o curso/classe tem plano definido.
          const plan = curriculum.items.filter(
            (c) => turma && c.course === turma.course && c.school_class === turma.school_class,
          );
          if (plan.length > 0 && !plan.some((c) => c.subject === values.subject)) {
            return `Esta disciplina não está no plano curricular de ${turma?.course_nome} · ${turma?.school_class_nome}.ª classe.`;
          }
          return null;
        },
      }}
      messages={{
        created: () => "Disciplina atribuída à turma com sucesso.",
        updated: (td) => `Atribuição de ${td.subject_nome} na turma ${td.turma_nome} atualizada.`,
        deleted: (td) => `${td.subject_nome} retirada da turma ${td.turma_nome}.`,
      }}
      fetchOne={getTurmaDisciplinaById}
      onCreate={(values, token) => createTurmaDisciplina(payloadOf(values), token)}
      onUpdate={(td, values, token) => patchTurmaDisciplina(td.id, payloadOf(values), token)}
      onDelete={(td, token) => deleteTurmaDisciplina(td.id, token)}
    />
  );
}

/* ─────────────────────────── Plano curricular ─────────────────────────── */

/** Plano curricular (`/api/academico/curriculum-subjects/`): disciplinas por curso e classe. */
export function CurriculumManager() {
  const courses = useAllCourses();
  const classes = useAllSchoolClasses();
  const subjects = useAllSubjects();

  const courseOptions = courses.items.map((c) => ({ value: c.id, label: c.nome })).sort(byLabel);
  const classOptions = [...classes.items]
    .sort((a, b) => a.numero - b.numero)
    .map((c) => ({ value: c.id, label: `${c.numero}.ª classe` }));
  const subjectOptions = subjects.items.map((s) => ({ value: s.id, label: s.nome })).sort(byLabel);

  return (
    <ResourceManager<CurriculumSubject>
      title="Plano curricular"
      noun="disciplinas no plano"
      addLabel="Adicionar ao plano"
      icon={ListChecks}
      searchPlaceholder="Pesquise por curso, classe ou disciplina"
      emptyMessage="Ainda não há plano curricular. Defina que disciplinas pertencem a cada curso e classe."
      store={curriculumSubjectsStore}
      columns={[
        { label: "Curso", render: (c) => <span className="font-medium">{c.course_nome}</span> },
        { label: "Classe", className: "w-[100px]", render: (c) => `${c.school_class_numero}.ª` },
        { label: "Disciplina", render: (c) => c.subject_nome },
      ]}
      getLabel={(c) => `${c.subject_nome} (${c.course_nome}, ${c.school_class_numero}.ª)`}
      searchText={(c) => [c.course_nome, `${c.school_class_numero}.ª`, c.subject_nome]}
      compare={(a, b) =>
        a.course_nome.localeCompare(b.course_nome, "pt") ||
        a.school_class_numero - b.school_class_numero ||
        a.subject_nome.localeCompare(b.subject_nome, "pt")
      }
      dialog={{
        titles: {
          create: "Adicionar disciplina ao plano",
          edit: "Editar plano curricular",
          view: "Plano curricular",
        },
        descriptions: {
          create: "A combinação curso + classe + disciplina é única.",
          edit: "Altere o curso, a classe ou a disciplina.",
          view: "Consulte o registo do plano.",
        },
        submitLabel: "Adicionar",
        fields: [
          {
            name: "course",
            label: "Curso",
            type: "select",
            icon: GraduationCap,
            required: true,
            wide: true,
            options: courseOptions,
            optionsLoading: courses.status === "loading",
          },
          {
            name: "school_class",
            label: "Classe",
            type: "select",
            icon: Layers,
            required: true,
            options: classOptions,
            optionsLoading: classes.status === "loading",
          },
          {
            name: "subject",
            label: "Disciplina",
            type: "select",
            icon: BookOpen,
            required: true,
            options: subjectOptions,
            optionsLoading: subjects.status === "loading",
          },
        ],
        emptyValues: { course: "", school_class: "", subject: "" },
        toValues: (c) => ({ course: c.course, school_class: c.school_class, subject: c.subject }),
        validate: (values) =>
          !values.course || !values.school_class || !values.subject
            ? "Selecione o curso, a classe e a disciplina."
            : null,
      }}
      messages={{
        created: () => "Disciplina adicionada ao plano curricular.",
        updated: (c) => `Plano de ${c.subject_nome} atualizado.`,
        deleted: (c) => `${c.subject_nome} retirada do plano de ${c.course_nome} (${c.school_class_numero}.ª).`,
      }}
      fetchOne={getCurriculumSubjectById}
      onCreate={(values, token) =>
        createCurriculumSubject(
          { course: values.course, school_class: values.school_class, subject: values.subject },
          token,
        )
      }
      onUpdate={(c, values, token) =>
        patchCurriculumSubject(
          c.id,
          { course: values.course, school_class: values.school_class, subject: values.subject },
          token,
        )
      }
      onDelete={(c, token) => deleteCurriculumSubject(c.id, token)}
    />
  );
}

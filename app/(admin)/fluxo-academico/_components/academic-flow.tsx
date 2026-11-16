"use client";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  CircleDashed,
  ClipboardList,
  ExternalLink,
  Gavel,
  GraduationCap,
  KeyRound,
  Layers,
  ListChecks,
  School,
  Scale,
  UserCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { PageContext } from "@/components/shared/page-context";
import { useAllClassRules } from "@/hooks/assessments/use-class-rules";
import { useAllExamGrades } from "@/hooks/assessments/use-exams";
import { useAllGradingScales } from "@/hooks/assessments/use-grading-scales";
import { useAllCurriculumSubjects } from "@/hooks/academic/use-curriculum-subjects";
import { useAllEnrollments } from "@/hooks/academic/use-enrollments";
import { useAllTurmaDisciplinas } from "@/hooks/academic/use-turma-disciplinas";
import { useAllManagedAccessCodes } from "@/hooks/access-codes/use-managed-access-codes";
import { useAllGrades } from "@/hooks/assessments/use-grades";
import { useAllTrimesters } from "@/hooks/assessments/use-trimesters";
import { useAllCourses } from "@/hooks/academic/use-courses";
import { useAllSchoolClasses } from "@/hooks/academic/use-school-classes";
import { useAllSchoolYears } from "@/hooks/academic/use-school-years";
import { useAllSubjects } from "@/hooks/academic/use-subjects";
import { useAllTurmas } from "@/hooks/academic/use-turmas";
import { useStudents } from "@/hooks/students/use-students";
import { useTeacherOptions } from "@/hooks/teachers/use-teacher-options";
import { cn } from "@/lib/utils";

/** Django admin do backend: onde vivem as etapas sem endpoint público. */
const DJANGO_ADMIN_URL = `${(process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "")}/admin/`;

type StepState = "done" | "pending" | "external" | "loading" | "error";

type Step = {
  title: string;
  description: string;
  icon: LucideIcon;
  state: StepState;
  /** Resumo do que já existe (ex.: "3 cursos"). */
  summary?: string;
  /** Ecrã da plataforma onde se faz a etapa. */
  href?: string;
  hrefLabel?: string;
  /** Modelo a abrir no Django admin, para etapas sem API. */
  djangoModel?: string;
};

type Phase = { title: string; steps: Step[] };

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function countState(status: string, count: number): StepState {
  if (status === "loading" || status === "idle") return "loading";
  // Pedido falhado (sem sessão, sem permissão, rede): não afirmar que está por fazer.
  if (status === "error") return "error";
  return count > 0 ? "done" : "pending";
}

/**
 * Fluxo académico (docs: `fluxo-academico.md`): as etapas por ordem, desde a
 * estrutura até ao lançamento de notas, com o estado real de cada uma.
 * Todas as etapas têm API e ecrã no painel. O estado "external" (Django
 * admin) fica disponível para etapas que voltem a não ter API.
 */
export function AcademicFlow() {
  const years = useAllSchoolYears();
  const classes = useAllSchoolClasses();
  const courses = useAllCourses();
  const subjects = useAllSubjects();
  const turmas = useAllTurmas();
  const teachers = useTeacherOptions();
  const students = useStudents();
  const trimesters = useAllTrimesters();
  const grades = useAllGrades();
  const exams = useAllExamGrades();
  const curriculum = useAllCurriculumSubjects();
  const enrollments = useAllEnrollments();
  const turmaDisciplinas = useAllTurmaDisciplinas();
  const classRules = useAllClassRules();
  const scales = useAllGradingScales();
  const codes = useAllManagedAccessCodes();

  const activeEnrollments = enrollments.items.filter((e) => (e.status ?? "ATIVA") === "ATIVA").length;
  const turmasWithSubjects = new Set(turmaDisciplinas.items.map((td) => td.turma)).size;
  const rulesStatus =
    classRules.status === "error" || scales.status === "error"
      ? "error"
      : classRules.status === "success" && scales.status === "success"
        ? "success"
        : "loading";

  const withDirector = turmas.items.filter((t) => Boolean(t.director_teacher)).length;
  const openTrimesters = trimesters.items.filter((t) => t.status !== "FECHADO").length;
  const studentsStatus = students.listStatus;

  const phases: Phase[] = [
    {
      title: "1. Estrutura",
      steps: [
        {
          title: "Ano letivo",
          description: "Raiz de turmas, matrículas, trimestres e regras. O ano de fim é sempre o de início + 1.",
          icon: CalendarRange,
          state: countState(years.status, years.items.length),
          summary: plural(years.items.length, "ano letivo", "anos letivos"),
          href: "/turmas",
          hrefLabel: "Turmas → Anos letivos",
        },
        {
          title: "Classes",
          description: "O número da classe escolhe a escala (1.ª–6.ª: 0–10; 7.ª–13.ª: 0–20) e a regra de avaliação.",
          icon: Layers,
          state: countState(classes.status, classes.items.length),
          summary: plural(classes.items.length, "classe", "classes"),
          href: "/turmas",
          hrefLabel: "Turmas → Classes",
        },
        {
          title: "Cursos",
          description: "Ex.: Informática, Electrónica e Telecomunicação.",
          icon: GraduationCap,
          state: countState(courses.status, courses.items.length),
          summary: plural(courses.items.length, "curso", "cursos"),
          href: "/turmas",
          hrefLabel: "Turmas → Cursos",
        },
        {
          title: "Disciplinas",
          description: "Catálogo de disciplinas (nome único).",
          icon: BookOpen,
          state: countState(subjects.status, subjects.items.length),
          summary: plural(subjects.items.length, "disciplina", "disciplinas"),
          href: "/disciplinas",
          hrefLabel: "Disciplinas",
        },
        {
          title: "Plano curricular",
          description: "Que disciplinas pertencem a cada curso e classe. Valida as disciplinas atribuídas às turmas.",
          icon: ListChecks,
          state: countState(curriculum.status, curriculum.items.length),
          summary: plural(curriculum.items.length, "disciplina no plano", "disciplinas no plano"),
          href: "/turmas?tab=plano",
          hrefLabel: "Turmas → Plano curricular",
        },
      ],
    },
    {
      title: "2. Turmas, professores e alunos",
      steps: [
        {
          title: "Professores",
          description: "Conta de professor e perfil (nome, telefone, BI, género). Também são os diretores de turma.",
          icon: UserCheck,
          state: countState(teachers.status, teachers.items.length),
          summary: plural(teachers.items.length, "professor", "professores"),
          href: "/professores",
          hrefLabel: "Professores",
        },
        {
          title: "Turmas e diretor de turma",
          description: "Turma por curso, classe e ano letivo. Um professor só dirige uma turma por ano.",
          icon: School,
          state: countState(turmas.status, turmas.items.length),
          summary: `${plural(turmas.items.length, "turma", "turmas")} · ${withDirector} com diretor`,
          href: "/turmas",
          hrefLabel: "Turmas",
        },
        {
          title: "Estudantes",
          description: "N.º de processo único, nome e género. O aluno não tem conta: consulta o boletim com código.",
          icon: UsersRound,
          state: countState(studentsStatus, students.count),
          summary: plural(students.count, "estudante", "estudantes"),
          href: "/estudantes",
          hrefLabel: "Estudantes",
        },
        {
          title: "Matrícula na turma",
          description: "Liga o aluno à turma e ao ano letivo. Só matrículas ATIVA entram nas mini-pautas, cálculos e códigos.",
          icon: ClipboardList,
          state: countState(enrollments.status, activeEnrollments),
          summary: `${plural(activeEnrollments, "matrícula ativa", "matrículas ativas")} de ${students.count} estudantes`,
          href: "/turmas?tab=matriculas",
          hrefLabel: "Turmas → Matrículas",
        },
        {
          title: "Turma-disciplina (professor por disciplina)",
          description: "Que professor lecciona cada disciplina em cada turma. Sem isto o professor não vê turmas nem lança notas.",
          icon: BookOpen,
          state: countState(turmaDisciplinas.status, turmaDisciplinas.items.length),
          summary: `${plural(turmaDisciplinas.items.length, "atribuição", "atribuições")} · ${turmasWithSubjects} de ${turmas.items.length} turmas`,
          href: "/turmas?tab=disciplinas",
          hrefLabel: "Turmas → Disciplinas por turma",
        },
      ],
    },
    {
      title: "3. Avaliação",
      steps: [
        {
          title: "Regras de avaliação",
          description: "Escala, regra por classe (componentes, pesos, exame, transição) e tipo de exame por disciplina. Vêm pré-configuradas e podem ser ajustadas.",
          icon: Scale,
          state: countState(rulesStatus, Math.min(classRules.items.length, scales.items.length)),
          summary: `${plural(scales.items.length, "escala", "escalas")} · ${plural(classRules.items.length, "regra de classe", "regras de classe")}`,
          href: "/regras-de-avaliacao",
          hrefLabel: "Regras de avaliação",
        },
        {
          title: "Trimestres",
          description: "1.º a 3.º de cada ano letivo. Fechar bloqueia as notas e exige todas as notas obrigatórias.",
          icon: CalendarDays,
          state: countState(trimesters.status, trimesters.items.length),
          summary: `${plural(trimesters.items.length, "trimestre", "trimestres")} · ${openTrimesters} aberto(s)`,
          href: "/periodos-de-lancamento",
          hrefLabel: "Períodos de lançamento",
        },
        {
          title: "Lançamento de notas (MAC, PP, PT)",
          description: "Feito pelo professor da turma-disciplina (ou pelo admin). A API valida matrícula, trimestre, escala e componente e arredonda o valor.",
          icon: ClipboardList,
          state: countState(grades.status, grades.items.length),
          summary: plural(grades.items.length, "nota lançada", "notas lançadas"),
          href: "/lancamento-de-notas",
          hrefLabel: "Lançamento de notas",
        },
      ],
    },
    {
      title: "4. Resultados e consulta",
      steps: [
        {
          title: "Exames e resultados anuais",
          description: "Exames só em classes com exame final. MT, MFD e MF são calculados pela API.",
          icon: Gavel,
          state: countState(exams.status, exams.items.length),
          summary: plural(exams.items.length, "exame", "exames"),
          href: "/pautas",
          hrefLabel: "Pautas → Resultados",
        },
        {
          title: "Códigos de acesso ao boletim",
          description: "Gerados por aluno ou por turma (matrículas ativas), válidos 2 dias.",
          icon: KeyRound,
          state: countState(codes.status, codes.items.length),
          summary: `${plural(codes.items.length, "código emitido", "códigos emitidos")} · ${codes.items.filter((c) => c.revoked).length} revogado(s)`,
          href: "/codigos-de-acesso",
          hrefLabel: "Códigos de acesso",
        },
      ],
    },
  ];

  const steps = phases.flatMap((p) => p.steps);
  const done = steps.filter((s) => s.state === "done").length;
  const tracked = steps.filter((s) => s.state !== "external").length;
  const failed = steps.filter((s) => s.state === "error").length;
  const checking = steps.some((s) => s.state === "loading");
  const nextStep = steps.find((s) => s.state === "pending");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <PageContext
          title="Fluxo académico"
          subtitle="Da estrutura da escola ao lançamento de notas, pela ordem em que os dados dependem uns dos outros"
        />
      </div>

      <section className="flex flex-wrap items-center gap-4 rounded-lg border bg-card px-6 py-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-sm font-semibold">
            {done} de {tracked} etapas da plataforma com dados
          </span>
          <span className="text-xs text-muted-foreground">
            {checking
              ? "A verificar os dados da plataforma…"
              : failed > 0
              ? `Não foi possível verificar ${failed} etapa(s): confirme a sessão e a ligação à API.`
              : nextStep
                ? `Próximo passo: ${nextStep.title}.`
                : "Todas as etapas da plataforma têm dados."}{" "}
           
          </span>
        </div>
        <div className="h-2 w-48 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${tracked ? Math.round((done / tracked) * 100) : 0}%` }}
          />
        </div>
      </section>

      {phases.map((phase) => (
        <section key={phase.title} className="flex flex-col gap-3">
          <h2 className="font-sans text-[15px] font-semibold">{phase.title}</h2>
          <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {phase.steps.map((step) => (
              <StepCard key={step.title} step={step} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

const STATE_STYLES: Record<StepState, { label: string; className: string }> = {
  done: { label: "Com dados", className: "bg-positive-soft text-positive" },
  pending: { label: "Por fazer", className: "bg-pending-soft text-pending" },
  external: { label: "Django admin", className: "bg-bark-soft text-bark" },
  loading: { label: "A verificar…", className: "bg-neutral-soft text-neutral" },
  error: { label: "Erro ao verificar", className: "bg-negative-soft text-negative" },
};

function StepCard({ step }: { step: Step }) {
  const Icon = step.icon;
  const style = STATE_STYLES[step.state];

  return (
    <li className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            step.state === "external" ? "bg-bark-soft text-bark" : "bg-accent text-primary",
          )}
        >
          <Icon className="size-4" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-sans text-[13px] font-semibold">{step.title}</h3>
            <span className={cn("inline-flex items-center gap-1 rounded-sm px-1.5 py-px text-[10px] font-semibold", style.className)}>
              {step.state === "done" ? (
                <CheckCircle2 className="size-3" />
              ) : (
                <CircleDashed className="size-3" />
              )}
              {style.label}
            </span>
          </div>
          <p className="text-xs leading-snug text-muted-foreground">{step.description}</p>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs">
        <span className="text-muted-foreground">
          {step.state === "external" ? `Modelo: ${step.djangoModel}` : (step.summary ?? "")}
        </span>
        {step.href ? (
          <Link href={step.href} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
            {step.hrefLabel}
            <ArrowRight className="size-3.5" />
          </Link>
        ) : (
          <a
            href={DJANGO_ADMIN_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-medium text-bark hover:underline"
          >
            Django admin
            <ExternalLink className="size-3.5" />
          </a>
        )}
      </div>
    </li>
  );
}

"use client";

import { BookOpen, CalendarDays, ClipboardList, Hash, UserRound } from "lucide-react";

import { ResourceManager } from "@/components/shared/resource/resource-manager";
import { cn } from "@/lib/utils";
import {
  createGrade,
  deleteGrade,
  getGradeById,
  patchGrade,
  type Grade,
  type GradeComponent,
  type GradePayload,
} from "@/services/grades";
import { gradesStore } from "@/stores/use-grades.store";

import { idField, isUuid } from "./id-field";
import {
  COMPONENT_LABELS,
  formatDecimal,
  isDecimal,
  optionsOf,
  toDecimal,
} from "./labels";
import { useAssessmentOptions } from "./use-assessment-options";

const label = (g: Grade) => `${g.component ?? "MAC"} de ${g.student_nome}`;

export function GradeValue({
  value,
  passing,
}: {
  value?: string | null;
  passing?: number;
}) {
  const number = Number(value);
  const known = value !== null && value !== undefined && value !== "";
  return (
    <span
      className={cn(
        "rounded-sm px-1.5 py-0.5 font-medium",
        !known
          ? "text-muted-foreground"
          : number < (passing ?? 10)
            ? "bg-negative-soft text-negative"
            : "bg-positive-soft text-positive",
      )}
    >
      {formatDecimal(value)}
    </span>
  );
}

function toPayload(values: Record<string, string>): GradePayload {
  return {
    enrollment: values.enrollment.trim(),
    turma_disciplina: values.turma_disciplina.trim(),
    trimester: values.trimester,
    component: values.component as GradeComponent,
    value: toDecimal(values.value) ?? "",
  };
}

/** Notas trimestrais (MAC, PP e PT) — `/api/avaliacoes/grades/`. */
export function GradesManager() {
  const { enrollmentOptions, subjectOptions, trimesterOptions, loading } =
    useAssessmentOptions();

  return (
    <ResourceManager<Grade>
      title="Notas lançadas"
      noun="notas"
      addLabel="Lançar nota"
      icon={ClipboardList}
      searchPlaceholder="Pesquise por estudante, turma ou disciplina"
      emptyMessage="Ainda não existem notas lançadas."
      store={gradesStore}
      columns={[
        {
          label: "Estudante",
          render: (g) => <span className="font-medium">{g.student_nome}</span>,
        },
        { label: "Turma", className: "w-[120px]", render: (g) => g.turma_nome },
        { label: "Disciplina", render: (g) => g.subject_nome },
        {
          label: "Trimestre",
          className: "w-[100px]",
          render: (g) => `${g.trimester_numero}.º`,
        },
        {
          label: "Componente",
          className: "w-[110px]",
          render: (g) => g.component ?? "MAC",
        },
        {
          label: "Nota",
          className: "w-[90px]",
          render: (g) => <GradeValue value={g.value} passing={g.scale?.passing} />,
        },
      ]}
      getLabel={label}
      searchText={(g) => [g.student_nome, g.turma_nome, g.subject_nome]}
      compare={(a, b) =>
        a.turma_nome.localeCompare(b.turma_nome, "pt", { numeric: true }) ||
        a.student_nome.localeCompare(b.student_nome, "pt") ||
        a.subject_nome.localeCompare(b.subject_nome, "pt") ||
        a.trimester_numero - b.trimester_numero
      }
      dialog={{
        titles: {
          create: "Lançar nota",
          edit: "Editar nota",
          view: "Dados da nota",
        },
        descriptions: {
          create: "Indique o estudante, a disciplina, o trimestre e a nota.",
          edit: "Corrija a nota lançada.",
          view: "Consulte a nota lançada.",
        },
        submitLabel: "Lançar nota",
        fields: [
          idField("enrollment", "Estudante (matrícula)", UserRound, enrollmentOptions, loading),
          idField("turma_disciplina", "Disciplina da turma", BookOpen, subjectOptions, loading),
          {
            name: "trimester",
            label: "Trimestre",
            type: "select",
            icon: CalendarDays,
            required: true,
            options: trimesterOptions,
            optionsLoading: loading && trimesterOptions.length === 0,
          },
          {
            name: "component",
            label: "Componente",
            type: "select",
            icon: ClipboardList,
            required: true,
            options: optionsOf(COMPONENT_LABELS),
          },
          {
            name: "value",
            label: "Nota",
            icon: Hash,
            required: true,
            maxLength: 5,
            placeholder: "Ex.: 14,5",
          },
        ],
        emptyValues: {
          enrollment: "",
          turma_disciplina: "",
          trimester: "",
          component: "MAC",
          value: "",
        },
        toValues: (g) => ({
          enrollment: g.enrollment,
          turma_disciplina: g.turma_disciplina,
          trimester: g.trimester,
          component: g.component ?? "MAC",
          value: formatDecimal(g.value).replace("—", ""),
        }),
        validate: (values) => {
          if (!isUuid(values.enrollment) || !isUuid(values.turma_disciplina)) {
            return "Indique um estudante e uma disciplina válidos.";
          }
          if (!values.trimester) return "Selecione o trimestre.";
          if (!isDecimal(values.value)) {
            return "A nota deve ser um número com até duas casas decimais (ex.: 14,5).";
          }
          return null;
        },
      }}
      messages={{
        created: (values) => `Nota ${values.component} lançada com sucesso.`,
        updated: (g) => `Nota ${g.component ?? "MAC"} de ${g.student_nome} atualizada.`,
        deleted: (g) => `Nota ${g.component ?? "MAC"} de ${g.student_nome} eliminada.`,
      }}
      fetchOne={getGradeById}
      onCreate={(values, token) => createGrade(toPayload(values), token)}
      onUpdate={(g, values, token) => patchGrade(g.id, toPayload(values), token)}
      onDelete={(g, token) => deleteGrade(g.id, token)}
    />
  );
}

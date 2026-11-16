"use client";

import { BookOpen, FileCheck2, Hash, PenLine, UserRound } from "lucide-react";

import { ResourceManager } from "@/components/shared/resource/resource-manager";
import {
  createExamGrade,
  deleteExamGrade,
  getExamGradeById,
  patchExamGrade,
  type ExamGrade,
  type ExamGradePayload,
  type ExamType,
} from "@/services/exams";
import { examsStore } from "@/stores/use-exams.store";

import { GradeValue } from "./grades-manager";
import { idField, isUuid } from "./id-field";
import {
  EXAM_TYPE_LABELS,
  formatDecimal,
  isDecimal,
  optionsOf,
  toDecimal,
} from "./labels";
import { useAssessmentOptions } from "./use-assessment-options";

const typeOf = (e: ExamGrade): ExamType => e.exam_type ?? "SIMPLE";
const label = (e: ExamGrade) => `exame de ${e.subject_nome} de ${e.student_nome}`;
const asText = (value?: string | null) => formatDecimal(value).replace("—", "");

/** Valor do select para "usar o tipo configurado para a disciplina". */
const AUTO_TYPE = "AUTO";

function toPayload(values: Record<string, string>): ExamGradePayload {
  const base = {
    enrollment: values.enrollment.trim(),
    turma_disciplina: values.turma_disciplina.trim(),
  };
  if (values.exam_type === AUTO_TYPE) {
    // Fluxo académico: sem tipo, a API usa o configurado (SubjectExamRule).
    // Envia os valores preenchidos: nota única ou NEE + NEO.
    return {
      ...base,
      exam_value: toDecimal(values.exam_value),
      nee: toDecimal(values.nee),
      neo: toDecimal(values.neo),
    };
  }
  const type = values.exam_type as ExamType;
  return {
    ...base,
    exam_type: type,
    // MEC usa as notas escrita (NEE) e oral (NEO); os outros, a nota do exame.
    exam_value: type === "MEC" ? null : toDecimal(values.exam_value),
    nee: type === "MEC" ? toDecimal(values.nee) : null,
    neo: type === "MEC" ? toDecimal(values.neo) : null,
  };
}

/** Notas de exame — `/api/avaliacoes/exams/`. */
export function ExamsManager() {
  const { enrollmentOptions, subjectOptions, loading } = useAssessmentOptions();

  return (
    <ResourceManager<ExamGrade>
      title="Notas de exame"
      noun="exames"
      addLabel="Lançar exame"
      icon={FileCheck2}
      searchPlaceholder="Pesquise por estudante ou disciplina"
      emptyMessage="Ainda não existem notas de exame lançadas."
      store={examsStore}
      columns={[
        {
          label: "Estudante",
          render: (e) => <span className="font-medium">{e.student_nome}</span>,
        },
        {
          label: "Classe",
          className: "w-[100px]",
          render: (e) => `${e.school_class_numero}.ª`,
        },
        { label: "Disciplina", render: (e) => e.subject_nome },
        {
          label: "Tipo",
          className: "w-[190px]",
          render: (e) => EXAM_TYPE_LABELS[typeOf(e)],
        },
        {
          label: "Nota",
          className: "w-[150px]",
          render: (e) =>
            typeOf(e) === "MEC" ? (
              <span className="flex gap-1.5 text-xs">
                <span title="Nota escrita">
                  NEE <GradeValue value={e.nee} passing={e.scale?.passing} />
                </span>
                <span title="Nota oral">
                  NEO <GradeValue value={e.neo} passing={e.scale?.passing} />
                </span>
              </span>
            ) : (
              <GradeValue value={e.exam_value} passing={e.scale?.passing} />
            ),
        },
      ]}
      getLabel={label}
      searchText={(e) => [e.student_nome, e.subject_nome]}
      compare={(a, b) =>
        a.student_nome.localeCompare(b.student_nome, "pt") ||
        a.subject_nome.localeCompare(b.subject_nome, "pt")
      }
      dialog={{
        titles: {
          create: "Lançar nota de exame",
          edit: "Editar nota de exame",
          view: "Dados do exame",
        },
        descriptions: {
          create:
            "Só em classes com exame final e disciplinas não isentas. Exame simples ou especial: indique a nota. Exame MEC: indique a nota escrita (NEE) e a oral (NEO).",
          edit: "Corrija a nota de exame.",
          view: "Consulte a nota de exame.",
        },
        submitLabel: "Lançar exame",
        fields: [
          idField("enrollment", "Estudante (matrícula)", UserRound, enrollmentOptions, loading),
          idField("turma_disciplina", "Disciplina da turma", BookOpen, subjectOptions, loading),
          {
            name: "exam_type",
            label: "Tipo de exame",
            type: "select",
            icon: FileCheck2,
            required: true,
            wide: true,
            options: [
              { value: AUTO_TYPE, label: "Tipo configurado para a disciplina" },
              ...optionsOf(EXAM_TYPE_LABELS),
            ],
          },
          {
            name: "exam_value",
            label: "Nota do exame (simples/especial)",
            icon: Hash,
            maxLength: 5,
            placeholder: "Ex.: 12",
            wide: true,
          },
          { name: "nee", label: "NEE · escrita (MEC)", icon: PenLine, maxLength: 5, placeholder: "Ex.: 11" },
          { name: "neo", label: "NEO · oral (MEC)", icon: PenLine, maxLength: 5, placeholder: "Ex.: 13" },
        ],
        emptyValues: {
          enrollment: "",
          turma_disciplina: "",
          exam_type: AUTO_TYPE,
          exam_value: "",
          nee: "",
          neo: "",
        },
        toValues: (e) => ({
          enrollment: e.enrollment,
          turma_disciplina: e.turma_disciplina,
          exam_type: typeOf(e),
          exam_value: asText(e.exam_value),
          nee: asText(e.nee),
          neo: asText(e.neo),
        }),
        validate: (values) => {
          if (!isUuid(values.enrollment) || !isUuid(values.turma_disciplina)) {
            return "Indique um estudante e uma disciplina válidos.";
          }
          if (values.exam_type === AUTO_TYPE) {
            const single = isDecimal(values.exam_value);
            const mec = isDecimal(values.nee) && isDecimal(values.neo);
            return single || mec
              ? null
              : "Indique a nota do exame ou, no exame MEC, a nota escrita (NEE) e a oral (NEO).";
          }
          if (values.exam_type === "MEC") {
            return isDecimal(values.nee) && isDecimal(values.neo)
              ? null
              : "No exame MEC indique a nota escrita (NEE) e a oral (NEO).";
          }
          return isDecimal(values.exam_value)
            ? null
            : "Indique a nota do exame (ex.: 12,5).";
        },
      }}
      messages={{
        created: () => "Nota de exame lançada com sucesso.",
        updated: (e) => `Exame de ${e.student_nome} atualizado.`,
        deleted: (e) => `Exame de ${e.student_nome} eliminado.`,
      }}
      fetchOne={getExamGradeById}
      onCreate={(values, token) => createExamGrade(toPayload(values), token)}
      onUpdate={(e, values, token) => patchExamGrade(e.id, toPayload(values), token)}
      onDelete={(e, token) => deleteExamGrade(e.id, token)}
    />
  );
}

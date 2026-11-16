"use client";

import {
  BookOpen,
  CalendarRange,
  FileCheck2,
  Hash,
  Layers,
  MessageSquareText,
  Ruler,
  Scale,
  Sigma,
} from "lucide-react";

import { ResourceManager } from "@/components/shared/resource/resource-manager";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAllSubjects } from "@/hooks/academic/use-subjects";
import {
  createClassRule,
  deleteClassRule,
  getClassRuleById,
  patchClassRule,
  type ClassRule,
  type ClassRulePayload,
} from "@/services/class-rules";
import {
  createGradingScale,
  deleteGradingScale,
  getGradingScaleById,
  patchGradingScale,
  type GradingScale,
  type GradingScalePayload,
  type RoundingMode,
} from "@/services/grading-scales";
import {
  createSubjectExamRule,
  deleteSubjectExamRule,
  getSubjectExamRuleById,
  patchSubjectExamRule,
  type SubjectExamRule,
  type SubjectExamType,
} from "@/services/subject-exam-rules";
import { classRulesStore } from "@/stores/use-class-rules.store";
import { gradingScalesStore } from "@/stores/use-grading-scales.store";
import { subjectExamRulesStore } from "@/stores/use-subject-exam-rules.store";

import { formatDecimal, isDecimal, toDecimal } from "./labels";

const ROUNDING_LABELS: Record<RoundingMode, string> = {
  HALF_UP: "Meio para cima (14,5 → 15)",
  HALF_DOWN: "Meio para baixo (14,5 → 14)",
  UP: "Sempre para cima",
  DOWN: "Sempre para baixo",
};

const SUBJECT_EXAM_LABELS: Record<SubjectExamType, string> = {
  SIMPLE: "Exame simples",
  MEC: "Exame escrito e oral (MEC)",
  EXEMPT: "Sem exame (isenta)",
};

const options = <K extends string>(labels: Record<K, string>) =>
  (Object.entries(labels) as [K, string][]).map(([value, label]) => ({ value, label }));

const yesNo = [
  { value: "true", label: "Sim" },
  { value: "false", label: "Não" },
];

const DEFAULT_YEAR = String(new Date().getFullYear());

/** 0 = aplica-se a todos os anos (valor do seed). */
const isEffectiveYear = (value: string) =>
  /^d+$/.test(value.trim()) && (Number(value) === 0 || (Number(value) >= 2000 && Number(value) <= 2100));
const yearLabel = (value?: number) => (value ? String(value) : "Sempre");

const int = (value: string) => (value.trim() === "" ? null : Number(value));
const isInt = (value: string, min = 0, max = 99) =>
  /^\d+$/.test(value.trim()) && Number(value) >= min && Number(value) <= max;
const optionalInt = (value: string, min = 0, max = 99) => value.trim() === "" || isInt(value, min, max);
/** Peso: decimal entre 0 e 1 com até duas casas (ex.: 0,4). */
const isWeight = (value: string) => /^(0([.,]\d{1,2})?|1([.,]0{1,2})?)$/.test(value.trim());

const effectiveFrom = {
  name: "effective_from",
  label: "Aplica-se a partir do ano letivo (ano de início)",
  type: "number" as const,
  icon: CalendarRange,
  min: 0,
  max: 2100,
  required: true,
  wide: true,
  placeholder: "Ex.: 2026 (0 = todos os anos)",
};

/* ───────────────────────────── Escalas ───────────────────────────── */

/** Escalas de avaliação por intervalo de classes (`/api/avaliacoes/grading-scales/`). */
export function GradingScalesManager() {
  const label = (s: GradingScale) => `${s.class_min}.ª–${s.class_max}.ª classe`;
  const toPayload = (v: Record<string, string>): GradingScalePayload => ({
    class_min: Number(v.class_min),
    class_max: Number(v.class_max),
    min_value: toDecimal(v.min_value) ?? "0",
    max_value: toDecimal(v.max_value) ?? "",
    passing_value: toDecimal(v.passing_value) ?? "",
    rounding_mode: v.rounding_mode as RoundingMode,
    effective_from: Number(v.effective_from),
  });

  return (
    <ResourceManager<GradingScale>
      title="Escalas de avaliação"
      noun="escalas"
      addLabel="Nova escala"
      icon={Ruler}
      searchPlaceholder="Pesquise por classe ou ano"
      emptyMessage="Ainda não existem escalas de avaliação."
      store={gradingScalesStore}
      pageSize={8}
      columns={[
        { label: "Classes", render: (s) => <span className="font-medium">{label(s)}</span> },
        {
          label: "Intervalo",
          className: "w-[120px]",
          render: (s) => `${formatDecimal(s.min_value ?? "0")} a ${formatDecimal(s.max_value)}`,
        },
        { label: "Positiva", className: "w-[90px]", render: (s) => `≥ ${formatDecimal(s.passing_value)}` },
        {
          label: "Arredondamento",
          className: "w-[200px]",
          render: (s) => ROUNDING_LABELS[s.rounding_mode ?? "HALF_UP"],
        },
        { label: "Desde", className: "w-[80px]", render: (s) => yearLabel(s.effective_from) },
      ]}
      getLabel={(s) => `a escala da ${label(s)}`}
      searchText={(s) => [label(s), String(s.effective_from ?? "")]}
      compare={(a, b) => a.class_min - b.class_min || (b.effective_from ?? 0) - (a.effective_from ?? 0)}
      dialog={{
        titles: { create: "Nova escala", edit: "Editar escala", view: "Escala de avaliação" },
        descriptions: {
          create: "Define os limites da nota, a positiva e o arredondamento para um intervalo de classes. Vale a escala com o ano mais recente que não ultrapasse o ano letivo.",
          edit: "Alterar uma escala muda a validação e o arredondamento das notas futuras.",
          view: "Consulte a escala.",
        },
        submitLabel: "Guardar escala",
        fields: [
          { name: "class_min", label: "Da classe", type: "number", icon: Layers, min: 1, max: 13, required: true, placeholder: "Ex.: 7" },
          { name: "class_max", label: "Até à classe", type: "number", icon: Layers, min: 1, max: 13, required: true, placeholder: "Ex.: 13" },
          { name: "min_value", label: "Nota mínima", icon: Hash, maxLength: 5, required: true, placeholder: "0" },
          { name: "max_value", label: "Nota máxima", icon: Hash, maxLength: 5, required: true, placeholder: "20" },
          { name: "passing_value", label: "Positiva a partir de", icon: Hash, maxLength: 5, required: true, placeholder: "10" },
          {
            name: "rounding_mode",
            label: "Arredondamento",
            type: "select",
            icon: Sigma,
            required: true,
            options: options(ROUNDING_LABELS),
          },
          effectiveFrom,
        ],
        emptyValues: {
          class_min: "",
          class_max: "",
          min_value: "0",
          max_value: "",
          passing_value: "",
          rounding_mode: "HALF_UP",
          effective_from: DEFAULT_YEAR,
        },
        toValues: (s) => ({
          class_min: String(s.class_min),
          class_max: String(s.class_max),
          min_value: formatDecimal(s.min_value ?? "0"),
          max_value: formatDecimal(s.max_value),
          passing_value: formatDecimal(s.passing_value),
          rounding_mode: s.rounding_mode ?? "HALF_UP",
          effective_from: String(s.effective_from ?? DEFAULT_YEAR),
        }),
        validate: (v) => {
          if (!isInt(v.class_min, 1, 13) || !isInt(v.class_max, 1, 13)) return "As classes vão de 1 a 13.";
          if (Number(v.class_min) > Number(v.class_max)) return "A classe inicial não pode ser maior que a final.";
          if (![v.min_value, v.max_value, v.passing_value].every(isDecimal)) {
            return "As notas devem ser números com até duas casas decimais.";
          }
          const [min, max, pass] = [v.min_value, v.max_value, v.passing_value].map((x) => Number(toDecimal(x)));
          if (!(min < max) || pass < min || pass > max) return "A positiva tem de estar entre a nota mínima e a máxima.";
          if (max > 20) return "A nota máxima não pode passar de 20.";
          if (!isEffectiveYear(v.effective_from)) return "Indique o ano de início (ex.: 2026) ou 0 para todos os anos.";
          return null;
        },
      }}
      messages={{
        created: () => "Escala de avaliação criada.",
        updated: (s) => `Escala da ${label(s)} atualizada.`,
        deleted: (s) => `Escala da ${label(s)} eliminada.`,
      }}
      fetchOne={getGradingScaleById}
      onCreate={(v, token) => createGradingScale(toPayload(v), token)}
      onUpdate={(s, v, token) => patchGradingScale(s.id, toPayload(v), token)}
      onDelete={(s, token) => deleteGradingScale(s.id, token)}
    />
  );
}

/* ─────────────────────────── Regras por classe ─────────────────────────── */

/** Regras de avaliação por classe (`/api/avaliacoes/class-rules/`). */
export function ClassRulesManager() {
  const subjects = useAllSubjects();
  const subjectOptions = subjects.items
    .map((s) => ({ value: s.id, label: s.nome }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt"));

  const toPayload = (v: Record<string, string>): ClassRulePayload => ({
    school_class_numero: Number(v.school_class_numero),
    approved_max_negatives: Number(v.approved_max_negatives),
    recourse_max_negatives: int(v.recourse_max_negatives),
    direct_fail_min_negatives: int(v.direct_fail_min_negatives),
    has_final_exam: v.has_final_exam === "true",
    exam_weight: toDecimal(v.exam_weight) ?? "0",
    mfd_weight: toDecimal(v.mfd_weight) ?? "1",
    pt_disabled_trimester: int(v.pt_disabled_trimester),
    allowed_negative_subject: v.allowed_negative_subject || null,
    notes: v.notes.trim(),
    effective_from: Number(v.effective_from),
  });

  return (
    <ResourceManager<ClassRule>
      title="Regras por classe"
      noun="regras"
      addLabel="Nova regra"
      icon={Scale}
      searchPlaceholder="Pesquise por classe"
      emptyMessage="Ainda não existem regras por classe."
      store={classRulesStore}
      pageSize={13}
      columns={[
        {
          label: "Classe",
          className: "w-[90px]",
          render: (r) => <span className="font-medium">{r.school_class_numero}.ª</span>,
        },
        {
          label: "Transição (negativas)",
          render: (r) =>
            `aprova ≤ ${r.approved_max_negatives ?? 0}` +
            (r.recourse_max_negatives != null ? ` · recurso ≤ ${r.recourse_max_negatives}` : "") +
            (r.direct_fail_min_negatives != null ? ` · reprova ≥ ${r.direct_fail_min_negatives}` : ""),
        },
        {
          label: "Exame",
          className: "w-[170px]",
          render: (r) =>
            r.has_final_exam ? (
              <StatusBadge tone="info">
                Sim · {formatDecimal(r.mfd_weight)}×MFD + {formatDecimal(r.exam_weight)}×Ex.
              </StatusBadge>
            ) : (
              <span className="text-muted-foreground">Não</span>
            ),
        },
        {
          label: "PT",
          className: "w-[150px]",
          render: (r) => (r.pt_disabled_trimester ? `Sem PT no ${r.pt_disabled_trimester}.º trim.` : "Todos os trimestres"),
        },
        { label: "Desde", className: "w-[80px]", render: (r) => yearLabel(r.effective_from) },
      ]}
      getLabel={(r) => `a regra da ${r.school_class_numero}.ª classe`}
      searchText={(r) => [`${r.school_class_numero}`, `${r.school_class_numero}.ª`, r.notes ?? ""]}
      compare={(a, b) => a.school_class_numero - b.school_class_numero || (b.effective_from ?? 0) - (a.effective_from ?? 0)}
      dialog={{
        titles: { create: "Nova regra de classe", edit: "Editar regra de classe", view: "Regra de classe" },
        descriptions: {
          create: "Define os componentes, o exame e os limites de negativas para a transição numa classe.",
          edit: "Alterações mudam o cálculo de resultados e a situação dos alunos dessa classe.",
          view: "Consulte a regra.",
        },
        submitLabel: "Guardar regra",
        fields: [
          { name: "school_class_numero", label: "Classe", type: "number", icon: Layers, min: 1, max: 13, required: true, placeholder: "Ex.: 10" },
          effectiveFrom,
          { name: "approved_max_negatives", label: "Aprova com até (negativas)", type: "number", icon: Hash, min: 0, max: 20, required: true, placeholder: "Ex.: 2" },
          { name: "recourse_max_negatives", label: "Recurso com até (negativas)", type: "number", icon: Hash, min: 0, max: 20, placeholder: "Opcional" },
          { name: "direct_fail_min_negatives", label: "Reprova a partir de (negativas)", type: "number", icon: Hash, min: 0, max: 20, placeholder: "Opcional" },
          {
            name: "pt_disabled_trimester",
            label: "PT não se aplica no",
            type: "select",
            icon: CalendarRange,
            options: [1, 2, 3].map((n) => ({ value: String(n), label: `${n}.º trimestre` })),
            noneLabel: "PT em todos os trimestres",
          },
          { name: "has_final_exam", label: "Tem exame final", type: "select", icon: FileCheck2, required: true, options: yesNo },
          { name: "mfd_weight", label: "Peso da MFD (0 a 1)", icon: Sigma, maxLength: 4, placeholder: "Ex.: 0,6" },
          { name: "exam_weight", label: "Peso do exame (0 a 1)", icon: Sigma, maxLength: 4, placeholder: "Ex.: 0,4" },
          {
            name: "allowed_negative_subject",
            label: "Negativa permitida em",
            type: "select",
            icon: BookOpen,
            options: subjectOptions,
            optionsLoading: subjects.status === "loading",
            noneLabel: "Nenhuma disciplina",
          },
          { name: "notes", label: "Notas", icon: MessageSquareText, maxLength: 500, wide: true, placeholder: "Opcional" },
        ],
        emptyValues: {
          school_class_numero: "",
          effective_from: DEFAULT_YEAR,
          approved_max_negatives: "",
          recourse_max_negatives: "",
          direct_fail_min_negatives: "",
          pt_disabled_trimester: "",
          has_final_exam: "false",
          mfd_weight: "1",
          exam_weight: "0",
          allowed_negative_subject: "",
          notes: "",
        },
        toValues: (r) => ({
          school_class_numero: String(r.school_class_numero),
          effective_from: String(r.effective_from ?? DEFAULT_YEAR),
          approved_max_negatives: String(r.approved_max_negatives ?? 0),
          recourse_max_negatives: r.recourse_max_negatives == null ? "" : String(r.recourse_max_negatives),
          direct_fail_min_negatives: r.direct_fail_min_negatives == null ? "" : String(r.direct_fail_min_negatives),
          pt_disabled_trimester: r.pt_disabled_trimester ? String(r.pt_disabled_trimester) : "",
          has_final_exam: r.has_final_exam ? "true" : "false",
          mfd_weight: formatDecimal(r.mfd_weight ?? "1"),
          exam_weight: formatDecimal(r.exam_weight ?? "0"),
          allowed_negative_subject: r.allowed_negative_subject ?? "",
          notes: r.notes ?? "",
        }),
        validate: (v) => {
          if (!isInt(v.school_class_numero, 1, 13)) return "A classe vai de 1 a 13.";
          if (!isEffectiveYear(v.effective_from)) return "Indique o ano de início (ex.: 2026) ou 0 para todos os anos.";
          if (!isInt(v.approved_max_negatives, 0, 20)) return "Indique o máximo de negativas para aprovar.";
          if (!optionalInt(v.recourse_max_negatives, 0, 20) || !optionalInt(v.direct_fail_min_negatives, 0, 20)) {
            return "Os limites de negativas devem ser números inteiros.";
          }
          if (!isWeight(v.mfd_weight) || !isWeight(v.exam_weight)) return "Os pesos são decimais entre 0 e 1 (ex.: 0,6).";
          if (v.has_final_exam === "true") {
            const sum = Number(toDecimal(v.mfd_weight)) + Number(toDecimal(v.exam_weight));
            if (Math.abs(sum - 1) > 0.001) return "Com exame, os pesos da MFD e do exame devem somar 1.";
          }
          return null;
        },
      }}
      messages={{
        created: (v) => `Regra da ${v.school_class_numero}.ª classe criada.`,
        updated: (r) => `Regra da ${r.school_class_numero}.ª classe atualizada.`,
        deleted: (r) => `Regra da ${r.school_class_numero}.ª classe eliminada.`,
      }}
      fetchOne={getClassRuleById}
      onCreate={(v, token) => createClassRule(toPayload(v), token)}
      onUpdate={(r, v, token) => patchClassRule(r.id, toPayload(v), token)}
      onDelete={(r, token) => deleteClassRule(r.id, token)}
    />
  );
}

/* ─────────────────────────── Exame por disciplina ─────────────────────────── */

/** Tipo de exame por disciplina e classe (`/api/avaliacoes/subject-exam-rules/`). */
export function SubjectExamRulesManager() {
  const subjects = useAllSubjects();
  const subjectOptions = subjects.items
    .map((s) => ({ value: s.id, label: s.nome }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt"));

  const toPayload = (v: Record<string, string>) => ({
    school_class_numero: Number(v.school_class_numero),
    subject: v.subject,
    exam_type: v.exam_type as SubjectExamType,
    effective_from: Number(v.effective_from),
  });

  return (
    <ResourceManager<SubjectExamRule>
      title="Exame por disciplina"
      noun="regras de exame"
      addLabel="Nova regra de exame"
      icon={FileCheck2}
      searchPlaceholder="Pesquise por disciplina ou classe"
      emptyMessage="Ainda não existem regras de exame. Sem regra, a disciplina usa o exame simples."
      store={subjectExamRulesStore}
      columns={[
        { label: "Disciplina", render: (r) => <span className="font-medium">{r.subject_nome}</span> },
        { label: "Classe", className: "w-[90px]", render: (r) => `${r.school_class_numero}.ª` },
        {
          label: "Exame",
          className: "w-[220px]",
          render: (r) => (
            <StatusBadge tone={r.exam_type === "EXEMPT" ? "neutral" : r.exam_type === "MEC" ? "info" : "positive"}>
              {SUBJECT_EXAM_LABELS[r.exam_type ?? "SIMPLE"]}
            </StatusBadge>
          ),
        },
        { label: "Desde", className: "w-[80px]", render: (r) => yearLabel(r.effective_from) },
      ]}
      getLabel={(r) => `a regra de exame de ${r.subject_nome} (${r.school_class_numero}.ª)`}
      searchText={(r) => [r.subject_nome, `${r.school_class_numero}.ª`]}
      compare={(a, b) => a.school_class_numero - b.school_class_numero || a.subject_nome.localeCompare(b.subject_nome, "pt")}
      dialog={{
        titles: { create: "Nova regra de exame", edit: "Editar regra de exame", view: "Regra de exame" },
        descriptions: {
          create: "Escolha o tipo de exame da disciplina numa classe com exame final. Isenta: a disciplina não tem exame.",
          edit: "Altere o tipo de exame.",
          view: "Consulte a regra.",
        },
        submitLabel: "Guardar regra",
        fields: [
          {
            name: "subject",
            label: "Disciplina",
            type: "select",
            icon: BookOpen,
            required: true,
            wide: true,
            options: subjectOptions,
            optionsLoading: subjects.status === "loading",
          },
          { name: "school_class_numero", label: "Classe", type: "number", icon: Layers, min: 1, max: 13, required: true, placeholder: "Ex.: 9" },
          { name: "exam_type", label: "Tipo de exame", type: "select", icon: FileCheck2, required: true, options: options(SUBJECT_EXAM_LABELS) },
          effectiveFrom,
        ],
        emptyValues: { subject: "", school_class_numero: "", exam_type: "SIMPLE", effective_from: DEFAULT_YEAR },
        toValues: (r) => ({
          subject: r.subject,
          school_class_numero: String(r.school_class_numero),
          exam_type: r.exam_type ?? "SIMPLE",
          effective_from: String(r.effective_from ?? DEFAULT_YEAR),
        }),
        validate: (v) => {
          if (!v.subject) return "Selecione a disciplina.";
          if (!isInt(v.school_class_numero, 1, 13)) return "A classe vai de 1 a 13.";
          if (!isEffectiveYear(v.effective_from)) return "Indique o ano de início (ex.: 2026) ou 0 para todos os anos.";
          return null;
        },
      }}
      messages={{
        created: () => "Regra de exame criada.",
        updated: (r) => `Regra de exame de ${r.subject_nome} atualizada.`,
        deleted: (r) => `Regra de exame de ${r.subject_nome} eliminada.`,
      }}
      fetchOne={getSubjectExamRuleById}
      onCreate={(v, token) => createSubjectExamRule(toPayload(v), token)}
      onUpdate={(r, v, token) => patchSubjectExamRule(r.id, toPayload(v), token)}
      onDelete={(r, token) => deleteSubjectExamRule(r.id, token)}
    />
  );
}

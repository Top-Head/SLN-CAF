"use client";

import { CalendarRange, Gavel, MessageSquareText, UserRound } from "lucide-react";

import { ResourceManager } from "@/components/shared/resource/resource-manager";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Tone } from "@/components/shared/tone";
import { formatDateTime } from "@/lib/utils/format-date";
import {
  createPromotionDecision,
  getPromotionDecisionById,
  type PromotionDecision,
  type PromotionStatus,
} from "@/services/promotion-decisions";
import { promotionDecisionsStore } from "@/stores/use-promotion-decisions.store";

import { idField, isUuid } from "./id-field";
import { PROMOTION_STATUS_LABELS, optionsOf, promotionLabel } from "./labels";
import { useAssessmentOptions } from "./use-assessment-options";

export const PROMOTION_TONES: Record<string, Tone> = {
  APROVADO: "positive",
  REPROVADO: "negative",
  RECURSO: "pending",
  EXAME_ESPECIAL: "info",
  PENDENTE_DECISAO: "neutral",
};

export function PromotionBadge({ status }: { status?: string | null }) {
  return (
    <StatusBadge tone={PROMOTION_TONES[status ?? ""] ?? "neutral"}>
      {promotionLabel(status)}
    </StatusBadge>
  );
}

/**
 * Decisões de transição/reprovação (Subdirector/Admin) —
 * `/api/avaliacoes/promotion-decisions/`. A API só permite listar,
 * detalhar e registar (sem editar nem eliminar).
 */
export function PromotionDecisionsManager() {
  const { enrollmentOptions, schoolYearOptions, loading } = useAssessmentOptions({
    decisions: true,
  });
  const studentOf = (id: string) =>
    enrollmentOptions.find((o) => o.value === id)?.label ?? `Matrícula ${id.slice(0, 8)}`;
  const yearOf = (id: string) =>
    schoolYearOptions.find((o) => o.value === id)?.label ?? "—";

  return (
    <ResourceManager<PromotionDecision>
      title="Decisões de promoção"
      noun="decisões"
      addLabel="Registar decisão"
      icon={Gavel}
      searchPlaceholder="Pesquise por estudante, estado ou motivo"
      emptyMessage="Ainda não foram registadas decisões."
      store={promotionDecisionsStore}
      columns={[
        {
          label: "Estudante",
          render: (d) => <span className="font-medium">{studentOf(d.enrollment)}</span>,
        },
        { label: "Ano letivo", className: "w-[110px]", render: (d) => yearOf(d.school_year) },
        {
          label: "Decisão",
          className: "w-[170px]",
          render: (d) => <PromotionBadge status={d.status} />,
        },
        {
          label: "Motivo",
          render: (d) => (
            <span className="line-clamp-1 text-muted-foreground">{d.reason || "—"}</span>
          ),
        },
        {
          label: "Data",
          className: "w-[150px]",
          render: (d) => formatDateTime(d.created_at),
        },
      ]}
      getLabel={(d) => `decisão de ${studentOf(d.enrollment)}`}
      searchText={(d) => [studentOf(d.enrollment), promotionLabel(d.status), d.reason]}
      compare={(a, b) => b.created_at.localeCompare(a.created_at)}
      dialog={{
        titles: {
          create: "Registar decisão",
          edit: "",
          view: "Decisão de promoção",
        },
        descriptions: {
          create:
            "Regista a decisão final de transição do estudante no ano letivo. Fica guardada no histórico e não pode ser editada.",
          edit: "",
          view: "Consulte a decisão registada.",
        },
        submitLabel: "Registar decisão",
        fields: [
          idField("enrollment", "Estudante (matrícula)", UserRound, enrollmentOptions, loading),
          {
            name: "school_year",
            label: "Ano letivo",
            type: "select",
            icon: CalendarRange,
            required: true,
            options: schoolYearOptions,
          },
          {
            name: "status",
            label: "Decisão",
            type: "select",
            icon: Gavel,
            required: true,
            options: optionsOf(PROMOTION_STATUS_LABELS),
          },
          {
            name: "reason",
            label: "Motivo",
            icon: MessageSquareText,
            required: true,
            wide: true,
            maxLength: 500,
            placeholder: "Ex.: Aprovado em conselho de notas",
          },
        ],
        emptyValues: { enrollment: "", school_year: "", status: "", reason: "" },
        toValues: (d) => ({
          enrollment: d.enrollment,
          school_year: d.school_year,
          status: d.status,
          reason: d.reason,
        }),
        validate: (values) => {
          if (!isUuid(values.enrollment)) return "Indique um estudante válido.";
          if (!values.school_year || !values.status) {
            return "Selecione o ano letivo e a decisão.";
          }
          return values.reason.trim() ? null : "Indique o motivo da decisão.";
        },
      }}
      messages={{
        created: (values) =>
          `Decisão "${promotionLabel(values.status)}" registada com sucesso.`,
      }}
      fetchOne={getPromotionDecisionById}
      onCreate={(values, token) =>
        createPromotionDecision(
          {
            enrollment: values.enrollment.trim(),
            school_year: values.school_year,
            status: values.status as PromotionStatus,
            reason: values.reason.trim(),
          },
          token,
        )
      }
    />
  );
}

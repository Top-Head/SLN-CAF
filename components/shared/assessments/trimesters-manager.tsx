"use client";

import { CalendarDays, CalendarRange, LockKeyhole } from "lucide-react";

import { ResourceManager } from "@/components/shared/resource/resource-manager";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  createTrimester,
  deleteTrimester,
  getTrimesterById,
  patchTrimester,
  type Trimester,
  type TrimesterStatus,
} from "@/services/trimesters";
import { trimestersStore } from "@/stores/use-trimesters.store";

import { TRIMESTER_STATUS_LABELS, optionsOf, trimesterLabel } from "./labels";
import { useAssessmentOptions } from "./use-assessment-options";

const yearOf = (t: Trimester) =>
  t.school_year_detail
    ? `${t.school_year_detail.ano_inicio}/${t.school_year_detail.ano_fim}`
    : "—";

/**
 * Trimestres de cada ano letivo (`/api/avaliacoes/trimesters/`).
 * Fechar um trimestre bloqueia o lançamento de notas nesse trimestre.
 */
export function TrimestersManager() {
  const { schoolYearOptions } = useAssessmentOptions();

  return (
    <ResourceManager<Trimester>
      title="Trimestres"
      noun="trimestres"
      addLabel="Novo trimestre"
      icon={CalendarDays}
      searchPlaceholder="Pesquise por ano letivo ou trimestre"
      emptyMessage="Ainda não existem trimestres cadastrados."
      store={trimestersStore}
      pageSize={6}
      columns={[
        {
          label: "Trimestre",
          render: (t) => <span className="font-medium">{t.numero}.º trimestre</span>,
        },
        { label: "Ano letivo", className: "w-[160px]", render: yearOf },
        {
          label: "Estado",
          className: "w-[140px]",
          render: (t) => (
            <StatusBadge tone={t.status === "FECHADO" ? "neutral" : "positive"}>
              {TRIMESTER_STATUS_LABELS[t.status ?? "ABERTO"]}
            </StatusBadge>
          ),
        },
      ]}
      getLabel={trimesterLabel}
      searchText={(t) => [trimesterLabel(t), yearOf(t)]}
      compare={(a, b) =>
        (b.school_year_detail?.ano_inicio ?? 0) -
          (a.school_year_detail?.ano_inicio ?? 0) || a.numero - b.numero
      }
      dialog={{
        titles: {
          create: "Novo trimestre",
          edit: "Editar trimestre",
          view: "Dados do trimestre",
        },
        descriptions: {
          create: "Associe o trimestre a um ano letivo.",
          edit: "Feche o trimestre para impedir novos lançamentos de notas.",
          view: "Consulte o trimestre registado.",
        },
        submitLabel: "Cadastrar trimestre",
        fields: [
          {
            name: "school_year",
            label: "Ano letivo",
            type: "select",
            icon: CalendarRange,
            required: true,
            wide: true,
            options: schoolYearOptions,
          },
          {
            name: "numero",
            label: "Trimestre",
            type: "select",
            icon: CalendarDays,
            required: true,
            options: [1, 2, 3].map((n) => ({
              value: String(n),
              label: `${n}.º trimestre`,
            })),
          },
          {
            name: "status",
            label: "Estado",
            type: "select",
            icon: LockKeyhole,
            required: true,
            options: optionsOf(TRIMESTER_STATUS_LABELS),
          },
        ],
        emptyValues: { school_year: "", numero: "", status: "ABERTO" },
        toValues: (t) => ({
          school_year: t.school_year,
          numero: String(t.numero),
          status: t.status ?? "ABERTO",
        }),
        validate: (values) =>
          !values.school_year || !values.numero
            ? "Selecione o ano letivo e o trimestre."
            : null,
      }}
      messages={{
        created: (values) => `${values.numero}.º trimestre criado com sucesso.`,
        updated: (_, values) =>
          values.status === "FECHADO"
            ? `${values.numero}.º trimestre fechado: os lançamentos ficam bloqueados.`
            : `${values.numero}.º trimestre atualizado.`,
        deleted: (t) => `${trimesterLabel(t)} eliminado.`,
      }}
      fetchOne={getTrimesterById}
      onCreate={(values, token) =>
        createTrimester(
          {
            school_year: values.school_year,
            numero: Number(values.numero),
            status: values.status as TrimesterStatus,
          },
          token,
        )
      }
      onUpdate={(t, values, token) =>
        patchTrimester(
          t.id,
          {
            school_year: values.school_year,
            numero: Number(values.numero),
            status: values.status as TrimesterStatus,
          },
          token,
        )
      }
      onDelete={(t, token) => deleteTrimester(t.id, token)}
    />
  );
}

"use client";

import { Calculator, CalendarDays, CalendarRange, Gavel, UserRound } from "lucide-react";
import { useState, type ReactNode } from "react";

import { currentAccessToken } from "@/components/shared/resource/resource-manager";
import {
  ResourceFormDialog,
  type SelectOption,
} from "@/components/shared/resource/resource-form-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notify } from "@/lib/notify";
import {
  createPromotionDecision,
  type PromotionStatus,
} from "@/services/promotion-decisions";
import {
  getAnnualResult,
  getPromotionResult,
  getTrimesterResult,
  type AnnualResult,
  type PromotionResult,
  type TrimesterResult,
} from "@/services/results";
import { promotionDecisionsStore } from "@/stores/use-promotion-decisions.store";

import { GradeValue } from "./grades-manager";
import { isUuid } from "./id-field";
import { PROMOTION_STATUS_LABELS, formatDecimal, optionsOf } from "./labels";
import { PromotionBadge } from "./promotion-decisions-manager";
import { useAssessmentOptions } from "./use-assessment-options";

type Results = {
  trimester: TrimesterResult | null;
  annual: AnnualResult | null;
  promotion: PromotionResult | null;
};

const EMPTY: Results = { trimester: null, annual: null, promotion: null };

/**
 * Resultados calculados pela API para uma matrícula:
 * trimestre (`results/trimester/`), ano (`results/annual/`) e situação de
 * transição (`results/promotion/`), com registo da decisão final.
 */
export function StudentResults({ canDecide = false }: { canDecide?: boolean }) {
  const { enrollmentOptions, trimesterOptions, schoolYearOptions, enrollmentYear, loading } =
    useAssessmentOptions({ decisions: canDecide });
  const [enrollment, setEnrollment] = useState("");
  const [trimester, setTrimester] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [results, setResults] = useState<Results>(EMPTY);
  const [pending, setPending] = useState(false);
  const [decisionOpen, setDecisionOpen] = useState(false);

  const year = schoolYear || enrollmentYear.get(enrollment) || "";
  const passing = (value?: string) => (value ? Number(value) : undefined);

  async function load() {
    if (!isUuid(enrollment)) {
      notify.info("Selecione o estudante (matrícula) para calcular os resultados.");
      return;
    }
    if (!trimester && !year) {
      notify.info("Selecione um trimestre ou um ano letivo.");
      return;
    }

    setPending(true);
    const token = currentAccessToken();
    const [trimesterResult, annual, promotion] = await Promise.allSettled([
      trimester ? getTrimesterResult({ enrollment, trimester }, token) : Promise.resolve(null),
      year ? getAnnualResult({ enrollment, school_year: year }, token) : Promise.resolve(null),
      year ? getPromotionResult({ enrollment, school_year: year }, token) : Promise.resolve(null),
    ]);
    setPending(false);

    const value = <T,>(r: PromiseSettledResult<T | null>) =>
      r.status === "fulfilled" ? r.value : null;
    setResults({
      trimester: value(trimesterResult),
      annual: value(annual),
      promotion: value(promotion),
    });

    const failed = [trimesterResult, annual, promotion].filter(
      (r): r is PromiseRejectedResult => r.status === "rejected",
    );
    const requested = (trimester ? 1 : 0) + (year ? 2 : 0);
    if (failed.length > 0 && failed.length === requested) {
      notify.error(failed[0].reason, "Não foi possível calcular os resultados.");
    } else if (failed.length > 0) {
      notify.warning("Alguns resultados não puderam ser calculados.");
    } else {
      notify.success("Resultados calculados.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-wrap items-end gap-3 rounded-lg border bg-card px-6 py-4">
        <Picker
          label="Estudante (matrícula)"
          icon={<UserRound className="size-4" />}
          value={enrollment}
          options={enrollmentOptions}
          loading={loading}
          manual
          onChange={(next) => {
            setEnrollment(next);
            setSchoolYear("");
            setResults(EMPTY);
          }}
          wide
        />
        <Picker
          label="Trimestre"
          icon={<CalendarDays className="size-4" />}
          value={trimester}
          options={trimesterOptions}
          onChange={setTrimester}
        />
        <Picker
          label="Ano letivo"
          icon={<CalendarRange className="size-4" />}
          value={year}
          options={schoolYearOptions}
          onChange={setSchoolYear}
        />
        <button
          type="button"
          onClick={() => void load()}
          disabled={pending}
          className="flex h-11 items-center gap-2 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          <Calculator className="size-4" />
          {pending ? "A calcular..." : "Calcular resultados"}
        </button>
      </section>

      {!results.trimester && !results.annual && !results.promotion && (
        <p className="rounded-lg border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
          Escolha o estudante e o trimestre ou ano letivo para ver as médias calculadas pela API.
        </p>
      )}

      {results.promotion && (
        <Card
          title={`Situação de transição · ${results.promotion.student}`}
          subtitle={`${results.promotion.turma} · ${results.promotion.school_class}.ª classe · ${results.promotion.school_year}`}
          action={
            canDecide && (
              <button
                type="button"
                onClick={() => setDecisionOpen(true)}
                className="flex h-9 items-center gap-2 rounded-md border bg-card px-3.5 text-[13px] font-medium transition-colors hover:bg-muted"
              >
                <Gavel className="size-4 text-neutral" />
                {results.promotion.decision ? "Nova decisão" : "Registar decisão"}
              </button>
            )
          }
        >
          <div className="grid gap-4 px-6 pb-5 text-sm sm:grid-cols-4">
            <Stat label="Situação" value={<PromotionBadge status={results.promotion.status} />} />
            <Stat label="Sugestão do sistema" value={<PromotionBadge status={results.promotion.suggested_status} />} />
            <Stat
              label="Negativas"
              value={`${results.promotion.negative_count} de ${results.promotion.allowed_negative_count} permitidas`}
            />
            <Stat label="Dados completos" value={results.promotion.is_complete ? "Sim" : "Não"} />
          </div>
          {results.promotion.decision && (
            <p className="mx-6 mb-5 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
              Decisão registada por {results.promotion.decision.decided_by}:{" "}
              <strong>{PROMOTION_STATUS_LABELS[results.promotion.decision.status]}</strong>
              {results.promotion.decision.reason && ` — ${results.promotion.decision.reason}`}
            </p>
          )}
        </Card>
      )}

      {results.trimester && (
        <Card
          title={`${results.trimester.trimester}.º trimestre · ${results.trimester.student}`}
          subtitle={`${results.trimester.turma} · escala ${formatDecimal(results.trimester.scale_min)}–${formatDecimal(results.trimester.scale_max)}, positiva a partir de ${formatDecimal(results.trimester.passing_grade)}`}
        >
          <Table
            head={["Disciplina", "Professor", "MAC", "PP", "PT", "Média"]}
            rows={results.trimester.subjects.map((s) => [
              <span key="s" className="font-medium">
                {s.subject}
                {!s.is_complete && (
                  <span className="ml-2 text-xs text-muted-foreground">(incompleta)</span>
                )}
              </span>,
              s.teacher || "—",
              formatDecimal(s.components.MAC),
              formatDecimal(s.components.PP),
              formatDecimal(s.components.PT),
              <GradeValue key="m" value={s.average} passing={passing(results.trimester?.passing_grade)} />,
            ])}
          />
        </Card>
      )}

      {results.annual && (
        <Card
          title={`Resultado anual · ${results.annual.student}`}
          subtitle={`${results.annual.turma} · ${results.annual.school_year}`}
        >
          <Table
            head={["Disciplina", "MT1", "MT2", "MT3", "MFD", "Exame", "MF"]}
            rows={results.annual.subjects.map((s) => [
              <span key="s" className={s.negative ? "font-medium text-primary" : "font-medium"}>
                {s.subject}
              </span>,
              formatDecimal(s.mt1),
              formatDecimal(s.mt2),
              formatDecimal(s.mt3),
              formatDecimal(s.mfd),
              s.exam
                ? s.exam.type === "MEC"
                  ? `NEE ${formatDecimal(s.exam.nee)} · NEO ${formatDecimal(s.exam.neo)}`
                  : formatDecimal(s.exam.value)
                : "—",
              <GradeValue key="mf" value={s.mf} passing={passing(results.annual?.passing_grade)} />,
            ])}
          />
        </Card>
      )}

      {canDecide && results.promotion && (
        <ResourceFormDialog<PromotionResult>
          key={decisionOpen ? "open" : "closed"}
          open={decisionOpen}
          mode="create"
          item={null}
          icon={Gavel}
          titles={{ create: "Registar decisão", edit: "", view: "" }}
          descriptions={{
            create: `Decisão final de ${results.promotion.student} no ano letivo ${results.promotion.school_year}.`,
            edit: "",
            view: "",
          }}
          submitLabel="Registar decisão"
          fields={[
            {
              name: "status",
              label: "Decisão",
              type: "select",
              icon: Gavel,
              required: true,
              wide: true,
              options: optionsOf(PROMOTION_STATUS_LABELS),
            },
            {
              name: "reason",
              label: "Motivo",
              required: true,
              wide: true,
              maxLength: 500,
              placeholder: "Ex.: Aprovado em conselho de notas",
            },
          ]}
          emptyValues={{ status: results.promotion.suggested_status ?? "", reason: "" }}
          toValues={() => ({ status: "", reason: "" })}
          validate={(values) =>
            !values.status
              ? "Selecione a decisão."
              : values.reason.trim()
                ? null
                : "Indique o motivo da decisão."
          }
          onSubmit={async (values) => {
            await createPromotionDecision(
              {
                enrollment,
                school_year: year,
                status: values.status as PromotionStatus,
                reason: values.reason.trim(),
              },
              currentAccessToken(),
            );
            notify.success("Decisão registada com sucesso.");
            await promotionDecisionsStore.invalidate();
            await load();
          }}
          onOpenChange={setDecisionOpen}
        />
      )}
    </div>
  );
}

function Picker({
  label,
  icon,
  value,
  options,
  loading,
  manual,
  wide,
  onChange,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  options: SelectOption[];
  loading?: boolean;
  /** Sem opções conhecidas, permite escrever o identificador. */
  manual?: boolean;
  wide?: boolean;
  onChange: (value: string) => void;
}) {
  const useInput = manual && !loading && options.length === 0;
  return (
    <label className={wide ? "flex min-w-[260px] flex-[2] flex-col gap-2" : "flex min-w-[200px] flex-1 flex-col gap-2"}>
      <span className="text-xs font-medium text-[#1e1e1e]">
        {useInput ? `${label} (ID)` : label}
      </span>
      {useInput ? (
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value.trim())}
          placeholder="Identificador (UUID) da matrícula"
          className="h-11"
        />
      ) : (
        <Select value={value || undefined} onValueChange={onChange} disabled={loading}>
          <SelectTrigger icon={icon} aria-label={label}>
            <SelectValue placeholder={loading ? "A carregar..." : "Selecione"} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </label>
  );
}

function Card({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <header className="flex flex-wrap items-center gap-3 px-6 py-4">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="font-sans text-[15px] font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto border-t">
      <table className="w-full min-w-[560px] text-left text-[13px]">
        <thead className="bg-table-head text-[11px] text-muted-foreground uppercase">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-6 py-2.5 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={head.length} className="px-6 py-6 text-center text-muted-foreground">
                Sem disciplinas com dados.
              </td>
            </tr>
          ) : (
            rows.map((cells, i) => (
              <tr key={i} className="border-t">
                {cells.map((cell, j) => (
                  <td key={j} className="px-6 py-3">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

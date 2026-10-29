"use client";

import { Pencil } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

import {
  APPROVAL_RULES,
  FORMULA_TERMS,
  FORMULAS,
  GRADE_SCALES,
  OPTIONS,
  ROUNDING_EXAMPLES,
  roundGrade,
  type SectionProps,
} from "../_lib/settings";
import { Field, SelectInput, SettingsSection, SettingsTable, TextInput, ToggleOption } from "./settings-ui";

function Tag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "info" }) {
  return (
    <span
      className={cn(
        "rounded-sm px-2 py-[3px] text-xs font-medium",
        tone === "info" ? "bg-info-soft text-info" : "bg-neutral-soft text-neutral",
      )}
    >
      {children}
    </span>
  );
}

export function ScalesSection() {
  return (
    <SettingsSection
      id="classes"
      title="Classes e escalas"
      description="Escala de avaliação e componentes por classe. A positiva começa a meio da escala"
    >
      <SettingsTable
        columns={[
          { label: "Classe", className: "w-[120px]" },
          { label: "Tipo", className: "w-[150px]" },
          { label: "Escala", className: "w-[90px]" },
          { label: "Positiva ≥", className: "w-[110px]" },
          { label: "Componentes" },
        ]}
      >
        {GRADE_SCALES.map((row) => (
          <tr key={row.grades}>
            <td className="font-medium">{row.grades}</td>
            <td>{row.type}</td>
            <td>{row.scale}</td>
            <td>{row.pass}</td>
            <td>
              <div className="flex flex-wrap gap-1.5">
                <Tag>MAC</Tag>
                <Tag>PP</Tag>
                <Tag>PT</Tag>
                {row.exam && <Tag tone="info">Exame</Tag>}
              </div>
            </td>
          </tr>
        ))}
      </SettingsTable>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-xs font-medium text-neutral">Fora do sistema:</span>
        <Tag>Iniciação</Tag>
        <Tag>13.ª classe</Tag>
        <span className="text-xs text-muted-foreground">
          Estas classes não usam o sistema de gestão de notas.
        </span>
      </div>
    </SettingsSection>
  );
}

export function FormulasSection({ value, onChange }: SectionProps<"formulas">) {
  const weightsValid = value.mfdWeight + value.examWeight === 100;
  const toWeight = (text: string) => Math.max(0, Math.min(100, Number(text.replace(/\D/g, "")) || 0));

  return (
    <SettingsSection
      id="formulas"
      title="Fórmulas de cálculo"
      description="Como o sistema calcula as médias a partir das notas lançadas pelos professores"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {FORMULAS.map((formula) => (
          <div key={formula.name} className="flex flex-col gap-2.5 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <h3 className="flex-1 font-sans text-[13px] font-semibold">{formula.name}</h3>
              <button
                type="button"
                aria-label={`Editar fórmula: ${formula.name}`}
                className="rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Pencil className="size-4" />
              </button>
            </div>
            <code className="rounded-md bg-table-head px-3 py-2.5 font-mono text-sm font-medium text-primary">
              {formula.expression}
            </code>
            <p className="text-xs text-muted-foreground">{formula.scope}</p>
          </div>
        ))}
      </div>

      <dl className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
        {FORMULA_TERMS.map(([term, meaning]) => (
          <div key={term} className="flex gap-1.5">
            <dt className="font-mono font-medium">{term}</dt>
            <dd className="text-muted-foreground">{meaning}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-start gap-4">
        <Field label="Peso da MFD na nota final" className="max-w-[200px]">
          {(id) => (
            <TextInput
              id={id}
              inputMode="numeric"
              suffix="%"
              value={value.mfdWeight}
              invalid={!weightsValid}
              onChange={(text) => onChange({ mfdWeight: toWeight(text) })}
            />
          )}
        </Field>
        <Field label="Peso do exame na nota final" className="max-w-[200px]">
          {(id) => (
            <TextInput
              id={id}
              inputMode="numeric"
              suffix="%"
              value={value.examWeight}
              invalid={!weightsValid}
              onChange={(text) => onChange({ examWeight: toWeight(text) })}
            />
          )}
        </Field>
        <p
          role={weightsValid ? undefined : "alert"}
          className={cn(
            "min-w-[200px] flex-1 pt-6 text-xs",
            weightsValid ? "text-muted-foreground" : "text-destructive",
          )}
        >
          {weightsValid
            ? "Os pesos têm de somar 100%. Alterar uma fórmula recalcula as médias ainda não publicadas."
            : `Os pesos somam ${value.mfdWeight + value.examWeight}%. Ajuste-os para somarem 100%.`}
        </p>
      </div>
    </SettingsSection>
  );
}

export function RoundingSection({ value, onChange }: SectionProps<"rounding">) {
  return (
    <SettingsSection
      id="arredondamento"
      title="Arredondamento"
      description="Regra aplicada às notas calculadas antes de aparecerem nas pautas e boletins"
    >
      <div className="flex flex-wrap gap-4">
        <Field label="Regra">
          {(id) => (
            <SelectInput id={id} value={value.rule} options={OPTIONS.roundingRules} onChange={(rule) => onChange({ rule })} />
          )}
        </Field>
        <Field label="Aplicar a">
          {(id) => (
            <SelectInput id={id} value={value.scope} options={OPTIONS.roundingScopes} onChange={(scope) => onChange({ scope })} />
          )}
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium text-neutral">Exemplos:</span>
        {ROUNDING_EXAMPLES.map((example) => (
          <span key={example} className="flex items-center gap-1.5 rounded-md bg-table-head px-2.5 py-1.5 text-[13px]">
            <span className="font-mono font-medium text-neutral">{example.toLocaleString("pt-PT")}</span>
            <span aria-hidden className="text-muted-foreground">→</span>
            <span className="sr-only">fica</span>
            <span className="font-mono font-medium">{roundGrade(example, value.rule)}</span>
          </span>
        ))}
      </div>
      <ToggleOption
        title="Mostrar a nota antes do arredondamento"
        description="Exibe o valor com décimas, a cinzento, ao lado da nota final nas pautas internas"
        checked={value.showRaw}
        onChange={(showRaw) => onChange({ showRaw })}
      />
    </SettingsSection>
  );
}

export function ApprovalSection({ value, onChange }: SectionProps<"approval">) {
  return (
    <SettingsSection
      id="aprovacao"
      title="Regras de aprovação"
      description="Critérios de transição e reprovação de cada classe"
    >
      <SettingsTable
        columns={[
          { label: "Classe", className: "w-[90px]" },
          { label: "Regra" },
          { label: "Máx. negativas", className: "w-[110px]" },
          { label: "Recurso", className: "w-[120px]" },
          { label: "Estado", className: "w-[130px]" },
        ]}
      >
        {APPROVAL_RULES.map((row) => (
          <tr key={row.grades}>
            <td className="font-medium">{row.grades}</td>
            <td>{row.rule}</td>
            <td>{row.maxNegatives}</td>
            <td>{row.appeal}</td>
            <td>
              {row.confirmed ? (
                <StatusBadge tone="positive">Activa</StatusBadge>
              ) : (
                <StatusBadge tone="pending">Por confirmar</StatusBadge>
              )}
            </td>
          </tr>
        ))}
      </SettingsTable>
      <ToggleOption
        title="Permitir recurso nas classes de transição"
        description="Com duas negativas o estudante vai a recurso; com três negativas reprova"
        checked={value.allowAppeal}
        onChange={(allowAppeal) => onChange({ allowAppeal })}
      />
    </SettingsSection>
  );
}

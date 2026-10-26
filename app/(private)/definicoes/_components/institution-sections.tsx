"use client";

import { Mail, Phone, Plus, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

import { BRAND_COLORS, OPTIONS, TRIMESTER_DATES, type SectionProps } from "../_lib/settings";
import { Field, outlineButton, SelectInput, SettingsSection, SettingsTable, TextInput } from "./settings-ui";

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

export function IdentitySection({ value, onChange }: SectionProps<"identity">) {
  const fileRef = useRef<HTMLInputElement>(null);

  // Liberta o URL temporário do logótipo quando é substituído ou removido.
  useEffect(() => {
    const logo = value.logo;
    return () => {
      if (logo?.startsWith("blob:")) URL.revokeObjectURL(logo);
    };
  }, [value.logo]);

  return (
    <SettingsSection
      id="identidade"
      title="Identidade da instituição"
      description="Nome, logótipo e contactos que aparecem no sistema, nas pautas e nos boletins"
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed bg-table-head">
          {value.logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- pré-visualização local (blob:)
            <img src={value.logo} alt="Logótipo carregado" className="size-full object-contain p-2" />
          ) : (
            <Image src="/logo.svg" alt="Logótipo actual" width={44} height={44} />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[13px] font-medium">Logótipo</span>
          <span className="text-xs text-muted-foreground">
            PNG ou SVG com fundo transparente, até 2 MB. Recomendado 512 × 512 px.
          </span>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/svg+xml"
          className="sr-only"
          aria-label="Carregar novo logótipo"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            if (file.size > MAX_LOGO_BYTES) {
              window.alert("O logótipo tem de ter no máximo 2 MB.");
              return;
            }
            onChange({ logo: URL.createObjectURL(file) });
          }}
        />
        <button type="button" onClick={() => fileRef.current?.click()} className={outlineButton}>
          <Upload className="size-4 text-neutral" />
          Carregar novo
        </button>
        <button
          type="button"
          disabled={!value.logo}
          onClick={() => onChange({ logo: null })}
          className="text-[13px] font-medium text-primary hover:underline disabled:opacity-40 disabled:no-underline"
        >
          Remover
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Field label="Nome do sistema">
          {(id) => <TextInput id={id} value={value.systemName} onChange={(systemName) => onChange({ systemName })} />}
        </Field>
        <Field label="Subtítulo do sistema">
          {(id) => (
            <TextInput id={id} value={value.systemSubtitle} onChange={(systemSubtitle) => onChange({ systemSubtitle })} />
          )}
        </Field>
      </div>
      <div className="flex flex-wrap gap-4">
        <Field label="Nome da instituição">
          {(id) => <TextInput id={id} value={value.institution} onChange={(institution) => onChange({ institution })} />}
        </Field>
        <Field label="Sigla" className="max-w-40 min-w-32">
          {(id) => <TextInput id={id} value={value.acronym} onChange={(acronym) => onChange({ acronym })} />}
        </Field>
      </div>
      <div className="flex flex-wrap gap-4">
        <Field label="Email da secretaria">
          {(id) => (
            <TextInput id={id} type="email" icon={Mail} value={value.email} onChange={(email) => onChange({ email })} />
          )}
        </Field>
        <Field label="Telefone">
          {(id) => (
            <TextInput id={id} type="tel" icon={Phone} value={value.phone} onChange={(phone) => onChange({ phone })} />
          )}
        </Field>
      </div>
      <Field label="Morada">
        {(id) => <TextInput id={id} value={value.address} onChange={(address) => onChange({ address })} />}
      </Field>

      <div className="flex flex-col gap-2">
        <span id="cor-principal" className="text-xs font-medium text-neutral">
          Cor principal
        </span>
        <div role="radiogroup" aria-labelledby="cor-principal" className="flex flex-wrap items-center gap-2.5">
          {BRAND_COLORS.map((color) => {
            const selected = color === value.color;
            return (
              <button
                key={color}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={color}
                onClick={() => onChange({ color })}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 transition-colors",
                  selected ? "border-current" : "border-transparent",
                )}
                style={{ color }}
              >
                <span className="size-6 rounded-full" style={{ backgroundColor: color }} />
              </button>
            );
          })}
          <span className="text-xs text-muted-foreground">
            {value.color} · usada em botões, destaques e no menu activo
          </span>
        </div>
      </div>
    </SettingsSection>
  );
}

export function YearSection({ value, onChange }: SectionProps<"year">) {
  return (
    <SettingsSection
      id="ano-lectivo"
      title="Ano lectivo"
      description="Ano e trimestres em curso. As notas ficam sempre associadas ao trimestre correcto"
    >
      <div className="flex flex-wrap gap-4">
        <Field label="Ano lectivo activo">
          {(id) => (
            <SelectInput id={id} value={value.active} options={OPTIONS.years} onChange={(active) => onChange({ active })} />
          )}
        </Field>
        <Field label="Trimestre activo">
          {(id) => (
            <SelectInput
              id={id}
              value={value.trimester}
              options={OPTIONS.trimesters}
              onChange={(trimester) => onChange({ trimester })}
            />
          )}
        </Field>
      </div>

      <SettingsTable
        columns={[
          { label: "Trimestre" },
          { label: "Início", className: "w-[150px]" },
          { label: "Fim", className: "w-[150px]" },
          { label: "Estado", className: "w-[130px]" },
        ]}
      >
        {TRIMESTER_DATES.map((t) => (
          <tr key={t.name}>
            <td className="font-medium">{t.name}</td>
            <td>{t.start}</td>
            <td>{t.end}</td>
            <td>
              {t.status === "current" ? (
                <StatusBadge tone="positive">Em curso</StatusBadge>
              ) : (
                <StatusBadge tone="info">Por iniciar</StatusBadge>
              )}
            </td>
          </tr>
        ))}
      </SettingsTable>

      <div className="flex flex-wrap items-center gap-3">
        <p className="flex-1 text-xs text-muted-foreground">
          No 3.º trimestre das classes de exame (6.ª e 9.ª) não há PT.
        </p>
        <button type="button" className={outlineButton}>
          <Plus className="size-4 text-neutral" />
          Iniciar novo ano lectivo
        </button>
      </div>
    </SettingsSection>
  );
}

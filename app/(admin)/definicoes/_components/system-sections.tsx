"use client";

import { Archive, Database, GraduationCap, RotateCcw, Upload, UsersRound, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

import { EXPORT_FORMATS, OPTIONS, type SectionProps } from "../_lib/settings";
import {
  ChipGroup,
  Divider,
  Field,
  OptionRow,
  outlineButton,
  SelectInput,
  SettingsGroupLabel,
  SettingsSection,
  ToggleOption,
} from "./settings-ui";

function ImportCard({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="flex min-w-[260px] flex-1 flex-col gap-3 rounded-lg border border-dashed bg-table-head p-4">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-card">
          <Icon className="size-[18px] text-neutral" />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h4 className="font-sans text-[13px] font-semibold">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="sr-only"
        aria-label={`Carregar ficheiro: ${title}`}
        onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => fileRef.current?.click()} className={outlineButton}>
          <Upload className="size-4 text-neutral" />
          Carregar ficheiro
        </button>
        <button type="button" className="text-[13px] font-medium text-primary hover:underline">
          Descarregar modelo .xlsx
        </button>
      </div>
      {fileName && (
        <p aria-live="polite" className="truncate text-xs text-neutral">
          Ficheiro seleccionado: <span className="font-medium text-foreground">{fileName}</span>
        </p>
      )}
    </div>
  );
}

export function DataSection({ value, onChange }: SectionProps<"data">) {
  const [lastBackup, setLastBackup] = useState("hoje, 02:00");

  return (
    <SettingsSection
      id="dados"
      title="Dados e cópias de segurança"
      description="Exportação, importação de listas e cópias de segurança automáticas"
    >
      <SettingsGroupLabel>Exportação</SettingsGroupLabel>
      <ChipGroup
        label="Formatos"
        options={EXPORT_FORMATS}
        value={value.formats}
        onChange={(formats) => onChange({ formats })}
      />
      <div className="flex flex-col gap-3.5">
        <ToggleOption
          title="Cabeçalho oficial nos documentos"
          description="Logótipo e nome da instituição no topo das pautas, estatísticas e boletins"
          checked={value.officialHeader}
          onChange={(officialHeader) => onChange({ officialHeader })}
        />
        <Divider />
        <ToggleOption
          title="Incluir espaço para assinatura do director"
          description="Acrescenta a linha de assinatura no fim das pautas trimestrais"
          checked={value.signature}
          onChange={(signature) => onChange({ signature })}
        />
      </div>

      <Divider />
      <SettingsGroupLabel>Importação</SettingsGroupLabel>
      <div className="flex flex-wrap gap-4">
        <ImportCard
          icon={GraduationCap}
          title="Importar estudantes"
          description="Lista com nome, n.º de processo, classe e turma"
        />
        <ImportCard
          icon={UsersRound}
          title="Importar professores"
          description="Lista com nome, email e disciplinas que lecciona"
        />
      </div>

      <Divider />
      <SettingsGroupLabel>Cópias de segurança</SettingsGroupLabel>
      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-table-head px-4 py-3">
        <Database className="size-[18px] shrink-0 text-neutral" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p aria-live="polite" className="text-[13px] font-medium">
            Última cópia: {lastBackup} · 248 MB
          </p>
          <p className="text-xs text-muted-foreground">
            Próxima cópia automática amanhã às 02:00 · guardada em servidor externo
          </p>
        </div>
        <StatusBadge tone="positive">Concluída</StatusBadge>
      </div>
      <div className="flex flex-wrap gap-4">
        <Field label="Frequência">
          {(id) => (
            <SelectInput
              id={id}
              value={value.frequency}
              options={OPTIONS.backupFrequency}
              onChange={(frequency) => onChange({ frequency })}
            />
          )}
        </Field>
        <Field label="Manter cópias durante">
          {(id) => (
            <SelectInput
              id={id}
              value={value.retention}
              options={OPTIONS.backupRetention}
              onChange={(retention) => onChange({ retention })}
            />
          )}
        </Field>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() =>
            setLastBackup(
              `agora, ${new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}`,
            )
          }
          className={outlineButton}
        >
          <Database className="size-4 text-neutral" />
          Fazer cópia agora
        </button>
        <button type="button" className={outlineButton}>
          <RotateCcw className="size-4 text-neutral" />
          Restaurar a partir de uma cópia
        </button>
      </div>
    </SettingsSection>
  );
}

export function AuditSection({ value, onChange }: SectionProps<"audit">) {
  return (
    <SettingsSection
      id="auditoria"
      title="Auditoria e versões"
      description="Registo de quem lançou ou alterou notas e pautas, e quando"
    >
      <div className="flex flex-col gap-3.5">
        <ToggleOption
          title="Guardar histórico de versões das notas"
          description="Permite consultar o valor anterior de qualquer nota alterada"
          checked
          locked
        />
        <Divider />
        <ToggleOption
          title="Exigir motivo ao alterar notas publicadas"
          description="O director escreve a justificação, que fica no histórico"
          checked={value.requireReason}
          onChange={(requireReason) => onChange({ requireReason })}
        />
        <Divider />
        <OptionRow
          title="Manter registos durante"
          description="Logs de acesso e histórico de alterações"
          labelFor="manter-registos"
        >
          <SelectInput
            id="manter-registos"
            className="w-40"
            value={value.retention}
            options={OPTIONS.auditRetention}
            onChange={(retention) => onChange({ retention })}
          />
        </OptionRow>
      </div>
      <Link href="/historico-de-alteracoes" className="w-fit text-[13px] font-medium text-primary hover:underline">
        Abrir histórico de alterações
      </Link>
    </SettingsSection>
  );
}

const dangerButton = cn(
  "flex h-[38px] shrink-0 items-center gap-2 rounded-md border border-primary bg-card px-3.5 text-[13px] font-medium text-primary transition-colors hover:bg-accent",
);

export function DangerZone({ year, onFactoryReset }: { year: string; onFactoryReset: () => void }) {
  return (
    <SettingsSection
      danger
      title="Zona de perigo"
      description="Acções com impacto em todo o sistema. Pedem confirmação com palavra-passe"
    >
      <div className="flex flex-col gap-3.5">
        <OptionRow
          title="Arquivar o ano lectivo"
          description={`Fecha ${year} em modo de leitura. Pautas e boletins continuam disponíveis`}
        >
          <button
            type="button"
            onClick={() => window.confirm(`Arquivar o ano lectivo ${year}? Esta acção não pode ser desfeita aqui.`)}
            className={dangerButton}
          >
            <Archive className="size-4" />
            Arquivar ano
          </button>
        </OptionRow>
        <Divider />
        <OptionRow
          title="Repor definições de fábrica"
          description="Volta às fórmulas, escalas e regras originais. As notas lançadas não são apagadas"
        >
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Repor todas as definições de fábrica? As notas lançadas não são apagadas.")) {
                onFactoryReset();
              }
            }}
            className={dangerButton}
          >
            <RotateCcw className="size-4" />
            Repor definições
          </button>
        </OptionRow>
      </div>
    </SettingsSection>
  );
}

"use client";

import { Check, MessageCircle, Minus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { StatusBadge } from "@/components/shared/status-badge";
import { generateAccessCode } from "@/lib/utils/access-code";

import {
  ADMINS,
  CHANNELS,
  OPTIONS,
  PERMISSION_ROLES,
  PERMISSIONS,
  type Permission,
  type SectionProps,
} from "../_lib/settings";
import {
  ChipGroup,
  Divider,
  Field,
  OptionRow,
  SelectInput,
  SettingsGroupLabel,
  SettingsSection,
  SettingsTable,
  TextInput,
  ToggleOption,
} from "./settings-ui";

function PermissionCell({ access }: { access: Permission }) {
  if (access === true) return <Check aria-label="Permitido" className="size-4 text-positive" />;
  if (access === false) return <Minus aria-label="Sem acesso" className="size-4 text-catalog-faint" />;
  return (
    <span className="flex items-center gap-1.5 text-xs text-neutral">
      <Check aria-hidden className="size-3.5 text-pending" />
      {access}
    </span>
  );
}

export function UsersSection() {
  return (
    <SettingsSection
      id="utilizadores"
      title="Utilizadores e permissões"
      description="Cada perfil só acede às funções e aos dados que lhe cabem"
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-4">
          <SettingsGroupLabel>Administradores · Directores</SettingsGroupLabel>
          <Link href="/professores" className="ml-auto text-[13px] font-medium text-primary hover:underline">
            Gerir professores
          </Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-3">
          {ADMINS.map((admin) => (
            <li key={admin.email} className="flex items-center gap-2.5 rounded-lg border px-3 py-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary">
                {admin.initials}
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-[13px] font-medium">{admin.name}</span>
                <span className="truncate text-[11px] text-muted-foreground">{admin.email}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <SettingsTable
        columns={[
          { label: "Permissão" },
          ...PERMISSION_ROLES.map((role, i) => ({
            label: role,
            className: ["w-[100px]", "w-[130px]", "w-[140px]", "w-[130px]"][i],
          })),
        ]}
      >
        {PERMISSIONS.map((permission) => (
          <tr key={permission.name}>
            <td>{permission.name}</td>
            {permission.access.map((access, i) => (
              <td key={PERMISSION_ROLES[i]}>
                <PermissionCell access={access} />
              </td>
            ))}
          </tr>
        ))}
      </SettingsTable>
    </SettingsSection>
  );
}

export function SecuritySection({ value, onChange }: SectionProps<"security">) {
  const toNumber = (text: string, min: number, max: number) =>
    Math.max(min, Math.min(max, Number(text.replace(/\D/g, "")) || min));

  return (
    <SettingsSection
      id="seguranca"
      title="Segurança"
      description="Protecção das contas e dos dados contra acessos indevidos"
    >
      <ToggleOption
        title="Verificação em dois passos para administradores"
        description="Pede um código por SMS ou email ao entrar como director"
        checked={value.twoFactor}
        onChange={(twoFactor) => onChange({ twoFactor })}
      />
      <Divider />
      <OptionRow
        title="Terminar sessão por inactividade"
        description="Sai automaticamente quando a conta fica parada"
        labelFor="inactividade"
      >
        <SelectInput
          id="inactividade"
          className="w-40"
          value={value.inactivity}
          options={OPTIONS.inactivity}
          onChange={(inactivity) => onChange({ inactivity })}
        />
      </OptionRow>
      <Divider />
      <OptionRow
        title="Tamanho mínimo da palavra-passe"
        description="Com letras e números. Aplica-se a professores e administradores"
        labelFor="palavra-passe-minimo"
      >
        <TextInput
          id="palavra-passe-minimo"
          inputMode="numeric"
          className="w-40"
          suffix="caracteres"
          value={value.minPassword}
          onChange={(text) => onChange({ minPassword: toNumber(text, 6, 64) })}
        />
      </OptionRow>
      <Divider />
      <OptionRow
        title="Bloquear após tentativas falhadas"
        description="A conta fica bloqueada 15 minutos depois de várias tentativas erradas"
        labelFor="tentativas"
      >
        <TextInput
          id="tentativas"
          inputMode="numeric"
          className="w-40"
          suffix="tentativas"
          value={value.maxAttempts}
          onChange={(text) => onChange({ maxAttempts: toNumber(text, 1, 20) })}
        />
      </OptionRow>
      <Divider />
      <OptionRow
        title="Encriptação de dados"
        description="Palavras-passe, códigos de acesso e dados sensíveis são guardados e transmitidos cifrados"
      >
        <StatusBadge tone="positive">Sempre activa</StatusBadge>
      </OptionRow>
      <Divider />
      <ToggleOption
        title="Registar logs de acesso"
        description="Quem entrou, quando e o que fez. Obrigatório para auditoria"
        checked
        locked
      />
    </SettingsSection>
  );
}

export function CodesSection({ value, onChange }: SectionProps<"codes">) {
  const [example, setExample] = useState("K7QM-4X2P");

  return (
    <SettingsSection
      id="codigos"
      title="Códigos de acesso"
      description="Códigos que o director fornece aos estudantes para consultarem o boletim"
    >
      <div className="flex flex-wrap gap-4">
        <Field label="Formato">
          {(id) => (
            <SelectInput id={id} value={value.format} options={OPTIONS.codeFormats} onChange={(format) => onChange({ format })} />
          )}
        </Field>
        <Field label="Caracteres permitidos">
          {(id) => (
            <SelectInput id={id} value={value.charset} options={OPTIONS.codeCharsets} onChange={(charset) => onChange({ charset })} />
          )}
        </Field>
      </div>
      <div className="flex flex-wrap gap-4">
        <Field label="Validade do código">
          {(id) => (
            <SelectInput
              id={id}
              value={value.validity}
              options={OPTIONS.codeValidity}
              onChange={(validity) => onChange({ validity })}
            />
          )}
        </Field>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium text-neutral">Pré-visualização</span>
          <div className="flex items-center gap-2.5">
            <output
              aria-label="Código de exemplo"
              className="flex h-10 items-center rounded-md bg-accent px-3.5 font-mono text-[15px] font-medium tracking-[1.5px] text-primary"
            >
              {example}
            </output>
            <button
              type="button"
              onClick={() => setExample(generateAccessCode())}
              className="text-[13px] font-medium text-primary hover:underline"
            >
              Gerar outro exemplo
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3.5">
        <ToggleOption
          title="Regenerar invalida o código anterior"
          description="O código antigo deixa de funcionar assim que um novo é gerado"
          checked={value.regenerateInvalidates}
          onChange={(regenerateInvalidates) => onChange({ regenerateInvalidates })}
        />
        <Divider />
        <ToggleOption
          title="O mesmo código dá acesso ao boletim"
          description="O estudante usa um único código para entrar e consultar o boletim"
          checked={value.sameCode}
          onChange={(sameCode) => onChange({ sameCode })}
        />
        <Divider />
        <ToggleOption
          title="Permitir descarregar o boletim em PDF"
          description="O estudante pode guardar ou imprimir o boletim a partir da área dele"
          checked={value.allowPdf}
          onChange={(allowPdf) => onChange({ allowPdf })}
        />
      </div>
    </SettingsSection>
  );
}

export function NotificationsSection({ value, onChange }: SectionProps<"notifications">) {
  return (
    <SettingsSection
      id="notificacoes"
      title="Notificações"
      description="Avisos automáticos enviados a professores e directores"
    >
      <ChipGroup
        label="Canais"
        options={CHANNELS}
        value={value.channels}
        offIcon={MessageCircle}
        onChange={(channels) => onChange({ channels })}
      />
      <div className="flex flex-col gap-3.5">
        <OptionRow
          title="Lembrar professores antes do fim do prazo"
          description="Enviado a quem ainda tem notas por lançar na disciplina"
          labelFor="lembrete"
        >
          <SelectInput
            id="lembrete"
            className="w-40"
            value={value.reminder}
            options={OPTIONS.reminders}
            onChange={(reminder) => onChange({ reminder })}
          />
        </OptionRow>
        <Divider />
        <ToggleOption
          title="Avisar os directores quando uma pauta fica completa"
          description="Inclui a ligação directa para rever e publicar"
          checked={value.pautaComplete}
          onChange={(pautaComplete) => onChange({ pautaComplete })}
        />
        <Divider />
        <ToggleOption
          title="Alertar alterações de notas fora do prazo"
          description="Notifica os outros directores sempre que uma nota é corrigida depois do prazo"
          checked={value.lateChanges}
          onChange={(lateChanges) => onChange({ lateChanges })}
        />
        <Divider />
        <ToggleOption
          title="Resumo semanal do lançamento"
          description="Email às segundas-feiras com o progresso por disciplina e turma"
          checked={value.weeklySummary}
          onChange={(weeklySummary) => onChange({ weeklySummary })}
        />
      </div>
    </SettingsSection>
  );
}

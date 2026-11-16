"use client";

import { Ban, KeyRound } from "lucide-react";
import { useState } from "react";

import { ResourceManager, currentAccessToken } from "@/components/shared/resource/resource-manager";
import { StatusBadge } from "@/components/shared/status-badge";
import { notify } from "@/lib/notify";
import { formatDateTime } from "@/lib/utils/format-date";
import {
  getAccessCodeById,
  revokeAccessCode,
  type ManagedAccessCode,
} from "@/services/access-codes";
import { managedAccessCodesStore } from "@/stores/use-managed-access-codes.store";

type CodeState = "active" | "expired" | "revoked";

function stateOf(code: ManagedAccessCode): CodeState {
  if (code.revoked) return "revoked";
  return new Date(code.expires_at).getTime() < Date.now() ? "expired" : "active";
}

const STATE = {
  active: { label: "Ativo", tone: "positive" },
  expired: { label: "Expirado", tone: "neutral" },
  revoked: { label: "Revogado", tone: "negative" },
} as const;

/**
 * Códigos emitidos (`GET /api/acess-code/codes/`) e revogação
 * (`POST /codes/{id}/revoke/`). A API nunca devolve o código em claro aqui:
 * só no momento em que é gerado.
 */
export function IssuedCodesManager() {
  const [revoking, setRevoking] = useState<string | null>(null);

  async function revoke(code: ManagedAccessCode) {
    if (
      !window.confirm(
        `Revogar o código de ${code.student_nome}? O encarregado deixa de conseguir consultar o boletim com ele.`,
      )
    ) {
      return;
    }
    setRevoking(code.id);
    try {
      await revokeAccessCode(code.id, currentAccessToken());
      notify.success(`Código de ${code.student_nome} revogado.`);
      await managedAccessCodesStore.invalidate();
    } catch (cause) {
      notify.error(cause, "Não foi possível revogar o código.");
    } finally {
      setRevoking(null);
    }
  }

  return (
    <ResourceManager<ManagedAccessCode>
      title="Códigos emitidos"
      noun="códigos"
      addLabel=""
      icon={KeyRound}
      searchPlaceholder="Pesquise por aluno ou n.º de processo"
      emptyMessage="Ainda não foram emitidos códigos de acesso."
      store={managedAccessCodesStore}
      columns={[
        {
          label: "Estudante",
          render: (c) => (
            <span className="flex flex-col">
              <span className="font-medium">{c.student_nome}</span>
              <span className="text-xs text-muted-foreground">{c.student_numero_processo}</span>
            </span>
          ),
        },
        {
          label: "Estado",
          className: "w-[110px]",
          render: (c) => <StatusBadge tone={STATE[stateOf(c)].tone}>{STATE[stateOf(c)].label}</StatusBadge>,
        },
        { label: "Emitido", className: "w-[150px]", render: (c) => formatDateTime(c.created_at) },
        { label: "Válido até", className: "w-[150px]", render: (c) => formatDateTime(c.expires_at) },
        {
          label: "Último uso",
          className: "w-[150px]",
          render: (c) => (c.last_used_at ? formatDateTime(c.last_used_at) : "Nunca usado"),
        },
        { label: "Emitido por", className: "w-[130px]", render: (c) => c.created_by_username ?? "—" },
      ]}
      getLabel={(c) => `o código de ${c.student_nome}`}
      searchText={(c) => [c.student_nome, c.student_numero_processo]}
      compare={(a, b) => b.created_at.localeCompare(a.created_at)}
      rowActions={(c) =>
        stateOf(c) === "active" ? (
          <button
            type="button"
            onClick={() => void revoke(c)}
            disabled={revoking === c.id}
            className="flex h-8 items-center gap-1.5 rounded-md border border-negative px-2.5 text-xs font-medium text-negative transition-colors hover:bg-negative-soft disabled:opacity-50"
          >
            <Ban className="size-3.5" />
            {revoking === c.id ? "A revogar..." : "Revogar"}
          </button>
        ) : null
      }
      dialog={{
        titles: { create: "", edit: "", view: "Código de acesso" },
        descriptions: {
          create: "",
          edit: "",
          view: "O código em claro só é mostrado quando é gerado.",
        },
        submitLabel: "",
        fields: [],
        emptyValues: {},
        toValues: () => ({}),
        renderView: (c) => (
          <dl className="grid gap-3 rounded-lg border bg-[#FAFAFB] px-4 py-3 text-sm sm:grid-cols-2">
            <Info label="Estudante">{c.student_nome}</Info>
            <Info label="N.º de processo">{c.student_numero_processo}</Info>
            <Info label="Estado">{STATE[stateOf(c)].label}</Info>
            <Info label="Emitido por">{c.created_by_username ?? "—"}</Info>
            <Info label="Emitido">{formatDateTime(c.created_at)}</Info>
            <Info label="Válido até">{formatDateTime(c.expires_at)}</Info>
            <Info label="Último uso">{c.last_used_at ? formatDateTime(c.last_used_at) : "Nunca usado"}</Info>
          </dl>
        ),
      }}
      fetchOne={getAccessCodeById}
    />
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-[#1C1C1C]">{children}</dd>
    </div>
  );
}

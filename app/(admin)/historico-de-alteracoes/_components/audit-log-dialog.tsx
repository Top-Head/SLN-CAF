"use client";

import { useEffect, useState } from "react";

import { currentAccessToken } from "@/components/shared/resource/resource-manager";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { notify } from "@/lib/notify";
import { formatDateTime } from "@/lib/utils/format-date";
import { getAuditLogById, type AuditLog } from "@/services/audit-logs";

import { ActionBadge, StatusCode } from "./audit-log-list";

/** Detalhe de um registo (`GET /api/audit/logs/{id}/`), com as alterações. */
export function AuditLogDialog({
  log,
  onClose,
}: {
  log: AuditLog | null;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<AuditLog | null>(null);

  useEffect(() => {
    if (!log) return;
    let active = true;
    getAuditLogById(log.id, currentAccessToken())
      .then((result) => {
        if (active) setDetail(result);
      })
      .catch((cause: unknown) => {
        if (active) notify.error(cause, "Não foi possível carregar o detalhe do registo.");
      });
    return () => {
      active = false;
    };
  }, [log]);

  const current = detail?.id === log?.id ? detail : log;
  const changes = current?.changes;
  const hasChanges =
    changes !== null &&
    changes !== undefined &&
    !(typeof changes === "object" && Object.keys(changes as object).length === 0);

  return (
    <Dialog open={Boolean(log)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px]">
        {current && (
          <>
            <DialogHeader>
              <DialogTitle>Registo de auditoria</DialogTitle>
              <DialogDescription>
                {current.description || "Ação registada pelo sistema."}
              </DialogDescription>
            </DialogHeader>

            <dl className="grid gap-3 rounded-lg border bg-[#FAFAFB] px-4 py-3 text-sm sm:grid-cols-2">
              <Info label="Data">{formatDateTime(current.created_at)}</Info>
              <Info label="Ação">
                <ActionBadge action={current.action} />
              </Info>
              <Info label="Utilizador">
                {current.user_username || "Anónimo"}
                {current.user_role && ` · ${current.user_role}`}
              </Info>
              <Info label="Resultado">
                <StatusCode code={current.status_code} />
              </Info>
              <Info label="Entidade">{current.entity || "—"}</Info>
              <Info label="ID do registo">
                <span className="font-mono text-xs break-all">{current.entity_id || "—"}</span>
              </Info>
              <Info label="Pedido" wide>
                <span className="font-mono text-xs break-all">
                  {current.method} {current.path}
                </span>
              </Info>
              <Info label="Endereço IP">{current.ip_address || "—"}</Info>
              <Info label="Navegador" wide>
                <span className="text-xs break-all">{current.user_agent || "—"}</span>
              </Info>
            </dl>

            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-[#373737]">Alterações</h3>
              {hasChanges ? (
                <pre className="max-h-64 overflow-auto rounded-lg border bg-[#FAFAFB] p-3 font-mono text-xs">
                  {JSON.stringify(changes, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground">Sem alterações registadas.</p>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Info({
  label,
  wide,
  children,
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={wide ? "flex flex-col gap-0.5 sm:col-span-2" : "flex flex-col gap-0.5"}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-[#1C1C1C]">{children}</dd>
    </div>
  );
}

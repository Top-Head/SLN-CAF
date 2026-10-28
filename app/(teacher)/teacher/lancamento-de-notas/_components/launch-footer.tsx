import { ArrowRight, Check, CloudCheck, Lock, Send } from "lucide-react";
import Link from "next/link";

import type { Sheet } from "../_lib/mock-data";

const outlineButton =
  "flex h-[42px] items-center rounded-md border border-catalog-border bg-card px-4 text-[13px] font-medium text-catalog-text transition-colors hover:bg-muted";
const primaryButton =
  "flex h-[42px] items-center gap-2 rounded-md bg-primary px-4 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 disabled:hover:bg-primary";

type LaunchFooterProps = {
  sheet: Sheet;
  savedAt: string;
  concludedAt?: string;
  correctionRequested: boolean;
  onSaveDraft: () => void;
  onConclude: () => void;
  onRequestCorrection: () => void;
};

/** Barra final: gravação e conclusão com o prazo aberto; pedido de correcção depois. */
export function LaunchFooter({
  sheet,
  savedAt,
  concludedAt,
  correctionRequested,
  onSaveDraft,
  onConclude,
  onRequestCorrection,
}: LaunchFooterProps) {
  const open = sheet.period.status === "open";

  return (
    <section className="flex min-h-[76px] flex-wrap items-center justify-between gap-4 rounded-[10px] border border-catalog-border bg-card px-5 py-4">
      <div className="flex items-center gap-2.5">
        {open ? (
          <CloudCheck className="size-5 shrink-0 text-grade-pass" />
        ) : (
          <Lock className="size-5 shrink-0 text-catalog-text" />
        )}
        <div className="flex flex-col gap-[3px]" aria-live="polite">
          <p className="text-xs font-medium text-catalog-text">
            {!open
              ? `Mini-pauta bloqueada desde ${sheet.period.closesShort}`
              : concludedAt
                ? `Lançamento concluído às ${concludedAt} · alterações guardadas às ${savedAt}`
                : `Alterações guardadas automaticamente às ${savedAt}`}
          </p>
          <p className="text-[11px] text-catalog-muted">
            {!open
              ? correctionRequested
                ? "Pedido de correcção enviado à direcção pedagógica — a alteração fica no histórico."
                : "Encontrou um erro? Peça a correcção à direcção pedagógica — a alteração fica no histórico."
              : sheet.mode === "exam"
                ? "A direcção acompanha este lançamento em tempo real · MT3 calculada com MAC e PP; MF só depois do exame."
                : "A direcção acompanha este lançamento em tempo real · MT calculada só com MAC, PP e PT preenchidas."}
          </p>
        </div>
      </div>

      {open ? (
        <div className="flex gap-2.5">
          <button type="button" onClick={onSaveDraft} className={outlineButton}>
            Guardar rascunho
          </button>
          <button
            type="button"
            onClick={onConclude}
            disabled={Boolean(concludedAt)}
            className={primaryButton}
          >
            {concludedAt ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
            {concludedAt ? "Lançamento concluído" : "Concluir lançamento"}
          </button>
        </div>
      ) : (
        <div className="flex gap-2.5">
          <Link href="/teacher/mini-pautas" className={outlineButton}>
            Ver mini-pauta
          </Link>
          <button
            type="button"
            onClick={onRequestCorrection}
            disabled={correctionRequested}
            className={primaryButton}
          >
            {correctionRequested ? <Check className="size-4" /> : <Send className="size-4" />}
            {correctionRequested ? "Pedido enviado" : "Pedir correcção"}
          </button>
        </div>
      )}
    </section>
  );
}

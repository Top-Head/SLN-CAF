"use client";

import { ChevronRight, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { useRef, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatGrade } from "@/lib/utils/format-grade";

import type { summarize } from "../_lib/grading";
import type { Sheet } from "../_lib/mock-data";

/** Quantos estudantes pendentes aparecem no aviso antes de "Ver os N pendentes". */
const PREVIEW = 3;

type ConcludeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sheet: Sheet;
  summary: ReturnType<typeof summarize>;
  pending: { name: string; missing: string[] }[];
  onShowPending: () => void;
  onConfirm: () => void;
};

export function ConcludeDialog({
  open,
  onOpenChange,
  sheet,
  summary,
  pending,
  onShowPending,
  onConfirm,
}: ConcludeDialogProps) {
  const [checked, setChecked] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const total = sheet.students.length;

  const indicators = [
    { label: "Completos", value: `${summary.complete} / ${total}` },
    { label: "Positivas", value: summary.positives, className: "text-grade-pass" },
    { label: "Negativas", value: summary.negatives, className: "text-grade-fail" },
    {
      label: "Média da turma",
      value: summary.average === null ? "—" : formatGrade(Math.round(summary.average * 10) / 10),
    },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setChecked(false);
        onOpenChange(next);
      }}
    >
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={(event) => {
          // A primeira acção é conferir as notas, não fechar.
          event.preventDefault();
          confirmRef.current?.focus();
        }}
        className="gap-0 overflow-hidden rounded-xl border-0 p-0 shadow-[0_24px_48px_rgb(15_18_26/0.25)] sm:max-w-[540px]"
      >
        <div className="flex items-start gap-3.5 px-6 pt-6 pb-2">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-grade-fail-soft text-primary">
            <CircleCheck className="size-5" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <DialogTitle className="font-sans text-lg font-bold text-foreground">
              Concluir lançamento?
            </DialogTitle>
            <DialogDescription className="text-xs text-catalog-muted">
              {sheet.classInfo.name} · {sheet.subject} · {sheet.trimester}.º trimestre
            </DialogDescription>
          </div>
          <DialogClose
            aria-label="Fechar"
            className="flex size-8 items-center justify-center rounded-md text-catalog-muted transition-colors hover:bg-muted hover:text-catalog-text"
          >
            <X className="size-4" />
          </DialogClose>
        </div>

        <div className="flex flex-col gap-4 px-6 pt-4 pb-5">
          <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {indicators.map(({ label, value, className }) => (
              <div
                key={label}
                className="flex flex-col gap-1 rounded-lg border border-catalog-border px-3.5 py-3"
              >
                <dt className="text-[10px] text-catalog-muted">{label}</dt>
                <dd className={cn("font-mono text-[17px] font-semibold text-foreground", className)}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {pending.length > 0 && (
            <div className="flex flex-col gap-2.5 rounded-lg border border-[#f6ddb0] bg-[#fff8ec] px-4 py-3.5">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-[#7a4a00]">
                <TriangleAlert className="size-4 text-[#b26a00]" />
                {pending.length === 1
                  ? "1 estudante ainda tem notas em falta"
                  : `${pending.length} estudantes ainda têm notas em falta`}
              </p>
              <ul className="flex flex-col gap-1.5 pl-6">
                {pending.slice(0, PREVIEW).map(({ name, missing }) => (
                  <li key={name} className="flex justify-between gap-4">
                    <span className="text-xs text-[#4a3a1e]">{name}</span>
                    <span className="text-[11px] font-medium text-[#b26a00]">
                      falta {missing.join(", ")}
                    </span>
                  </li>
                ))}
                {pending.length > PREVIEW && (
                  <li>
                    <button
                      type="button"
                      onClick={onShowPending}
                      className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      Ver os {pending.length} pendentes
                      <ChevronRight className="size-3.5" />
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}

          <p className="flex gap-2.5 text-xs text-grade-locked-text">
            <Info className="size-4 shrink-0" />
            A mini-pauta fica marcada como concluída para a direcção. Pode continuar a corrigir notas
            até {sheet.period.closesShort}, depois, só a direcção pode alterar.
          </p>

          <label className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-grade-locked px-3.5 py-3 text-xs font-medium text-catalog-text">
            <Checkbox
              ref={confirmRef}
              checked={checked}
              onCheckedChange={(value) => setChecked(value === true)}
              className="size-[18px] rounded-sm data-[state=checked]:border-primary data-[state=checked]:bg-primary"
            />
            Conferi as notas lançadas e confirmo que estão correctas
          </label>
        </div>

        <div className="flex justify-end gap-2.5 border-t border-catalog-border bg-[#fafbfc] px-6 py-4">
          <DialogClose className="h-[42px] rounded-md border border-catalog-border bg-card px-4 text-[13px] font-medium text-catalog-text transition-colors hover:bg-muted">
            Voltar ao lançamento
          </DialogClose>
          <button
            type="button"
            disabled={!checked}
            onClick={() => {
              setChecked(false);
              onConfirm();
            }}
            className="h-[42px] rounded-md bg-primary px-4 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {pending.length > 0 ? `Concluir com ${pending.length} em falta` : "Concluir lançamento"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

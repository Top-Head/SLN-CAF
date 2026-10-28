"use client";

import { Download, RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { FilterSelect } from "@/components/shared/filter-select";
import { PageContext } from "@/components/shared/page-context";
import { generateAccessCode } from "@/lib/utils/access-code";

import {
  ACCESS_CODES,
  CLASSES,
  CODE_VALID_UNTIL,
  TRIMESTERS,
  type AccessCode,
} from "../_lib/mock-data";
import { AccessCodesTable, statusOfCode } from "./access-codes-table";

/** Descarrega a lista em CSV, sem os códigos (só o estado de cada aluno). */
function exportCsv(rows: AccessCode[], className: string) {
  const header = ["Processo", "Estudante", "Encarregado", "Telefone", "Estado", "Validade", "Último acesso"];
  const statusLabel = { active: "Activo", expired: "Expirado", none: "Sem código" } as const;
  const lines = rows.map((r) =>
    [r.process, r.student, r.guardian, r.phone, statusLabel[statusOfCode(r)], r.validUntil ?? "", r.lastAccess ?? ""]
      .map((cell) => `"${cell.replace(/"/g, '""')}"`)
      .join(";"),
  );
  const blob = new Blob([`﻿${[header.join(";"), ...lines].join("\n")}`], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `codigos-de-acesso-${className.replace(/\W+/g, "")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function AccessCodesWorkspace() {
  const [rows, setRows] = useState(ACCESS_CODES);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [className, setClassName] = useState("12.ª IB");
  const [trimester, setTrimester] = useState(TRIMESTERS[0]);

  const toggleReveal = (id: string) =>
    setRevealed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  /** Gera um código novo (ou o primeiro) e mostra-o para poder ser partilhado. */
  const regenerate = (ids: string[]) => {
    if (ids.length === 0) return;
    const targets = new Set(ids);
    setRows((all) =>
      all.map((row) =>
        targets.has(row.id)
          ? { ...row, code: generateAccessCode(), validUntil: CODE_VALID_UNTIL, expired: false, lastAccess: null }
          : row,
      ),
    );
    setRevealed((current) => new Set([...current, ...ids]));
  };

  const missingOrExpired = rows.filter((r) => statusOfCode(r) !== "active").map((r) => r.id);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <PageContext
          title="Acesso aos boletins"
          subtitle="Partilhe o código com o encarregado para consultar o boletim"
        />
        <FilterSelect label="Turma" value={className} options={CLASSES} onChange={setClassName} />
        <FilterSelect label="Trimestre" value={trimester} options={TRIMESTERS} onChange={setTrimester} />
        <button
          type="button"
          onClick={() => exportCsv(rows, className)}
          className="flex h-10 items-center gap-2 rounded-md border bg-card pr-4 pl-3.5 text-[13px] transition-colors hover:bg-muted"
        >
          <Download className="size-4 text-neutral" />
          Exportar lista
        </button>
        <button
          type="button"
          onClick={() => regenerate(missingOrExpired)}
          disabled={missingOrExpired.length === 0}
          title="Gera códigos para os alunos sem código e com o código expirado"
          className="flex h-10 items-center gap-2 rounded-md bg-primary pr-4 pl-3.5 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <RefreshCw className="size-4" />
          Gerar códigos da turma
        </button>
      </div>

      <AccessCodesTable
        rows={rows}
        revealed={revealed}
        onToggleReveal={toggleReveal}
        onRegenerate={(id) => regenerate([id])}
      />

      <section className="flex items-center gap-3.5 rounded-lg border bg-card px-6 py-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-positive-soft">
          <ShieldCheck className="size-[18px] text-positive" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <h2 className="font-sans text-[13px] font-semibold">Regenerar invalida o código anterior</h2>
          <p className="text-xs text-muted-foreground">
            O encarregado deixa de conseguir aceder ao boletim com o código antigo e passa a usar o
            novo código partilhado.
          </p>
        </div>
      </section>
    </>
  );
}

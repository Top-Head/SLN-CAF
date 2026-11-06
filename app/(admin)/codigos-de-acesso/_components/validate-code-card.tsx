"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { ValidateCodeForm } from "@/components/shared/report-card/validate-code-form";

/** Permite à secretaria confirmar um código tal como o encarregado o vê. */
export function ValidateCodeCard() {
  return (
    <section className="flex flex-col gap-4 rounded-lg border bg-card px-6 py-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-sans text-sm font-semibold">Validar um código</h2>
          <p className="text-xs text-muted-foreground">
            Confirme um código e veja o boletim exactamente como o encarregado o vê.
          </p>
        </div>
        <Link
          href="/boletim"
          target="_blank"
          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          Página pública do boletim
          <ExternalLink className="size-3.5" />
        </Link>
      </div>
      <ValidateCodeForm />
    </section>
  );
}

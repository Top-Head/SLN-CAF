"use client";

import { KeyRound, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

import {
  validateAccessCode,
  type AccessCodeValidation,
} from "@/services/access-codes";

import { StudentGradesReport } from "./student-grades-report";

/** Formulário que valida um código de acesso e mostra o boletim do aluno. */
export function ValidateCodeForm({ autoFocus }: { autoFocus?: boolean }) {
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AccessCodeValidation | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!code.trim()) {
      setError("Introduza o código de acesso.");
      return;
    }

    setPending(true);
    setError(null);
    setResult(null);

    try {
      setResult(await validateAccessCode({ codigo: code }));
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Código inválido, expirado ou já revogado.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-[220px] flex-1 flex-col gap-2">
          <span className="text-xs font-medium text-[#1e1e1e]">Código de acesso</span>
          <span className="flex h-11 items-center gap-2 rounded-md border bg-card px-3 focus-within:border-primary">
            <KeyRound className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setError(null);
              }}
              autoFocus={autoFocus}
              autoComplete="off"
              spellCheck={false}
              placeholder="Ex.: K7QM-4X2P"
              className="w-full bg-transparent font-mono text-sm tracking-[1px] outline-none placeholder:font-sans placeholder:tracking-normal placeholder:text-[#9e9e9e]"
            />
          </span>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="flex h-11 items-center gap-2 rounded-md bg-[#1c1d26] px-5 text-sm font-medium text-white transition-colors hover:bg-[#1c1d26]/90 disabled:opacity-60"
        >
          <Search className="size-3.5" />
          {pending ? "A validar..." : "Consultar boletim"}
        </button>
      </form>

      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {result && <StudentGradesReport result={result} />}
    </div>
  );
}

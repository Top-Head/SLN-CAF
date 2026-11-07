"use client";

import {
  Clock,
  Download,
  KeyRound,
  RefreshCw,
  School,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { useState } from "react";

import { FilterSelect } from "@/components/shared/filter-select";
import { PageContext } from "@/components/shared/page-context";
import { SummaryCards } from "@/components/shared/summary-cards";
import { notify } from "@/lib/notify";
import { formatDateTime } from "@/lib/utils/format-date";
import { useAllTurmas } from "@/hooks/academic/use-turmas";
import type { StudentAccessCode } from "@/services/access-codes";
import {
  accessCodesStore,
  useAccessCodesState,
} from "@/stores/use-access-codes.store";

import { AccessCodesTable, isExpired } from "./access-codes-table";
import { ValidateCodeCard } from "./validate-code-card";

const NO_TURMA = "Selecione a turma";


/** Descarrega a lista em CSV, sem os códigos (só o estado de cada aluno). */
function exportCsv(rows: StudentAccessCode[], turmaName: string) {
  const header = ["Processo", "Estudante", "Estado", "Validade"];
  const lines = rows.map((r) =>
    [
      r.student.numero_processo,
      r.student.nome,
      isExpired(r) ? "Expirado" : "Activo",
      formatDateTime(r.expires_at),
    ]
      .map((cell) => `"${cell.replace(/"/g, '""')}"`)
      .join(";"),
  );
  const blob = new Blob([`﻿${[header.join(";"), ...lines].join("\n")}`], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `codigos-de-acesso-${turmaName.replace(/\W+/g, "")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function AccessCodesWorkspace() {
  const turmas = useAllTurmas();
  const { byTurma } = useAccessCodesState();
  const [turmaId, setTurmaId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<string | null>(null);

  const turmaLabel = (t: { nome: string; school_year_label: string }) =>
    t.school_year_label ? `${t.nome} · ${t.school_year_label}` : t.nome;
  const options = [...turmas.items].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt", { numeric: true }),
  );
  const turma = options.find((t) => t.id === turmaId) ?? null;
  const rows = turma ? (byTurma[turma.id] ?? []) : [];
  const expired = rows.filter(isExpired).length;

  const toggleReveal = (studentId: string) =>
    setRevealed((current) => {
      const next = new Set(current);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });

  async function generateForTurma() {
    if (!turma) return;
    if (
      rows.length > 0 &&
      !window.confirm(
        "Gerar novos códigos invalida os códigos anteriores de todos os alunos desta turma. Continuar?",
      )
    ) {
      return;
    }

    setPending("turma");
    try {
      const result = await accessCodesStore.generateForTurma(turma.id);
      setRevealed(new Set(result.codes.map((c) => c.student.id)));
      const total = result.codes.length;
      if (total === 0) {
        notify.info(`A turma ${turma.nome} não tem alunos com matrícula activa.`);
      } else {
        notify.success(
          total === 1
            ? `1 código gerado para a turma ${turma.nome}.`
            : `${total} códigos gerados para a turma ${turma.nome}.`,
        );
        notify.info("Partilhe os códigos antes de sair: não ficam guardados neste dispositivo.");
      }
    } catch (cause) {
      notify.error(cause, "Não foi possível gerar os códigos.");
    } finally {
      setPending(null);
    }
  }

  async function regenerate(studentId: string) {
    if (!turma) return;
    setPending(studentId);
    try {
      await accessCodesStore.generateForStudent(turma.id, studentId);
      setRevealed((current) => new Set([...current, studentId]));
      const name = rows.find((r) => r.student.id === studentId)?.student.nome;
      notify.success(
        name
          ? `Novo código gerado para ${name}. O anterior deixou de ser válido.`
          : "Novo código gerado. O anterior deixou de ser válido.",
      );
    } catch (cause) {
      notify.error(cause, "Não foi possível gerar o código.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <SummaryCards
        className="gap-6"
        stats={[
          {
            label: "Turma selecionada",
            value: turma?.nome ?? "—",
            icon: School,
            tone: "info",
            iconSize: 20,
          },
          {
            label: "Códigos gerados",
            value: rows.length,
            icon: UsersRound,
            tone: "primary",
            iconSize: 20,
          },
          {
            label: "Códigos activos",
            value: rows.length - expired,
            icon: KeyRound,
            tone: "positive",
            iconSize: 20,
          },
          {
            label: "Códigos expirados",
            value: expired,
            icon: Clock,
            tone: "pending",
            iconSize: 20,
          },
        ]}
      />

      <div className="flex flex-wrap items-center gap-3">
        <PageContext
          title="Acesso aos boletins"
          subtitle="Partilhe o código com o encarregado para consultar o boletim"
        />
        <FilterSelect
          label="Turma"
          value={
            turma
              ? turmaLabel(turma)
              : turmas.status === "loading"
                ? "A carregar turmas..."
                : NO_TURMA
          }
          options={options.map(turmaLabel)}
          onChange={(label) => {
            setTurmaId(options.find((t) => turmaLabel(t) === label)?.id ?? null);
          }}
        />
        <button
          type="button"
          onClick={() => {
            if (!turma) return;
            exportCsv(rows, turma.nome);
            notify.success(`Lista da turma ${turma.nome} exportada (sem os códigos).`);
          }}
          disabled={rows.length === 0}
          className="flex h-10 items-center gap-2 rounded-md border bg-card pr-4 pl-3.5 text-[13px] transition-colors hover:bg-muted disabled:opacity-50"
        >
          <Download className="size-4 text-neutral" />
          Exportar lista
        </button>
        <button
          type="button"
          onClick={() => void generateForTurma()}
          disabled={!turma || pending !== null}
          title="Gera códigos para todos os alunos com matrícula activa na turma"
          className="flex h-10 items-center gap-2 rounded-md bg-primary pr-4 pl-3.5 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <RefreshCw className={pending === "turma" ? "size-4 animate-spin" : "size-4"} />
          {pending === "turma" ? "A gerar..." : "Gerar códigos da turma"}
        </button>
      </div>

      {turmas.status === "error" && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {turmas.error}
        </p>
      )}

      <AccessCodesTable
        rows={rows}
        revealed={revealed}
        pendingId={pending}
        emptyMessage={
          !turma
            ? "Selecione uma turma para gerar os códigos de acesso."
            : "Ainda não foram gerados códigos para esta turma nesta sessão."
        }
        onToggleReveal={toggleReveal}
        onRegenerate={(id) => void regenerate(id)}
      />

      <ValidateCodeCard />

      <section className="flex items-center gap-3.5 rounded-lg border bg-card px-6 py-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-positive-soft">
          <ShieldCheck className="size-[18px] text-positive" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <h2 className="font-sans text-[13px] font-semibold">
            Os códigos são válidos durante 2 dias e regenerar invalida o anterior
          </h2>
          <p className="text-xs text-muted-foreground">
            Por segurança, os códigos só são mostrados no momento em que são gerados e
            não ficam guardados neste dispositivo. Partilhe-os com o encarregado antes
            de sair da página.
          </p>
        </div>
      </section>
    </div>
  );
}

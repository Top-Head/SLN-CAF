"use client";

import { Search, UsersRound } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { notify } from "@/lib/notify";
import { matchesSearch } from "@/lib/utils/matches-search";
import { createEnrollment } from "@/services/enrollments";
import type { Student } from "@/services/students";
import type { Turma } from "@/services/turmas";
import { enrollmentsStore } from "@/stores/use-enrollments.store";

const turmaLabel = (t: Turma) => (t.school_year_label ? `${t.nome} · ${t.school_year_label}` : t.nome);

/**
 * Matricula vários alunos numa turma (um `POST /api/academico/enrollments/`
 * por aluno; a API não tem criação em lote). Só lista alunos sem matrícula
 * ativa, porque cada aluno só pode ter uma.
 */
export function BulkEnrollDialog({
  open,
  onOpenChange,
  turmas,
  students,
  accessToken,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  turmas: Turma[];
  students: Student[];
  accessToken: () => string | undefined;
}) {
  const [turmaId, setTurmaId] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const sortedTurmas = [...turmas].sort((a, b) =>
    turmaLabel(a).localeCompare(turmaLabel(b), "pt", { numeric: true }),
  );
  const visible = students
    .filter((s) => matchesSearch(query, s.nome, s.numero_processo))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt"));
  const allVisibleSelected = visible.length > 0 && visible.every((s) => selected.has(s.id));

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((current) => {
      const next = new Set(current);
      for (const s of visible) {
        if (allVisibleSelected) next.delete(s.id);
        else next.add(s.id);
      }
      return next;
    });
  }

  function close(nextOpen: boolean) {
    if (saving) return;
    if (!nextOpen) {
      setSelected(new Set());
      setQuery("");
    }
    onOpenChange(nextOpen);
  }

  async function submit() {
    const turma = turmas.find((t) => t.id === turmaId);
    if (!turma) {
      notify.info("Escolha a turma.");
      return;
    }
    if (selected.size === 0) {
      notify.info("Selecione pelo menos um aluno.");
      return;
    }

    setSaving(true);
    const token = accessToken();
    // Por ordem alfabética, para a ordem dos pedidos ser previsível.
    const chosen = students
      .filter((s) => selected.has(s.id))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt"));
    let created = 0;
    const failures: string[] = [];

    for (const student of chosen) {
      try {
        await createEnrollment(
          {
            student: student.id,
            turma: turma.id,
            school_year: turma.school_year,
            status: "ATIVA",
          },
          token,
        );
        created += 1;
      } catch (cause) {
        failures.push(`${student.nome}: ${cause instanceof Error ? cause.message : "erro"}`);
      }
    }

    await enrollmentsStore.invalidate();
    setSaving(false);

    if (created > 0) {
      notify.success(
        created === 1
          ? `1 aluno matriculado em ${turma.nome}.`
          : `${created} alunos matriculados em ${turma.nome}.`,
      );
    }
    if (failures.length > 0) {
      notify.error(
        `${failures.length} matrícula(s) falharam. ${failures[0]}${failures.length > 1 ? " …" : ""}`,
      );
    } else {
      close(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UsersRound className="size-5 text-primary" />
            Matricular vários alunos
          </DialogTitle>
          <DialogDescription>
            Escolha a turma e os alunos. Só aparecem alunos sem matrícula ativa.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-[#373737]">Turma</span>
            <select
              value={turmaId}
              onChange={(event) => setTurmaId(event.target.value)}
              className="h-11 rounded-[8px] border bg-card px-3 text-sm outline-none focus:border-primary"
            >
              <option value="">Selecione a turma</option>
              {sortedTurmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {turmaLabel(t)}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-2 rounded-[8px] border px-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquisar aluno ou n.º de processo"
              className="h-10 flex-1 bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <label className="flex items-center gap-2">
              <Checkbox checked={allVisibleSelected} onCheckedChange={toggleAll} disabled={visible.length === 0} />
              Selecionar todos os visíveis
            </label>
            <span>{selected.size} selecionado(s)</span>
          </div>

          <ul className="max-h-[300px] overflow-y-auto rounded-[8px] border">
            {visible.map((s) => (
              <li key={s.id} className="border-b last:border-0">
                <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted">
                  <Checkbox checked={selected.has(s.id)} onCheckedChange={() => toggle(s.id)} />
                  <span className="flex-1">{s.nome}</span>
                  <span className="text-xs text-muted-foreground">{s.numero_processo}</span>
                </label>
              </li>
            ))}
            {visible.length === 0 && (
              <li className="px-3 py-8 text-center text-sm text-muted-foreground">
                {students.length === 0
                  ? "Todos os alunos já têm matrícula ativa."
                  : "Nenhum aluno encontrado."}
              </li>
            )}
          </ul>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => close(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button type="button" onClick={() => void submit()} disabled={saving || selected.size === 0 || !turmaId}>
            {saving ? "A matricular..." : `Matricular ${selected.size || ""}`.trim()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

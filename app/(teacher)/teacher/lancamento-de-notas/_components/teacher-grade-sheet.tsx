"use client";

import { ChevronDown, Save, Undo2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { formatDecimal, isDecimal, toDecimal } from "@/components/shared/assessments/labels";
import { currentAccessToken } from "@/components/shared/resource/resource-manager";
import { useAllGrades } from "@/hooks/assessments/use-grades";
import { useAllTrimesters } from "@/hooks/assessments/use-trimesters";
import { useMiniPauta } from "@/hooks/teacher-dashboard/use-mini-pauta";
import { useTeacherClasses } from "@/hooks/teacher-dashboard/use-teacher-dashboard";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import {
  createGrade,
  deleteGrade,
  patchGrade,
  type Grade,
  type GradeComponent,
} from "@/services/grades";
import type { MiniPautaStudent } from "@/services/mini-pautas";
import { gradesStore } from "@/stores/use-grades.store";
import { miniPautasStore } from "@/stores/use-mini-pautas.store";

import { miniPautaHref } from "../../_lib/teacher-api";

const COMPONENTS: { key: GradeComponent; field: "mac" | "pp" | "pt"; label: string; hint: string }[] = [
  { key: "MAC", field: "mac", label: "MAC", hint: "Aval. contínua" },
  { key: "PP", field: "pp", label: "PP", hint: "Prova professor" },
  { key: "PT", field: "pt", label: "PT", hint: "Prova trimestre" },
];

type Edits = Record<string, Partial<Record<GradeComponent, string>>>;

const selectClass =
  "h-10 appearance-none rounded-md border bg-card pr-8 pl-3 text-[13px] text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring";

const asText = (value: string | null) => (value === null ? "" : formatDecimal(value));

/**
 * Folha de lançamento por turma-disciplina: os alunos e o `enrollment_id`
 * vêm da mini-pauta (`/api/teacher/mini-pautas/`) e as notas são gravadas em
 * `/api/avaliacoes/grades/` (cria, corrige por PATCH ou elimina se ficar vazia).
 */
export function TeacherGradeSheet({ initialTurmaDisciplina }: { initialTurmaDisciplina?: string }) {
  const classes = useTeacherClasses();
  const trimesters = useAllTrimesters();
  const grades = useAllGrades();
  const [selectedId, setSelectedId] = useState(initialTurmaDisciplina ?? "");
  const [selectedTrimester, setSelectedTrimester] = useState<number | null>(null);
  const [edits, setEdits] = useState<Edits>({});
  const [saving, setSaving] = useState(false);

  const options = [...classes.items].sort(
    (a, b) =>
      a.classe - b.classe ||
      a.turma.localeCompare(b.turma, "pt", { numeric: true }) ||
      a.disciplina.localeCompare(b.disciplina, "pt"),
  );
  const current = options.find((o) => o.id === selectedId) ?? options[0] ?? null;
  const turmaDisciplinaId = current?.id ?? "";

  // Trimestres do ano letivo da turma (o nome do ano vem como "2026/2027").
  const yearTrimesters = trimesters.items
    .filter((t) => {
      const d = t.school_year_detail;
      return !current?.ano_letivo || !d || `${d.ano_inicio}/${d.ano_fim}` === current.ano_letivo;
    })
    .sort((a, b) => a.numero - b.numero);
  const openTrimester = yearTrimesters.find((t) => t.status !== "FECHADO");
  const numero = selectedTrimester ?? openTrimester?.numero ?? null;
  const trimester = yearTrimesters.find((t) => t.numero === numero) ?? null;
  const closed = trimester?.status === "FECHADO";

  const { miniPauta, status, error } = useMiniPauta(
    turmaDisciplinaId
      ? { turma_disciplina_id: turmaDisciplinaId, trimestre: numero ?? undefined }
      : null,
  );
  const students: MiniPautaStudent[] = miniPauta?.alunos ?? [];
  const max = (current?.classe ?? 7) <= 6 ? 10 : 20;

  /** Nota já gravada para o aluno/componente neste trimestre. */
  const existing = (enrollment: string, component: GradeComponent): Grade | undefined =>
    grades.items.find(
      (g) =>
        g.enrollment === enrollment &&
        g.turma_disciplina === turmaDisciplinaId &&
        g.trimester === trimester?.id &&
        (g.component ?? "MAC") === component,
    );

  const valueOf = (student: MiniPautaStudent, component: (typeof COMPONENTS)[number]) =>
    edits[student.enrollment_id]?.[component.key] ?? asText(student[component.field]);

  const changes = Object.entries(edits).flatMap(([enrollment, byComponent]) =>
    Object.entries(byComponent).map(([component, value]) => ({
      enrollment,
      component: component as GradeComponent,
      value: value.trim(),
    })),
  );
  const invalid = changes.filter(
    (c) => c.value !== "" && (!isDecimal(c.value) || Number(toDecimal(c.value)) > max),
  );

  function setValue(enrollment: string, component: GradeComponent, value: string) {
    setEdits((all) => ({ ...all, [enrollment]: { ...all[enrollment], [component]: value } }));
  }

  function select(next: { id?: string; trimester?: number | null }) {
    if (changes.length > 0 && !window.confirm("Há notas por guardar. Descartar as alterações?")) {
      return;
    }
    if (next.id !== undefined) setSelectedId(next.id);
    if (next.trimester !== undefined) setSelectedTrimester(next.trimester);
    setEdits({});
  }

  async function save() {
    if (!trimester) {
      notify.warning("Não há trimestre criado para este ano letivo. Peça à direcção para o abrir.");
      return;
    }
    if (invalid.length > 0) {
      notify.error(`Há ${invalid.length} nota(s) inválida(s): use valores de 0 a ${max}, com até duas casas decimais.`);
      return;
    }

    setSaving(true);
    const token = currentAccessToken();
    let saved = 0;
    const failures: string[] = [];

    for (const change of changes) {
      const grade = existing(change.enrollment, change.component);
      const decimal = toDecimal(change.value);
      try {
        if (grade && decimal === null) {
          await deleteGrade(grade.id, token);
        } else if (grade && decimal !== null) {
          if (Number(grade.value) === Number(decimal)) continue;
          await patchGrade(grade.id, { value: decimal }, token);
        } else if (decimal !== null) {
          await createGrade(
            {
              enrollment: change.enrollment,
              turma_disciplina: turmaDisciplinaId,
              trimester: trimester.id,
              component: change.component,
              value: decimal,
            },
            token,
          );
        } else {
          continue;
        }
        saved += 1;
      } catch (cause) {
        const name = students.find((s) => s.enrollment_id === change.enrollment)?.aluno ?? "aluno";
        failures.push(
          `${change.component} de ${name}: ${cause instanceof Error ? cause.message : "erro"}`,
        );
      }
    }

    await Promise.all([gradesStore.invalidate(), miniPautasStore.invalidate()]);
    setSaving(false);

    if (failures.length === 0) {
      setEdits({});
      notify.success(saved === 1 ? "1 nota guardada." : `${saved} notas guardadas.`);
    } else {
      notify.error(
        `${failures.length} nota(s) não foram guardadas. ${failures[0]}${failures.length > 1 ? " …" : ""}`,
      );
      if (saved > 0) notify.success(`${saved} nota(s) guardadas.`);
    }
  }

  const loading = classes.status === "loading" || classes.status === "idle" || status === "loading";

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-wrap items-end gap-3 rounded-lg border bg-card px-6 py-4">
        <label className="relative flex min-w-[240px] flex-1 flex-col gap-2">
          <span className="text-xs font-medium text-[#1e1e1e]">Turma e disciplina</span>
          <select
            value={turmaDisciplinaId}
            onChange={(event) => select({ id: event.target.value, trimester: null })}
            disabled={options.length === 0}
            className={selectClass}
          >
            {options.length === 0 && <option value="">Sem turmas atribuídas</option>}
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.turma} · {o.disciplina} ({o.ano_letivo})
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 bottom-3 size-4 text-muted-foreground" />
        </label>

        <label className="relative flex min-w-[200px] flex-col gap-2">
          <span className="text-xs font-medium text-[#1e1e1e]">Trimestre</span>
          <select
            value={numero ?? ""}
            onChange={(event) => select({ trimester: Number(event.target.value) })}
            disabled={yearTrimesters.length === 0}
            className={selectClass}
          >
            {yearTrimesters.length === 0 && <option value="">Sem trimestres criados</option>}
            {yearTrimesters.map((t) => (
              <option key={t.id} value={t.numero}>
                {t.numero}.º Trimestre{t.status === "FECHADO" ? " (fechado)" : ""}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 bottom-3 size-4 text-muted-foreground" />
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEdits({})}
            disabled={changes.length === 0 || saving}
            className="flex h-10 items-center gap-2 rounded-md border bg-card px-3.5 text-[13px] transition-colors hover:bg-muted disabled:opacity-50"
          >
            <Undo2 className="size-4 text-muted-foreground" />
            Descartar
          </button>
          <button
            type="button"
            onClick={() => void save()}
            disabled={changes.length === 0 || saving || closed}
            className="flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="size-4" />
            {saving ? "A guardar..." : `Guardar${changes.length ? ` (${changes.length})` : ""}`}
          </button>
        </div>
      </section>

      {(error || classes.error) && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error ?? classes.error}
        </p>
      )}
      {closed && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Este trimestre está fechado: as notas só podem ser consultadas.
        </p>
      )}
      {!trimester && trimesters.status === "success" && current && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Ainda não existe nenhum trimestre para {current.ano_letivo}. A direcção tem de o criar em
          Períodos de lançamento antes de lançar notas.
        </p>
      )}

      <section className="overflow-hidden rounded-lg border bg-card">
        <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div>
            <h2 className="font-sans text-[15px] font-semibold">
              {miniPauta?.titulo || (current ? `${current.disciplina} · ${current.turma}` : "Folha de lançamento")}
            </h2>
            <p className="text-xs text-muted-foreground">
              Notas de 0 a {max} · deixe vazio para apagar uma nota · MT calculada pela API
            </p>
          </div>
          {current && (
            <Link href={miniPautaHref(current.id)} className="text-[13px] font-medium text-primary hover:underline">
              Ver mini-pauta
            </Link>
          )}
        </header>
        <div className="overflow-x-auto border-t">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="bg-table-head text-[11px] text-muted-foreground uppercase">
              <tr>
                <th className="w-12 px-4 py-2.5 font-medium">N.º</th>
                <th className="px-4 py-2.5 font-medium">Estudante</th>
                {COMPONENTS.map((c) => (
                  <th key={c.key} className="w-28 px-2 py-2.5 text-center font-medium">
                    {c.label}
                    <span className="block text-[9px] font-normal normal-case">{c.hint}</span>
                  </th>
                ))}
                <th className="w-20 px-4 py-2.5 text-center font-medium">MT</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.enrollment_id} className="border-t">
                  <td className="px-4 py-2 text-xs text-muted-foreground">
                    {String(student.numero).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-2">
                    <span className="font-medium">{student.aluno}</span>
                    <span className="block text-[11px] text-muted-foreground">{student.numero_processo}</span>
                  </td>
                  {COMPONENTS.map((c) => {
                    const value = valueOf(student, c);
                    const edited = edits[student.enrollment_id]?.[c.key] !== undefined;
                    const bad =
                      value.trim() !== "" &&
                      (!isDecimal(value) || Number(toDecimal(value)) > max);
                    return (
                      <td key={c.key} className="px-2 py-2 text-center">
                        <input
                          value={value}
                          onChange={(event) => setValue(student.enrollment_id, c.key, event.target.value)}
                          disabled={closed || saving}
                          inputMode="decimal"
                          maxLength={5}
                          aria-label={`${c.label} de ${student.aluno}`}
                          placeholder="—"
                          className={cn(
                            "h-9 w-20 rounded-md border bg-card text-center text-[13px] outline-none focus:border-primary disabled:bg-muted",
                            edited && "border-info bg-info-soft",
                            bad && "border-negative bg-negative-soft text-negative",
                          )}
                        />
                      </td>
                    );
                  })}
                  <td className="px-4 py-2 text-center font-semibold">
                    {student.mt === null ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <span className={Number(student.mt) < max / 2 ? "text-negative" : ""}>
                        {formatDecimal(student.mt)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    {loading
                      ? "A carregar os estudantes..."
                      : options.length === 0
                        ? "Ainda não tem turmas e disciplinas atribuídas."
                        : "Esta turma ainda não tem estudantes matriculados."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

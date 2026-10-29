"use client";

import { useMemo, useState } from "react";

import { evaluate, summarize } from "../_lib/grading";
import {
  getSheet,
  periodOf,
  TEACHER_CLASSES,
  TRIMESTERS,
  type Grades,
  type PeriodStatus,
  type Trimester,
} from "../_lib/mock-data";
import { ConcludeDialog } from "./conclude-dialog";
import { LaunchContext } from "./launch-context";
import { LaunchFooter } from "./launch-footer";
import { SheetTable, type GradeChange, type SheetView } from "./sheet-table";

type Selection = { classId: string; subject: string; trimester: Trimester };

const INITIAL: Selection = { classId: "12-ib", subject: "Matemática", trimester: 1 };

const currentTime = () =>
  new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });

/** Ao trocar de turma ou disciplina: o trimestre em lançamento, senão o mesmo, senão o último encerrado. */
function pickTrimester(classId: string, subject: string, current: Trimester) {
  const statusOf = (t: Trimester) => periodOf(classId, subject, t).status;
  return (
    TRIMESTERS.find((t) => statusOf(t) === "open") ??
    (statusOf(current) !== "upcoming" ? current : undefined) ??
    TRIMESTERS.findLast((t) => statusOf(t) === "closed") ??
    current
  );
}

export function GradeLaunchWorkspace() {
  const [selection, setSelection] = useState(INITIAL);
  /** Notas alteradas, por mini-pauta e estudante; o resto vem dos dados. */
  const [edits, setEdits] = useState<Record<string, Record<string, Grades>>>({});
  const [savedAt, setSavedAt] = useState("10:42");
  const [concluded, setConcluded] = useState<Record<string, string>>({});
  const [corrections, setCorrections] = useState<Set<string>>(new Set());
  const [view, setView] = useState<SheetView>("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { classId, subject, trimester } = selection;
  const sheet = useMemo(() => getSheet(classId, subject, trimester), [classId, subject, trimester]);

  if (!sheet) return null;

  const sheetEdits = edits[sheet.key] ?? {};
  const grades = Object.fromEntries(
    sheet.students.map((s) => [s.id, { ...s.grades, ...sheetEdits[s.id] }]),
  );
  const evaluations = Object.fromEntries(
    sheet.students.map((s) => [s.id, evaluate(s, grades[s.id], sheet.mode)]),
  );
  const summary = summarize(Object.values(evaluations));
  const pending = sheet.students
    .filter((s) => evaluations[s.id].missing.length > 0)
    .map((s) => ({ name: s.name, missing: evaluations[s.id].missing }));

  const trimesterStatus = Object.fromEntries(
    TRIMESTERS.map((t) => [t, periodOf(classId, subject, t).status]),
  ) as Record<Trimester, PeriodStatus>;

  const select = (next: Selection) => {
    setSelection(next);
    setView("all");
  };

  const selectSheet = (nextClassId: string, nextSubject: string) =>
    select({
      classId: nextClassId,
      subject: nextSubject,
      trimester: pickTrimester(nextClassId, nextSubject, trimester),
    });

  const updateGrades = (changes: GradeChange[]) => {
    if (changes.length === 0) return;
    setEdits((current) => {
      const forSheet = { ...current[sheet.key] };
      for (const { id, key, value } of changes) forSheet[id] = { ...forSheet[id], [key]: value };
      return { ...current, [sheet.key]: forSheet };
    });
    setSavedAt(currentTime());
  };

  return (
    <div className="flex flex-col gap-6">
      <LaunchContext
        sheet={sheet}
        completeCount={summary.complete}
        trimesterStatus={trimesterStatus}
        onClassChange={(id) => {
          const subjects = TEACHER_CLASSES.find((c) => c.id === id)?.subjects ?? [];
          selectSheet(id, subjects.includes(subject) ? subject : subjects[0]);
        }}
        onSubjectChange={(value) => selectSheet(classId, value)}
        onTrimesterChange={(value) => select({ classId, subject, trimester: value })}
      />

      <SheetTable
        key={sheet.key}
        sheet={sheet}
        grades={grades}
        evaluations={evaluations}
        view={view}
        onViewChange={setView}
        onChange={updateGrades}
      />

      <LaunchFooter
        sheet={sheet}
        savedAt={savedAt}
        concludedAt={concluded[sheet.key]}
        correctionRequested={corrections.has(sheet.key)}
        onSaveDraft={() => setSavedAt(currentTime())}
        onConclude={() => setDialogOpen(true)}
        onRequestCorrection={() => setCorrections((current) => new Set(current).add(sheet.key))}
      />

      <ConcludeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        sheet={sheet}
        summary={summary}
        pending={pending}
        onShowPending={() => {
          setView("pending");
          setDialogOpen(false);
        }}
        onConfirm={() => {
          setConcluded((current) => ({ ...current, [sheet.key]: currentTime() }));
          setDialogOpen(false);
        }}
      />
    </div>
  );
}

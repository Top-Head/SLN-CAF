"use client";

import { ChevronDown, Clock, Lock } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { plural } from "@/lib/utils/format-date";

import {
  TEACHER_CLASSES,
  TRIMESTERS,
  type PeriodStatus,
  type Sheet,
  type Trimester,
} from "../_lib/mock-data";

const EXAM_FORMULA = "MFD = (MT1 + MT2 + MT3) ÷ 3 · MF = 0,4 × MFD + 0,6 × Exame.";

type SelectorProps = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

function Selector({ label, value, options, onChange }: SelectorProps) {
  const current = options.find((o) => o.value === value)?.label ?? value;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-10 items-center gap-2 rounded-md border bg-card pr-3 pl-3.5 transition-colors hover:bg-muted">
        <span className="text-xs text-catalog-faint">{label}</span>
        <span className="text-[13px] text-foreground">{current}</span>
        <ChevronDown className="size-4 text-catalog-muted" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value} className="text-[13px]">
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type LaunchContextProps = {
  sheet: Sheet;
  completeCount: number;
  trimesterStatus: Record<Trimester, PeriodStatus>;
  onClassChange: (classId: string) => void;
  onSubjectChange: (subject: string) => void;
  onTrimesterChange: (trimester: Trimester) => void;
};

/** Identificação da mini-pauta, seletores e prazo do lançamento. */
export function LaunchContext({
  sheet,
  completeCount,
  trimesterStatus,
  onClassChange,
  onSubjectChange,
  onTrimesterChange,
}: LaunchContextProps) {
  const { classInfo, subject, trimester, period, mode, students } = sheet;
  const open = period.status === "open";
  const total = students.length;
  const exam = mode === "exam";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-medium tracking-[0.6px] text-catalog-muted uppercase">
            {open ? "Mini-pauta em lançamento" : "Mini-pauta · Período encerrado"}
            {exam && " · Classe de exame"}
          </p>
          <h2 className="font-sans text-xl font-bold text-foreground">
            {classInfo.name} · {subject}
          </h2>
          <p className="text-xs text-catalog-muted">
            {classInfo.course} · {total} estudantes · Escala 0–20
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Selector
            label="Turma"
            value={classInfo.id}
            options={TEACHER_CLASSES.map((c) => ({ value: c.id, label: c.name }))}
            onChange={onClassChange}
          />
          <Selector
            label="Disciplina"
            value={subject}
            options={classInfo.subjects.map((s) => ({ value: s, label: s }))}
            onChange={onSubjectChange}
          />
          <div
            role="radiogroup"
            aria-label="Trimestre"
            className="flex gap-0.5 rounded-md border bg-grade-locked p-[3px]"
          >
            {TRIMESTERS.map((t) => {
              const active = t === trimester;
              const locked = trimesterStatus[t] === "upcoming";
              return (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={locked}
                  title={locked ? "O lançamento deste trimestre ainda não abriu" : undefined}
                  onClick={() => onTrimesterChange(t)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-sm px-3 py-2 text-xs transition-colors",
                    active
                      ? "bg-card font-semibold text-catalog-text shadow-[0_1px_2px_rgb(23_26_36/0.08)]"
                      : "font-medium text-catalog-muted hover:text-catalog-text",
                    locked && "text-catalog-faint hover:text-catalog-faint",
                  )}
                >
                  {locked && <Lock className="size-3" />}
                  {active ? `${t}.º trimestre` : `${t}.º`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-wrap items-center gap-3.5 rounded-lg border border-catalog-border py-3.5 pr-5 pl-4",
          open ? "bg-card" : "bg-grade-locked",
        )}
      >
        <span
          className={cn(
            "flex size-[38px] shrink-0 items-center justify-center rounded-lg",
            open ? "bg-grade-fail-soft text-primary" : "bg-catalog-border text-grade-locked-text",
          )}
        >
          {open ? <Clock className="size-[18px]" /> : <Lock className="size-[18px]" />}
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <p className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-catalog-text">
            {open ? `Lançamento aberto até ${period.closesAt}` : `Lançamento encerrado a ${period.closesAt}`}
            <span className="rounded-[10px] bg-grade-fail-soft px-2 py-[3px] text-[10px] font-semibold text-grade-fail">
              {open ? `Faltam ${plural(period.daysLeft, "dia", "dias")}` : "Bloqueado"}
            </span>
          </p>
          <p className="text-[11px] text-catalog-muted">
            {!open
              ? "As notas estão bloqueadas. Correções fora do prazo só podem ser feitas pela direcção pedagógica."
              : exam
                ? `${classInfo.examRule} ${EXAM_FORMULA}`
                : "Depois do prazo as notas ficam bloqueadas. Correções fora do prazo só podem ser feitas pela direcção."}
          </p>
        </div>

        <div className="flex w-[220px] flex-col gap-[7px]">
          <p className="flex justify-between text-[11px]">
            <span className="text-catalog-muted">Estudantes completos</span>
            <span className="font-mono font-semibold text-catalog-text">
              {completeCount} / {total}
            </span>
          </p>
          <div
            role="progressbar"
            aria-label="Estudantes completos"
            aria-valuenow={completeCount}
            aria-valuemin={0}
            aria-valuemax={total}
            className="h-1.5 overflow-hidden rounded-[3px] bg-catalog-track"
          >
            <div
              className={cn("h-full rounded-[3px]", open ? "bg-primary" : "bg-catalog-faint")}
              style={{ width: `${total === 0 ? 0 : (completeCount / total) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

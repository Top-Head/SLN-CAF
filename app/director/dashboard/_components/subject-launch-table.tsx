import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";
import { formatGrade, PASS_GRADE } from "@/lib/utils/format-grade";

import {
  CLASS_SIZE,
  subjectStatus,
  type ClassSubject,
  type SubjectStatus,
} from "../../_lib/class-data";

const STATUS: Record<
  SubjectStatus,
  { label: string; tone: "positive" | "pending" | "neutral"; bar: string }
> = {
  done: { label: "Concluído", tone: "positive", bar: "bg-[#22a559]" },
  ongoing: { label: "Em curso", tone: "pending", bar: "bg-primary" },
  "not-started": { label: "Por iniciar", tone: "neutral", bar: "bg-transparent" },
};

/** Progresso do lançamento de cada disciplina da turma. */
export function SubjectLaunchTable({ subjects }: { subjects: ClassSubject[] }) {
  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center justify-between gap-4 px-5 pt-[18px] pb-3.5">
        <div className="flex flex-col gap-[3px]">
          <h2 className="font-sans text-[15px] font-semibold text-foreground">
            Lançamento por disciplina
          </h2>
          <p className="text-[11px] text-catalog-muted">
            Acompanhe que professores já lançaram as notas da turma
          </p>
        </div>
        <Link
          href="/director/pauta-trimestral"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Ver pauta
          <ChevronRight className="size-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[690px] border-collapse text-left">
          <thead>
            <tr className="h-[34px] border-y border-catalog-border bg-[#f6f7f9] text-[10px] font-medium text-catalog-muted uppercase">
              <th className="w-[220px] pl-5 font-medium">Disciplina</th>
              <th className="font-medium">Progresso</th>
              <th className="w-[90px] font-medium">Média</th>
              <th className="w-[130px] pr-5 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => {
              const status = STATUS[subjectStatus(subject)];
              const percent = (subject.launched / CLASS_SIZE) * 100;
              return (
                <tr key={subject.name} className="h-[50px] border-b border-catalog-border last:border-0">
                  <td className="pl-5">
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-semibold text-catalog-text">{subject.name}</span>
                      <span className="text-[10px] text-catalog-faint">Prof. {subject.teacher}</span>
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-2.5">
                      <span
                        role="progressbar"
                        aria-label={`Notas lançadas em ${subject.name}`}
                        aria-valuenow={subject.launched}
                        aria-valuemin={0}
                        aria-valuemax={CLASS_SIZE}
                        className="h-1.5 w-[140px] overflow-hidden rounded-[3px] bg-catalog-track"
                      >
                        <span
                          className={cn("block h-full rounded-[3px]", status.bar)}
                          style={{ width: `${percent}%` }}
                        />
                      </span>
                      <span className="font-mono text-[11px] text-grade-locked-text">
                        {subject.launched}/{CLASS_SIZE}
                      </span>
                    </span>
                  </td>
                  <td
                    className={cn(
                      "font-mono text-[13px] font-semibold",
                      subject.average === null
                        ? "text-catalog-faint"
                        : subject.average < PASS_GRADE
                          ? "text-primary"
                          : "text-catalog-text",
                    )}
                  >
                    {formatGrade(subject.average)}
                  </td>
                  <td className="pr-5">
                    <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

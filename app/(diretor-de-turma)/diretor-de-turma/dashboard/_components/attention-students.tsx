import { TriangleAlert } from "lucide-react";

import { getInitials } from "@/lib/utils/get-initials";

export type AttentionStudent = { name: string; subjects: string[] };

/** Estudantes com mais negativas do que a regra de transição permite. */
export function AttentionStudents({ rule, students }: { rule: string; students: AttentionStudent[] }) {
  return (
    <section className="flex flex-col rounded-lg border bg-card px-5 pt-[18px] pb-2.5">
      <div className="flex items-center gap-2 pb-1.5">
        <TriangleAlert className="size-4 shrink-0 text-pending" />
        <div className="flex flex-col gap-0.5">
          <h2 className="font-sans text-[15px] font-semibold text-foreground">Estudantes em atenção</h2>
          <p className="text-[11px] text-catalog-muted">{rule}</p>
        </div>
      </div>

      {students.length === 0 ? (
        <p className="border-t border-catalog-border py-4 text-xs text-catalog-muted">
          Nenhum estudante acima do limite de negativas.
        </p>
      ) : (
        <ul>
          {students.map(({ name, subjects }) => (
            <li
              key={name}
              className="flex items-center gap-3 border-t border-catalog-border py-2.5"
            >
              <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-neutral-soft text-[11px] font-semibold text-grade-locked-text">
                {getInitials(name)}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-xs font-medium text-catalog-text">{name}</span>
                <span className="truncate text-[10px] text-catalog-faint">{subjects.join(" · ")}</span>
              </span>
              <span className="rounded-[10px] bg-grade-fail-soft px-2 py-[3px] text-[10px] font-semibold text-grade-fail">
                {subjects.length} neg.
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

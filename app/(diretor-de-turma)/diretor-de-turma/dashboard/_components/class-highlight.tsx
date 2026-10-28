import { Eye } from "lucide-react";

import { formatGrade } from "@/lib/utils/format-grade";

type ClassHighlightProps = {
  name: string;
  course: string;
  students: number;
  subjects: number;
  doneSubjects: number;
  average: number;
};

export function ClassHighlight({
  name,
  course,
  students,
  subjects,
  doneSubjects,
  average,
}: ClassHighlightProps) {
  return (
    <section className="relative isolate flex flex-wrap items-center gap-6 overflow-hidden rounded-[10px] bg-primary px-8 py-[26px] text-white">
      <span
        aria-hidden
        className="absolute top-[70px] left-[73%] -z-10 size-[260px] rounded-full bg-[#ff8159]"
      />
      <span
        aria-hidden
        className="absolute top-5 left-[82.5%] -z-10 size-[300px] rounded-full bg-[#ffc43d]"
      />

      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
        <h2 className="font-sans text-2xl font-bold">
          {name} · {course}
        </h2>
        <p className="max-w-[540px] text-[13px] opacity-90">
          {students} estudantes · {subjects} disciplinas.{" "}
          {doneSubjects === subjects
            ? "Todas as disciplinas têm as notas lançadas: a pauta está completa."
            : `${doneSubjects} ${doneSubjects === 1 ? "disciplina já tem" : "disciplinas já têm"} todas as notas lançadas, a pauta fica completa quando os professores terminarem.`}
        </p>
        <span className="flex items-center gap-1.5 rounded-xl bg-white/[0.18] px-2.5 py-[5px] text-[11px] font-medium">
          <Eye className="size-[13px]" />
          Modo de consulta · não altera notas
        </span>
      </div>

      <div className="flex flex-col items-center gap-0.5 rounded-[10px] bg-white px-[22px] py-4 text-center shadow-[0_8px_24px_rgb(102_13_31/0.18)]">
        <span className="text-[9px] font-semibold text-catalog-faint uppercase">Média da turma</span>
        <span className="text-[34px] leading-tight font-bold text-foreground">
          {formatGrade(average)}
        </span>
        <span className="text-[11px] font-medium text-catalog-muted">em 20 valores</span>
      </div>
    </section>
  );
}

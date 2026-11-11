import { formatDateTime } from "@/lib/utils/format-date";
import type {
  AccessCodeValidation,
  StudentGrade,
} from "@/services/access-codes";

const TRIMESTERS = [1, 2, 3] as const;
const COMPONENT_ORDER = ["MAC", "PP", "PT"];
const COMPONENT_LABELS: Record<string, string> = {
  MAC: "Média das avaliações contínuas",
  PP: "Prova do professor",
  PT: "Prova trimestral",
};

type SubjectRow = {
  subject: string;
  byTrimester: Record<number, StudentGrade[]>;
};

function groupBySubject(grades: StudentGrade[]): SubjectRow[] {
  const rows = new Map<string, SubjectRow>();

  for (const grade of grades) {
    const key = grade.subject_id || grade.subject;
    const row = rows.get(key) ?? { subject: grade.subject, byTrimester: {} };
    (row.byTrimester[grade.trimester] ??= []).push(grade);
    rows.set(key, row);
  }

  for (const row of rows.values()) {
    for (const list of Object.values(row.byTrimester)) {
      list.sort(
        (a, b) =>
          COMPONENT_ORDER.indexOf(a.component) - COMPONENT_ORDER.indexOf(b.component),
      );
    }
  }

  return [...rows.values()].sort((a, b) =>
    a.subject.localeCompare(b.subject, "pt"),
  );
}

function formatValue(value: string) {
  const number = Number(value);
  return Number.isFinite(number)
    ? number.toLocaleString("pt-PT", { maximumFractionDigits: 2 })
    : value;
}

/** Dados do aluno e notas devolvidos pela validação do código de acesso. */
export function StudentGradesReport({ result }: { result: AccessCodeValidation }) {
  const rows = groupBySubject(result.grades);
  const years = [
    ...new Set(
      result.grades.map((g) => `${g.school_year.ano_inicio}/${g.school_year.ano_fim}`),
    ),
  ];
  const turmas = [...new Set(result.grades.map((g) => g.turma).filter(Boolean))];

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid gap-3 rounded-lg border bg-[#FAFAFB] px-4 py-3 text-sm sm:grid-cols-2">
        <Info label="Estudante" value={result.student.nome} />
        <Info label="N.º de processo" value={result.student.numero_processo} />
        <Info label="Turma" value={turmas.join(", ") || "—"} />
        <Info label="Ano letivo" value={years.join(", ") || "—"} />
        <Info label="Código válido até" value={formatDateTime(result.expires_at)} />
        <Info label="Notas lançadas" value={String(result.grades.length)} />
      </dl>

      {rows.length === 0 ? (
        <p className="rounded-lg border px-4 py-6 text-center text-sm text-muted-foreground">
          Ainda não existem notas lançadas para este estudante.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[520px] text-left text-[13px]">
            <thead className="bg-table-head text-[11px] text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-2.5 font-medium">Disciplina</th>
                {TRIMESTERS.map((t) => (
                  <th key={t} className="px-4 py-2.5 font-medium">
                    {t}.º Trimestre
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.subject} className="border-t">
                  <td className="px-4 py-3 font-medium">{row.subject}</td>
                  {TRIMESTERS.map((t) => (
                    <td key={t} className="px-4 py-3">
                      {row.byTrimester[t]?.length ? (
                        <span className="flex flex-wrap gap-1.5">
                          {row.byTrimester[t].map((g) => (
                            <span
                              key={g.id}
                              title={`${COMPONENT_LABELS[g.component] ?? g.component} · ${g.teacher}`}
                              className={
                                Number(g.value) < 10
                                  ? "rounded-sm bg-negative-soft px-1.5 py-0.5 text-negative"
                                  : "rounded-sm bg-positive-soft px-1.5 py-0.5 text-positive"
                              }
                            >
                              <span className="mr-1 text-[10px] opacity-70">
                                {g.component}
                              </span>
                              {formatValue(g.value)}
                            </span>
                          ))}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-[#1C1C1C]">{value}</dd>
    </div>
  );
}

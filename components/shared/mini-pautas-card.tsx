import Link from "next/link";

export type MiniPautaItem = {
  id: string;
  turma: {
    name: string;
    description: string;
  };
  disciplina: string;
  alunos: number;
  completedStudents: number;
  totalStudents: number;
  prazo: {
    date: string;
    subLabel?: string;
  };
  estado: "em_curso" | "concluido" | "por_iniciar";
  href: string;
};

type MiniPautasCardProps = {
  items: MiniPautaItem[];
  viewAllHref?: string;
  footerInfo?: string;
};

export function MiniPautasCard({
  items,
  viewAllHref = "/teacher/mini-pautas",
  footerInfo = "Escala 0–10 até à 6.ª classe · 0–20 a partir da 7.ª",
}: MiniPautasCardProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white text-gray-800 shadow-sm">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-4 px-6 pt-6">
        <div>
          <h3 className="text-base font-bold text-gray-900">As minhas mini-pautas</h3>
          <p className="text-xs text-gray-400">
            Progresso do lançamento por turma e disciplina
          </p>
        </div>
        <Link
          href={viewAllHref}
          className="inline-flex shrink-0 items-center text-xs font-semibold text-rose-500 hover:underline"
        >
          Ver todas
          <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Tabela / Lista */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <th className="py-2.5 px-3 first:rounded-l-lg first:pl-6">Turma</th>
              <th className="py-2.5 px-3">Disciplina</th>
              <th className="py-2.5 px-3">Alunos</th>
              <th className="py-2.5 px-3">Progresso</th>
              <th className="py-2.5 px-3">Prazo</th>
              <th className="py-2.5 px-3">Estado</th>
              <th className="py-2.5 px-3 last:rounded-r-lg last:pr-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {items.map((item) => {
              const percentage =
                item.totalStudents > 0
                  ? Math.round(
                      (item.completedStudents / item.totalStudents) * 100
                    )
                  : 0;

              let progressColor = "bg-gray-200";
              if (item.estado === "concluido" || percentage === 100) {
                progressColor = "bg-emerald-500";
              } else if (item.estado === "em_curso" || item.completedStudents > 0) {
                progressColor = "bg-rose-500";
              }

              return (
                <tr
                  key={item.id}
                  className="group align-middle transition-colors hover:bg-gray-50/50"
                >
                  {/* Turma */}
                  <td className="py-3 px-3 first:pl-6">
                    <p className="font-bold leading-tight text-gray-900">
                      {item.turma.name}
                    </p>
                    <p className="mt-0.5 max-w-[120px] truncate text-[10px] text-gray-400">
                      {item.turma.description}
                    </p>
                  </td>

                  {/* Disciplina */}
                  <td className="py-3 px-3 font-semibold text-gray-800">
                    {item.disciplina}
                  </td>

                  {/* Alunos */}
                  <td className="py-3 px-3 font-medium text-gray-600">{item.alunos}</td>

                  {/* Progresso */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${progressColor}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="whitespace-nowrap text-[11px] font-medium text-gray-500">
                        {item.completedStudents}/{item.totalStudents}
                      </span>
                    </div>
                  </td>

                  {/* Prazo */}
                  <td className="py-3 px-3">
                    <p className="whitespace-nowrap font-semibold leading-tight text-gray-800">
                      {item.prazo.date}
                    </p>
                    {item.prazo.subLabel && (
                      <p className="mt-0.5 whitespace-nowrap text-[10px] font-bold text-rose-500">
                        {item.prazo.subLabel}
                      </p>
                    )}
                  </td>

                  {/* Estado */}
                  <td className="py-3 px-3">
                    <StatusBadge estado={item.estado} />
                  </td>

                  {/* Seta de ação */}
                  <td className="py-3 px-3 text-right last:pr-6">
                    <Link
                      href={item.href}
                      className="inline-flex size-8 items-center justify-center rounded-lg text-gray-300 transition group-hover:bg-gray-100 group-hover:text-gray-600"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rodapé do card */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 px-6 py-3.5 text-[11px] text-gray-400">
        <span>{footerInfo}</span>
        <span className="font-semibold text-gray-600">
          {items.length} de {items.length} mini-pautas
        </span>
      </div>
    </div>
  );
}

const BADGE_STYLES = {
  concluido: "bg-emerald-50 text-emerald-600 [&>span]:bg-emerald-500",
  em_curso: "bg-amber-50 text-amber-600 [&>span]:bg-amber-500",
  por_iniciar: "bg-gray-100 text-gray-500 [&>span]:bg-gray-400",
} as const;

const STATUS_LABELS = {
  concluido: "Concluído",
  em_curso: "Em curso",
  por_iniciar: "Por iniciar",
} as const;

function StatusBadge({ estado }: { estado: MiniPautaItem["estado"] }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-semibold ${BADGE_STYLES[estado]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" />
      {STATUS_LABELS[estado]}
    </span>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
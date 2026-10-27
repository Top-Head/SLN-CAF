// components/mini-pautas-card.tsx
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
  viewAllHref = "/mini-pautas",
  footerInfo = "Escola 0–10 até à 6.ª classe · 0–20 a partir da 7.ª",
}: MiniPautasCardProps) {
  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden text-neutral-900">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-neutral-900">
            As minhas mini-pautas
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Progresso do lançamento por turma e disciplina
          </p>
        </div>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#E8395B] hover:underline"
        >
          Ver todas
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Tabela / Lista */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-100 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 bg-neutral-50/50">
              <th className="py-3 px-6">Turma</th>
              <th className="py-3 px-6">Disciplina</th>
              <th className="py-3 px-6">Alunos</th>
              <th className="py-3 px-6">Progresso</th>
              <th className="py-3 px-6">Prazo</th>
              <th className="py-3 px-6">Estado</th>
              <th className="py-3 px-6 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-sm">
            {items.map((item) => {
              const percentage =
                item.totalStudents > 0
                  ? Math.round(
                      (item.completedStudents / item.totalStudents) * 100
                    )
                  : 0;

              // Cores da barra de progresso corrigidas de acordo com a imagem
              let progressColor = "bg-neutral-200";
              if (item.estado === "concluido" || percentage === 100) {
                progressColor = "bg-emerald-500";
              } else if (item.estado === "em_curso" || item.completedStudents > 0) {
                progressColor = "bg-[#E8395B]";
              }

              return (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-neutral-50/60 group align-middle"
                >
                  {/* Turma */}
                  <td className="py-4 px-6">
                    <p className="font-semibold text-neutral-900 text-base leading-tight">
                      {item.turma.name}
                    </p>
                    <p className="text-xs text-neutral-500 whitespace-nowrap mt-0.5">
                      {item.turma.description}
                    </p>
                  </td>

                  {/* Disciplina */}
                  <td className="py-4 px-6 text-neutral-700 text-base">
                    {item.disciplina}
                  </td>

                  {/* Alunos */}
                  <td className="py-4 px-6 text-neutral-700 font-mono">
                    {item.alunos}
                  </td>

                  {/* Progresso */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-28 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${progressColor}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-neutral-500 min-w-[40px] whitespace-nowrap">
                        {item.completedStudents}/{item.totalStudents}
                      </span>
                    </div>
                  </td>

                  {/* Prazo */}
                  <td className="py-4 px-6">
                    <p className="text-base text-neutral-900 whitespace-nowrap leading-tight">
                      {item.prazo.date}
                    </p>
                    {item.prazo.subLabel && (
                      <p className="text-xs text-[#E8395B] whitespace-nowrap mt-0.5">
                        {item.prazo.subLabel}
                      </p>
                    )}
                  </td>

                  {/* Estado */}
                  <td className="py-4 px-6">
                    <StatusBadge estado={item.estado} />
                  </td>

                  {/* Seta de ação */}
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={item.href}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 group-hover:text-neutral-700 group-hover:bg-neutral-100 transition"
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
      <div className="flex items-center justify-between px-6 py-3.5 bg-neutral-50/50 border-t border-neutral-100 text-xs text-neutral-500">
        <span>{footerInfo}</span>
        <span className="font-medium text-neutral-700">
          {items.length} de {items.length} mini-pautas
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ estado }: { estado: MiniPautaItem["estado"] }) {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap";

  if (estado === "concluido") {
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700`}>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Concluído
      </span>
    );
  }

  if (estado === "em_curso") {
    // Alterado para usar o tom avermelhado/rosa correspondente à marca (#E8395B)
    return (
      <span className={`${base} bg-rose-50 text-[#E8395B]`}>
        <span className="h-1.5 w-1.5 rounded-full bg-[#E8395B]" />
        Em curso
      </span>
    );
  }

  return (
    <span className={`${base} bg-neutral-100 text-neutral-600`}>
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
      Por iniciar
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
import Link from "next/link";

import { ChevronRight } from "./chevron-right";
import { StatusBadge } from "./status-badge";
import { MiniPautaItem } from "../_lib/types";

type MiniPautasCardProps = {
  items: MiniPautaItem[];
  viewAllHref?: string;
  footerInfo?: string;
};

export function MiniPautasCard({
  items,
  viewAllHref = "/teacher/mini-pautas",
  footerInfo = "Escola 0–10 até à 6.ª classe · 0–20 a partir da 7.ª",
}: MiniPautasCardProps) {
  return (
    <div className=" h-auto w-[700px] rounded-lg border border-[#DEDEE6] bg-white shadow-sm overflow-hidden text-neutral-900">
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
              const percentage = Math.round(
                (item.completedStudents / item.totalStudents) * 100
              );

              let progressColor = "bg-neutral-200";
              if (item.estado === "concluido" || percentage === 100) {
                progressColor = "bg-emerald-500";
              } else if (item.completedStudents > 0) {
                progressColor = "bg-[#E8395B]";
              }

              return (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-neutral-50/60 group"
                >
                  <td className="py-4 px-6">
                    <p className="font-semibold text-neutral-900 text-[10px]">
                      {item.turma.name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {item.turma.description}
                    </p>
                  </td>

                  <td className="py-4 px-6 text-neutral-700 font-medium">
                    {item.disciplina}
                  </td>

                  <td className="py-4 px-6 text-neutral-700">
                    {item.alunos}
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-28 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${progressColor}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-neutral-600 min-w-9">
                        {item.completedStudents}/{item.totalStudents}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <p className="font-medium text-neutral-900">
                      {item.prazo.date}
                    </p>
                    {item.prazo.subLabel && (
                      <p className="text-[11px] font-medium text-[#E8395B] mt-0.5">
                        {item.prazo.subLabel}
                      </p>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    <StatusBadge estado={item.estado} />
                  </td>

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

      <div className="flex items-center justify-between px-6 py-3.5 bg-neutral-50/50 border-t border-neutral-100 text-xs text-neutral-500">
        <span>{footerInfo}</span>
        <span className="font-medium text-neutral-700">
          {items.length} de {items.length} mini-pautas
        </span>
      </div>
    </div>
  );
}

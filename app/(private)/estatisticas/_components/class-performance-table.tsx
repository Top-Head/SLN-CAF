import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { ListTableHeader } from "@/components/shared/list-table-header";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatGrade, PASS_GRADE } from "@/lib/utils/format-grade";

import type { ClassPerformance } from "../_lib/mock-data";

const COLUMNS = [
  { label: "Turma", className: "w-[220px]" },
  { label: "Alunos", className: "w-[110px]" },
  { label: "Média geral", className: "w-[130px]" },
  { label: "Aprovados", className: "w-[120px]" },
  { label: "Reprovados", className: "w-[120px]" },
  { label: "Taxa de aprovação" },
  { label: "", className: "w-10" },
];

/** Verde a partir de 45%, laranja entre 40% e 45%, vermelho abaixo. */
function rateColor(rate: number) {
  if (rate >= 45) return "bg-positive";
  if (rate >= 40) return "bg-[#ed9921]";
  return "bg-primary";
}

export function ClassPerformanceTable({ rows }: { rows: ClassPerformance[] }) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border bg-card p-6">
      <div className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="font-sans text-[15px] font-semibold">Desempenho por turma</h2>
          <p className="text-xs text-muted-foreground">
            Média geral e taxa de aprovação de cada turma no 1.º trimestre
          </p>
        </div>
        <Link
          href="/pautas"
          className="flex items-center gap-1 text-[13px] text-primary hover:underline"
        >
          Ver pautas
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <Table>
        <ListTableHeader columns={COLUMNS} />
        <TableBody>
          {rows.map((row) => {
            const rate = Math.round((row.passed / row.students) * 100);
            return (
              <TableRow key={row.className} className="h-14 text-[13px] last:border-0">
                <TableCell className="pl-4">
                  <span className="flex flex-col gap-0.5">
                    <span className="font-medium">{row.className}</span>
                    <span className="text-[11px] text-muted-foreground">{row.course}</span>
                  </span>
                </TableCell>
                <TableCell>{row.students}</TableCell>
                <TableCell
                  className={cn("font-semibold", row.average < PASS_GRADE && "text-primary")}
                >
                  {formatGrade(row.average)}
                </TableCell>
                <TableCell className="text-positive">{row.passed}</TableCell>
                <TableCell className="text-primary">{row.failed}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      role="meter"
                      aria-label={`Taxa de aprovação da ${row.className}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={rate}
                      className="h-1.5 w-[180px] overflow-hidden rounded-[3px] bg-[#f0f0f4]"
                    >
                      <div
                        className={cn("h-full rounded-[3px]", rateColor(rate))}
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{rate}%</span>
                  </div>
                </TableCell>
                <TableCell className="pr-4">
                  <Link href="/pautas" aria-label={`Ver pauta da ${row.className}`}>
                    <ChevronRight className="mx-auto size-4 text-primary" />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}

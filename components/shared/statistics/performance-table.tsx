import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { ListTableHeader } from "@/components/shared/list-table-header";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatGrade, PASS_GRADE } from "@/lib/utils/format-grade";

/** Uma linha: uma turma (visão da escola) ou uma disciplina (visão da turma). */
export type PerformanceRow = {
  name: string;
  detail: string;
  students: number;
  average: number;
  passed: number;
  failed: number;
};

type PerformanceTableProps = {
  title: string;
  description: string;
  rows: PerformanceRow[];
  labels: { name: string; average: string; passed: string; failed: string; rate: string };
  link: { href: string; label: string };
  /** Taxa mínima para verde e para laranja; abaixo fica vermelho. */
  thresholds?: { good: number; warning: number };
};

export function PerformanceTable({
  title,
  description,
  rows,
  labels,
  link,
  thresholds = { good: 45, warning: 40 },
}: PerformanceTableProps) {
  const columns = [
    { label: labels.name, className: "w-[220px]" },
    { label: "Alunos", className: "w-[110px]" },
    { label: labels.average, className: "w-[130px]" },
    { label: labels.passed, className: "w-[120px]" },
    { label: labels.failed, className: "w-[120px]" },
    { label: labels.rate },
    { label: "", className: "w-10" },
  ];

  const rateColor = (rate: number) =>
    rate >= thresholds.good
      ? "bg-positive"
      : rate >= thresholds.warning
        ? "bg-[#ed9921]"
        : "bg-primary";

  return (
    <section className="flex flex-col gap-4 rounded-lg border bg-card p-6">
      <div className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="font-sans text-[15px] font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Link
          href={link.href}
          className="flex items-center gap-1 text-[13px] text-primary hover:underline"
        >
          {link.label}
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <Table>
        <ListTableHeader columns={columns} />
        <TableBody>
          {rows.map((row) => {
            const rate = Math.round((row.passed / row.students) * 100);
            return (
              <TableRow key={row.name} className="h-14 text-[13px] last:border-0">
                <TableCell className="pl-4">
                  <span className="flex flex-col gap-0.5">
                    <span className="font-medium">{row.name}</span>
                    <span className="text-[11px] text-muted-foreground">{row.detail}</span>
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
                      aria-label={`${labels.rate} de ${row.name}`}
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
                  <Link href={link.href} aria-label={`${link.label}: ${row.name}`}>
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

import { cn } from "@/lib/utils";
import { formatGrade, PASS_GRADE } from "@/lib/utils/format-grade";

type ReportInfoProps = {
  className: string;
  course: string;
  director: string;
  period: string;
  classMean: number | null;
  status: React.ReactNode;
};

export function ReportInfo({
  className,
  course,
  director,
  period,
  classMean,
  status,
}: ReportInfoProps) {
  const items = [
    { label: "Turma", value: className, className: "w-[90px] pl-0" },
    { label: "Curso", value: course, className: "flex-1" },
    { label: "Director de turma", value: director, className: "w-[150px]" },
    { label: "Período", value: period, className: "flex-1" },
    {
      label: "Média da turma",
      value: (
        <span className={cn(classMean !== null && classMean < PASS_GRADE && "text-primary")}>
          {formatGrade(classMean)}
        </span>
      ),
      className: "w-[110px]",
    },
  ];

  return (
    <dl className="flex flex-wrap items-center gap-y-3 rounded-lg border bg-card px-6 py-[18px]">
      {items.map(({ label, value, className: itemClass }, i) => (
        <div
          key={label}
          className={cn(
            "flex min-w-0 flex-col gap-1 pl-5 whitespace-nowrap",
            i > 0 && "border-l",
            itemClass,
          )}
        >
          <dt className="text-[11px] text-muted-foreground">{label}</dt>
          <dd className="text-sm font-medium">{value}</dd>
        </div>
      ))}
      <div className="flex flex-col gap-1 border-l pl-5">
        <dt className="text-[11px] text-muted-foreground">Estado</dt>
        <dd>{status}</dd>
      </div>
    </dl>
  );
}

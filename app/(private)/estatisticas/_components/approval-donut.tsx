"use client";

import { Cell, Pie, PieChart } from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { formatGrade } from "@/lib/utils/format-grade";

import type { APPROVAL } from "../_lib/mock-data";

const chartConfig = {
  value: { label: "Alunos" },
} satisfies ChartConfig;

const percent = (value: number, total: number) =>
  `${formatGrade(total === 0 ? 0 : (value / total) * 100)}%`;

export function ApprovalDonut({ approval }: { approval: typeof APPROVAL }) {
  const total = approval.passed + approval.failed + approval.notEvaluated;
  const segments = [
    { name: "Aprovados", value: approval.passed, color: "var(--positive)" },
    { name: "Reprovados", value: approval.failed, color: "var(--primary)" },
    { name: "Sem avaliação", value: approval.notEvaluated, color: "#dedee6" },
  ];

  return (
    <section className="flex flex-col gap-5 rounded-lg border bg-card p-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-sans text-[15px] font-semibold">Taxa de aprovação</h2>
        <p className="text-xs text-muted-foreground">
          Resultados de {total} alunos no trimestre
        </p>
      </div>

      <div className="relative mx-auto size-[150px]">
        <ChartContainer config={chartConfig} className="aspect-square size-full">
          <PieChart>
            <Pie
              data={segments}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={75}
              startAngle={90}
              endAngle={-270}
              paddingAngle={1}
              stroke="none"
              isAnimationActive={false}
            >
              {segments.map(({ name, color }) => (
                <Cell key={name} fill={color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[22px] font-black">{percent(approval.passed, total)}</span>
          <span className="text-[11px] text-muted-foreground">aprovados</span>
        </div>
      </div>

      <ul className="flex flex-col gap-2.5 text-xs">
        {segments.map(({ name, value, color }) => (
          <li key={name} className="flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="flex-1 text-neutral">{name}</span>
            <span className="font-semibold">{value}</span>
            <span className="w-11 text-right text-muted-foreground">{percent(value, total)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { formatGrade, PASS_GRADE } from "@/lib/utils/format-grade";

import type { SubjectAverage } from "../_lib/mock-data";

const chartConfig = {
  average: { label: "Média" },
} satisfies ChartConfig;

const tick = { fill: "var(--muted-foreground)", fontSize: 11 };

export function SubjectAverageChart({ data }: { data: SubjectAverage[] }) {
  return (
    <section className="flex flex-col gap-5 rounded-lg border bg-card p-6">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="font-sans text-[15px] font-semibold">Média por disciplina</h2>
          <p className="text-xs text-muted-foreground">
            Escala de 0 a 20 valores · nota mínima de aprovação {PASS_GRADE}
          </p>
        </div>
        <ul className="flex items-center gap-3.5 text-[11px] text-neutral">
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px] bg-accent" />≥ {PASS_GRADE}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px] bg-primary" />
            {"<"} {PASS_GRADE}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-0.5 w-3.5 bg-foreground" />
            Mínimo
          </li>
        </ul>
      </div>

      <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
        <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#ededf1" />
          <XAxis dataKey="subject" tickLine={false} axisLine={false} tickMargin={12} tick={tick} interval={0} />
          <YAxis domain={[0, 20]} ticks={[0, 5, 10, 15, 20]} tickLine={false} axisLine={false} width={28} tick={tick} />
          <ReferenceLine y={PASS_GRADE} stroke="var(--foreground)" strokeOpacity={0.6} strokeWidth={1.5} />
          <Bar dataKey="average" barSize={34} radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {data.map(({ subject, average }) => (
              <Cell
                key={subject}
                fill={average < PASS_GRADE ? "var(--primary)" : "var(--accent)"}
              />
            ))}
            <LabelList
              dataKey="average"
              position="top"
              offset={6}
              content={({ x, y, width, value }) => {
                const average = Number(value);
                return (
                  <text
                    x={Number(x) + Number(width) / 2}
                    y={Number(y) - 6}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={600}
                    fill={average < PASS_GRADE ? "var(--primary)" : "var(--foreground)"}
                  >
                    {formatGrade(average)}
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </section>
  );
}

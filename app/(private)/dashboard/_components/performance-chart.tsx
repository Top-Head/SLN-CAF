"use client";

import Image from "next/image";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import type { PerformancePoint } from "../_lib/mock-data";

const chartConfig = {
  bar: { label: "Barras", color: "var(--accent)" },
  line: { label: "Linha", color: "var(--primary)" },
} satisfies ChartConfig;

const Y_TICKS = [-100, -60, -20, 0, 20, 60, 100];

export function PerformanceChart({ data }: { data: PerformancePoint[] }) {
  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-lg border bg-card px-8 pt-[22px] pb-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-sans text-sm font-semibold">
            Estatística de Desempenho por turma
          </h2>
          <div className="flex items-center gap-[22px]">
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Período anterior">
                <Image
                  src="/icons/arrow-right.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="rotate-180"
                />
              </button>
              <button type="button" aria-label="Período seguinte">
                <Image
                  src="/icons/arrow-right.svg"
                  alt=""
                  width={18}
                  height={18}
                />
              </button>
            </div>
            <button type="button" aria-label="Mais informação">
              <Image src="/icons/info.svg" alt="" width={18} height={18} />
            </button>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="mt-14 h-[293px] w-full">
          <ComposedChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              domain={[-100, 100]}
              ticks={Y_TICKS}
              tickLine={false}
              axisLine={false}
              width={40}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="bar"
              fill="var(--color-bar)"
              barSize={64}
              isAnimationActive={false}
            />
            <Line
              dataKey="line"
              isAnimationActive={false}
              type="linear"
              stroke="var(--color-line)"
              strokeWidth={1.5}
              dot={{ r: 2, fill: "var(--foreground)", stroke: "none" }}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ChartContainer>
      </section>

      <div className="flex items-center gap-4 text-xs font-medium">
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-[3px] bg-accent" />
          Barras
        </span>
        <span className="flex items-center gap-2">
          <span className="flex h-3 w-6 items-center px-0.5">
            <span className="h-0.5 flex-1 rounded-[1px] bg-primary" />
          </span>
          Linha
        </span>
      </div>
    </div>
  );
}

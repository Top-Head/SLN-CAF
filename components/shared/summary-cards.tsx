import type { LucideIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { TONES, type Tone } from "./tone";

export type SummaryStat = {
  label: string;
  value: number | string;
  /** Caminho de uma imagem em /public ou um ícone do lucide. */
  icon: string | LucideIcon;
  avatar?: boolean;
  tone?: Tone;
  iconSize?: number;
  hint?: string;
};

type SummaryCardsProps = {
  stats: SummaryStat[];
  className?: string;
};

export function SummaryCards({ stats, className }: SummaryCardsProps) {
  return <StatsCards stats={stats} className={className} />;
}

export function StatsCards({ stats, className }: SummaryCardsProps) {
  return (
    <div className={cn("grid gap-1.5 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {stats.map(({ label, value, icon: Icon, avatar, tone = "primary", iconSize = 18, hint }) => (
        <div
          key={label}
          className="flex min-h-[83px] items-center gap-[22px] rounded-lg border bg-card px-[18px] py-3"
        >
          <div
            className={cn(
              "flex size-[42px] shrink-0 items-center justify-center overflow-hidden",
              avatar ? "rounded-full" : cn("rounded-lg", TONES[tone]),
            )}
          >
            {typeof Icon === "string" ? (
              <Image
                src={Icon}
                alt=""
                width={avatar ? 42 : iconSize}
                height={avatar ? 42 : iconSize}
              />
            ) : (
              <Icon style={{ width: iconSize, height: iconSize }} />
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="truncate text-xs text-muted-foreground">{label}</span>
            <span className="text-xl font-black leading-none">
              {typeof value === "number" ? value.toLocaleString("pt-PT") : value}
            </span>
            {hint && (
              <span className="truncate text-[10px] leading-tight text-muted-foreground">
                {hint}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

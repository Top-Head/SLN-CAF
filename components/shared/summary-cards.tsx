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
      {stats.map(({ label, value, icon: Icon, avatar, tone = "primary", iconSize = 18 }) => (
        <div
          key={label}
          className="flex h-[83px] items-center gap-[22px] rounded-lg border bg-card px-[18px]"
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
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-xl font-black">
              {typeof value === "number" ? value.toLocaleString("pt-PT") : value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

import Image from "next/image";

import { cn } from "@/lib/utils";

export type SummaryStat = {
  label: string;
  value: number;
  icon: string;
  avatar?: boolean;
  tone?: "primary" | "positive";
  iconSize?: number;
};

type SummaryCardsProps = {
  stats: SummaryStat[];
  className?: string;
};

export function SummaryCards({ stats, className }: SummaryCardsProps) {
  return (
    <div className={cn("grid gap-1.5 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {stats.map(({ label, value, icon, avatar, tone = "primary", iconSize = 18 }) => (
        <div
          key={label}
          className="flex h-[83px] items-center gap-[22px] rounded-lg border bg-card px-[18px]"
        >
          <div
            className={cn(
              "flex size-[42px] shrink-0 items-center justify-center overflow-hidden",
              avatar
                ? "rounded-full"
                : cn(
                    "rounded-lg",
                    tone === "positive" ? "bg-positive-soft" : "bg-accent",
                  ),
            )}
          >
            <Image
              src={icon}
              alt=""
              width={avatar ? 42 : iconSize}
              height={avatar ? 42 : iconSize}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-xl font-black">
              {value.toLocaleString("pt-PT")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

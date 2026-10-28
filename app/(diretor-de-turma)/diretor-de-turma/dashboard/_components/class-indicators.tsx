import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type ClassIndicator = {
  label: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
  /** Cor do ícone e do fundo. */
  tone: "primary" | "positive" | "pending";
};

const TONES: Record<ClassIndicator["tone"], string> = {
  primary: "bg-grade-fail-soft text-primary",
  positive: "bg-grade-pass-soft text-grade-pass",
  pending: "bg-pending-soft text-pending",
};

export function ClassIndicators({ items }: { items: ClassIndicator[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, hint, icon: Icon, tone }) => (
        <div key={label} className="flex items-center gap-3.5 rounded-lg border bg-card p-[18px]">
          <span
            className={cn("flex size-[42px] shrink-0 items-center justify-center rounded-lg", TONES[tone])}
          >
            <Icon className="size-[18px]" />
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-xs text-catalog-muted">{label}</span>
            <span className="text-[22px] leading-tight font-bold text-foreground">{value}</span>
            <span className="truncate text-[10px] text-catalog-faint">{hint}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

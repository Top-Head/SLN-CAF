import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

const TONES = {
  active: "bg-active-soft text-active",
  inactive: "bg-neutral-soft text-catalog-muted",
  attention: "bg-attention-soft text-attention",
} as const;

type CatalogBadgeProps = {
  tone: keyof typeof TONES;
  alert?: boolean;
  children: React.ReactNode;
};

export function CatalogBadge({ tone, alert, children }: CatalogBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm py-[5px] whitespace-nowrap",
        alert ? "px-[7px] text-[10px] font-medium" : "px-2 text-[11px]",
        TONES[tone],
      )}
    >
      {alert && <CircleAlert className="size-3" strokeWidth={1.6} />}
      {children}
    </span>
  );
}

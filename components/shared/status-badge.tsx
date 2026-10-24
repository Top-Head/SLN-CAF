import { cn } from "@/lib/utils";

import { TONES, type Tone } from "./tone";

type StatusBadgeProps = {
  tone: Tone;
  children: React.ReactNode;
};

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2 py-[3px] text-xs font-medium whitespace-nowrap",
        TONES[tone],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

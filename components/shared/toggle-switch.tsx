"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/** Interruptor de 40×24 do Figma (o do shadcn por omissão é mais pequeno). */
export function ToggleSwitch({
  className,
  ...props
}: React.ComponentProps<typeof Switch>) {
  return (
    <Switch
      className={cn(
        "shrink-0 shadow-none data-[size=default]:h-6 data-[size=default]:w-10 data-[state=unchecked]:bg-catalog-switch disabled:opacity-50",
        "[&_[data-slot=switch-thumb]]:size-[18px] data-[state=checked]:[&_[data-slot=switch-thumb]]:translate-x-[19px] data-[state=unchecked]:[&_[data-slot=switch-thumb]]:translate-x-0.5",
        className,
      )}
      {...props}
    />
  );
}

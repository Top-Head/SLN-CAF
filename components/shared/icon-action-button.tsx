import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type IconActionButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  /** Destaque da acção recomendada para a linha. */
  variant?: "default" | "primary" | "warning" | "danger" | "active";
};

const VARIANTS = {
  default: "border bg-card text-neutral hover:bg-muted",
  active: "border bg-table-head text-neutral hover:bg-muted",
  warning: "border border-pending bg-card text-pending hover:bg-pending-soft",
  danger: "border border-primary bg-card text-primary hover:bg-accent",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
};

/** Botão quadrado de 32px só com ícone, usado nas colunas de acções. */
export function IconActionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  variant = "default",
}: IconActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-35",
        VARIANTS[variant],
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}

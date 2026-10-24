"use client";

import { ListFilter } from "lucide-react";
import { useId } from "react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type CatalogView<T extends string> = {
  key: T;
  label: string;
  count: number;
};

type CatalogViewsProps<T extends string> = {
  views: CatalogView<T>[];
  value: T;
  onChange: (value: T) => void;
  pendingOnly: boolean;
  onPendingOnlyChange: (value: boolean) => void;
  showFilterIcon?: boolean;
};

export function CatalogViews<T extends string>({
  views,
  value,
  onChange,
  pendingOnly,
  onPendingOnlyChange,
  showFilterIcon,
}: CatalogViewsProps<T>) {
  const switchId = useId();

  return (
    <div className="flex h-11 items-center justify-between gap-4 border-b border-catalog-border">
      <div role="tablist" className="flex h-full gap-6 overflow-x-auto">
        {views.map(({ key, label, count }) => {
          const active = key === value;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(key)}
              className={cn(
                "flex h-full items-center gap-[7px] border-b-2 whitespace-nowrap transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-catalog-muted hover:text-catalog-text",
              )}
            >
              <span className={cn("text-[13px]", active && "font-semibold")}>
                {label}
              </span>
              <span
                className={cn("text-[11px]", !active && "text-catalog-faint")}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {showFilterIcon && (
          <ListFilter className="size-3.5 text-catalog-muted" />
        )}
        <label
          htmlFor={switchId}
          className="cursor-pointer text-[11px] text-catalog-muted"
        >
          Só com pendências
        </label>
        <Switch
          id={switchId}
          size="sm"
          checked={pendingOnly}
          onCheckedChange={onPendingOnlyChange}
          className="h-[15px] w-[26px] shadow-none data-[state=unchecked]:bg-catalog-switch"
        />
      </div>
    </div>
  );
}

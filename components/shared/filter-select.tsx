"use client";

import { ChevronDown, type LucideIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FilterSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  icon?: LucideIcon;
};

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  icon: Icon,
}: FilterSelectProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={label}
        className="flex h-10 shrink-0 items-center gap-2 rounded-md border bg-card pr-3 pl-3.5 text-[13px] text-foreground transition-colors hover:bg-muted data-[state=open]:bg-muted"
      >
        {Icon && <Icon className="size-4 text-muted-foreground" />}
        {value}
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option} value={option} className="text-[13px]">
              {option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

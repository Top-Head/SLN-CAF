"use client";

import { Ellipsis, Eye, Pencil, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type RowActionsMenuProps = {
  label: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  triggerClassName?: string;
};

const itemClass =
  "gap-2.5 rounded-md px-3 py-2.5 text-[13px] font-medium text-[#1f242e] focus:bg-muted focus:text-[#1f242e] [&_svg:not([class*='size-'])]:size-[18px]";

export function RowActionsMenu({
  label,
  onView,
  onEdit,
  onDelete,
  triggerClassName,
}: RowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Acções de ${label}`}
        className={cn(
          "flex size-8 items-center justify-center rounded-md border bg-card text-neutral transition-colors hover:bg-muted data-[state=open]:bg-muted",
          triggerClassName,
        )}
      >
        <Ellipsis className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex w-[220px] flex-col gap-1 rounded-lg p-2 shadow-[0_6px_8px_rgb(0_0_0/0.08)]"
      >
        <DropdownMenuItem className={itemClass} onSelect={onView}>
          <Eye className="text-muted-foreground" />
          Ver
        </DropdownMenuItem>
        <DropdownMenuItem className={itemClass} onSelect={onEdit}>
          <Pencil className="text-muted-foreground" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(itemClass, "text-primary focus:text-primary")}
          onSelect={onDelete}
        >
          <Trash className="text-primary" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

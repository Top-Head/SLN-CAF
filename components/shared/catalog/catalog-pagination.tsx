"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type CatalogPaginationProps = {
  page: number;
  pageSize: number;
  pageSizeOptions: number[];
  total: number;
  noun: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

function getPageItems(page: number, pageCount: number): (number | "…")[] {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  if (page <= 3) return [1, 2, 3, "…", pageCount];
  if (page >= pageCount - 2) {
    return [1, "…", pageCount - 2, pageCount - 1, pageCount];
  }
  return [1, "…", page, "…", pageCount];
}

export function CatalogPagination({
  page,
  pageSize,
  pageSizeOptions,
  total,
  noun,
  onPageChange,
  onPageSizeChange,
}: CatalogPaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <div className="flex h-[58px] items-center justify-between gap-4 px-4 text-[11px] text-catalog-muted">
      <p>
        {first}–{last} de {total.toLocaleString("pt-PT")} {noun}
      </p>
      <div className="flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-sm px-1 py-1 hover:text-catalog-text">
            {pageSize} por página
            <ChevronDown className="size-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-0">
            <DropdownMenuRadioGroup
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              {pageSizeOptions.map((option) => (
                <DropdownMenuRadioItem
                  key={option}
                  value={String(option)}
                  className="text-xs"
                >
                  {option} por página
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <nav aria-label="Paginação" className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Página anterior"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="flex size-[30px] items-center justify-center text-catalog-faint disabled:opacity-40"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          {getPageItems(page, pageCount).map((item, i) =>
            item === "…" ? (
              <span
                key={`gap-${i}`}
                className="flex size-7 items-center justify-center"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPageChange(item)}
                className={cn(
                  "flex size-7 items-center justify-center rounded-sm transition-colors",
                  item === page
                    ? "bg-catalog-active font-semibold text-primary"
                    : "hover:bg-catalog-head",
                )}
              >
                {item}
              </button>
            ),
          )}
          <button
            type="button"
            aria-label="Página seguinte"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
            className="flex size-[30px] items-center justify-center text-catalog-text disabled:opacity-40"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </nav>
      </div>
    </div>
  );
}

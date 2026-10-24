"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type ListPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  noun: string;
  note?: string;
  onPageChange: (page: number) => void;
};

const MAX_VISIBLE_PAGES = 3;

export function ListPagination({
  page,
  pageSize,
  total,
  noun,
  note,
  onPageChange,
}: ListPaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  const start = Math.max(
    1,
    Math.min(page - 1, pageCount - MAX_VISIBLE_PAGES + 1),
  );
  const pages = Array.from(
    { length: Math.min(MAX_VISIBLE_PAGES, pageCount) },
    (_, i) => start + i,
  );

  return (
    <div className="flex h-[52px] items-center gap-4 border-t px-6">
      <p className="flex-1 text-xs text-muted-foreground">
        {first}–{last} de {total.toLocaleString("pt-PT")} {noun}
        {note && ` · ${note}`}
      </p>
      <nav aria-label="Paginação" className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="text-muted-foreground disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>
        {pages.map((n) => (
          <button
            key={n}
            type="button"
            aria-current={n === page ? "page" : undefined}
            onClick={() => onPageChange(n)}
            className={cn(
              "flex size-[26px] items-center justify-center rounded-sm text-xs transition-colors",
              n === page
                ? "bg-accent font-semibold text-primary"
                : "text-neutral hover:bg-muted",
            )}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          aria-label="Página seguinte"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="text-foreground disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </nav>
    </div>
  );
}

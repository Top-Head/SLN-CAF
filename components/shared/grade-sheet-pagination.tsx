"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const GRADE_SHEET_PAGE_SIZES = [8, 16, 32];

type GradeSheetPaginationProps = {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export function GradeSheetPagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: GradeSheetPaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;

  return (
    <div className="flex h-[52px] items-center justify-between gap-4 border-t border-catalog-border px-5 text-[11px] text-catalog-muted">
      <p>
        {first}–{Math.min(page * pageSize, total)} de {total} estudantes
      </p>
      <div className="flex items-center gap-3.5">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3.5 hover:text-catalog-text">
            {pageSize} por página
            <ChevronDown className="size-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-0">
            <DropdownMenuRadioGroup
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              {GRADE_SHEET_PAGE_SIZES.map((size) => (
                <DropdownMenuRadioItem key={size} value={String(size)} className="text-xs">
                  {size} por página
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <nav aria-label="Paginação" className="flex items-center gap-3.5">
          <button
            type="button"
            aria-label="Página anterior"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="text-catalog-faint disabled:opacity-40"
          >
            <ChevronLeft className="size-[15px]" />
          </button>
          <span
            aria-current="page"
            className="flex size-[26px] items-center justify-center rounded-sm bg-catalog-active font-semibold text-primary"
          >
            {page}
          </span>
          <span>de {pageCount}</span>
          <button
            type="button"
            aria-label="Página seguinte"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
            className="text-catalog-text disabled:opacity-40"
          >
            <ChevronRight className="size-[15px]" />
          </button>
        </nav>
      </div>
    </div>
  );
}

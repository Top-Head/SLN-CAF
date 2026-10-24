"use client";

import { ArrowDown, ArrowUp, ChevronDown, ChevronRight } from "lucide-react";
import { Fragment } from "react";

import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import type { SortDirection } from "@/hooks/use-catalog-state";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type CatalogColumn<T> = {
  label: string;
  className?: string;
  render: (item: T, expanded: boolean) => React.ReactNode;
};

type CatalogTableProps<T> = {
  items: T[];
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  columns: CatalogColumn<T>[];
  renderDetails: (item: T) => React.ReactNode;
  expanded: Set<string>;
  onToggleExpanded: (id: string) => void;
  selected: Set<string>;
  onSelectedChange: (selected: Set<string>) => void;
  sortDirection: SortDirection;
  onSortDirectionChange: (direction: "asc" | "desc") => void;
  emptyMessage: string;
  rowHeightClass: string;
  selectionWidthClass: string;
  footer: React.ReactNode;
};

const checkboxClass =
  "size-[15px] rounded-[3px] border-catalog-checkbox bg-card shadow-none";

export function CatalogTable<T>({
  items,
  getId,
  getLabel,
  columns,
  renderDetails,
  expanded,
  onToggleExpanded,
  selected,
  onSelectedChange,
  sortDirection,
  onSortDirectionChange,
  emptyMessage,
  rowHeightClass,
  selectionWidthClass,
  footer,
}: CatalogTableProps<T>) {
  const pageIds = items.map(getId);
  const selectedOnPage = pageIds.filter((id) => selected.has(id)).length;
  const allSelected = pageIds.length > 0 && selectedOnPage === pageIds.length;

  const toggleAll = (checked: boolean) => {
    const next = new Set(selected);
    pageIds.forEach((id) => (checked ? next.add(id) : next.delete(id)));
    onSelectedChange(next);
  };

  const toggleOne = (id: string, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(id);
    else next.delete(id);
    onSelectedChange(next);
  };

  const SortIcon = sortDirection === "desc" ? ArrowDown : ArrowUp;
  const colSpan = columns.length + 2;

  return (
    <div className="overflow-hidden rounded-lg border border-catalog-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead>
            <tr className="h-10 bg-catalog-head">
              <th className={cn("pl-4", selectionWidthClass)}>
                <Checkbox
                  aria-label="Selecionar todas"
                  checked={
                    allSelected ? true : selectedOnPage > 0 ? "indeterminate" : false
                  }
                  onCheckedChange={(checked) => toggleAll(checked === true)}
                  className={checkboxClass}
                />
              </th>
              {columns.map(({ label, className }, i) => (
                <th
                  key={label}
                  scope="col"
                  aria-sort={
                    i === 0 && sortDirection
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  className={cn(
                    "text-[10px] font-semibold tracking-[0.4px] text-catalog-muted uppercase",
                    className,
                  )}
                >
                  {i === 0 ? (
                    <button
                      type="button"
                      onClick={() =>
                        onSortDirectionChange(
                          sortDirection === "asc" ? "desc" : "asc",
                        )
                      }
                      className="inline-flex items-center gap-1 uppercase hover:text-catalog-text"
                    >
                      {label}
                      <SortIcon className="size-3" />
                    </button>
                  ) : (
                    label
                  )}
                </th>
              ))}
              <th className="w-12 pr-4">
                <span className="sr-only">Acções</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const id = getId(item);
              const isExpanded = expanded.has(id);
              const Chevron = isExpanded ? ChevronDown : ChevronRight;
              const detailsId = `${id}-details`;

              return (
                <Fragment key={id}>
                  <tr
                    className={cn(
                      "border-b transition-colors",
                      rowHeightClass,
                      isExpanded
                        ? "border-catalog-active-border bg-catalog-active"
                        : "border-catalog-border hover:bg-catalog-head/60",
                    )}
                  >
                    <td className="pl-4">
                      <Checkbox
                        aria-label={`Selecionar ${getLabel(item)}`}
                        checked={selected.has(id)}
                        onCheckedChange={(checked) =>
                          toggleOne(id, checked === true)
                        }
                        className={checkboxClass}
                      />
                    </td>
                    {columns.map(({ label, className, render }, i) => (
                      <td key={label} className={cn("pr-3", className)}>
                        {i === 0 ? (
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            aria-controls={detailsId}
                            onClick={() => onToggleExpanded(id)}
                            className="flex items-center gap-2 text-left"
                          >
                            <Chevron
                              className={cn(
                                "size-3.5 shrink-0",
                                isExpanded ? "text-primary" : "text-catalog-faint",
                              )}
                            />
                            {render(item, isExpanded)}
                          </button>
                        ) : (
                          render(item, isExpanded)
                        )}
                      </td>
                    ))}
                    <td className="pr-4">
                      <RowActionsMenu
                        label={getLabel(item)}
                        triggerClassName={cn(
                          "h-[30px] rounded-sm text-catalog-muted",
                          isExpanded
                            ? "border-[#ecc0c9] bg-card text-primary"
                            : "border-transparent bg-transparent",
                        )}
                      />
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr
                      id={detailsId}
                      className="border-b border-catalog-border bg-catalog-detail"
                    >
                      <td colSpan={colSpan} className="pt-2.5 pr-4 pb-6">
                        {renderDetails(item)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={colSpan}
                  className="h-24 border-b border-catalog-border text-center text-[13px] text-catalog-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {footer}
    </div>
  );
}

export function CatalogCell({
  primary,
  secondary,
  muted,
  secondaryClassName,
}: {
  primary: React.ReactNode;
  secondary: React.ReactNode;
  muted?: boolean;
  secondaryClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-[5px] whitespace-nowrap">
      <span className={cn("text-xs", muted ? "text-catalog-muted" : "text-catalog-text")}>
        {primary}
      </span>
      <span className={cn("text-[11px] text-catalog-muted", secondaryClassName)}>
        {secondary}
      </span>
    </div>
  );
}

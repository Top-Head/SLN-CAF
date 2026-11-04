"use client";

import { useState } from "react";

export type SortDirection = "asc" | "desc" | null;

export function useCatalogState<View extends string>(
  initialView: View,
  initialPageSize: number,
) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>(initialView);
  const [pendingOnly, setPendingOnly] = useState(false);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const resetPage =
    <A extends unknown[]>(fn: (...args: A) => void) =>
    (...args: A) => {
      fn(...args);
      setPage(1);
    };

  const toggleExpanded = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return {
    query,
    setQuery: resetPage(setQuery),
    view,
    setView: resetPage(setView),
    pendingOnly,
    setPendingOnly: resetPage(setPendingOnly),
    sortDirection,
    setSortDirection,
    page,
    setPage,
    pageSize,
    setPageSize: resetPage(setPageSize),
    selected,
    setSelected,
    expanded,
    toggleExpanded,
  };
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  return items.slice((page - 1) * pageSize, page * pageSize);
}

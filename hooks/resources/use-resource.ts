"use client";

import { useEffect } from "react";

import {
  paramsKeyOf,
  type ResourceListParams,
  type ResourceStore,
} from "@/stores/create-resource-store";

/** Liga um componente à listagem paginada de uma store de recurso. */
export function useResourceList<T, P extends ResourceListParams>(
  store: ResourceStore<T, P>,
  params: P,
  { enabled = true }: { enabled?: boolean } = {},
) {
  const state = store.useResourceState();
  const key = paramsKeyOf({ ...params, page: params.page ?? 1 });

  useEffect(() => {
    if (!enabled || state.paramsKey === key) return;
    void store.fetchList(params);
    // `key` representa `params` de forma estável.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, key, state.paramsKey, store]);

  return {
    items: state.items,
    count: state.count,
    pageSize: state.pageSize,
    status: state.listStatus,
    error: state.listError,
    refetch: () => store.fetchList(params),
    invalidate: store.invalidate,
  };
}

/** Todos os registos do recurso (todas as páginas), com cache partilhada. */
export function useResourceAll<T, P extends ResourceListParams>(
  store: ResourceStore<T, P>,
  { enabled = true }: { enabled?: boolean } = {},
) {
  const state = store.useResourceState();

  useEffect(() => {
    if (!enabled || state.allStatus !== "idle") return;
    void store.fetchAll();
  }, [enabled, state.allStatus, store]);

  return {
    items: state.all,
    status: state.allStatus,
    error: state.allError,
    refetch: () => store.fetchAll(true),
  };
}

"use client";

import { useSyncExternalStore } from "react";

import { fetchAllPages, type Paginated } from "@/services/data";
import { authStore } from "@/stores/use-auth.store";

export type ResourceStatus = "idle" | "loading" | "success" | "error";

export type ResourceListParams = { page?: number } & Record<
  string,
  string | number | undefined
>;

export type ResourceState<T, P extends ResourceListParams> = {
  /** Página atual da listagem. */
  items: T[];
  count: number;
  /** Tamanho de página do servidor, inferido de uma página com `next`. */
  pageSize: number | null;
  params: P;
  /** Chave estável dos parâmetros pedidos (página + filtros). */
  paramsKey: string | null;
  listStatus: ResourceStatus;
  listError: string | null;
  /** Todos os registos (todas as páginas), para selects e mapas id → nome. */
  all: T[];
  allStatus: ResourceStatus;
  allError: string | null;
};

type ResourceStoreOptions<T, P extends ResourceListParams> = {
  fetchPage: (params: P, accessToken?: string) => Promise<Paginated<T>>;
  errorMessage: string;
};

export function paramsKeyOf(params: ResourceListParams): string {
  return JSON.stringify(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== "")
      .sort(([a], [b]) => a.localeCompare(b)),
  );
}

function errorMessageOf(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function accessToken() {
  authStore.hydrate();
  return authStore.getState().accessToken ?? undefined;
}

/**
 * Cria uma store externa (useSyncExternalStore) para um recurso paginado da API.
 * Segue o mesmo modelo das stores de estudantes e professores, mas genérico.
 */
export function createResourceStore<T, P extends ResourceListParams>({
  fetchPage,
  errorMessage,
}: ResourceStoreOptions<T, P>) {
  const initialState: ResourceState<T, P> = {
    items: [],
    count: 0,
    pageSize: null,
    params: {} as P,
    paramsKey: null,
    listStatus: "idle",
    listError: null,
    all: [],
    allStatus: "idle",
    allError: null,
  };

  let state = initialState;
  let listRequestId = 0;
  let allRequest: Promise<T[]> | null = null;
  const listeners = new Set<() => void>();

  function setState(patch: Partial<ResourceState<T, P>>) {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  const getState = () => state;
  const getServerState = () => initialState;

  async function fetchList(params: P = {} as P): Promise<Paginated<T> | null> {
    const requestId = ++listRequestId;
    const normalized = { ...params, page: params.page ?? 1 } as P;

    setState({
      params: normalized,
      paramsKey: paramsKeyOf(normalized),
      listStatus: "loading",
      listError: null,
    });

    try {
      const result = await fetchPage(normalized, accessToken());
      if (requestId !== listRequestId) return null;

      setState({
        items: result.results,
        count: result.count,
        pageSize: result.next ? result.results.length : state.pageSize,
        listStatus: "success",
        listError: null,
      });
      return result;
    } catch (error) {
      if (requestId !== listRequestId) return null;

      setState({
        listStatus: "error",
        listError: errorMessageOf(error, errorMessage),
      });
      return null;
    }
  }

  function fetchAll(force = false): Promise<T[]> {
    if (!force && state.allStatus === "success") {
      return Promise.resolve(state.all);
    }
    if (!force && allRequest) return allRequest;

    setState({ allStatus: "loading", allError: null });

    const request = fetchAllPages((page) =>
      fetchPage({ page } as P, accessToken()),
    )
      .then((all) => {
        if (allRequest === request) {
          setState({ all, allStatus: "success", allError: null });
        }
        return all;
      })
      .catch((error: unknown) => {
        if (allRequest === request) {
          setState({
            allStatus: "error",
            allError: errorMessageOf(error, errorMessage),
          });
        }
        return [] as T[];
      })
      .finally(() => {
        if (allRequest === request) allRequest = null;
      });

    allRequest = request;
    return request;
  }

  /** Recarrega a página atual e descarta a cache de "todos" após mutações. */
  async function invalidate() {
    allRequest = null;
    const hadAll = state.allStatus !== "idle";
    setState({ allStatus: "idle", allError: null });

    await Promise.all([
      state.paramsKey !== null ? fetchList(state.params) : null,
      hadAll ? fetchAll(true) : null,
    ]);
  }

  function reset() {
    listRequestId += 1;
    allRequest = null;
    state = initialState;
    listeners.forEach((listener) => listener());
  }

  function useResourceState() {
    return useSyncExternalStore(subscribe, getState, getServerState);
  }

  // Os dados dependem de quem tem sessão (ex.: turmas do professor):
  // descarta a cache ao terminar sessão ou ao mudar de utilizador.
  if (typeof window !== "undefined") {
    let sessionKey: string | null | undefined;
    authStore.subscribe(() => {
      const auth = authStore.getState();
      if (!auth.hydrated) return;
      const next = auth.accessToken ? String(auth.user?.id ?? auth.user?.email ?? "") : null;
      if (sessionKey !== undefined && next !== sessionKey && state !== initialState) {
        reset();
      }
      sessionKey = next;
    });
  }

  return {
    subscribe,
    getState,
    fetchList,
    fetchAll,
    invalidate,
    reset,
    useResourceState,
  };
}

export type ResourceStore<
  T,
  P extends ResourceListParams = ResourceListParams,
> = ReturnType<typeof createResourceStore<T, P>>;

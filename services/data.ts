import { decodeJwtClaims } from "./auth/jwt";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiResponse<T> = {
  data: T;
};

/** Resposta paginada padrão do DRF (`PageNumberPagination`). */
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type QueryValue = string | number | boolean | null | undefined;

/** Acrescenta a query string a `path`, ignorando valores vazios. */
export function withQuery(
  path: string,
  params: Record<string, QueryValue> = {},
): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    const text = String(value).trim();
    if (text) search.set(key, text);
  }

  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

/**
 * Percorre todas as páginas de uma listagem paginada.
 * Útil para preencher selects (cursos, classes, anos letivos, professores).
 */
export async function fetchAllPages<T>(
  fetchPage: (page: number) => Promise<Paginated<T>>,
  maxPages = 50,
): Promise<T[]> {
  const items: T[] = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const result = await fetchPage(page);
    items.push(...result.results);
    if (!result.next) break;
  }

  return items;
}

export type RequestConfig = {
  accessToken?: string;
  cache?: RequestCache;
  fallbackErrorMessage?: string;
};

type AccessTokenRefresher = () => Promise<string | null>;

let accessTokenRefresher: AccessTokenRefresher | null = null;

export function setAccessTokenRefresher(
  refresher: AccessTokenRefresher | null,
) {
  accessTokenRefresher = refresher;
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

const DEFAULT_ERROR_MESSAGE = "Não foi possível concluir o pedido.";

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function parseBody(text: string): unknown {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function isAccessTokenExpired(token: string): boolean {
  const claims = decodeJwtClaims(token);
  const exp = claims?.exp;

  if (typeof exp !== "number") return true;

  return exp * 1000 <= Date.now() + 30_000;
}

function shouldRefreshAccessToken(status: number, token: string): boolean {
  if (status === 401) return true;
  if (status === 403) return isAccessTokenExpired(token);

  return false;
}

function extractErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === "string" && data.trim()) return data;

  if (!data || typeof data !== "object") return fallback;

  const record = data as Record<string, unknown>;

  if (typeof record.detail === "string") return record.detail;
  if (typeof record.message === "string") return record.message;

  const firstValue = Object.values(record)[0];

  if (typeof firstValue === "string") return firstValue;
  if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
    return firstValue[0];
  }

  return fallback;
}

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  config: RequestConfig = {},
  isRetry = false,
): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError(
      "A variável NEXT_PUBLIC_API_URL não está configurada.",
      500,
    );
  }

  const response = await fetch(new URL(path, `${API_BASE_URL}/`), {
    method,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(config.accessToken
        ? { Authorization: `Bearer ${config.accessToken}` }
        : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    ...(config.cache ? { cache: config.cache } : {}),
  });

  const data = parseBody(await response.text());

  if (!response.ok) {
    const refresher = accessTokenRefresher;

    if (
      !isRetry &&
      config.accessToken &&
      refresher &&
      shouldRefreshAccessToken(response.status, config.accessToken)
    ) {
      const accessToken = await refresher();

      if (accessToken) {
        return request<T>(
          method,
          path,
          body,
          { ...config, accessToken },
          true,
        );
      }

      throw new ApiError(
        "Sessão expirada. Inicie sessão novamente.",
        401,
        data,
      );
    }

    throw new ApiError(
      extractErrorMessage(
        data,
        config.fallbackErrorMessage ?? DEFAULT_ERROR_MESSAGE,
      ),
      response.status,
      data,
    );
  }

  return data as T;
}

export const API = {
  async get<T>(path: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return { data: await request<T>("GET", path, undefined, config) };
  },

  async post<T>(
    path: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return { data: await request<T>("POST", path, body, config) };
  },

  async put<T>(
    path: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return { data: await request<T>("PUT", path, body, config) };
  },

  async patch<T>(
    path: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return { data: await request<T>("PATCH", path, body, config) };
  },

  async delete<T>(
    path: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return { data: await request<T>("DELETE", path, undefined, config) };
  },
};

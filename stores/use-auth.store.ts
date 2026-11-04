"use client";

import { useSyncExternalStore } from "react";

import {
  enrichTeacherUser,
  login as loginRequest,
  logout as logoutRequest,
  refresh as refreshRequest,
} from "@/services/auth";
import { ApiError } from "@/services/data";
import type { AuthState, AuthUser, LoginPayload } from "@/services/auth";

const STORAGE_KEY = "sln-caf.auth";

type StorageKind = "local" | "session";

let storageKind: StorageKind = "local";

const INITIAL_STATE: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "unauthenticated",
  hydrated: false,
};

type PersistedSession = Pick<
  AuthState,
  "user" | "accessToken" | "refreshToken"
>;

let state = INITIAL_STATE;
let storageListenerAttached = false;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function isAuthUser(value: unknown): value is AuthUser {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as AuthUser).email === "string"
  );
}

function readPersistedSession(): PersistedSession | null {
  if (typeof window === "undefined") return null;

  try {
    const localValue = window.localStorage.getItem(STORAGE_KEY);
    const sessionValue = window.sessionStorage.getItem(STORAGE_KEY);
    const raw = localValue ?? sessionValue;

    if (!raw) return null;

    storageKind = localValue ? "local" : "session";

    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return {
      user: isAuthUser(parsed.user) ? parsed.user : null,
      accessToken:
        typeof parsed.accessToken === "string" ? parsed.accessToken : null,
      refreshToken:
        typeof parsed.refreshToken === "string" ? parsed.refreshToken : null,
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function persist() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(STORAGE_KEY);

  if (!state.accessToken) return;

  const storage =
    storageKind === "local" ? window.localStorage : window.sessionStorage;

  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      user: state.user,
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
    } satisfies PersistedSession),
  );
}

function setState(patch: Partial<AuthState>) {
  state = { ...state, ...patch };
  persist();
  notify();
}

function clearSession() {
  storageKind = "local";

  setState({
    user: null,
    accessToken: null,
    refreshToken: null,
    status: "unauthenticated",
    hydrated: true,
  });
}

function applyPersistedSession() {
  const session = readPersistedSession();

  setState({
    user: session?.user ?? null,
    accessToken: session?.accessToken ?? null,
    refreshToken: session?.refreshToken ?? null,
    status: session?.accessToken ? "authenticated" : "unauthenticated",
    hydrated: true,
  });
}

let userEnrichment: Promise<void> | null = null;

async function enrichPersistedUser() {
  if (userEnrichment) return userEnrichment;

  const { user, accessToken } = state;

  if (!user || user.name || !accessToken) return;

  userEnrichment = (async () => {
    const enriched = await enrichTeacherUser(user, accessToken);

    if (enriched.name && state.accessToken === accessToken) {
      setState({ user: enriched });
    }
  })().finally(() => {
    userEnrichment = null;
  });

  return userEnrichment;
}

function handleStorageChange(event: StorageEvent) {
  if (event.key !== null && event.key !== STORAGE_KEY) return;
  applyPersistedSession();
  void enrichPersistedUser();
}

function hydrate() {
  if (typeof window === "undefined" || state.hydrated) return;

  if (!storageListenerAttached) {
    window.addEventListener("storage", handleStorageChange);
    storageListenerAttached = true;
  }

  applyPersistedSession();
  void enrichPersistedUser();
}

async function login(payload: LoginPayload) {
  const session = await loginRequest(payload);

  storageKind = payload.remember === false ? "session" : "local";

  setState({
    user: session.user,
    accessToken: session.access,
    refreshToken: session.refresh,
    status: "authenticated",
    hydrated: true,
  });

  return session;
}

async function logout() {
  const refreshToken = state.refreshToken;

  try {
    if (refreshToken) await logoutRequest(refreshToken);
  } finally {
    clearSession();
  }
}

async function refresh() {
  const refreshToken = state.refreshToken;

  if (!refreshToken) {
    clearSession();
    throw new ApiError("Sessão expirada.", 401);
  }

  try {
    const result = await refreshRequest(refreshToken);

    setState({
      accessToken: result.access,
      refreshToken: result.refresh,
      status: "authenticated",
      hydrated: true,
    });

    return result;
  } catch (error) {
    if (
      error instanceof ApiError &&
      [400, 401, 403].includes(error.status)
    ) {
      clearSession();
    }

    throw error;
  }
}

export const authStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getState() {
    return state;
  },
  getServerSnapshot() {
    return INITIAL_STATE;
  },
  hydrate,
  login,
  logout,
  refresh,
  clearSession,
};

export function useAuthState() {
  return useSyncExternalStore(
    authStore.subscribe,
    authStore.getState,
    authStore.getServerSnapshot,
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";

import { authService } from "@/services/auth/auth.service";
import type {
  ConfirmPasswordPayload,
  LoginPayload,
  PasswordResetPayload,
} from "@/services/auth/type";
import { authStore, useAuthState } from "@/stores/use-auth.store";

type ActionResult<TResult> =
  | { ok: true; data: TResult }
  | { ok: false; error: string };

function useAuthHydration() {
  useEffect(() => {
    authStore.hydrate();
  }, []);
}

export function useAuth() {
  useAuthHydration();
  return useAuthState();
}

function useAsyncAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (...args: TArgs): Promise<ActionResult<TResult>> => {
      setIsPending(true);
      setError(null);

      try {
        return { ok: true, data: await action(...args) };
      } catch (cause) {
        const message =
          cause instanceof Error
            ? cause.message
            : "Ocorreu um erro inesperado.";
        setError(message);
        return { ok: false, error: message };
      } finally {
        setIsPending(false);
      }
    },
    [action],
  );

  const resetError = useCallback(() => setError(null), []);

  return { run, isPending, error, resetError };
}

export function useLogin() {
  const { run, isPending, error, resetError } = useAsyncAction<
    [LoginPayload],
    Awaited<ReturnType<typeof authStore.login>>
  >(authStore.login);

  return { login: run, isPending, error, resetError };
}

export function useLogout() {
  useAuthHydration();

  const { run, isPending, error, resetError } = useAsyncAction<
    [],
    Awaited<ReturnType<typeof authStore.logout>>
  >(authStore.logout);

  return { logout: run, isPending, error, resetError };
}

export function useRefreshAuth() {
  useAuthHydration();

  const { run, isPending, error, resetError } = useAsyncAction<
    [],
    Awaited<ReturnType<typeof authStore.refresh>>
  >(authStore.refresh);

  return { refresh: run, isPending, error, resetError };
}

export function useRequestPasswordReset() {
  const { run, isPending, error, resetError } = useAsyncAction<
    [PasswordResetPayload],
    void
  >(authService.requestPasswordReset);

  return { requestPasswordReset: run, isPending, error, resetError };
}

export function useConfirmPassword() {
  const { run, isPending, error, resetError } = useAsyncAction<
    [ConfirmPasswordPayload],
    void
  >(authService.confirmPassword);

  return { confirmPassword: run, isPending, error, resetError };
}

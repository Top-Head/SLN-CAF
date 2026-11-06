"use client";

import { useSyncExternalStore } from "react";

import {
  generateStudentAccessCode,
  generateTurmaAccessCodes,
  type StudentAccessCode,
} from "@/services/access-codes";
import { authStore } from "@/stores/use-auth.store";

/**
 * A API não tem endpoint para listar códigos já gerados: cada código só é
 * devolvido no momento em que é gerado. Guardamos os códigos desta sessão
 * apenas em memória (nunca em localStorage), agrupados por turma.
 */
type AccessCodesState = {
  byTurma: Record<string, StudentAccessCode[]>;
};

const INITIAL_STATE: AccessCodesState = { byTurma: {} };

let state = INITIAL_STATE;
const listeners = new Set<() => void>();

function setState(next: AccessCodesState) {
  state = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function accessToken() {
  authStore.hydrate();
  return authStore.getState().accessToken ?? undefined;
}

async function generateForTurma(turmaId: string) {
  const result = await generateTurmaAccessCodes(turmaId, accessToken());
  setState({ byTurma: { ...state.byTurma, [turmaId]: result.codes } });
  return result;
}

async function generateForStudent(turmaId: string, studentId: string) {
  const code = await generateStudentAccessCode(studentId, accessToken());
  const current = state.byTurma[turmaId] ?? [];
  const exists = current.some((c) => c.student.id === studentId);
  const codes = exists
    ? current.map((c) => (c.student.id === studentId ? code : c))
    : [...current, code];

  setState({ byTurma: { ...state.byTurma, [turmaId]: codes } });
  return code;
}

function reset() {
  setState(INITIAL_STATE);
}

// Códigos são dados sensíveis: descarta-os quando a sessão termina.
if (typeof window !== "undefined") {
  authStore.subscribe(() => {
    const auth = authStore.getState();
    if (auth.hydrated && !auth.accessToken && state !== INITIAL_STATE) reset();
  });
}

export const accessCodesStore = {
  subscribe,
  getState: () => state,
  generateForTurma,
  generateForStudent,
  reset,
};

export function useAccessCodesState() {
  return useSyncExternalStore(subscribe, () => state, () => INITIAL_STATE);
}

"use client";

import { useSyncExternalStore } from "react";

import { teachersService } from "@/services/teachers/teachers.service";
import type {
  PaginatedTeachers,
  Teacher,
  TeacherListParams,
  TeachersState,
} from "@/services/teachers/type";
import { authStore } from "@/stores/use-auth.store";

const INITIAL_STATE: TeachersState = {
  teachers: [],
  count: 0,
  page: 1,
  next: null,
  previous: null,
  listStatus: "idle",
  listError: null,
  selectedTeacher: null,
  detailTeacherId: null,
  detailStatus: "idle",
  detailError: null,
};

let state = INITIAL_STATE;
let listRequestId = 0;
let detailRequestId = 0;

const detailRequests = new Map<string, Promise<Teacher | null>>();

const listeners = new Set<() => void>();

function setState(patch: Partial<TeachersState>) {
  state = { ...state, ...patch };

  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

function getState() {
  return state;
}

function getServerState() {
  return INITIAL_STATE;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : "Não foi possível carregar os professores.";
}

function applyListResult(result: PaginatedTeachers, page: number) {
  setState({
    teachers: result.results,
    count: result.count,
    page,
    next: result.next,
    previous: result.previous,
    listStatus: "success",
    listError: null,
  });
}

async function fetchTeachers(
  params: TeacherListParams = {},
): Promise<PaginatedTeachers | null> {
  const requestId = ++listRequestId;
  const page = params.page ?? 1;

  authStore.hydrate();

  setState({ listStatus: "loading", listError: null });

  try {
    const result = await teachersService.getAllTeachers(
      { page },
      authStore.getState().accessToken ?? undefined,
    );

    if (requestId !== listRequestId) return null;

    applyListResult(result, page);

    return result;
  } catch (error) {
    if (requestId !== listRequestId) return null;

    setState({
      listStatus: "error",
      listError: getErrorMessage(error),
    });

    return null;
  }
}

async function loadTeacher(id: string): Promise<Teacher | null> {
  const cached = state.selectedTeacher;

  if (cached?.id === id && state.detailStatus === "success") {
    return cached;
  }

  const requestId = ++detailRequestId;

  authStore.hydrate();

  setState({
    selectedTeacher: cached?.id === id ? cached : null,
    detailTeacherId: id,
    detailStatus: "loading",
    detailError: null,
  });

  try {
    const teacher = await teachersService.getTeacherById(
      id,
      authStore.getState().accessToken ?? undefined,
    );

    if (requestId !== detailRequestId) return null;

    setState({
      selectedTeacher: teacher,
      detailTeacherId: id,
      detailStatus: "success",
      detailError: null,
    });

    return teacher;
  } catch (error) {
    if (requestId !== detailRequestId) return null;

    setState({
      selectedTeacher: null,
      detailTeacherId: id,
      detailStatus: "error",
      detailError: getErrorMessage(error),
    });

    return null;
  }
}

function fetchTeacher(id: string, force = false): Promise<Teacher | null> {
  const cached = state.selectedTeacher;

  if (!force && cached?.id === id && state.detailStatus === "success") {
    return Promise.resolve(cached);
  }

  const existing = detailRequests.get(id);

  if (!force && existing) return existing;

  const request = loadTeacher(id);

  detailRequests.set(id, request);

  void request.finally(() => {
    if (detailRequests.get(id) === request) {
      detailRequests.delete(id);
    }
  });

  return request;
}

function clearTeacher() {
  detailRequestId += 1;

  setState({
    selectedTeacher: null,
    detailStatus: "idle",
    detailError: null,
  });
}

function reset() {
  listRequestId += 1;
  detailRequestId += 1;
  state = INITIAL_STATE;

  listeners.forEach((listener) => listener());
}

export const teachersStore = {
  subscribe,
  getState,
  fetchTeachers,
  fetchTeacher,
  clearTeacher,
  reset,
};

export function useTeachersState() {
  return useSyncExternalStore(subscribe, getState, getServerState);
}

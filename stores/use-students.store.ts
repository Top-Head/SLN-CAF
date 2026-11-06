"use client";

import { useSyncExternalStore } from "react";

import {
  getAllStudents,
  getStudentById,
} from "@/services/students";
import type {
  PaginatedStudents,
  Student,
  StudentListParams,
  StudentsState,
} from "@/services/students";
import { authStore } from "@/stores/use-auth.store";

const INITIAL_STATE: StudentsState = {
  students: [],
  count: 0,
  page: 1,
  search: "",
  next: null,
  previous: null,
  listStatus: "idle",
  listError: null,
  selectedStudent: null,
  detailStudentId: null,
  detailStatus: "idle",
  detailError: null,
};

let state = INITIAL_STATE;
let listRequestId = 0;
let detailRequestId = 0;

const detailRequests = new Map<string, Promise<Student | null>>();
const listeners = new Set<() => void>();

function setState(patch: Partial<StudentsState>) {
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

function getErrorMessage(error: unknown) {
  return error instanceof Error && error.message
    ? error.message
    : "Não foi possível carregar os estudantes.";
}

function applyListResult(
  result: PaginatedStudents,
  page: number,
  search: string,
) {
  setState({
    students: result.results,
    count: result.count,
    page,
    search,
    next: result.next,
    previous: result.previous,
    listStatus: "success",
    listError: null,
  });
}

async function fetchStudents(
  params: StudentListParams = {},
): Promise<PaginatedStudents | null> {
  const requestId = ++listRequestId;
  const page = params.page ?? 1;
  const search = params.search?.trim() ?? "";

  authStore.hydrate();
  setState({ page, search, listStatus: "loading", listError: null });

  try {
    const result = await getAllStudents(
      { page, search },
      authStore.getState().accessToken ?? undefined,
    );

    if (requestId !== listRequestId) return null;

    applyListResult(result, page, search);
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

async function loadStudent(id: string): Promise<Student | null> {
  const cached = state.selectedStudent;

  if (cached?.id === id && state.detailStatus === "success") {
    return cached;
  }

  const requestId = ++detailRequestId;
  authStore.hydrate();
  setState({
    selectedStudent: cached?.id === id ? cached : null,
    detailStudentId: id,
    detailStatus: "loading",
    detailError: null,
  });

  try {
    const student = await getStudentById(
      id,
      authStore.getState().accessToken ?? undefined,
    );

    if (requestId !== detailRequestId) return null;

    setState({
      selectedStudent: student,
      detailStudentId: id,
      detailStatus: "success",
      detailError: null,
    });
    return student;
  } catch (error) {
    if (requestId !== detailRequestId) return null;

    setState({
      selectedStudent: null,
      detailStudentId: id,
      detailStatus: "error",
      detailError: getErrorMessage(error),
    });
    return null;
  }
}

function fetchStudent(id: string, force = false): Promise<Student | null> {
  const cached = state.selectedStudent;

  if (!force && cached?.id === id && state.detailStatus === "success") {
    return Promise.resolve(cached);
  }

  const existing = detailRequests.get(id);
  if (!force && existing) return existing;

  const request = loadStudent(id);
  detailRequests.set(id, request);

  void request.finally(() => {
    if (detailRequests.get(id) === request) {
      detailRequests.delete(id);
    }
  });

  return request;
}

function clearStudent() {
  detailRequestId += 1;
  setState({
    selectedStudent: null,
    detailStudentId: null,
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

export const studentsStore = {
  subscribe,
  getState,
  fetchStudents,
  fetchStudent,
  clearStudent,
  reset,
};

export function useStudentsState() {
  return useSyncExternalStore(subscribe, getState, getServerState);
}

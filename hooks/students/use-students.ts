"use client";

import { useEffect } from "react";

import { studentsStore, useStudentsState } from "@/stores/use-students.store";

export type UseStudentsOptions = {
  page?: number;
  search?: string;
  enabled?: boolean;
};

export function useStudents({
  page = 1,
  search = "",
  enabled = true,
}: UseStudentsOptions = {}) {
  const state = useStudentsState();
  const normalizedSearch = search.trim();

  useEffect(() => {
    if (!enabled) return;
    if (
      state.listStatus !== "idle" &&
      state.page === page &&
      state.search === normalizedSearch
    ) {
      return;
    }

    void studentsStore.fetchStudents({ page, search: normalizedSearch });
  }, [
    enabled,
    page,
    normalizedSearch,
    state.listStatus,
    state.page,
    state.search,
  ]);

  return {
    ...state,
    fetchStudents: studentsStore.fetchStudents,
    refetch: () =>
      studentsStore.fetchStudents({
        page,
        search: normalizedSearch,
      }),
    reset: studentsStore.reset,
  };
}

export type UseStudentOptions = {
  enabled?: boolean;
};

export function useStudent(
  id?: string | null,
  { enabled = true }: UseStudentOptions = {},
) {
  const state = useStudentsState();

  useEffect(() => {
    if (!enabled || !id) return;
    void studentsStore.fetchStudent(id);
  }, [enabled, id]);

  const isSelected = Boolean(id) && state.selectedStudent?.id === id;

  return {
    student: isSelected ? state.selectedStudent : null,
    status: isSelected ? state.detailStatus : "idle",
    error: isSelected ? state.detailError : null,
    fetchStudent: studentsStore.fetchStudent,
    refetch: () =>
      id ? studentsStore.fetchStudent(id, true) : Promise.resolve(null),
    clear: studentsStore.clearStudent,
  };
}

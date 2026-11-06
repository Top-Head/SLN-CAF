"use client";

import { useEffect } from "react";

import { teachersStore, useTeachersState } from "@/stores/use-teachers.store";

export type UseTeachersOptions = {
  page?: number;
  enabled?: boolean;
};

export function useTeachers({
  page,
  enabled = true,
}: UseTeachersOptions = {}) {
  const state = useTeachersState();
  const { listStatus, page: loadedPage } = state;

  useEffect(() => {
    if (!enabled || listStatus === "loading") return;

    if (page !== undefined && page !== loadedPage) {
      void teachersStore.fetchTeachers({ page });
      return;
    }

    if (listStatus === "idle") {
      void teachersStore.fetchTeachers({ page: page ?? 1 });
    }
  }, [enabled, page, listStatus, loadedPage]);

  return {
    ...state,
    fetchTeachers: teachersStore.fetchTeachers,
    refetch: () => teachersStore.fetchTeachers({ page: page ?? state.page }),
    reset: teachersStore.reset,
  };
}

export type UseTeacherOptions = {
  enabled?: boolean;
};

export function useTeacher(id?: string | null, { enabled = true }: UseTeacherOptions = {}) {
  const state = useTeachersState();

  useEffect(() => {
    if (!enabled || !id) return;

    void teachersStore.fetchTeacher(id);
  }, [enabled, id]);

  const isSelected = Boolean(id) && state.selectedTeacher?.id === id;

  return {
    teacher: isSelected ? state.selectedTeacher : null,
    status: isSelected ? state.detailStatus : "idle",
    error: isSelected ? state.detailError : null,
    fetchTeacher: teachersStore.fetchTeacher,
    refetch: () => (id ? teachersStore.fetchTeacher(id, true) : Promise.resolve(null)),
    clear: teachersStore.clearTeacher,
  };
}

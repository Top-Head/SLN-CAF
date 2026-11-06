"use client";

import { getAllTeachers } from "@/services/teachers";
import type { Teacher, TeacherListParams } from "@/services/teachers";
import { createResourceStore } from "@/stores/create-resource-store";

export const teacherOptionsStore = createResourceStore<Teacher, TeacherListParams>({
  fetchPage: getAllTeachers,
  errorMessage: "Não foi possível carregar os professores.",
});

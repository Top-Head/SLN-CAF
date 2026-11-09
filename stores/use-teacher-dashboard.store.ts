"use client";

import {
  getTeacherActivity,
  getTeacherClasses,
  getTeacherDashboard,
  getTeacherMiniPautasBoard,
} from "@/services/teacher-dashboard";
import type {
  TeacherActivity,
  TeacherClass,
  TeacherDashboardSummary,
  TeacherMiniPautaBoardItem,
  TeacherPageParams,
} from "@/services/teacher-dashboard";
import { createResourceStore } from "@/stores/create-resource-store";

export const teacherDashboardStore = createResourceStore<
  TeacherDashboardSummary,
  TeacherPageParams
>({
  fetchPage: getTeacherDashboard,
  errorMessage: "Não foi possível carregar o resumo do dashboard.",
});

export const teacherActivityStore = createResourceStore<TeacherActivity, TeacherPageParams>({
  fetchPage: getTeacherActivity,
  errorMessage: "Não foi possível carregar a actividade recente.",
});

export const teacherMiniPautasBoardStore = createResourceStore<
  TeacherMiniPautaBoardItem,
  TeacherPageParams
>({
  fetchPage: getTeacherMiniPautasBoard,
  errorMessage: "Não foi possível carregar as mini-pautas.",
});

export const teacherClassesStore = createResourceStore<TeacherClass, TeacherPageParams>({
  fetchPage: getTeacherClasses,
  errorMessage: "Não foi possível carregar as suas turmas.",
});

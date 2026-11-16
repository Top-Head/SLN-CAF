"use client";

import { getAllEnrollments } from "@/services/enrollments";
import type { Enrollment, EnrollmentListParams } from "@/services/enrollments";
import { createResourceStore } from "@/stores/create-resource-store";

export const enrollmentsStore = createResourceStore<Enrollment, EnrollmentListParams>({
  fetchPage: getAllEnrollments,
  errorMessage: "Não foi possível carregar as matrículas.",
});

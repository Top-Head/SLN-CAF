import { API } from "../data";
import type { ExamGrade, ExamGradePayload } from "./type";

export async function createExamGrade(
  payload: ExamGradePayload,
  accessToken?: string,
): Promise<ExamGrade> {
  const response = await API.post<ExamGrade>("/api/avaliacoes/exams/", payload, {
    accessToken,
  });

  return response.data;
}

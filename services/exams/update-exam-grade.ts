import { API } from "../data";
import type { ExamGrade, ExamGradePayload } from "./type";

export async function updateExamGrade(
  id: string,
  payload: ExamGradePayload,
  accessToken?: string,
): Promise<ExamGrade> {
  const response = await API.put<ExamGrade>(
    `/api/avaliacoes/exams/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

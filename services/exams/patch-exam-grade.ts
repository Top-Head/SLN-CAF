import { API } from "../data";
import type { ExamGrade, ExamGradePayload } from "./type";

export async function patchExamGrade(
  id: string,
  payload: Partial<ExamGradePayload>,
  accessToken?: string,
): Promise<ExamGrade> {
  const response = await API.patch<ExamGrade>(
    `/api/avaliacoes/exams/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

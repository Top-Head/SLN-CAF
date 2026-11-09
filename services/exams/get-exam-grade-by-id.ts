import { API } from "../data";
import type { ExamGrade } from "./type";

export async function getExamGradeById(
  id: string,
  accessToken?: string,
): Promise<ExamGrade> {
  const response = await API.get<ExamGrade>(
    `/api/avaliacoes/exams/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}

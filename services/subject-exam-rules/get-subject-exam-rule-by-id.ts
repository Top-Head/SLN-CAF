import { API } from "../data";
import type { SubjectExamRule } from "./type";

export async function getSubjectExamRuleById(
  id: string,
  accessToken?: string,
): Promise<SubjectExamRule> {
  const response = await API.get<SubjectExamRule>(
    `/api/avaliacoes/subject-exam-rules/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}

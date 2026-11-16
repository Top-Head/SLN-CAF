import { API } from "../data";
import type { SubjectExamRule, SubjectExamRulePayload } from "./type";

export async function updateSubjectExamRule(
  id: string,
  payload: SubjectExamRulePayload,
  accessToken?: string,
): Promise<SubjectExamRule> {
  const response = await API.put<SubjectExamRule>(
    `/api/avaliacoes/subject-exam-rules/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

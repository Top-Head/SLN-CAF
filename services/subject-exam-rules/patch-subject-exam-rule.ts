import { API } from "../data";
import type { SubjectExamRule, SubjectExamRulePayload } from "./type";

export async function patchSubjectExamRule(
  id: string,
  payload: Partial<SubjectExamRulePayload>,
  accessToken?: string,
): Promise<SubjectExamRule> {
  const response = await API.patch<SubjectExamRule>(
    `/api/avaliacoes/subject-exam-rules/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

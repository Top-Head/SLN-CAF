import { API } from "../data";
import type { SubjectExamRule, SubjectExamRulePayload } from "./type";

export async function createSubjectExamRule(
  payload: SubjectExamRulePayload,
  accessToken?: string,
): Promise<SubjectExamRule> {
  const response = await API.post<SubjectExamRule>("/api/avaliacoes/subject-exam-rules/", payload, {
    accessToken,
  });

  return response.data;
}

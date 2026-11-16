import { API, withQuery } from "../data";
import type { PaginatedSubjectExamRules, SubjectExamRuleListParams } from "./type";

export async function getAllSubjectExamRules(
  params: SubjectExamRuleListParams = {},
  accessToken?: string,
): Promise<PaginatedSubjectExamRules> {
  const response = await API.get<PaginatedSubjectExamRules>(
    withQuery("/api/avaliacoes/subject-exam-rules/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}

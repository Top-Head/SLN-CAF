import { API, withQuery } from "../data";
import type { PaginatedClassRules, ClassRuleListParams } from "./type";

export async function getAllClassRules(
  params: ClassRuleListParams = {},
  accessToken?: string,
): Promise<PaginatedClassRules> {
  const response = await API.get<PaginatedClassRules>(
    withQuery("/api/avaliacoes/class-rules/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}

import { API } from "../data";
import type { ClassRule, ClassRulePayload } from "./type";

export async function createClassRule(
  payload: ClassRulePayload,
  accessToken?: string,
): Promise<ClassRule> {
  const response = await API.post<ClassRule>("/api/avaliacoes/class-rules/", payload, {
    accessToken,
  });

  return response.data;
}

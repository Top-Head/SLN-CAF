import { API } from "../data";
import type { ClassRule, ClassRulePayload } from "./type";

export async function updateClassRule(
  id: string,
  payload: ClassRulePayload,
  accessToken?: string,
): Promise<ClassRule> {
  const response = await API.put<ClassRule>(
    `/api/avaliacoes/class-rules/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

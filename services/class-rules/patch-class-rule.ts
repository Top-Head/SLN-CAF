import { API } from "../data";
import type { ClassRule, ClassRulePayload } from "./type";

export async function patchClassRule(
  id: string,
  payload: Partial<ClassRulePayload>,
  accessToken?: string,
): Promise<ClassRule> {
  const response = await API.patch<ClassRule>(
    `/api/avaliacoes/class-rules/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

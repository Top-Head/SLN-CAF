import { API } from "../data";
import type { ClassRule } from "./type";

export async function getClassRuleById(
  id: string,
  accessToken?: string,
): Promise<ClassRule> {
  const response = await API.get<ClassRule>(
    `/api/avaliacoes/class-rules/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}

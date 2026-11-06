import { API } from "../data";
import type { Subject } from "./type";

export async function getSubjectById(
  id: string,
  accessToken?: string,
): Promise<Subject> {
  const response = await API.get<Subject>(
    `/api/academico/subjects/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}

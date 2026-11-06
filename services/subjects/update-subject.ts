import { API } from "../data";
import type { Subject, SubjectPayload } from "./type";

export async function updateSubject(
  id: string,
  payload: SubjectPayload,
  accessToken?: string,
): Promise<Subject> {
  const response = await API.put<Subject>(
    `/api/academico/subjects/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

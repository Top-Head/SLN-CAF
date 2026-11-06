import { API } from "../data";
import type { Subject, SubjectPayload } from "./type";

export async function patchSubject(
  id: string,
  payload: Partial<SubjectPayload>,
  accessToken?: string,
): Promise<Subject> {
  const response = await API.patch<Subject>(
    `/api/academico/subjects/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

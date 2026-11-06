import { API } from "../data";
import type { Subject, SubjectPayload } from "./type";

export async function createSubject(
  payload: SubjectPayload,
  accessToken?: string,
): Promise<Subject> {
  const response = await API.post<Subject>("/api/academico/subjects/", payload, {
    accessToken,
  });

  return response.data;
}

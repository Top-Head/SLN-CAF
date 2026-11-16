import { API } from "../data";
import type { CurriculumSubject, CurriculumSubjectPayload } from "./type";

export async function createCurriculumSubject(
  payload: CurriculumSubjectPayload,
  accessToken?: string,
): Promise<CurriculumSubject> {
  const response = await API.post<CurriculumSubject>("/api/academico/curriculum-subjects/", payload, {
    accessToken,
  });

  return response.data;
}

import { API } from "../data";
import type { CurriculumSubject, CurriculumSubjectPayload } from "./type";

export async function updateCurriculumSubject(
  id: string,
  payload: CurriculumSubjectPayload,
  accessToken?: string,
): Promise<CurriculumSubject> {
  const response = await API.put<CurriculumSubject>(
    `/api/academico/curriculum-subjects/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

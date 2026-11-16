import { API } from "../data";
import type { CurriculumSubject, CurriculumSubjectPayload } from "./type";

export async function patchCurriculumSubject(
  id: string,
  payload: Partial<CurriculumSubjectPayload>,
  accessToken?: string,
): Promise<CurriculumSubject> {
  const response = await API.patch<CurriculumSubject>(
    `/api/academico/curriculum-subjects/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

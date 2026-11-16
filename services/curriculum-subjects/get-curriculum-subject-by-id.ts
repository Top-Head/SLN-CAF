import { API } from "../data";
import type { CurriculumSubject } from "./type";

export async function getCurriculumSubjectById(
  id: string,
  accessToken?: string,
): Promise<CurriculumSubject> {
  const response = await API.get<CurriculumSubject>(
    `/api/academico/curriculum-subjects/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}

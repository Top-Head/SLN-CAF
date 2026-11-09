import { API } from "../data";
import type { Grade, GradePayload } from "./type";

export async function patchGrade(
  id: string,
  payload: Partial<GradePayload>,
  accessToken?: string,
): Promise<Grade> {
  const response = await API.patch<Grade>(
    `/api/avaliacoes/grades/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

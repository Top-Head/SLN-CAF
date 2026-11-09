import { API } from "../data";
import type { Grade, GradePayload } from "./type";

export async function updateGrade(
  id: string,
  payload: GradePayload,
  accessToken?: string,
): Promise<Grade> {
  const response = await API.put<Grade>(
    `/api/avaliacoes/grades/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

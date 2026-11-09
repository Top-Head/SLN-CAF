import { API } from "../data";
import type { Grade, GradePayload } from "./type";

export async function createGrade(
  payload: GradePayload,
  accessToken?: string,
): Promise<Grade> {
  const response = await API.post<Grade>("/api/avaliacoes/grades/", payload, {
    accessToken,
  });

  return response.data;
}

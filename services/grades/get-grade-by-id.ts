import { API } from "../data";
import type { Grade } from "./type";

export async function getGradeById(
  id: string,
  accessToken?: string,
): Promise<Grade> {
  const response = await API.get<Grade>(
    `/api/avaliacoes/grades/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}

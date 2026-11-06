import { API } from "../data";
import type { Turma } from "./type";

export async function getTurmaById(
  id: string,
  accessToken?: string,
): Promise<Turma> {
  const response = await API.get<Turma>(
    `/api/academico/turmas/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}

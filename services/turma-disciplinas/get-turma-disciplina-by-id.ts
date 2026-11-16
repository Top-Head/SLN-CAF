import { API } from "../data";
import type { TurmaDisciplina } from "./type";

export async function getTurmaDisciplinaById(
  id: string,
  accessToken?: string,
): Promise<TurmaDisciplina> {
  const response = await API.get<TurmaDisciplina>(
    `/api/avaliacoes/turma-disciplinas/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}

import { API } from "../data";
import type { TurmaDisciplina, TurmaDisciplinaPayload } from "./type";

export async function updateTurmaDisciplina(
  id: string,
  payload: TurmaDisciplinaPayload,
  accessToken?: string,
): Promise<TurmaDisciplina> {
  const response = await API.put<TurmaDisciplina>(
    `/api/avaliacoes/turma-disciplinas/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

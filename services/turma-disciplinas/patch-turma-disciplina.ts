import { API } from "../data";
import type { TurmaDisciplina, TurmaDisciplinaPayload } from "./type";

export async function patchTurmaDisciplina(
  id: string,
  payload: Partial<TurmaDisciplinaPayload>,
  accessToken?: string,
): Promise<TurmaDisciplina> {
  const response = await API.patch<TurmaDisciplina>(
    `/api/avaliacoes/turma-disciplinas/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

import { API } from "../data";
import type { TurmaDisciplina, TurmaDisciplinaPayload } from "./type";

export async function createTurmaDisciplina(
  payload: TurmaDisciplinaPayload,
  accessToken?: string,
): Promise<TurmaDisciplina> {
  const response = await API.post<TurmaDisciplina>("/api/avaliacoes/turma-disciplinas/", payload, {
    accessToken,
  });

  return response.data;
}

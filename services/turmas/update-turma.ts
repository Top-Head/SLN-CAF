import { API } from "../data";
import type { Turma, TurmaPayload } from "./type";

export async function updateTurma(
  id: string,
  payload: TurmaPayload,
  accessToken?: string,
): Promise<Turma> {
  const response = await API.put<Turma>(
    `/api/academico/turmas/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

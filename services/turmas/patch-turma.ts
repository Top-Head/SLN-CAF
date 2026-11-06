import { API } from "../data";
import type { Turma, TurmaPayload } from "./type";

export async function patchTurma(
  id: string,
  payload: Partial<TurmaPayload>,
  accessToken?: string,
): Promise<Turma> {
  const response = await API.patch<Turma>(
    `/api/academico/turmas/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

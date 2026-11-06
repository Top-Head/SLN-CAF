import { API } from "../data";
import type { Turma, TurmaPayload } from "./type";

export async function createTurma(
  payload: TurmaPayload,
  accessToken?: string,
): Promise<Turma> {
  const response = await API.post<Turma>("/api/academico/turmas/", payload, {
    accessToken,
  });

  return response.data;
}

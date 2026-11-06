import { API } from "../data";
import type { TurmaAccessCodes } from "./type";

/** Gera códigos para todos os alunos com matrícula ativa na turma. */
export async function generateTurmaAccessCodes(
  turmaId: string,
  accessToken?: string,
): Promise<TurmaAccessCodes> {
  const response = await API.post<TurmaAccessCodes>(
    `/api/acess-code/turmas/${encodeURIComponent(turmaId)}/generate-codes/`,
    undefined,
    {
      accessToken,
      fallbackErrorMessage: "Não foi possível gerar os códigos da turma.",
    },
  );

  return response.data;
}

import { API } from "../data";
import type { StudentAccessCode } from "./type";

/** Gera um novo código (válido 2 dias) e revoga os anteriores do aluno. */
export async function generateStudentAccessCode(
  studentId: string,
  accessToken?: string,
): Promise<StudentAccessCode> {
  const response = await API.post<StudentAccessCode>(
    `/api/acess-code/students/${encodeURIComponent(studentId)}/generate-code/`,
    undefined,
    {
      accessToken,
      fallbackErrorMessage: "Não foi possível gerar o código do aluno.",
    },
  );

  return response.data;
}

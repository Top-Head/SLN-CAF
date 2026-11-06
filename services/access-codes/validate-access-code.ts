import { API } from "../data";
import type { AccessCodeValidation, ValidateAccessCodePayload } from "./type";

/** Endpoint público: valida o código e devolve o aluno e as notas. */
export async function validateAccessCode(
  payload: ValidateAccessCodePayload,
): Promise<AccessCodeValidation> {
  const response = await API.post<AccessCodeValidation>(
    "/api/acess-code/validate/",
    { codigo: payload.codigo.trim() },
    { fallbackErrorMessage: "Código inválido, expirado ou já revogado." },
  );

  return response.data;
}

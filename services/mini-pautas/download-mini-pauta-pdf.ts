import { API, withQuery } from "../data";
import type { MiniPautaParams } from "./type";

/** `GET /api/teacher/mini-pautas/pdf/` — a mesma mini-pauta em PDF. */
export async function downloadMiniPautaPdf(
  params: Omit<MiniPautaParams, "page">,
  accessToken?: string,
): Promise<Blob> {
  const response = await API.get<Blob>(
    withQuery("/api/teacher/mini-pautas/pdf/", params),
    {
      accessToken,
      cache: "no-store",
      responseType: "blob",
      fallbackErrorMessage: "Não foi possível gerar o PDF da mini-pauta.",
    },
  );

  return response.data;
}

import { API } from "../data";
import type { GradingScale } from "./type";

export async function getGradingScaleById(
  id: string,
  accessToken?: string,
): Promise<GradingScale> {
  const response = await API.get<GradingScale>(
    `/api/avaliacoes/grading-scales/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}

import { API } from "../data";
import type { GradingScale, GradingScalePayload } from "./type";

export async function updateGradingScale(
  id: string,
  payload: GradingScalePayload,
  accessToken?: string,
): Promise<GradingScale> {
  const response = await API.put<GradingScale>(
    `/api/avaliacoes/grading-scales/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

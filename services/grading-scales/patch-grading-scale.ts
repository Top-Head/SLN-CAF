import { API } from "../data";
import type { GradingScale, GradingScalePayload } from "./type";

export async function patchGradingScale(
  id: string,
  payload: Partial<GradingScalePayload>,
  accessToken?: string,
): Promise<GradingScale> {
  const response = await API.patch<GradingScale>(
    `/api/avaliacoes/grading-scales/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}

import { API } from "../data";
import type { GradingScale, GradingScalePayload } from "./type";

export async function createGradingScale(
  payload: GradingScalePayload,
  accessToken?: string,
): Promise<GradingScale> {
  const response = await API.post<GradingScale>("/api/avaliacoes/grading-scales/", payload, {
    accessToken,
  });

  return response.data;
}

import { API, ApiError } from "../data";
import type { RefreshResult } from "./type";

type RefreshApiResponse = {
  access_token?: string;
  refresh_token?: string;
  access?: string;
  refresh?: string;
};

export async function refresh(refreshToken: string): Promise<RefreshResult> {
  const response = await API.post<RefreshApiResponse>("/api/auth/refresh/", {
    refresh_token: refreshToken,
  });

  const data = response.data;
  const access = data.access ?? data.access_token;
  const refresh = data.refresh ?? data.refresh_token;

  if (!access || !refresh) {
    throw new ApiError(
      "Resposta de renovação de sessão inválida.",
      500,
      data,
    );
  }

  return {
    access,
    refresh,
  };
}

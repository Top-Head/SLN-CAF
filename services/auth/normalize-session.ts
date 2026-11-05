import { ApiError } from "../data";
import { decodeJwtClaims } from "./jwt";
import type { AuthSession, AuthUser } from "./type";

export type LoginApiResponse = {
  access?: string;
  refresh?: string;
  access_token?: string;
  refresh_token?: string;
  user?: AuthSession["user"];
};

function normalizeUser(
  data: LoginApiResponse,
  accessToken: string,
  fallbackEmail: string,
): AuthUser {
  const claims = decodeJwtClaims(accessToken);
  const apiUser = data.user;

  const claimId = claims?.user_id;
  const claimEmail = claims?.email;
  const claimName =
    claims?.name ?? claims?.nome ?? claims?.full_name ?? claims?.username;
  const claimRole = claims?.role;

  const apiName =
    apiUser?.name ??
    apiUser?.nome ??
    apiUser?.full_name ??
    apiUser?.username;

  return {
    id:
      apiUser?.id ??
      (typeof claimId === "string" || typeof claimId === "number"
        ? claimId
        : undefined),
    email:
      apiUser?.email ??
      (typeof claimEmail === "string" ? claimEmail : fallbackEmail),
    name:
      apiName ??
      (typeof claimName === "string" ? claimName : undefined),
    role:
      apiUser?.role ??
      (typeof claimRole === "string" ? claimRole : undefined),
  };
}

export function normalizeSession(
  data: LoginApiResponse,
  fallbackEmail: string,
): AuthSession {
  const access = data.access ?? data.access_token;
  const refresh = data.refresh ?? data.refresh_token;

  if (!access || !refresh) {
    throw new ApiError("Resposta de autenticação inválida.", 500, data);
  }

  return {
    access,
    refresh,
    user: normalizeUser(data, access, fallbackEmail),
  };
}

import { API, ApiError } from "../data";
import type {
  AuthSession,
  AuthUser,
  ConfirmPasswordPayload,
  LoginPayload,
  PasswordResetPayload,
  RefreshResult,
} from "./type";

type LoginApiResponse = {
  access?: string;
  refresh?: string;
  access_token?: string;
  refresh_token?: string;
  user?: AuthSession["user"];
};

type RefreshApiResponse = {
  access_token?: string;
  refresh_token?: string;
  access?: string;
  refresh?: string;
};

function decodeJwtClaims(token: string): Record<string, unknown> | null {
  const segment = token.split(".")[1];
  if (!segment) return null;

  try {
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const claims = JSON.parse(atob(padded)) as unknown;

    return typeof claims === "object" && claims !== null
      ? (claims as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

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

function normalizeSession(
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

type TeacherProfileApiResponse = {
  id: string;
  username: string;
  email: string;
  nome: string;
};

const TEACHER_ROLES = new Set([
  "teacher",
  "professor",
  "director",
  "diretor",
  "diretor-de-turma",
  "diretor_de_turma",
]);

export async function enrichTeacherUser(
  user: AuthUser,
  accessToken: string,
): Promise<AuthUser> {
  const role = user.role?.trim().toLowerCase();

  if (user.name || user.id === undefined || !role || !TEACHER_ROLES.has(role)) {
    return user;
  }

  try {
    const { data } = await API.get<TeacherProfileApiResponse>(
      `/api/auth/teachers/${encodeURIComponent(String(user.id))}/`,
      { accessToken },
    );

    return {
      ...user,
      name: data.nome,
      email: data.email || user.email,
    };
  } catch {
    return user;
  }
}

async function login(payload: LoginPayload): Promise<AuthSession> {
  const response = await API.post<LoginApiResponse>("/api/auth/login/", {
    email: payload.email,
    password: payload.password,
  });

  const session = normalizeSession(response.data, payload.email);

  return {
    ...session,
    user: await enrichTeacherUser(session.user, session.access),
  };
}

async function logout(refreshToken: string): Promise<void> {
  await API.post("/api/auth/logout/", {
    refresh_token: refreshToken,
  });
}

async function refresh(refreshToken: string): Promise<RefreshResult> {
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

async function requestPasswordReset(
  payload: PasswordResetPayload,
): Promise<void> {
  await API.post("/api/auth/password-reset", payload);
}

async function confirmPassword(
  payload: ConfirmPasswordPayload,
): Promise<void> {
  await API.post("/api/auth/confirm-password/", {
    token: payload.token,
    new_password: payload.newPassword,
    confirm_password: payload.confirmPassword,
  });
}

export const authService = {
  login,
  logout,
  refresh,
  requestPasswordReset,
  confirmPassword,
};

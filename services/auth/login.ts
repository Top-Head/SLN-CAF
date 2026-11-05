import { API } from "../data";
import { enrichTeacherUser } from "./enrich-teacher-user";
import {
  normalizeSession,
  type LoginApiResponse,
} from "./normalize-session";
import type { AuthSession, LoginPayload } from "./type";

export async function login(payload: LoginPayload): Promise<AuthSession> {
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

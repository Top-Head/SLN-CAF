import { API } from "../data";
import type { PasswordResetPayload } from "./type";

export async function requestPasswordReset(
  payload: PasswordResetPayload,
): Promise<void> {
  await API.post("/api/auth/password-reset", payload);
}

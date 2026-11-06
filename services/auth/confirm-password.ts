import { API } from "../data";
import type { ConfirmPasswordPayload } from "./type";

export async function confirmPassword(
  payload: ConfirmPasswordPayload,
): Promise<void> {
  await API.post("/api/auth/confirm-password/", {
    token: payload.token,
    new_password: payload.newPassword,
    confirm_password: payload.confirmPassword,
  });
}

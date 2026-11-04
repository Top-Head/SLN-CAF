import { API } from "../data";

export async function logout(refreshToken: string): Promise<void> {
  await API.post("/api/auth/logout/", {
    refresh_token: refreshToken,
  });
}

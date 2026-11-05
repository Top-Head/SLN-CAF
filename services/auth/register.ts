import { API } from "../data";
import type { RegisterPayload } from "./type";

export async function register(payload: RegisterPayload): Promise<void> {
  await API.post("/api/auth/register/", payload);
}

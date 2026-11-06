import { API } from "../data";
import type { CreateTeacherPayload } from "./type";

export async function createTeacher(
  payload: CreateTeacherPayload,
  accessToken?: string,
): Promise<void> {
  await API.post("/api/auth/teacher-register/", payload, { accessToken });
}

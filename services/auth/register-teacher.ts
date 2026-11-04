import { createTeacher } from "../teachers/create-teacher";
import type { CreateTeacherPayload } from "../teachers/type";

export async function registerTeacher(
  payload: CreateTeacherPayload,
): Promise<void> {
  await createTeacher(payload);
}

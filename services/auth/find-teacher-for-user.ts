import { ApiError, fetchAllPages } from "../data";
import { getAllTeachers } from "../teachers/get-all-teachers";
import { getTeacherById } from "../teachers/get-teacher-by-id";
import type { Teacher } from "../teachers/type";
import type { AuthUser } from "./type";

/**
 * Encontra o registo de professor do utilizador autenticado.
 * O `user_id` do JWT nem sempre coincide com o id do professor em
 * `/api/auth/teachers/{id}/`; nesse caso (404) procura pelo email/username.
 */
export async function findTeacherForUser(
  user: AuthUser,
  accessToken?: string,
): Promise<Teacher | null> {
  if (user.id !== undefined) {
    try {
      return await getTeacherById(String(user.id), accessToken);
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 404)) throw error;
    }
  }

  const email = user.email?.trim().toLowerCase();
  const username = user.username?.trim().toLowerCase();
  if (!email && !username) return null;

  const teachers = await fetchAllPages((page) =>
    getAllTeachers({ page }, accessToken),
  );

  return (
    teachers.find(
      (t) =>
        (email && t.email.trim().toLowerCase() === email) ||
        (username && t.username.trim().toLowerCase() === username),
    ) ?? null
  );
}

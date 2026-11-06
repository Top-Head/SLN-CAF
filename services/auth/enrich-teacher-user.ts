import { findTeacherForUser } from "./find-teacher-for-user";
import type { AuthUser } from "./type";

const TEACHER_ROLES = new Set([
  "teacher",
  "professor",
  "director",
  "diretor",
  "diretor-de-turma",
  "diretor_de_turma",
]);

/** Perfis que têm registo em /api/auth/teachers/{id}/. */
export function isTeacherRole(role?: string) {
  return Boolean(role && TEACHER_ROLES.has(role.trim().toLowerCase()));
}

export async function enrichTeacherUser(
  user: AuthUser,
  accessToken: string,
): Promise<AuthUser> {
  const role = user.role?.trim().toLowerCase();

  if (user.name || user.id === undefined || !role || !TEACHER_ROLES.has(role)) {
    return user;
  }

  try {
    const teacher = await findTeacherForUser(user, accessToken);
    if (!teacher) return user;

    return {
      ...user,
      name: teacher.nome,
      email: teacher.email || user.email,
    };
  } catch {
    return user;
  }
}

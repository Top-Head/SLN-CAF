import { API } from "../data";
import type { AuthUser } from "./type";

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

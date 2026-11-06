"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/auth/use-auth";
import { findTeacherForUser, isTeacherRole } from "@/services/auth";
import {
  patchTeacher,
  type Teacher,
  type TeacherUpdatePayload,
} from "@/services/teachers";
import { authStore } from "@/stores/use-auth.store";

// Cache simples por id para não repetir o pedido ao navegar entre páginas.
const cache = new Map<string, Teacher>();

/**
 * Perfil do utilizador autenticado.
 * - Todos: id, nome, email e perfil (role) da sessão/JWT.
 * - Professores e diretores de turma: dados completos de
 *   `GET /api/auth/teachers/{id}/` e edição por `PATCH`.
 * A API não tem endpoint de perfil para administradores.
 */
export function useCurrentProfile() {
  const auth = useAuth();
  const user = auth.user;
  const id = user?.id !== undefined ? String(user.id) : null;
  const canLoadTeacher = Boolean(id) && isTeacherRole(user?.role);

  const [teacher, setTeacher] = useState<Teacher | null>(
    id ? (cache.get(id) ?? null) : null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.hydrated || !canLoadTeacher || !id || !user) return;
    let active = true;

    findTeacherForUser(user, authStore.getState().accessToken ?? undefined)
      .then((result) => {
        if (!active) return;
        if (!result) {
          setError("Não existe um registo de professor associado a esta conta.");
          return;
        }
        cache.set(id, result);
        setTeacher(result);
        setError(null);
        // Mantém o cabeçalho com o nome completo do registo de professor.
        if (user.name !== result.nome) authStore.updateUser({ name: result.nome });
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof Error ? cause.message : "Não foi possível carregar o perfil.",
        );
      });

    return () => {
      active = false;
    };
    // `user` muda de referência ao atualizar o nome; `id` identifica-o.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.hydrated, canLoadTeacher, id]);

  async function update(payload: Partial<TeacherUpdatePayload>) {
    if (!id || !canLoadTeacher) {
      throw new Error("A API não permite editar este perfil.");
    }
    if (!teacher) throw new Error("Perfil de professor não carregado.");
    const updated = await patchTeacher(
      teacher.id,
      payload,
      authStore.getState().accessToken ?? undefined,
    );
    cache.set(id, updated);
    setTeacher(updated);
    authStore.updateUser({ name: updated.nome, email: updated.email });
    return updated;
  }

  return {
    user,
    hydrated: auth.hydrated,
    teacher: canLoadTeacher ? teacher : null,
    canEdit: canLoadTeacher,
    loading: canLoadTeacher && !teacher && !error,
    error,
    update,
  };
}

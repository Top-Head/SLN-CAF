"use client";

import { AtSign, Mail, ShieldCheck, ToggleRight, UserCog } from "lucide-react";

import { ResourceManager } from "@/components/shared/resource/resource-manager";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAuth } from "@/hooks/auth/use-auth";
import { formatDateTime } from "@/lib/utils/format-date";
import {
  getAppUserById,
  patchAppUser,
  type AppUser,
  type UserRole,
} from "@/services/users";
import { appUsersStore } from "@/stores/use-app-users.store";

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador",
  TEACHER: "Professor",
};

/**
 * Contas de utilizador (`/api/auth/users/`): ver, mudar papel, ativar e
 * desativar. A criação faz-se em Professores (conta + perfil) e a API não
 * permite eliminar contas.
 */
export function UsersManager() {
  const { user: me } = useAuth();
  const isMe = (u: AppUser) =>
    String(me?.id ?? "") === u.id || (me?.email ?? "").toLowerCase() === u.email.toLowerCase();

  return (
    <ResourceManager<AppUser>
      title="Utilizadores"
      noun="utilizadores"
      addLabel=""
      icon={UserCog}
      searchPlaceholder="Pesquise por nome de utilizador ou email"
      emptyMessage="Não há utilizadores."
      store={appUsersStore}
      toolbar={
        <p className="rounded-lg border bg-card px-5 py-3 text-xs text-muted-foreground">
          As contas de professor criam-se em Professores (conta e perfil ao mesmo tempo). Aqui
          pode mudar o papel e desativar uma conta; uma conta desativada deixa de iniciar sessão.
        </p>
      }
      columns={[
        {
          label: "Utilizador",
          render: (u) => (
            <span className="flex flex-col">
              <span className="font-medium">
                {u.username}
                {isMe(u) && <span className="ml-2 text-xs text-primary">(você)</span>}
              </span>
              <span className="text-xs text-muted-foreground">{u.email}</span>
            </span>
          ),
        },
        {
          label: "Papel",
          className: "w-[140px]",
          render: (u) => (
            <StatusBadge tone={u.role === "ADMIN" ? "info" : "neutral"}>{ROLE_LABELS[u.role]}</StatusBadge>
          ),
        },
        {
          label: "Estado",
          className: "w-[110px]",
          render: (u) =>
            u.active === false ? (
              <StatusBadge tone="negative">Inativa</StatusBadge>
            ) : (
              <StatusBadge tone="positive">Ativa</StatusBadge>
            ),
        },
        { label: "Criada", className: "w-[150px]", render: (u) => formatDateTime(u.created_at) },
      ]}
      getLabel={(u) => u.username}
      searchText={(u) => [u.username, u.email, ROLE_LABELS[u.role]]}
      compare={(a, b) => a.role.localeCompare(b.role) || a.username.localeCompare(b.username, "pt")}
      dialog={{
        titles: { create: "", edit: "Editar utilizador", view: "Dados do utilizador" },
        descriptions: {
          create: "",
          edit: "Mude o papel ou o estado da conta.",
          view: "Consulte a conta.",
        },
        submitLabel: "Guardar",
        fields: [
          { name: "username", label: "Nome de utilizador", icon: AtSign, required: true, maxLength: 50 },
          { name: "email", label: "Email", icon: Mail, required: true, maxLength: 254 },
          {
            name: "role",
            label: "Papel",
            type: "select",
            icon: ShieldCheck,
            required: true,
            options: (Object.keys(ROLE_LABELS) as UserRole[]).map((value) => ({
              value,
              label: ROLE_LABELS[value],
            })),
          },
          {
            name: "active",
            label: "Estado da conta",
            type: "select",
            icon: ToggleRight,
            required: true,
            options: [
              { value: "true", label: "Ativa" },
              { value: "false", label: "Inativa (não inicia sessão)" },
            ],
          },
        ],
        emptyValues: { username: "", email: "", role: "TEACHER", active: "true" },
        toValues: (u) => ({
          username: u.username,
          email: u.email,
          role: u.role,
          active: u.active === false ? "false" : "true",
        }),
        validate: (v) => {
          if (v.username.trim().length < 3) return "O nome de utilizador tem de ter pelo menos 3 caracteres.";
          if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) return "Indique um email válido.";
          return null;
        },
      }}
      messages={{
        updated: (u) => `Conta de ${u.username} atualizada.`,
      }}
      fetchOne={getAppUserById}
      onUpdate={(u, v, token) => {
        // Evita que o administrador se bloqueie a si próprio.
        if (isMe(u) && (v.active === "false" || v.role !== "ADMIN")) {
          throw new Error("Não pode desativar nem retirar o papel de administrador à sua própria conta.");
        }
        return patchAppUser(
          u.id,
          {
            username: v.username.trim(),
            email: v.email.trim(),
            role: v.role as UserRole,
            active: v.active === "true",
          },
          token,
        );
      }}
    />
  );
}

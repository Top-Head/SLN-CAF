"use client";

import { AtSign, IdCard, Mail, Phone, UserRound, VenusAndMars } from "lucide-react";
import { useState } from "react";

import {
  ResourceFormDialog,
  type FormValues,
} from "@/components/shared/resource/resource-form-dialog";
import { useCurrentProfile } from "@/hooks/auth/use-current-profile";
import { notify } from "@/lib/notify";
import { requestPasswordReset } from "@/services/auth";
import type { Teacher, TeacherGender } from "@/services/teachers";
import type {
  ActiveSession,
  Profile,
  ProfileField,
  SecuritySettings,
} from "@/types/profile.types";

import { PersonalInfoCard } from "./personal-info-card";
import { ProfileOverview } from "./profile-overview";
import { SecurityCard } from "./security-card";
import { SignOutCard } from "./sign-out-card";

type ProfileViewProps = {
  /**
   * Valores de demonstração para o que a API ainda não fornece
   * (morada, data de nascimento, 2FA, sessões ativas, ...).
   */
  fallback: {
    profile: Profile;
    personalInfo: ProfileField[];
    security: SecuritySettings;
    sessions: ActiveSession[];
  };
  description?: string;
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  administrador: "Administrador",
  teacher: "Professor",
  professor: "Professor",
  director: "Diretor de turma",
  diretor: "Diretor de turma",
  "diretor-de-turma": "Diretor de turma",
  diretor_de_turma: "Diretor de turma",
};

const GENDER_LABELS: Record<TeacherGender, string> = {
  MASCULINO: "Masculino",
  FEMENINO: "Feminino",
};

function roleLabel(role?: string) {
  if (!role) return null;
  return ROLE_LABELS[role.trim().toLowerCase()] ?? role;
}

/** "923418760" → "+244 923 418 760". */
function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 9
    ? `+244 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
    : phone;
}

function replaceField(fields: ProfileField[], label: string, value?: string | null) {
  if (!value) return fields;
  return fields.map((f) => (f.label === label ? { ...f, value } : f));
}

function toValues(teacher: Teacher): FormValues {
  return {
    nome: teacher.nome,
    username: teacher.username,
    email: teacher.email,
    telefone: teacher.telefone,
    bi: teacher.bi,
    genero: teacher.genero,
  };
}

/**
 * Perfil do utilizador autenticado. Usa os dados reais da sessão e, para
 * professores/diretores, de `GET /api/auth/teachers/{id}/`; o resto continua
 * com os valores de demonstração até a API os disponibilizar.
 */
export function ProfileView({ fallback, description }: ProfileViewProps) {
  const { user, teacher, canEdit, loading, error, update } = useCurrentProfile();
  const [editOpen, setEditOpen] = useState(false);
  const [passwordPending, setPasswordPending] = useState(false);

  const role = roleLabel(user?.role);
  const displayName =
    teacher?.nome ?? user?.name ?? user?.nome ?? fallback.profile.displayName;
  const email = teacher?.email ?? user?.email ?? fallback.profile.email;

  const profile: Profile = {
    ...fallback.profile,
    displayName,
    email,
    role: role ?? fallback.profile.role,
    phone: teacher?.telefone ? formatPhone(teacher.telefone) : fallback.profile.phone,
  };

  let personalInfo = fallback.personalInfo;
  personalInfo = replaceField(personalInfo, "Nome completo", displayName);
  personalInfo = replaceField(personalInfo, "N.º do Bilhete de Identidade", teacher?.bi);
  personalInfo = replaceField(
    personalInfo,
    "Género",
    teacher ? GENDER_LABELS[teacher.genero] : null,
  );
  personalInfo = replaceField(personalInfo, "Cargo", role);

  async function handleChangePassword() {
    if (!email) return;
    setPasswordPending(true);
    try {
      // A API não tem "alterar palavra-passe" autenticado: envia o link de
      // redefinição para o email da conta.
      await requestPasswordReset({ email });
      notify.success(
        `Enviámos um link para ${email} para definir uma nova palavra-passe.`,
      );
    } catch (cause) {
      notify.error(cause, "Não foi possível enviar o link de redefinição.");
    } finally {
      setPasswordPending(false);
    }
  }

  // Sem endpoint (administrador) ou ainda a carregar: o botão informa em vez de
  // não fazer nada.
  const openEdit = () => {
    if (canEdit && teacher) setEditOpen(true);
    else if (canEdit && loading) notify.info("Aguarde, os dados do perfil ainda estão a carregar.");
    else if (canEdit) notify.error(error ?? "Não foi possível carregar o perfil para edição.");
    else notify.info("A edição do perfil de administrador ainda não está disponível.");
  };

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          Não foi possível carregar os dados do perfil: {error}
        </p>
      )}
      <ProfileOverview profile={profile} onEdit={openEdit} />
      <div className="grid gap-6 lg:grid-cols-2">
        <PersonalInfoCard
          fields={personalInfo}
          description={description}
          onEdit={openEdit}
        />
        <SecurityCard
          security={fallback.security}
          sessions={fallback.sessions}
          onChangePassword={email ? () => void handleChangePassword() : undefined}
          passwordPending={passwordPending}
        />
      </div>
      <SignOutCard />

      {teacher && (
        <ResourceFormDialog<Teacher>
          key={editOpen ? "open" : "closed"}
          open={editOpen}
          mode="edit"
          item={teacher}
          icon={UserRound}
          titles={{ create: "", edit: "Editar perfil", view: "" }}
          descriptions={{
            create: "",
            edit: "Atualize os seus dados pessoais e de contacto.",
            view: "",
          }}
          submitLabel="Guardar"
          fields={[
            { name: "nome", label: "Nome completo", icon: UserRound, maxLength: 150, required: true, wide: true },
            { name: "username", label: "Nome de utilizador", icon: AtSign, maxLength: 50, required: true },
            { name: "email", label: "Email", icon: Mail, maxLength: 254, required: true },
            { name: "telefone", label: "Telefone", icon: Phone, maxLength: 9, required: true, placeholder: "923000000" },
            { name: "bi", label: "N.º do BI", icon: IdCard, maxLength: 16, required: true },
            {
              name: "genero",
              label: "Género",
              type: "select",
              icon: VenusAndMars,
              required: true,
              options: [
                { value: "MASCULINO", label: "Masculino" },
                { value: "FEMENINO", label: "Feminino" },
              ],
            },
          ]}
          emptyValues={{ nome: "", username: "", email: "", telefone: "", bi: "", genero: "" }}
          toValues={toValues}
          validate={(values) => {
            if (!/^\d{9}$/.test(values.telefone)) {
              return "O telefone deve ter 9 dígitos.";
            }
            if (values.bi.length < 6) {
              return "O número do BI deve ter pelo menos 6 caracteres.";
            }
            if (!/^\S+@\S+\.\S+$/.test(values.email)) {
              return "Indique um email válido.";
            }
            return null;
          }}
          onSubmit={async (values) => {
            // Envia só os campos alterados.
            const original = toValues(teacher);
            const changed = Object.fromEntries(
              Object.entries(values).filter(([key, value]) => original[key] !== value),
            );
            if (Object.keys(changed).length === 0) {
              notify.info("Não há alterações para guardar.");
              return;
            }
            await update(changed);
            notify.success("Perfil atualizado com sucesso.");
          }}
          onOpenChange={setEditOpen}
        />
      )}
    </div>
  );
}

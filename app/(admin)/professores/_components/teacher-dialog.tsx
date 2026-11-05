"use client";

import { useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTeacher } from "@/hooks/teachers/use-teachers";
import { createTeacher, updateTeacher } from "@/services/teachers";
import type {
  Teacher,
  TeacherGender,
  TeacherUpdatePayload,
} from "@/services/teachers";
import { authStore } from "@/stores/use-auth.store";
import { teachersStore } from "@/stores/use-teachers.store";

type DialogMode = "create" | "edit" | "view";

type TeacherDialogProps = {
  open: boolean;
  mode: DialogMode;
  teacher: Teacher | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

type TeacherForm = {
  username: string;
  email: string;
  nome: string;
  telefone: string;
  bi: string;
  genero: "" | TeacherGender;
  password: string;
};

const EMPTY_FORM: TeacherForm = {
  username: "",
  email: "",
  nome: "",
  telefone: "",
  bi: "",
  genero: "",
  password: "",
};

function toForm(teacher: Teacher): TeacherForm {
  return {
    username: teacher.username,
    email: teacher.email,
    nome: teacher.nome,
    telefone: teacher.telefone,
    bi: teacher.bi,
    genero: teacher.genero,
    password: "",
  };
}

export function TeacherDialog({
  open,
  mode,
  teacher,
  onOpenChange,
  onSaved,
}: TeacherDialogProps) {
  const [formEdits, setFormEdits] = useState<Partial<TeacherForm>>({});
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const teacherId = mode === "create" ? null : teacher?.id;
  const detail = useTeacher(teacherId, { enabled: open && Boolean(teacherId) });
  const currentTeacher = detail.teacher ?? teacher;
  const form = {
    ...(mode === "create" ? EMPTY_FORM : currentTeacher ? toForm(currentTeacher) : EMPTY_FORM),
    ...formEdits,
  };

  function updateField(field: keyof TeacherForm, value: string) {
    setFormEdits((current) => ({ ...current, [field]: value }));
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.genero !== "MASCULINO" && form.genero !== "FEMENINO") {
      setError("Selecione o género.");
      return;
    }

    const payload: TeacherUpdatePayload = {
      username: form.username.trim(),
      email: form.email.trim(),
      nome: form.nome.trim(),
      telefone: form.telefone.trim(),
      bi: form.bi.trim(),
      genero: form.genero,
    };

    if (
      !payload.username ||
      !payload.email ||
      !payload.nome ||
      !payload.telefone ||
      !payload.bi
    ) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!/^\d{9}$/.test(payload.telefone)) {
      setError("O telefone deve conter 9 dígitos.");
      return;
    }

    if (payload.bi.length < 6 || payload.bi.length > 16) {
      setError("O BI deve ter entre 6 e 16 caracteres.");
      return;
    }

    if (mode === "create" && form.password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    authStore.hydrate();
    const accessToken = authStore.getState().accessToken ?? undefined;
    setIsPending(true);
    setError(null);

    try {
      if (mode === "create") {
        await createTeacher(
          { ...payload, password: form.password },
          accessToken,
        );
      } else {
        if (!teacherId) {
          setError("Não foi possível identificar o professor.");
          return;
        }
        await updateTeacher(
          teacherId,
          payload,
          accessToken,
        );
      }

      teachersStore.clearTeacher();
      onOpenChange(false);
      onSaved();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível guardar os dados do professor.",
      );
    } finally {
      setIsPending(false);
    }
  }

  const isReadOnly = mode === "view";
  const isLoadingDetail = mode !== "create" && detail.status === "loading" && !currentTeacher;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Cadastrar professor"
              : mode === "edit"
                ? "Editar professor"
                : "Dados do professor"}
          </DialogTitle>
          <DialogDescription>
            {mode === "view"
              ? "Informações registadas para este professor."
              : "Preencha os dados conforme o cadastro do professor."}
          </DialogDescription>
        </DialogHeader>

        {isLoadingDetail ? (
          <p role="status" className="py-6 text-sm text-muted-foreground">
            A carregar os dados do professor...
          </p>
        ) : detail.error && !currentTeacher ? (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {detail.error}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {detail.error && currentTeacher && (
              <p
                role="alert"
                className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800"
              >
                Não foi possível atualizar os detalhes do servidor: {detail.error}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Nome completo" id="teacher-nome">
                <Input
                  id="teacher-nome"
                  value={form.nome}
                  maxLength={150}
                  onChange={(event) => updateField("nome", event.target.value)}
                  disabled={isReadOnly || isPending}
                  required
                  className="h-11 w-full"
                />
              </FormField>
              <FormField label="Nome de utilizador" id="teacher-username">
                <Input
                  id="teacher-username"
                  value={form.username}
                  maxLength={50}
                  onChange={(event) => updateField("username", event.target.value)}
                  disabled={isReadOnly || isPending}
                  required
                  className="h-11 w-full"
                />
              </FormField>
              <FormField label="Email" id="teacher-email">
                <Input
                  id="teacher-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  disabled={isReadOnly || isPending}
                  required
                  className="h-11 w-full"
                />
              </FormField>
              <FormField label="Telefone" id="teacher-telefone">
                <Input
                  id="teacher-telefone"
                  type="tel"
                  inputMode="numeric"
                  value={form.telefone}
                  maxLength={9}
                  onChange={(event) =>
                    updateField("telefone", event.target.value.replace(/\D/g, ""))
                  }
                  disabled={isReadOnly || isPending}
                  required
                  className="h-11 w-full"
                />
              </FormField>
              <FormField label="BI" id="teacher-bi">
                <Input
                  id="teacher-bi"
                  value={form.bi}
                  minLength={6}
                  maxLength={16}
                  onChange={(event) => updateField("bi", event.target.value)}
                  disabled={isReadOnly || isPending}
                  required
                  className="h-11 w-full"
                />
              </FormField>
              <FormField label="Género" id="teacher-genero">
                <select
                  id="teacher-genero"
                  value={form.genero}
                  onChange={(event) => updateField("genero", event.target.value)}
                  disabled={isReadOnly || isPending}
                  required
                  className="h-11 w-full rounded-[8px] border border-[#DEDEE6] bg-white px-3 text-sm outline-none focus:border-[#E73959] disabled:bg-muted"
                >
                  <option value="">Selecionar</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMENINO">Feminino</option>
                </select>
              </FormField>
              {mode === "create" && (
                <FormField label="Senha" id="teacher-password">
                  <Input
                    id="teacher-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    value={form.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    disabled={isPending}
                    required
                    className="h-11 w-full"
                  />
                </FormField>
              )}
            </div>

            {error && (
              <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            {!isReadOnly && (
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "A guardar..." : mode === "create" ? "Cadastrar" : "Guardar"}
                </Button>
              </DialogFooter>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-semibold">
        {label}
      </Label>
      {children}
    </div>
  );
}

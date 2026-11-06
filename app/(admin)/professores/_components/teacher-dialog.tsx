"use client";

import {
  AtSign,
  Check,
  CircleAlert,
  Eye,
  EyeOff,
  IdCard,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  VenusAndMars,
  X,
  type LucideIcon,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeacher } from "@/hooks/teachers/use-teachers";
import { cn } from "@/lib/utils";
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
  const generoInvalid = Boolean(error) && !form.genero;

  function updateField(field: keyof TeacherForm, value: string) {
    setFormEdits((current) => ({ ...current, [field]: value }));
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.genero !== "MASCULINO" && form.genero !== "FEMENINO") {
      setError("Selecione o género do professor.");
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
        await updateTeacher(teacherId, payload, accessToken);
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
  const isLoadingDetail =
    mode !== "create" && detail.status === "loading" && !currentTeacher;
  const title =
    mode === "create"
      ? "Cadastrar professor"
      : mode === "edit"
        ? "Editar professor"
        : "Dados do professor";
  const description =
    mode === "view"
      ? "Consulte as informações registadas para este professor."
      : mode === "edit"
        ? "Atualize os dados do professor."
        : "Preencha os dados para criar o perfil de professor.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="gap-3 text-left">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#FDF2F4] text-[#E73959]">
              <UserRound className="size-5" />
            </span>
            <div className="space-y-1">
              <DialogTitle className="text-lg font-bold text-[#1C1C1C]">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm text-[#999999]">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoadingDetail ? (
          <p role="status" className="py-6 text-sm text-muted-foreground">
            A carregar os dados do professor...
          </p>
        ) : detail.error && !currentTeacher ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            <span>{detail.error}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {detail.error && currentTeacher && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5 text-sm text-amber-800"
              >
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
                <span>
                  Não foi possível atualizar os detalhes do servidor:{" "}
                  {detail.error}
                </span>
              </div>
            )}

            <section className="space-y-3">
              <SectionTitle icon={UserRound}>Dados pessoais</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Nome completo"
                  id="teacher-nome"
                  className="sm:col-span-2"
                >
                  <IconInput
                    icon={UserRound}
                    id="teacher-nome"
                    value={form.nome}
                    maxLength={150}
                    onChange={(event) => updateField("nome", event.target.value)}
                    disabled={isReadOnly || isPending}
                    required
                  />
                </FormField>

                <FormField label="BI" id="teacher-bi">
                  <IconInput
                    icon={IdCard}
                    id="teacher-bi"
                    value={form.bi}
                    minLength={6}
                    maxLength={16}
                    onChange={(event) => updateField("bi", event.target.value)}
                    disabled={isReadOnly || isPending}
                    required
                  />
                </FormField>

                <FormField label="Telefone" id="teacher-telefone">
                  <IconInput
                    icon={Phone}
                    id="teacher-telefone"
                    type="tel"
                    inputMode="numeric"
                    value={form.telefone}
                    maxLength={9}
                    onChange={(event) =>
                      updateField(
                        "telefone",
                        event.target.value.replace(/\D/g, ""),
                      )
                    }
                    disabled={isReadOnly || isPending}
                    required
                  />
                </FormField>

                <FormField
                  label="Género"
                  id="teacher-genero"
                  className="sm:col-span-2"
                  hint="Selecione o género do professor."
                >
                  <Select
                    value={form.genero}
                    onValueChange={(value) => updateField("genero", value)}
                    disabled={isReadOnly || isPending}
                  >
                    <SelectTrigger
                      id="teacher-genero"
                      icon={<VenusAndMars className="size-4" />}
                      aria-required="true"
                      aria-invalid={generoInvalid || undefined}
                      className={!form.genero ? "text-[#999999]" : undefined}
                    >
                      <SelectValue placeholder="Selecione o género" />
                    </SelectTrigger>
                    <SelectContent sideOffset={4}>
                      <SelectItem value="MASCULINO">Masculino</SelectItem>
                      <SelectItem value="FEMENINO">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </section>

            <section className="space-y-3">
              <SectionTitle icon={ShieldCheck}>Acesso ao sistema</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Nome de utilizador" id="teacher-username">
                  <IconInput
                    icon={AtSign}
                    id="teacher-username"
                    value={form.username}
                    maxLength={50}
                    onChange={(event) =>
                      updateField("username", event.target.value)
                    }
                    disabled={isReadOnly || isPending}
                    autoComplete="username"
                    required
                  />
                </FormField>

                <FormField label="Email" id="teacher-email">
                  <IconInput
                    icon={Mail}
                    id="teacher-email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    disabled={isReadOnly || isPending}
                    autoComplete="email"
                    required
                  />
                </FormField>

                {mode === "create" && (
                  <FormField
                    label="Senha"
                    id="teacher-password"
                    className="sm:col-span-2"
                    hint="Mínimo de 8 caracteres."
                  >
                    <PasswordInput
                      id="teacher-password"
                      autoComplete="new-password"
                      minLength={8}
                      value={form.password}
                      onChange={(event) =>
                        updateField("password", event.target.value)
                      }
                      disabled={isPending}
                      required
                    />
                  </FormField>
                )}
              </div>
            </section>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600"
              >
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isReadOnly ? (
              <DialogFooter className="border-t border-[#F0F0F4] pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Fechar
                </Button>
              </DialogFooter>
            ) : (
              <DialogFooter className="border-t border-[#F0F0F4] pt-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => onOpenChange(false)}
                >
                  <X className="size-4" />
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending}>
                  <Check className="size-4" />
                  {isPending
                    ? "A guardar..."
                    : mode === "create"
                      ? "Cadastrar"
                      : "Guardar"}
                </Button>
              </DialogFooter>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function IconInput({
  icon: Icon,
  className,
  ...props
}: React.ComponentProps<"input"> & { icon: LucideIcon }) {
  return (
    <div className="relative">
      <Icon
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#A098AE]"
      />
      <Input
        {...props}
        className={cn(
          "h-11 w-full rounded-[8px] border-[#DEDEE6] pl-10 text-sm text-[#1C1C1C] placeholder:text-[#999999] focus-visible:border-[#E73959] focus-visible:ring-[3px] focus-visible:ring-[#E73959]/15 disabled:cursor-not-allowed disabled:bg-[#F6F6F6] disabled:opacity-70",
          className,
        )}
      />
    </div>
  );
}

function PasswordInput({
  className,
  disabled,
  ...props
}: React.ComponentProps<"input">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <LockKeyhole
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#A098AE]"
      />
      <Input
        {...props}
        type={visible ? "text" : "password"}
        disabled={disabled}
        className={cn(
          "h-11 w-full rounded-[8px] border-[#DEDEE6] pl-10 pr-11 text-sm text-[#1C1C1C] placeholder:text-[#999999] focus-visible:border-[#E73959] focus-visible:ring-[3px] focus-visible:ring-[#E73959]/15 disabled:cursor-not-allowed disabled:bg-[#F6F6F6] disabled:opacity-70",
          className,
        )}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={visible}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#A098AE] transition-colors hover:text-[#E73959] disabled:cursor-not-allowed"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-[#F0F0F4] pb-2">
      <span className="flex size-6 items-center justify-center rounded-md bg-[#FDF2F4] text-[#E73959]">
        <Icon className="size-3.5" />
      </span>
      <h3 className="text-[13px] font-semibold text-[#2C2E3B]">{children}</h3>
    </div>
  );
}

function FormField({
  label,
  id,
  hint,
  className,
  children,
}: {
  label: string;
  id: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-xs font-semibold text-[#2C2E3B]">
        {label}
      </Label>
      {children}
      {hint && <p className="text-[11px] text-[#A098AE]">{hint}</p>}
    </div>
  );
}

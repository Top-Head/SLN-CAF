"use client";

import {
  CircleAlert,
  FileText,
  UserRound,
  VenusAndMars,
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
import { useStudent } from "@/hooks/students/use-students";
import { cn } from "@/lib/utils";
import {
  createStudent,
  updateStudent,
} from "@/services/students";
import type { Student, StudentGender } from "@/services/students";
import { authStore } from "@/stores/use-auth.store";
import { studentsStore } from "@/stores/use-students.store";

type DialogMode = "create" | "edit" | "view";

type StudentDialogProps = {
  open: boolean;
  mode: DialogMode;
  student: Student | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

type StudentForm = {
  numero_processo: string;
  nome: string;
  genero: StudentGender | "none";
};

const EMPTY_FORM: StudentForm = {
  numero_processo: "",
  nome: "",
  genero: "none",
};

function toForm(student: Student): StudentForm {
  return {
    numero_processo: student.numero_processo,
    nome: student.nome,
    genero: student.genero || "none",
  };
}

export function StudentDialog({
  open,
  mode,
  student,
  onOpenChange,
  onSaved,
}: StudentDialogProps) {
  const [formEdits, setFormEdits] = useState<Partial<StudentForm>>({});
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const studentId = mode === "create" ? null : student?.id;
  const detail = useStudent(studentId, { enabled: open && Boolean(studentId) });
  const currentStudent = detail.student ?? student;
  const form = {
    ...(mode === "create" ? EMPTY_FORM : currentStudent ? toForm(currentStudent) : EMPTY_FORM),
    ...formEdits,
  };
  const isReadOnly = mode === "view";
  const isLoadingDetail =
    mode !== "create" && detail.status === "loading" && !currentStudent;

  function updateField(field: keyof StudentForm, value: string) {
    setFormEdits((current) => ({
      ...current,
      [field]: value,
    }));
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numero_processo = form.numero_processo.trim();
    const nome = form.nome.trim();

    if (!numero_processo || !nome) {
      setError("Preencha o nome e o número de processo.");
      return;
    }

    if (numero_processo.length > 50) {
      setError("O número de processo pode ter no máximo 50 caracteres.");
      return;
    }

    if (nome.length > 150) {
      setError("O nome pode ter no máximo 150 caracteres.");
      return;
    }

    if (mode !== "create" && !studentId) {
      setError("Não foi possível identificar o estudante.");
      return;
    }

    const payload = {
      numero_processo,
      nome,
      ...(form.genero !== "none" ? { genero: form.genero } : {}),
    };

    authStore.hydrate();
    const accessToken = authStore.getState().accessToken ?? undefined;
    setIsPending(true);
    setError(null);

    try {
      if (mode === "create") {
        await createStudent(payload, accessToken);
      } else {
        await updateStudent(studentId!, payload, accessToken);
      }

      studentsStore.clearStudent();
      onOpenChange(false);
      onSaved();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível guardar os dados do estudante.",
      );
    } finally {
      setIsPending(false);
    }
  }

  const title =
    mode === "create"
      ? "Cadastrar estudante"
      : mode === "edit"
        ? "Editar estudante"
        : "Dados do estudante";
  const description =
    mode === "view"
      ? "Consulte as informações registadas para este estudante."
      : mode === "edit"
        ? "Atualize os dados do estudante."
        : "Preencha os dados para cadastrar um novo estudante.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
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
            A carregar os dados do estudante...
          </p>
        ) : detail.error && !currentStudent ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            <span>{detail.error}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {detail.error && currentStudent && (
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
                  id="student-nome"
                  className="sm:col-span-2"
                >
                  <IconInput
                    icon={UserRound}
                    id="student-nome"
                    value={form.nome}
                    maxLength={150}
                    onChange={(event) => updateField("nome", event.target.value)}
                    disabled={isReadOnly || isPending}
                    required
                  />
                </FormField>

                <FormField
                  label="Número de processo"
                  id="student-numero-processo"
                >
                  <IconInput
                    icon={FileText}
                    id="student-numero-processo"
                    value={form.numero_processo}
                    maxLength={50}
                    onChange={(event) =>
                      updateField("numero_processo", event.target.value)
                    }
                    disabled={isReadOnly || isPending}
                    required
                  />
                </FormField>

                <FormField label="Género" id="student-genero">
                  <Select
                    value={form.genero === "none" ? undefined : form.genero}
                    onValueChange={(value) => updateField("genero", value)}
                    disabled={isReadOnly || isPending}
                  >
                    <SelectTrigger
                      id="student-genero"
                      icon={<VenusAndMars className="size-4" />}
                    >
                      <SelectValue placeholder="Não especificado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </section>

            {mode === "view" && currentStudent && (
              <div className="rounded-xl border border-[#F0F0F4] bg-[#FAFAFB] px-4 py-3">
                <p className="text-xs font-medium text-[#999999]">
                  Data de registo
                </p>
                <p className="mt-1 text-sm font-medium text-[#1C1C1C]">
                  {formatCreatedAt(currentStudent.created_at)}
                </p>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600"
              >
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!isReadOnly && (
              <DialogFooter className="gap-2 sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => onOpenChange(false)}
                  className="rounded-lg"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-[#E73959] px-5 text-white hover:bg-[#d52e4e]"
                >
                  {isPending
                    ? "A guardar..."
                    : mode === "create"
                      ? "Cadastrar estudante"
                      : "Guardar alterações"}
                </Button>
              </DialogFooter>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof UserRound;
  children: ReactNode;
}) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1C1C1C]">
      <Icon className="size-4 text-[#E73959]" />
      {children}
    </h3>
  );
}

function FormField({
  label,
  id,
  className,
  children,
}: {
  label: string;
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-xs font-semibold text-[#373737]">
        {label}
      </Label>
      {children}
    </div>
  );
}

function IconInput({
  icon: Icon,
  className,
  ...props
}: React.ComponentProps<typeof Input> & {
  icon: typeof UserRound;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#A098AE]" />
      <Input
        {...props}
        className={cn(
          "h-11 w-full rounded-[8px] border-[#DEDEE6] pl-9 text-sm text-[#1C1C1C] placeholder:text-[#999999] focus-visible:border-[#E73959] focus-visible:ring-[#E73959]/15 disabled:bg-[#F6F6F6]",
          className,
        )}
      />
    </div>
  );
}

function formatCreatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(date);
}

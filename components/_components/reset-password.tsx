"use client";

import { notify } from "@/lib/notify";
import { useConfirmPassword } from "@/hooks/auth/use-auth";
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type PasswordFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  visible: boolean;
  disabled: boolean;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
};

function PasswordField({
  id,
  name,
  label,
  value,
  visible,
  disabled,
  onChange,
  onToggleVisibility,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-semibold">
        {label}
      </Label>

      <div className="relative">
        <Image
          src="/auth/Password.png"
          alt=""
          width={15}
          height={15}
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2"
        />

        <Input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          placeholder="••••••••••••"
          className="h-11 pl-9 pr-10 text-[12px] text-[#999999]"
          value={value}
          autoComplete="new-password"
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          required
        />

        <button
          type="button"
          onClick={onToggleVisibility}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={visible}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-400 hover:text-zinc-600"
        >
          <Image src="/auth/Eyes.png" alt="" width={15} height={15} />
        </button>
      </div>
    </div>
  );
}

type ResetPasswordProps = {
  token: string;
};

export default function ResetPassword({ token }: ResetPasswordProps) {
  const { confirmPassword, isPending, error, resetError } = useConfirmPassword();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [passwordsMatchError, setPasswordsMatchError] = useState<string | null>(
    null,
  );
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handlePasswordChange(
    setter: (value: string) => void,
    value: string,
  ) {
    setter(value);
    setPasswordsMatchError(null);
    resetError();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordsMatchError(null);

    if (!token) {
      setPasswordsMatchError(
        "O link de redefinição está incompleto. Solicite um novo email.",
      );
      return;
    }

    if (newPassword !== confirmPasswordValue) {
      setPasswordsMatchError("As senhas informadas não coincidem.");
      return;
    }

    const result = await confirmPassword({
      token,
      newPassword,
      confirmPassword: confirmPasswordValue,
    });

    if (result.ok) {
      setIsSuccess(true);
      notify.success("Palavra-passe redefinida. Já pode iniciar sessão.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-100 space-y-6">
      <div className="space-y-2">
        <h1 className="text-[28px] font-black">Redefinir a senha</h1>
        <p className="text-[14px] text-[#999999]">
          Crie uma nova senha para sua conta.
        </p>
      </div>

      <div className="mt-[64px] flex flex-col gap-5">
        <PasswordField
          id="password"
          name="newPassword"
          label="Nova senha"
          value={newPassword}
          visible={showNewPassword}
          disabled={isPending || isSuccess}
          onChange={(value) => handlePasswordChange(setNewPassword, value)}
          onToggleVisibility={() => setShowNewPassword((visible) => !visible)}
        />
        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmar a senha"
          value={confirmPasswordValue}
          visible={showConfirmPassword}
          disabled={isPending || isSuccess}
          onChange={(value) =>
            handlePasswordChange(setConfirmPasswordValue, value)
          }
          onToggleVisibility={() =>
            setShowConfirmPassword((visible) => !visible)
          }
        />
      </div>

      {(error || passwordsMatchError) && (
        <p
          role="alert"
          className="rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-600"
        >
          {passwordsMatchError ?? error}
        </p>
      )}

      {isSuccess ? (
        <div role="status" className="space-y-4">
          <p className="text-sm text-green-700">
            Sua senha foi redefinida com sucesso.
          </p>
          <Link
            href="/login"
            className="inline-block font-semibold text-[#E73959] hover:underline"
          >
            Voltar para entrar
          </Link>
        </div>
      ) : (
        <Button
          size="lg"
          variant="ghost"
          type="submit"
          disabled={isPending}
          className="mt-[22px] cursor-pointer font-semibold text-white"
        >
          {isPending ? "A redefinir..." : "Redefinir senha"}
        </Button>
      )}
    </form>
  );
}
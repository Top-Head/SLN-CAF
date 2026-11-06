"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/auth/use-auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const ROLE_HOME: Record<string, string> = {
  admin: "/dashboard",
  administrador: "/dashboard",
  teacher: "/teacher/dashboard",
  professor: "/teacher/dashboard",
  director: "/diretor-de-turma/dashboard",
  diretor: "/diretor-de-turma/dashboard",
  "diretor-de-turma": "/diretor-de-turma/dashboard",
  diretor_de_turma: "/diretor-de-turma/dashboard",
};

function getHomePath(role?: string) {
  if (!role) return "/dashboard";

  return ROLE_HOME[role.trim().toLowerCase()] ?? "/dashboard";
}

export function LoginForm() {
  const router = useRouter();
  const { login, isPending, error, resetError } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await login({
      email: email.trim(),
      password,
      remember,
    });

    if (!result.ok) return;

    router.replace(getHomePath(result.data.user.role));
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-100 space-y-6">
      <h1 className="text-[28px] font-bold text-[#1C1C1C]">Entrar no sistema</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-semibold">
            Seu email
          </Label>
          <div className="relative">
            <Image
              src="/auth/Email.png"
              alt=""
              width={15}
              height={15}
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2"
            />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Informe o seu email"
              className="h-11 pl-9 text-[12px] text-[#999999]"
              value={email}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "login-error" : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                resetError();
              }}
              autoComplete="email"
              disabled={isPending}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs font-semibold">
            Sua senha
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
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="h-11 pl-9 pr-10 text-[12px] text-[#999999]"
              value={password}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "login-error" : undefined}
              onChange={(event) => {
                setPassword(event.target.value);
                resetError();
              }}
              autoComplete="current-password"
              disabled={isPending}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-400 hover:text-zinc-600"
            >
              <Image src="/auth/Eyes.png" alt="" width={15} height={15} />
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 px-1 text-[14px] text-[#999999]">
          <input
            type="checkbox"
            name="remember"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            disabled={isPending}
            className="size-4 rounded border-zinc-300 accent-brand"
          />
          Manter logado por 15 dias
        </label>

        {error && (
          <p
            id="login-error"
            role="alert"
            aria-live="polite"
            className="rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-600"
          >
            {error}
          </p>
        )}
      </div>

      <Button
        variant="ghost"
        size="lg"
        type="submit"
        disabled={isPending}
        className="mt-[22px] cursor-pointer text-[14px] font-bold text-white"
      >
        {isPending ? "A entrar..." : "Entrar no sistema"}
      </Button>

      <div className="space-y-3 text-center text-[16px] text-[#999999]">
        <p>
          Ainda lembra da tua senha?{" "}
          <Link
            href="/forgot-password"
            className="font-semibold text-[#E73959] hover:underline"
          >
            Recuperar senha
          </Link>
        </p>
        <p>
          É encarregado de educação?{" "}
          <Link
            href="/boletim"
            className="font-semibold text-[#E73959] hover:underline"
          >
            Consultar boletim
          </Link>
        </p>
        {/* <p>
          Ainda não tem conta?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#E73959] hover:underline"
          >
            Criar conta
          </Link>
        </p> */}
      </div>
    </form>
  );
}

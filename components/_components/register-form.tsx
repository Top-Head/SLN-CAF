"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/auth/use-auth";

const DEFAULT_FORM = {
  username: "",
  email: "",
  password: "",
};

export function RegisterForm() {
  const router = useRouter();
  const { register, isPending, error, resetError } = useRegister();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const updateField = (field: keyof typeof DEFAULT_FORM, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    resetError();
    setClientError(null);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const username = form.username.trim();
    const email = form.email.trim();
    const password = form.password;

    if (!username || !email || !password) {
      setClientError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setClientError("Informe um email válido.");
      return;
    }

    if (password.length < 8) {
      setClientError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    const result = await register({ username, email, password });

    if (!result.ok) return;

    router.replace("/login");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[480px] space-y-6">
      <div className="space-y-2">
        <h1 className="text-[28px] font-black text-[#1C1C1C]">Criar conta</h1>
        <p className="text-[14px] text-[#999999]">
          Registe-se para aceder ao sistema de gestão académica.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username" className="text-xs font-semibold">
          Nome de utilizador
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="Seu nome de utilizador"
          className="h-11 w-full text-[12px] text-[#999999]"
          value={form.username}
          onChange={(event) => updateField("username", event.target.value)}
          autoComplete="username"
          disabled={isPending}
          required
        />
      </div>

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
            className="h-11 w-full pl-9 text-[12px] text-[#999999]"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
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
            className="h-11 w-full pl-9 pr-10 text-[12px] text-[#999999]"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            autoComplete="new-password"
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

      {(clientError || error) && (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-600"
        >
          {clientError ?? error}
        </p>
      )}

      <Button
        type="submit"
        variant="ghost"
        size="lg"
        disabled={isPending}
        className="mt-[12px] w-full cursor-pointer text-[14px] font-bold text-white"
      >
        {isPending ? "A criar conta..." : "Criar conta"}
      </Button>

      <p className="text-center text-[16px] text-[#999999]">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#E73959] hover:underline"
        >
          Entrar no sistema
        </Link>
      </p>
    </form>
  );
}

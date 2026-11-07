"use client";

import { notify } from "@/lib/notify";
import { useRequestPasswordReset } from "@/hooks/auth/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { requestPasswordReset, isPending, error, resetError } =
    useRequestPasswordReset();
  const [email, setEmail] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await requestPasswordReset({ email: email.trim() });

    if (result.ok) {
      notify.success(`Enviámos o link de redefinição para ${email.trim()}.`);
      router.push("/sending-email");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-100 space-y-6">
      <div className="space-y-2">
        <h1 className="text-[28px] font-black text-[#1C1C1C]">
          Recuperar senha
        </h1>
        <p className="text-[14px] text-[#999999]">
          Informe seu email para receber um link de redefinição de senha.
        </p>
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
            className="h-11 pl-9 text-[12px] text-[#999999]"
            value={email}
            autoComplete="email"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "password-reset-error" : undefined}
            onChange={(event) => {
              setEmail(event.target.value);
              resetError();
            }}
            disabled={isPending}
            required
          />
        </div>
      </div>

      {error && (
        <p
          id="password-reset-error"
          role="alert"
          className="rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-600"
        >
          {error}
        </p>
      )}

      <Button
        size="lg"
        variant="ghost"
        type="submit"
        disabled={isPending}
        className="mt-[22px] cursor-pointer text-[14px] font-bold text-white"
      >
        {isPending ? "A enviar..." : "Continuar"}
      </Button>
    </form>
  );
}
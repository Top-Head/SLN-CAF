"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function LoginForm() {
  return (
    <form  className="w-full max-w-100 space-y-6">
      <h1 className="text-[28px] font-bold text-[#1C1C1C]">Entrar no sistema</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-semibold">
            Seu email
          </Label>
          <div className="relative">
            <img src="/auth/Email.png" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Informe o seu email"
              className="h-11 pl-9 text-[12px] text-[#999999]"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs font-semibold">
            Sua senha
          </Label>
          <div className="relative">
            <img src="/auth/Password.png" alt="" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <Input
              id="password"
              name="password"
              
              placeholder="••••••••••••"
              className="h-11 pl-9 pr-10 text-[12px] text-[#999999]"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
            <img src="/auth/Eyes.png" alt="" />
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 text-[14px] text-[#999999] px-1">
          <input
            type="checkbox"
            name="remember"
            className="size-4 rounded border-zinc-300 accent-brand"
          />
          Manter logado por 15 dias
        </label>
      </div>

      <Button
        variant="ghost"
        size="lg"
        type="submit"
        className="text-[14px] font-bold text-white mt-[22px] cursor-pointer"
      >
        Entrar no sistema
      </Button>

      <p className="text-center text-[16px] text-[#999999]">
        Ainda lembra da tua senha?{" "}
        <Link href="/forgot-password" className="font-semibold text-[#E73959] hover:underline">
          Recuperar senha
        </Link>
      </p>
    </form>
  );
}
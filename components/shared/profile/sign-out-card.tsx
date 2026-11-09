"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { notify } from "@/lib/notify";
import { authStore } from "@/stores/use-auth.store";

export function SignOutCard() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    try {
      // POST /api/auth/logout/ (revoga o refresh token) e limpa a sessão local,
      // mesmo que o pedido à API falhe.
      await authStore.logout();
      notify.success("Sessão terminada.");
    } catch {
      // A sessão local já foi limpa pelo `finally` de authStore.logout.
      notify.warning(
        "Sessão terminada neste dispositivo, mas o servidor não confirmou o pedido.",
      );
    } finally {
      router.replace("/login");
    }
  }

  return (
    <section className="flex flex-wrap items-center gap-3.5 rounded-lg border bg-card px-6 py-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent">
        <LogOut className="size-[18px] text-primary" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <h2 className="font-sans text-[13px] font-semibold">Terminar sessão</h2>
        <p className="text-xs text-muted-foreground">
          Sai da sua conta neste dispositivo. Vai precisar de iniciar sessão novamente.
        </p>
      </div>
      {/* Sem endpoint na API para terminar todas as sessões: mantém-se como estava. */}
      <Link
        href="/login"
        className="flex h-[34px] items-center rounded-md border bg-card px-3.5 text-[13px] font-medium transition-colors hover:bg-muted"
      >
        Terminar em todos os dispositivos
      </Link>
      <button
        type="button"
        onClick={() => void handleSignOut()}
        disabled={pending}
        className="flex h-[34px] items-center gap-2 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {pending ? "A terminar..." : "Terminar sessão"}
        <Image src="/icons/sign-out-white.svg" alt="" width={16} height={16} />
      </button>
    </section>
  );
}

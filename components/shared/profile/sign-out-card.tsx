import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function SignOutCard() {
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
      <Link
        href="/login"
        className="flex h-[34px] items-center rounded-md border bg-card px-3.5 text-[13px] font-medium transition-colors hover:bg-muted"
      >
        Terminar em todos os dispositivos
      </Link>
      <Link
        href="/login"
        className="flex h-[34px] items-center gap-2 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Terminar sessão
        <Image src="/icons/sign-out-white.svg" alt="" width={16} height={16} />
      </Link>
    </section>
  );
}

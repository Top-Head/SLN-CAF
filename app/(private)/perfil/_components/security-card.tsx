"use client";

import { Lock, Monitor, ShieldCheck, Smartphone, type LucideIcon } from "lucide-react";
import { useId, useState } from "react";

import { StatusBadge } from "@/components/shared/status-badge";
import { ToggleSwitch } from "@/components/shared/toggle-switch";

import type { ActiveSession, SECURITY } from "../_lib/mock-data";

function SecurityItem({
  icon: Icon,
  title,
  description,
  titleId,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  titleId?: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex size-[38px] shrink-0 items-center justify-center rounded-lg bg-[#f4f4f6]">
        <Icon className="size-[18px] text-neutral" strokeWidth={1.5} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <span id={titleId} className="text-[13px] font-medium">
          {title}
        </span>
        <span className="truncate text-xs text-muted-foreground">{description}</span>
      </div>
      {children}
    </li>
  );
}

type SecurityCardProps = {
  security: typeof SECURITY;
  sessions: ActiveSession[];
};

export function SecurityCard({ security, sessions: initialSessions }: SecurityCardProps) {
  const twoFactorId = useId();
  const [twoFactor, setTwoFactor] = useState(security.twoFactorEnabled);
  const [sessions, setSessions] = useState(initialSessions);

  return (
    <section className="flex flex-col gap-4 rounded-lg border bg-card p-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-sans text-[15px] font-semibold">Segurança</h2>
        <p className="text-xs text-muted-foreground">Proteja o acesso à sua conta</p>
      </div>

      <ul className="flex flex-col gap-4">
        <SecurityItem icon={Lock} title="Palavra-passe" description={security.passwordChanged}>
          <button
            type="button"
            className="h-[34px] shrink-0 rounded-md border bg-card px-3.5 text-[13px] font-medium transition-colors hover:bg-muted"
          >
            Alterar
          </button>
        </SecurityItem>
        <hr className="border-border" />
        <SecurityItem
          icon={ShieldCheck}
          title="Verificação em dois passos"
          titleId={twoFactorId}
          description={
            twoFactor
              ? `Código por SMS para ${security.twoFactorPhone}`
              : "Desactivada"
          }
        >
          <ToggleSwitch
            aria-labelledby={twoFactorId}
            checked={twoFactor}
            onCheckedChange={setTwoFactor}
          />
        </SecurityItem>
        <hr className="border-border" />
      </ul>

      <h3 className="text-[11px] font-medium text-muted-foreground uppercase">Sessões activas</h3>
      <ul className="flex flex-col gap-4">
        {sessions.map((session) => (
          <SecurityItem
            key={session.id}
            icon={session.kind === "mobile" ? Smartphone : Monitor}
            title={session.device}
            description={session.detail}
          >
            {session.current ? (
              <StatusBadge tone="positive">Este dispositivo</StatusBadge>
            ) : (
              <button
                type="button"
                onClick={() => setSessions((all) => all.filter((s) => s.id !== session.id))}
                className="shrink-0 text-[13px] font-medium text-primary hover:underline"
              >
                Terminar
              </button>
            )}
          </SecurityItem>
        ))}
      </ul>
    </section>
  );
}

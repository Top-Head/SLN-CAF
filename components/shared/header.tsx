"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

import { getPageTitle, roleFromPath, type Role } from "@/constants/navigation";
import type { User } from "@/types/user";

type HeaderProps = {
  user: User;
  hasNotifications?: boolean;
  role?: Role;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : ""))
    .toUpperCase();
}

export function Header({ user, hasNotifications, role }: HeaderProps) {
  const pathname = usePathname();
  const inferredRole: Role = role ?? roleFromPath(pathname);
  const title = getPageTitle(pathname, inferredRole);

  return (
    <header className="sticky top-0 z-10 flex h-20 shrink-0 items-center justify-between gap-6 bg-background px-6 lg:px-12">
      <h1 className="truncate font-sans text-2xl font-bold">{title}</h1>

      <div className="flex shrink-0 items-center gap-6">
        <button
          type="button"
          aria-label="Notificações"
          className="relative text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bell className="size-6" strokeWidth={2} />
          {hasNotifications && (
            <span className="absolute top-0.5 right-0.5 size-2 rounded-full bg-primary ring-2 ring-background" />
          )}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex size-9.5 items-center justify-center rounded-full border-2 border-gray-100 font-semibold text-[16px] text-muted-foreground">
            {getInitials(user.name)}
          </div>
          <div className="hidden flex-col gap-0.5 sm:flex">
            <span className="text-[16px] font-bold text-[#232631]">
              {user.name}
            </span>
            <span className="text-[12px] font-normal text-muted-foreground">
              {user.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

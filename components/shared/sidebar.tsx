"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAVIGATION, isActiveRoute } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[290px] shrink-0 flex-col overflow-y-auto bg-sidebar [scrollbar-width:none] px-[34px] py-7 lg:flex">
      <div className="flex items-center gap-3">
        <Image src="/logo.svg" alt="" width={38} height={38} priority />
        <div className="flex flex-col gap-1">
          <span className="text-xl font-bold text-white">Easy Meal</span>
          <span className="text-xs text-muted-foreground">
            Lançamento de Notas
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-[22px] pt-[68px]">
        {NAVIGATION.map((group) => (
          <div key={group.label} className="flex flex-col gap-2">
            <span className="text-[10px] font-medium tracking-[0.8px] text-sidebar-muted uppercase">
              {group.label}
            </span>
            <ul className="flex flex-col">
              {group.items.map(({ title, href, icon: Icon }) => {
                const active = isActiveRoute(pathname, href);

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-11 items-center gap-3 rounded-sm px-4 text-[13px] whitespace-nowrap transition-colors",
                        active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      {title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <span className="mt-auto pt-10 text-[10px] text-sidebar-muted">
        Easy Meal · Gestão escolar
      </span>
    </aside>
  );
}

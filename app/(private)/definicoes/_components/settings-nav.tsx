"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { SECTIONS } from "../_lib/settings";

/** Menu das secções, fixo ao fazer scroll, com a secção visível realçada. */
export function SettingsNav() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const elements = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Conta como activa a secção que ocupa a parte de cima do ecrã, abaixo do header.
      { rootMargin: "-96px 0px -60% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Secções das definições"
      className="sticky top-24 hidden w-[220px] shrink-0 self-start rounded-lg border bg-card p-2 lg:block"
    >
      <ul className="flex flex-col gap-0.5">
        {SECTIONS.map(({ id, label, icon: Icon }) => {
          const current = id === active;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={current ? "true" : undefined}
                onClick={() => setActive(id)}
                className={cn(
                  "flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[13px] transition-colors",
                  current ? "bg-accent font-semibold text-primary" : "text-neutral hover:bg-muted",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

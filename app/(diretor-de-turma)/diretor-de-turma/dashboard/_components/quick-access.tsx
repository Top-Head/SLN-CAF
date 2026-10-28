import { ChartColumn, ChevronRight, FileText, type LucideIcon } from "lucide-react";
import Link from "next/link";

const LINKS: { href: string; title: string; description: string; icon: LucideIcon }[] = [
  {
    href: "/diretor-de-turma/pauta-trimestral",
    title: "Pauta trimestral",
    description: "Consultar e exportar em PDF",
    icon: FileText,
  },
  {
    href: "/diretor-de-turma/estatistica-da-turma",
    title: "Estatística da turma",
    description: "Positivas, negativas e médias",
    icon: ChartColumn,
  },
];

export function QuickAccess() {
  return (
    <section className="flex flex-col gap-2.5 rounded-lg border bg-card px-5 py-[18px]">
      <h2 className="font-sans text-[15px] font-semibold text-foreground">Acesso rápido</h2>
      {LINKS.map(({ href, title, description, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-3 rounded-lg border border-catalog-border px-3 py-2.5 transition-colors hover:bg-muted"
        >
          <span className="flex size-[34px] shrink-0 items-center justify-center rounded-lg bg-grade-fail-soft text-primary">
            <Icon className="size-4" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-xs font-semibold text-catalog-text">{title}</span>
            <span className="text-[10px] text-catalog-faint">{description}</span>
          </span>
          <ChevronRight className="size-4 text-catalog-muted" />
        </Link>
      ))}
    </section>
  );
}

import {
  BookOpen,
  CalendarClock,
  ChartNoAxesColumn,
  CircleUserRound,
  FileText,
  GraduationCap,
  History,
  KeyRound,
  LayoutDashboard,
  Palette,
  Pencil,
  School,
  Settings,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const NAVIGATION: NavGroup[] = [
  {
    label: "Geral",
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Gestão",
    items: [
      { title: "Professores", href: "/professores", icon: UsersRound },
      { title: "Estudantes", href: "/estudantes", icon: GraduationCap },
      { title: "Disciplinas", href: "/disciplinas", icon: BookOpen },
      { title: "Turmas", href: "/turmas", icon: School },
    ],
  },
  {
    label: "Avaliação",
    items: [
      {
        title: "Lançamento de notas",
        href: "/lancamento-de-notas",
        icon: Pencil,
      },
      { title: "Pautas", href: "/pautas", icon: FileText },
      { title: "Estatísticas", href: "/estatisticas", icon: ChartNoAxesColumn },
    ],
  },
  {
    label: "Controlo",
    items: [
      {
        title: "Períodos de lançamento",
        href: "/periodos-de-lancamento",
        icon: CalendarClock,
      },
      { title: "Códigos de acesso", href: "/codigos-de-acesso", icon: KeyRound },
      {
        title: "Histórico de alterações",
        href: "/historico-de-alteracoes",
        icon: History,
      },
    ],
  },
  {
    label: "Conta",
    items: [
      { title: "Definições", href: "/definicoes", icon: Settings },
      { title: "Perfil", href: "/perfil", icon: CircleUserRound },
    ],
  },
];

export function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getPageTitle(pathname: string) {
  for (const group of NAVIGATION) {
    const item = group.items.find(({ href }) => isActiveRoute(pathname, href));
    if (item) return item.title;
  }
  return "";
}

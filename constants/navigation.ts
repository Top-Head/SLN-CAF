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
  Pencil,
  School,
  Settings,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type Role = "admin" | "teacher";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

// Menu completo (admin) — mantido exactamente como estava
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

// Menu simplificado do professor
export const TEACHER_NAVIGATION: NavGroup[] = [
  {
    label: "Geral",
    items: [
      { title: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Ensino",
    items: [
      { title: "Minhas turmas", href: "/teacher/turmas", icon: School },
      {
        title: "Lançamento de notas",
        href: "/teacher/lancamento-de-notas",
        icon: Pencil,
      },
      { title: "Mini-pautas", href: "/teacher/mini-pautas", icon: FileText },
    ],
  },
  {
    label: "Conta",
    items: [
      { title: "Perfil", href: "/teacher/perfil", icon: CircleUserRound },
    ],
  },
  
];

export function getNavigation(role: Role = "admin"): NavGroup[] {
  return role === "teacher" ? TEACHER_NAVIGATION : NAVIGATION;
}

export function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getPageTitle(pathname: string, role: Role = "admin") {
  for (const group of getNavigation(role)) {
    const item = group.items.find(({ href }) => isActiveRoute(pathname, href));
    if (item) return item.title;
  }
  return "";
}
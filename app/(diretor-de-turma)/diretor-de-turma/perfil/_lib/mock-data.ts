import type { ActiveSession, Profile, ProfileField, SecuritySettings } from "@/types/profile";

export const PROFILE: Profile = {
  displayName: "Paulo Sanguli",
  role: "Director de turma · 12.ª IB",
  location: "Luanda, Angola",
  phone: "+244 923 418 760",
  email: "paulo.sanguli@caf.ao",
  avatar: "/images/profile-avatar.png",
};

export const PERSONAL_INFO: ProfileField[] = [
  { label: "Nome completo", value: "Paulo Manuel Sanguli" },
  { label: "N.º do Bilhete de Identidade", value: "004512873LA039" },
  { label: "Data de nascimento", value: "2 de Maio de 1984" },
  { label: "Género", value: "Masculino" },
  { label: "Turma", value: "12.ª IB · Ciências Físicas e Biológicas" },
  { label: "Estudantes", value: "24 (13 F · 11 M)" },
  { label: "Instituição", value: "Colégio Árvore da Felicidade" },
  { label: "Membro desde", value: "Setembro de 2019" },
];

export const SECURITY: SecuritySettings = {
  passwordChanged: "Alterada há 3 meses",
  twoFactorPhone: "+244 923 ··· 760",
  twoFactorEnabled: true,
};

export const SESSIONS: ActiveSession[] = [
  { id: "chrome-win", device: "Chrome · Windows 11", kind: "desktop", detail: "Luanda, Angola · activa agora", current: true },
  { id: "safari-iphone", device: "Safari · iPhone 14", kind: "mobile", detail: "Luanda, Angola · há 2 dias", current: false },
];

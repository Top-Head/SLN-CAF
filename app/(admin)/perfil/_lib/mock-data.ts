import type { ActiveSession, Profile, ProfileField, SecuritySettings } from "@/types/profile";

export const PROFILE: Profile = {
  displayName: "Edilson Capo",
  role: "Administrador · Direcção pedagógica",
  location: "Luanda, Angola",
  phone: "+244 941 019 521",
  email: "edilsoncapo@gmail.com",
  avatar: "/images/profile-avatar.png",
};

export const PERSONAL_INFO: ProfileField[] = [
  { label: "Nome completo", value: "Edilson Manuel Capa" },
  { label: "N.º do Bilhete de Identidade", value: "007845621LA042" },
  { label: "Data de nascimento", value: "14 de Março de 1988" },
  { label: "Género", value: "Masculino" },
  { label: "Cargo", value: "Administrador do sistema" },
  { label: "Morada", value: "Talatona, Luanda" },
  { label: "Instituição", value: "Colégio Árvore da Felicidade" },
  { label: "Membro desde", value: "Janeiro de 2024" },
];

export const SECURITY: SecuritySettings = {
  passwordChanged: "Alterada há 3 meses",
  twoFactorPhone: "+244 941 ··· 521",
  twoFactorEnabled: true,
};

export const SESSIONS: ActiveSession[] = [
  { id: "chrome-win", device: "Chrome · Windows 11", kind: "desktop", detail: "Luanda, Angola · activa agora", current: true },
  { id: "safari-iphone", device: "Safari · iPhone 14", kind: "mobile", detail: "Luanda, Angola · há 2 dias", current: false },
];

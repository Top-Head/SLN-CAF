import {
  Bell,
  Building2,
  Calendar,
  CircleCheck,
  Database,
  Hash,
  History,
  KeyRound,
  Layers,
  Lock,
  Sigma,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type RoundingRule = "half-up" | "down" | "up";

export type Settings = {
  identity: {
    logo: string | null;
    systemName: string;
    systemSubtitle: string;
    institution: string;
    acronym: string;
    email: string;
    phone: string;
    address: string;
    color: string;
  };
  year: { active: string; trimester: string };
  formulas: { mfdWeight: number; examWeight: number };
  rounding: { rule: RoundingRule; scope: string; showRaw: boolean };
  approval: { allowAppeal: boolean };
  security: { twoFactor: boolean; inactivity: string; minPassword: number; maxAttempts: number };
  codes: {
    format: string;
    charset: string;
    validity: string;
    regenerateInvalidates: boolean;
    sameCode: boolean;
    allowPdf: boolean;
  };
  notifications: {
    channels: string[];
    reminder: string;
    pautaComplete: boolean;
    lateChanges: boolean;
    weeklySummary: boolean;
  };
  data: {
    formats: string[];
    officialHeader: boolean;
    signature: boolean;
    frequency: string;
    retention: string;
  };
  audit: { requireReason: boolean; retention: string };
};

export type SettingsKey = keyof Settings;

export const DEFAULT_SETTINGS: Settings = {
  identity: {
    logo: null,
    systemName: "Easy Meal",
    systemSubtitle: "Lançamento de Notas",
    institution: "Colégio Árvore da Felicidade",
    acronym: "CAF",
    email: "secretaria@arvoredafelicidade.ao",
    phone: "+244 923 000 111",
    address: "Rua da Missão, n.º 45 · Talatona, Luanda",
    color: "#E73959",
  },
  year: { active: "2026/2027", trimester: "1.º trimestre" },
  formulas: { mfdWeight: 40, examWeight: 60 },
  rounding: { rule: "half-up", scope: "Todas as médias calculadas (MT, MFD, MF)", showRaw: false },
  approval: { allowAppeal: true },
  security: { twoFactor: true, inactivity: "30 minutos", minPassword: 8, maxAttempts: 5 },
  codes: {
    format: "XXXX-XXXX · 8 caracteres",
    charset: "Maiúsculas e números, sem 0, O, 1 e I",
    validity: "Até ao fim do trimestre",
    regenerateInvalidates: true,
    sameCode: true,
    allowPdf: true,
  },
  notifications: {
    channels: ["email", "system"],
    reminder: "3 dias antes",
    pautaComplete: true,
    lateChanges: true,
    weeklySummary: false,
  },
  data: {
    formats: ["pdf", "xlsx"],
    officialHeader: true,
    signature: true,
    frequency: "Diária às 02:00",
    retention: "30 dias",
  },
  audit: { requireReason: true, retention: "5 anos" },
};

export type SettingsSectionMeta = { id: string; label: string; icon: LucideIcon; key?: SettingsKey };

/** Menu lateral: a ordem e os ids das secções da página. */
export const SECTIONS: SettingsSectionMeta[] = [
  { id: "identidade", label: "Identidade da instituição", icon: Building2, key: "identity" },
  { id: "ano-lectivo", label: "Ano lectivo", icon: Calendar, key: "year" },
  { id: "classes", label: "Classes e escalas", icon: Layers },
  { id: "formulas", label: "Fórmulas de cálculo", icon: Sigma, key: "formulas" },
  { id: "arredondamento", label: "Arredondamento", icon: Hash, key: "rounding" },
  { id: "aprovacao", label: "Regras de aprovação", icon: CircleCheck, key: "approval" },
  { id: "utilizadores", label: "Utilizadores e permissões", icon: UsersRound },
  { id: "seguranca", label: "Segurança", icon: Lock, key: "security" },
  { id: "codigos", label: "Códigos de acesso", icon: KeyRound, key: "codes" },
  { id: "notificacoes", label: "Notificações", icon: Bell, key: "notifications" },
  { id: "dados", label: "Dados e cópias de segurança", icon: Database, key: "data" },
  { id: "auditoria", label: "Auditoria e versões", icon: History, key: "audit" },
];

export const BRAND_COLORS = ["#E73959", "#2666D9", "#119E07", "#CC7805", "#7C3AED", "#1C1C1C"];

export const OPTIONS = {
  years: ["2026/2027", "2025/2026"],
  trimesters: ["1.º trimestre", "2.º trimestre", "3.º trimestre"],
  roundingRules: [
    { value: "half-up", label: "Meio para cima — décimas ≥ 0,5 sobem" },
    { value: "down", label: "Sempre para baixo — corta as décimas" },
    { value: "up", label: "Sempre para cima — qualquer décima sobe" },
  ] as { value: RoundingRule; label: string }[],
  roundingScopes: ["Todas as médias calculadas (MT, MFD, MF)", "Só a média final (MF)"],
  inactivity: ["15 minutos", "30 minutos", "60 minutos", "Nunca"],
  codeFormats: ["XXXX-XXXX · 8 caracteres", "XXX-XXX · 6 caracteres"],
  codeCharsets: ["Maiúsculas e números, sem 0, O, 1 e I", "Só números"],
  codeValidity: ["Até ao fim do trimestre", "Até ao fim do ano lectivo", "30 dias"],
  reminders: ["1 dia antes", "3 dias antes", "7 dias antes"],
  backupFrequency: ["Diária às 02:00", "Semanal ao domingo", "Mensal"],
  backupRetention: ["7 dias", "30 dias", "90 dias"],
  auditRetention: ["1 ano", "5 anos", "10 anos"],
};

export const CHANNELS = [
  { value: "email", label: "Email" },
  { value: "system", label: "No sistema" },
  { value: "sms", label: "SMS" },
];

export const EXPORT_FORMATS = [
  { value: "pdf", label: "PDF" },
  { value: "xlsx", label: "Excel (.xlsx)" },
  { value: "csv", label: "CSV" },
];

export const TRIMESTER_DATES = [
  { name: "1.º trimestre", start: "15/09/2026", end: "12/12/2026", status: "current" },
  { name: "2.º trimestre", start: "05/01/2027", end: "27/03/2027", status: "upcoming" },
  { name: "3.º trimestre", start: "12/04/2027", end: "18/06/2027", status: "upcoming" },
] as const;

export const GRADE_SCALES = [
  { grades: "1.ª – 5.ª", type: "Ensino primário", scale: "0 – 10", pass: 5, exam: false },
  { grades: "6.ª", type: "Classe de exame", scale: "0 – 10", pass: 5, exam: true },
  { grades: "7.ª – 8.ª", type: "Transição", scale: "0 – 20", pass: 10, exam: false },
  { grades: "9.ª", type: "Classe de exame", scale: "0 – 20", pass: 10, exam: true },
  { grades: "10.ª", type: "Transição", scale: "0 – 20", pass: 10, exam: false },
  { grades: "11.ª", type: "Continuidade", scale: "0 – 20", pass: 10, exam: false },
  { grades: "12.ª", type: "Fim de ciclo", scale: "0 – 20", pass: 10, exam: true },
];

export const FORMULAS = [
  { name: "Nota do trimestre", expression: "MT = (MAC + PP + PT) ÷ 3", scope: "Todas as classes, 1.º e 2.º trimestres" },
  { name: "Média final da disciplina", expression: "MFD = (MT1 + MT2 + MT3) ÷ 3", scope: "Todas as classes" },
  { name: "3.º trimestre em classes de exame", expression: "MT3 = (MAC + PP) ÷ 2", scope: "6.ª e 9.ª classe · sem prova trimestral" },
  { name: "Nota final com exame", expression: "MF = 0,4 × MFD + 0,6 × Exame", scope: "6.ª, 9.ª e 12.ª classe" },
  { name: "Média do exame comum", expression: "MEC = (NEE + NEO) ÷ 2", scope: "Língua Portuguesa (6.ª e 9.ª) e Inglês (9.ª)" },
  { name: "Arredondamento", expression: "Nota = arredondar(MF)", scope: "Aplicado a todas as médias calculadas" },
];

export const FORMULA_TERMS = [
  ["MAC", "Média das avaliações contínuas"],
  ["PP", "Prova do professor"],
  ["PT", "Prova trimestral"],
  ["NEE", "Exame escrito"],
  ["NEO", "Exame oral"],
];

export const APPROVAL_RULES = [
  { grades: "1.ª – 5.ª", rule: "Qualquer negativa na média final reprova", maxNegatives: "0", appeal: "—", confirmed: true },
  { grades: "6.ª", rule: "Sem negativas em nenhuma disciplina; nota final com exame", maxNegatives: "0", appeal: "—", confirmed: true },
  { grades: "7.ª – 8.ª", rule: "Para aprovar, não pode ter negativas", maxNegatives: "0", appeal: "Com 2 negativas", confirmed: true },
  { grades: "9.ª", rule: "Mesma fórmula da 6.ª, com Língua Portuguesa e Inglês pela MEC", maxNegatives: "—", appeal: "—", confirmed: false },
  { grades: "10.ª", rule: "Aprova com, no máximo, duas negativas", maxNegatives: "2", appeal: "Com 2 negativas", confirmed: true },
  { grades: "11.ª", rule: "Negativa da 10.ª que fica positiva transita; se repetir, exame especial na 12.ª decidido pelo subdirector", maxNegatives: "—", appeal: "Exame especial", confirmed: false },
  { grades: "12.ª", rule: "Transita para a 13.ª com no máximo uma negativa, apenas em Projecto Tecnológico", maxNegatives: "1", appeal: "—", confirmed: true },
];

export const ADMINS = [
  { name: "Otávio", email: "otavio@arvoredafelicidade.ao", initials: "OT" },
  { name: "Edilson Capa (você)", email: "edilsoncapo@gmail.com", initials: "EC" },
  { name: "Paulo", email: "paulo@arvoredafelicidade.ao", initials: "PA" },
];

/** true = permitido, false = sem acesso, texto = acesso parcial. */
export type Permission = boolean | string;

export const PERMISSION_ROLES = ["Administrador", "Professor", "Director de turma", "Estudante"];

export const PERMISSIONS: { name: string; access: Permission[] }[] = [
  { name: "Lançar notas (MAC, PP, PT)", access: [true, "Suas disciplinas", false, false] },
  { name: "Ver pautas", access: [true, "Suas disciplinas", "Trimestral, leitura", false] },
  { name: "Alterar pautas", access: [true, false, false, false] },
  { name: "Correcção de provas fora do prazo", access: [true, false, false, false] },
  { name: "Ver estatísticas", access: [true, false, "Da sua turma", false] },
  { name: "Abrir e fechar o sistema e prazos", access: [true, false, false, false] },
  { name: "Gerir professores e gerar códigos", access: [true, false, false, false] },
  { name: "Consultar boletim", access: [true, false, false, "Código próprio"] },
];

/** Arredonda uma nota segundo a regra escolhida (sem casas decimais). */
export function roundGrade(value: number, rule: RoundingRule) {
  if (rule === "down") return Math.floor(value);
  if (rule === "up") return Math.ceil(value);
  return Math.floor(value + 0.5);
}

export const ROUNDING_EXAMPLES = [9.5, 9.4, 14.7, 12.2];

/** Props comuns das secções editáveis: o valor da secção e uma actualização parcial. */
export type SectionProps<K extends SettingsKey> = {
  value: Settings[K];
  onChange: (patch: Partial<Settings[K]>) => void;
};

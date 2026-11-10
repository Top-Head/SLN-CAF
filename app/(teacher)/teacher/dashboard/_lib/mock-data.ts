// Dados de exemplo do que a API ainda não fornece (prazos por disciplina).
// Os cartões, as mini-pautas e a actividade vêm de /api/teacher/dashboard/*.

/** Próximo prazo mostrado no banner (sem endpoint de prazos). */
export const NEXT_DEADLINE_MOCK = {
  subject: "Física · 10.ª IB",
  label: "Física · 08 Dez, 23:59",
  date: "2026-12-08T23:59:00",
};

export const PROXIMOS_PRAZOS_MOCK = [
  {
    id: "1",
    day: "08",
    month: "DEZ",
    title: "Física",
    subtitle: "10.ª IB · 12.ª IB",
    daysLeftText: "2 dias",
    variant: "urgent" as const,
  },
  {
    id: "2",
    day: "12",
    month: "DEZ",
    title: "Matemática",
    subtitle: "12.ª IB · 11.ª IF · 9.ª A",
    daysLeftText: "4 dias",
    variant: "warning" as const,
  },
  {
    id: "3",
    day: "15",
    month: "DEZ",
    title: "Fecho do sistema",
    subtitle: "Fim do lançamento do 1.º trimestre",
    daysLeftText: "7 dias",
    variant: "neutral" as const,
  },
];

// Dados do card "Actividade recente" (caso queiras adicionar também)

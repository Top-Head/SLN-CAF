// components/proximos-prazos-card.tsx

export type PrazoItem = {
  id: string;
  day: string; // ex: "08"
  month: string; // ex: "DEZ"
  title: string; // ex: "Física"
  subtitle: string; // ex: "10.ª IB · 12.ª IB"
  daysLeftText: string; // ex: "2 dias"
  variant: "urgent" | "warning" | "neutral"; // vermelho / amarelo / cinzento
};

type ProximosPrazosCardProps = {
  prazos: PrazoItem[];
};

export function ProximosPrazosCard({ prazos }: ProximosPrazosCardProps) {
  return (
    <div className="w-[330px] h-auto rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
      {/* Cabeçalho */}
      <div className="mb-5 border-b border-neutral-100 pb-4">
        <h3 className="text-base font-bold text-neutral-900 tracking-tight">
          Próximos prazos
        </h3>
        <p className="mt-0.5 text-[11px] text-neutral-400">
          Definidos pela direcção por disciplina
        </p>
      </div>

      {/* Lista de Prazos */}
      <div className="divide-y divide-neutral-100">
        {prazos.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
            {/* Bloco de Data + Conteúdo */}
            <div className="flex items-center gap-3.5">
              {/* Box da Data */}
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-neutral-200/80 bg-neutral-50/50">
                <span className="text-sm font-bold leading-none text-neutral-900">
                  {item.day}
                </span>
                <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                  {item.month}
                </span>
              </div>

              {/* Título e Subtítulo */}
              <div>
                <h4 className="text-sm font-bold text-neutral-900 leading-tight">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs text-neutral-400 font-normal">
                  {item.subtitle}
                </p>
              </div>
            </div>

            {/* Crachá dos Dias Restantes */}
            <Badge variant={item.variant}>{item.daysLeftText}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function Badge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: PrazoItem["variant"];
}) {
  const styles = {
    urgent: "bg-rose-50 text-rose-500",
    warning: "bg-amber-50 text-amber-700",
    neutral: "bg-neutral-100 text-neutral-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
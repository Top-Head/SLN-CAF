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
    <div className="w-[330px] rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* Cabeçalho */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900">Próximos prazos</h3>
        <p className="mt-0.5 text-xs text-gray-400">
          Definidos pela direcção por disciplina
        </p>
      </div>

      {/* Lista de Prazos */}
      <div className="space-y-3">
        {prazos.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-1.5">
            {/* Bloco de Data + Conteúdo */}
            <div className="flex items-center gap-3">
              {/* Box da Data */}
              <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg border border-gray-100 bg-gray-50">
                <span className="text-xs font-bold leading-none text-gray-900">
                  {item.day}
                </span>
                <span className="mt-0.5 text-[9px] font-bold uppercase text-gray-400">
                  {item.month}
                </span>
              </div>

              {/* Título e Subtítulo */}
              <div>
                <h4 className="text-xs font-bold leading-tight text-gray-800">
                  {item.title}
                </h4>
                <p className="mt-0.5 text-[10px] font-normal text-gray-400">
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
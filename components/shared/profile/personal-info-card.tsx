import { Fragment } from "react";

import type { ProfileField } from "@/types/profile";

type PersonalInfoCardProps = {
  fields: ProfileField[];
  description?: string;
};

export function PersonalInfoCard({
  fields,
  description = "Dados usados em pautas, boletins e documentos oficiais",
}: PersonalInfoCardProps) {
  const rows = Array.from({ length: Math.ceil(fields.length / 2) }, (_, i) =>
    fields.slice(i * 2, i * 2 + 2),
  );

  return (
    <section className="flex flex-col gap-5 rounded-lg border bg-card p-6">
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="font-sans text-[15px] font-semibold">Informações pessoais</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <button type="button" className="text-[13px] font-medium text-primary hover:underline">
          Editar
        </button>
      </div>

      <dl className="flex flex-col gap-4">
        {rows.map((row, i) => (
          <Fragment key={row[0].label}>
            {i > 0 && <hr className="border-border" />}
            <div className="grid grid-cols-2 gap-6">
              {row.map(({ label, value }) => (
                <div key={label} className="flex min-w-0 flex-col gap-1">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="truncate text-sm font-medium">{value}</dd>
                </div>
              ))}
            </div>
          </Fragment>
        ))}
      </dl>
    </section>
  );
}

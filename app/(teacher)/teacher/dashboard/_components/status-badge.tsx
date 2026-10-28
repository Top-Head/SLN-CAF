import type { MiniPautaItem } from "../_lib/types";

export function StatusBadge({ estado }: { estado: MiniPautaItem["estado"] }) {
  if (estado === "concluido") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Concluído
      </span>
    );
  }

  if (estado === "em_curso") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Em curso
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
      Por iniciar
    </span>
  );
}

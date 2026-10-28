import { Eye } from "lucide-react";

import { CLASS_INFO } from "../_lib/class-data";

/** Lembra, no fundo da navegação, que o director de turma só consulta. */
export function ReadOnlyCard() {
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border border-[#333] bg-[#262626] p-3.5">
      <p className="flex items-center gap-2 text-xs font-semibold text-white">
        <Eye className="size-3.5 text-primary" />
        Director de turma · {CLASS_INFO.name}
      </p>
      <p className="text-[10px] text-sidebar-foreground">
        Acesso só de leitura: consulta a estatística e as pautas da turma, sem alterar notas.
      </p>
    </div>
  );
}

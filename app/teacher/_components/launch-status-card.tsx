import { cn } from "@/lib/utils";
import { plural } from "@/lib/utils/format-date";

import { LAUNCH_STATUS } from "../lancamento-de-notas/_lib/mock-data";

/** Estado do período de lançamento, no fundo da navegação do professor. */
export function LaunchStatusCard() {
  const { trimester, period, launchedPercent } = LAUNCH_STATUS;
  const open = period.status === "open";

  return (
    <div className="flex w-full flex-col gap-2.5 rounded-lg border border-[#333] bg-[#262626] p-3.5">
      <p className="flex items-center gap-2 text-xs font-semibold text-white">
        <span className={cn("size-2 rounded-full", open ? "bg-[#22c55e]" : "bg-[#6b6b6b]")} />
        {open ? "Lançamento aberto" : "Lançamento encerrado"}
      </p>
      <p className="text-[10px] text-sidebar-foreground">
        {trimester} · {open ? "fecha" : "fechou"} a {period.closesShort}
      </p>
      <div
        role="progressbar"
        aria-label="Notas lançadas"
        aria-valuenow={launchedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1 overflow-hidden rounded-xs bg-[#3a3a3a]"
      >
        <div
          className={cn("h-full rounded-xs", open ? "bg-primary" : "bg-[#6b6b6b]")}
          style={{ width: `${launchedPercent}%` }}
        />
      </div>
      <p className="flex justify-between text-[10px] text-sidebar-foreground">
        <span className="font-medium">{launchedPercent}% das notas lançadas</span>
        <span className={cn("font-semibold", open && "text-primary")}>
          {open ? plural(period.daysLeft, "dia", "dias") : "Bloqueado"}
        </span>
      </p>
    </div>
  );
}

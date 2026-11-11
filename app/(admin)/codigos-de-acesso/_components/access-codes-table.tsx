"use client";

import { Check, Copy, Eye, EyeOff, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { IconActionButton } from "@/components/shared/icon-action-button";
import { ListPagination } from "@/components/shared/list-pagination";
import { ListTableHeader } from "@/components/shared/list-table-header";
import { ListTabs } from "@/components/shared/list-tabs";
import { StatusBadge } from "@/components/shared/status-badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { paginate } from "@/hooks/catalog/use-catalog-state";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils/format-date";
import { matchesSearch } from "@/lib/utils/matches-search";
import type { StudentAccessCode } from "@/services/access-codes";

type View = "all" | "active" | "expired";

const PAGE_SIZE = 8;
const COPIED_MS = 1600;

const COLUMNS = [
  { label: "N.º", className: "w-10" },
  { label: "Estudante" },
  { label: "Código", className: "w-[170px]" },
  { label: "Validade", className: "w-[150px]" },
  { label: "Estado", className: "w-[116px]" },
  { label: "Ações", className: "w-[112px] text-right" },
];

export const isExpired = (row: StudentAccessCode) =>
  new Date(row.expires_at).getTime() <= Date.now();


type AccessCodesTableProps = {
  rows: StudentAccessCode[];
  revealed: Set<string>;
  pendingId: string | null;
  emptyMessage: string;
  onToggleReveal: (studentId: string) => void;
  onRegenerate: (studentId: string) => void;
};

export function AccessCodesTable({
  rows: allRows,
  revealed,
  pendingId,
  emptyMessage,
  onToggleReveal,
  onRegenerate,
}: AccessCodesTableProps) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("all");
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!copiedId) return;
    const timer = setTimeout(() => setCopiedId(null), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copiedId]);

  const copy = async (row: StudentAccessCode) => {
    try {
      await navigator.clipboard.writeText(row.code);
      setCopiedId(row.student.id);
      notify.success(`Código de ${row.student.nome} copiado.`);
    } catch {
      // Sem permissão para a área de transferência: revela para copiar à mão.
      onToggleReveal(row.student.id);
      notify.info("Não foi possível copiar automaticamente. O código foi revelado para copiar à mão.");
    }
  };

  const expiredCount = allRows.filter(isExpired).length;
  const searched = allRows.filter((r) =>
    matchesSearch(query, r.student.nome, r.student.numero_processo),
  );
  const filtered =
    view === "all"
      ? searched
      : searched.filter((r) => (view === "expired") === isExpired(r));
  const rows = paginate(filtered, page, PAGE_SIZE);

  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <ListTabs
        value={view}
        onChange={(next) => {
          setView(next);
          setPage(1);
        }}
        tabs={[
          { key: "all", label: "Todos", count: allRows.length, tone: "primary" },
          {
            key: "active",
            label: "Activos",
            count: allRows.length - expiredCount,
            tone: "positive",
          },
          { key: "expired", label: "Expirados", count: expiredCount, tone: "pending" },
        ]}
      >
        <label className="ml-auto flex h-9 w-[260px] shrink-0 items-center gap-2 rounded-md border bg-card px-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Pesquisar aluno ou processo"
            className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
        </label>
      </ListTabs>

      <div className="px-6 pt-4">
        <Table>
          <ListTableHeader columns={COLUMNS} />
          <TableBody>
            {rows.map((row, i) => {
              const id = row.student.id;
              const expired = isExpired(row);
              const isRevealed = revealed.has(id);

              return (
                <TableRow key={id} className="h-[60px] text-[13px] last:border-0">
                  <TableCell className="pl-4 text-xs text-muted-foreground">
                    {String((page - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell>
                    <span className="flex flex-col gap-0.5">
                      <span className="font-medium">{row.student.nome}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {row.student.numero_processo}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-sm px-2.5 py-[5px] font-mono text-[13px] font-medium tracking-[1px]",
                        isRevealed ? "bg-accent text-primary" : "bg-[#f4f4f6]",
                      )}
                    >
                      {isRevealed ? (
                        row.code
                      ) : (
                        <>
                          <span aria-hidden>••••-••••</span>
                          <span className="sr-only">Código oculto</span>
                        </>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className={cn("text-xs", expired && "text-negative")}>
                    {formatDateTime(row.expires_at)}
                  </TableCell>
                  <TableCell>
                    {expired ? (
                      <StatusBadge tone="pending">Expirado</StatusBadge>
                    ) : (
                      <StatusBadge tone="positive">Activo</StatusBadge>
                    )}
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex justify-end gap-2">
                      <IconActionButton
                        icon={isRevealed ? EyeOff : Eye}
                        label={`${isRevealed ? "Ocultar" : "Ver"} código de ${row.student.nome}`}
                        variant={isRevealed ? "active" : "default"}
                        onClick={() => onToggleReveal(id)}
                      />
                      <div className="relative">
                        <IconActionButton
                          icon={Copy}
                          label={`Copiar código de ${row.student.nome}`}
                          onClick={() => void copy(row)}
                        />
                        {copiedId === id && (
                          <span
                            role="status"
                            className="absolute top-1/2 right-full z-10 mr-2 flex -translate-y-1/2 items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap text-background"
                          >
                            <Check className="size-3.5 text-positive-soft" />
                            Código copiado
                          </span>
                        )}
                      </div>
                      <IconActionButton
                        icon={RefreshCw}
                        label={`Regenerar código de ${row.student.nome}`}
                        variant={expired ? "danger" : "default"}
                        disabled={pendingId !== null}
                        onClick={() => onRegenerate(id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={COLUMNS.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {allRows.length === 0 ? emptyMessage : "Nenhum estudante encontrado."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ListPagination
        page={page}
        pageSize={PAGE_SIZE}
        total={filtered.length}
        noun="estudantes"
        note="Cada código é válido durante 2 dias"
        onPageChange={setPage}
      />
    </section>
  );
}

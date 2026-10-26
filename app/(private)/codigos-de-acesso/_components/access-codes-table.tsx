"use client";

import { Check, Copy, Eye, EyeOff, Plus, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { IconActionButton } from "@/components/shared/icon-action-button";
import { ListPagination } from "@/components/shared/list-pagination";
import { ListTableHeader } from "@/components/shared/list-table-header";
import { ListTabs } from "@/components/shared/list-tabs";
import { StatusBadge } from "@/components/shared/status-badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { paginate } from "@/hooks/use-catalog-state";
import { cn } from "@/lib/utils";
import { matchesSearch } from "@/lib/utils/matches-search";

import type { AccessCode } from "../_lib/mock-data";

type CodeStatus = "active" | "expired" | "none";
type View = "all" | CodeStatus;

const PAGE_SIZE = 8;
const COPIED_MS = 1600;

const COLUMNS = [
  { label: "N.º", className: "w-10" },
  { label: "Estudante" },
  { label: "Encarregado", className: "w-[170px]" },
  { label: "Código", className: "w-[150px]" },
  { label: "Validade", className: "w-[104px]" },
  { label: "Último acesso", className: "w-[104px]" },
  { label: "Estado", className: "w-[116px]" },
  { label: "Ações", className: "w-[112px] text-right" },
];

export const statusOfCode = (row: AccessCode): CodeStatus =>
  row.code === null ? "none" : row.expired ? "expired" : "active";

type AccessCodesTableProps = {
  rows: AccessCode[];
  revealed: Set<string>;
  onToggleReveal: (id: string) => void;
  onRegenerate: (id: string) => void;
};

export function AccessCodesTable({
  rows: allRows,
  revealed,
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

  const copy = async (row: AccessCode) => {
    if (!row.code) return;
    try {
      await navigator.clipboard.writeText(row.code);
      setCopiedId(row.id);
    } catch {
      // Sem permissão para a área de transferência: o código pode ser revelado e copiado à mão.
      onToggleReveal(row.id);
    }
  };

  const countOf = (status: CodeStatus) => allRows.filter((r) => statusOfCode(r) === status).length;
  const searched = allRows.filter((r) => matchesSearch(query, r.student, r.guardian, r.process));
  const filtered = view === "all" ? searched : searched.filter((r) => statusOfCode(r) === view);
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
          { key: "active", label: "Activos", count: countOf("active"), tone: "positive" },
          { key: "expired", label: "Expirados", count: countOf("expired"), tone: "pending" },
          { key: "none", label: "Sem código", count: countOf("none"), tone: "primary" },
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
            placeholder="Pesquisar aluno ou encarregado"
            className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
        </label>
      </ListTabs>

      <div className="px-6 pt-4">
        <Table>
          <ListTableHeader columns={COLUMNS} />
          <TableBody>
            {rows.map((row, i) => {
              const status = statusOfCode(row);
              const isRevealed = revealed.has(row.id);

              return (
                <TableRow key={row.id} className="h-[60px] text-[13px] last:border-0">
                  <TableCell className="pl-4 text-xs text-muted-foreground">
                    {String((page - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell>
                    <span className="flex flex-col gap-0.5">
                      <span className="font-medium">{row.student}</span>
                      <span className="text-[11px] text-muted-foreground">{row.process}</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex flex-col gap-0.5">
                      <span className="font-medium">{row.guardian}</span>
                      <span className="text-[11px] text-muted-foreground">{row.phone}</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    {row.code === null ? (
                      <span className="text-xs text-muted-foreground">Sem código</span>
                    ) : (
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
                    )}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-xs",
                      status === "expired" ? "text-primary" : status === "none" && "text-muted-foreground",
                    )}
                  >
                    {row.validUntil ?? "—"}
                  </TableCell>
                  <TableCell
                    className={cn("text-xs", row.lastAccess ? "text-neutral" : "text-muted-foreground")}
                  >
                    {row.lastAccess ?? (row.code ? "Nunca acedido" : "—")}
                  </TableCell>
                  <TableCell>
                    {status === "active" && <StatusBadge tone="positive">Activo</StatusBadge>}
                    {status === "expired" && <StatusBadge tone="pending">Expirado</StatusBadge>}
                    {status === "none" && <StatusBadge tone="primary">Sem código</StatusBadge>}
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex justify-end gap-2">
                      <IconActionButton
                        icon={isRevealed ? EyeOff : Eye}
                        label={`${isRevealed ? "Ocultar" : "Ver"} código de ${row.student}`}
                        variant={isRevealed ? "active" : "default"}
                        disabled={row.code === null}
                        onClick={() => onToggleReveal(row.id)}
                      />
                      <div className="relative">
                        <IconActionButton
                          icon={Copy}
                          label={`Copiar código de ${row.student}`}
                          disabled={row.code === null}
                          onClick={() => copy(row)}
                        />
                        {copiedId === row.id && (
                          <span
                            role="status"
                            className="absolute top-1/2 right-full z-10 mr-2 flex -translate-y-1/2 items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap text-background"
                          >
                            <Check className="size-3.5 text-positive-soft" />
                            Código copiado
                          </span>
                        )}
                      </div>
                      {row.code === null ? (
                        <IconActionButton
                          icon={Plus}
                          label={`Gerar código para ${row.student}`}
                          variant="primary"
                          onClick={() => onRegenerate(row.id)}
                        />
                      ) : (
                        <IconActionButton
                          icon={RefreshCw}
                          label={`Regenerar código de ${row.student}`}
                          variant={status === "expired" ? "danger" : "default"}
                          onClick={() => onRegenerate(row.id)}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={COLUMNS.length} className="h-24 text-center text-muted-foreground">
                  Nenhum estudante encontrado.
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
        note="Os códigos são válidos até ao fim do trimestre"
        onPageChange={setPage}
      />
    </section>
  );
}

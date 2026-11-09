"use client";

import { History } from "lucide-react";
import { useState } from "react";

import { AUDIT_ACTION_LABELS } from "@/components/shared/assessments/labels";
import { FilterSelect } from "@/components/shared/filter-select";
import { ListPagination } from "@/components/shared/list-pagination";
import { ListTableHeader } from "@/components/shared/list-table-header";
import { PageContext } from "@/components/shared/page-context";
import { SearchCard } from "@/components/shared/search-card";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Tone } from "@/components/shared/tone";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useAuditLogs } from "@/hooks/audit/use-audit-logs";
import { formatDateTime } from "@/lib/utils/format-date";
import type { AuditAction, AuditLog } from "@/services/audit-logs";

import { AuditLogDialog } from "./audit-log-dialog";

const FALLBACK_PAGE_SIZE = 10;
const ALL_ACTIONS = "Todas as ações";
const ALL_RESULTS = "Todos os resultados";

const RESULT_FILTERS: Record<string, number | undefined> = {
  [ALL_RESULTS]: undefined,
  "Sucesso (200)": 200,
  "Criado (201)": 201,
  "Eliminado (204)": 204,
  "Pedido inválido (400)": 400,
  "Sem sessão (401)": 401,
  "Sem permissão (403)": 403,
  "Não encontrado (404)": 404,
};

const ACTION_TONES: Partial<Record<AuditAction, Tone>> = {
  CREATE: "positive",
  UPDATE: "info",
  DELETE: "primary",
  LOGIN_FAILED: "primary",
  LOGIN: "neutral",
  LOGOUT: "neutral",
};

const COLUMNS = [
  { label: "Data", className: "w-[150px] pl-4" },
  { label: "Utilizador", className: "w-[180px]" },
  { label: "Ação", className: "w-[170px]" },
  { label: "Registo" },
  { label: "Resultado", className: "w-[100px] pr-4" },
];

export function ActionBadge({ action }: { action: AuditAction }) {
  return (
    <StatusBadge tone={ACTION_TONES[action] ?? "pending"}>
      {AUDIT_ACTION_LABELS[action] ?? action}
    </StatusBadge>
  );
}

export function StatusCode({ code }: { code: number | null }) {
  if (code === null) return <span className="text-muted-foreground">—</span>;
  return (
    <span className={code >= 400 ? "font-medium text-primary" : "font-medium text-positive"}>
      {code}
    </span>
  );
}

/** Histórico de alterações — `GET /api/audit/logs/` com filtros do servidor. */
export function AuditLogList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState<AuditAction | "">("");
  const [result, setResult] = useState(ALL_RESULTS);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState<AuditLog | null>(null);

  const logs = useAuditLogs({
    page,
    search,
    action,
    status_code: RESULT_FILTERS[result],
    date_from: dateFrom,
    date_to: dateTo,
  });
  const pageSize = logs.pageSize ?? FALLBACK_PAGE_SIZE;
  const filtered = Boolean(search || action || dateFrom || dateTo || result !== ALL_RESULTS);

  const actionOptions = Object.entries(AUDIT_ACTION_LABELS) as [AuditAction, string][];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <PageContext
          title={`Histórico de alterações (${logs.count.toLocaleString("pt-PT")})`}
          subtitle="Registo das ações feitas no sistema: quem, o quê, quando e com que resultado"
        />
        <FilterSelect
          label="Ação"
          icon={History}
          value={action ? AUDIT_ACTION_LABELS[action] : ALL_ACTIONS}
          options={[ALL_ACTIONS, ...actionOptions.map(([, label]) => label)]}
          onChange={(label) => {
            setAction(actionOptions.find(([, l]) => l === label)?.[0] ?? "");
            setPage(1);
          }}
        />
        <FilterSelect
          label="Resultado"
          value={result}
          options={Object.keys(RESULT_FILTERS)}
          onChange={(value) => {
            setResult(value);
            setPage(1);
          }}
        />
      </div>

      <div className="flex flex-wrap items-stretch gap-3">
        <div className="min-w-[280px] flex-1">
          <SearchCard
            placeholder="Pesquise por utilizador, entidade ou descrição"
            onSearch={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
        </div>
        <DateFilter
          label="De"
          value={dateFrom}
          max={dateTo || undefined}
          onChange={(value) => {
            setDateFrom(value);
            setPage(1);
          }}
        />
        <DateFilter
          label="Até"
          value={dateTo}
          min={dateFrom || undefined}
          onChange={(value) => {
            setDateTo(value);
            setPage(1);
          }}
        />
      </div>

      {logs.status === "error" && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {logs.error}
        </p>
      )}

      <section className="overflow-hidden rounded-lg border bg-card">
        <div className="px-6 pt-4">
          <Table>
            <ListTableHeader columns={COLUMNS} />
            <TableBody>
              {(logs.status === "loading" || logs.status === "idle") &&
                logs.items.length === 0 && (
                  <MessageRow>A carregar o histórico...</MessageRow>
                )}
              {logs.items.map((log) => (
                <TableRow
                  key={log.id}
                  onClick={() => setSelected(log)}
                  className="h-14 cursor-pointer text-[13px] last:border-0"
                >
                  <TableCell className="pl-4 text-xs text-muted-foreground">
                    {formatDateTime(log.created_at)}
                  </TableCell>
                  <TableCell>
                    <span className="flex flex-col">
                      <span className="font-medium">{log.user_username || "Anónimo"}</span>
                      {log.user_role && (
                        <span className="text-xs text-muted-foreground">{log.user_role}</span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <ActionBadge action={log.action} />
                  </TableCell>
                  <TableCell>
                    <span className="flex flex-col">
                      <span className="line-clamp-1">
                        {log.description || `${log.method} ${log.path}`}
                      </span>
                      {log.entity && (
                        <span className="text-xs text-muted-foreground">
                          {log.entity}
                          {log.entity_id && ` · ${log.entity_id.slice(0, 8)}`}
                        </span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="pr-4">
                    <StatusCode code={log.status_code} />
                  </TableCell>
                </TableRow>
              ))}
              {logs.status === "success" && logs.items.length === 0 && (
                <MessageRow>
                  {filtered
                    ? "Nenhum registo corresponde aos filtros."
                    : "Ainda não existem registos no histórico."}
                </MessageRow>
              )}
            </TableBody>
          </Table>
        </div>

        <ListPagination
          page={page}
          pageSize={pageSize}
          total={logs.count}
          noun="registos"
          onPageChange={setPage}
        />
      </section>

      <AuditLogDialog log={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function DateFilter({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-w-[170px] flex-col justify-center gap-2.5 rounded-lg border bg-card px-4 py-3.5">
      <span className="text-xs font-medium text-[#1e1e1e]">{label}</span>
      <input
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent text-sm outline-none"
      />
    </label>
  );
}

function MessageRow({ children }: { children: React.ReactNode }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={COLUMNS.length} className="h-24 text-center text-muted-foreground">
        {children}
      </TableCell>
    </TableRow>
  );
}

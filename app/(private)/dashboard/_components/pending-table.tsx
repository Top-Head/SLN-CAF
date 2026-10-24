"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { PendingItem, PendingStatus } from "../_lib/mock-data";

type TabKey = "all" | PendingStatus;

const TABS: { key: TabKey; label: string; counter: string }[] = [
  { key: "all", label: "Pendências", counter: "bg-accent text-primary" },
  { key: "pending", label: "Pendentes", counter: "bg-pending-soft text-pending" },
  { key: "closed", label: "Encerradas", counter: "bg-neutral-soft text-neutral" },
];

const STATUS: Record<PendingStatus, { label: string; className: string }> = {
  pending: { label: "Pendente", className: "bg-pending-soft text-pending" },
  closed: { label: "Encerrado", className: "bg-neutral-soft text-neutral" },
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : ""))
    .toUpperCase();
}

type PendingTableProps = {
  items: PendingItem[];
  total: number;
};

export function PendingTable({ items, total }: PendingTableProps) {
  const [tab, setTab] = useState<TabKey>("all");
  const rows = tab === "all" ? items : items.filter((i) => i.status === tab);

  const count = (key: TabKey) =>
    key === "all" ? items.length : items.filter((i) => i.status === key).length;

  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="flex h-[60px] items-center gap-6 border-b px-6">
        <div role="tablist" className="flex h-full gap-6">
          {TABS.map(({ key, label, counter }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(key)}
                className={cn(
                  "flex h-full items-center gap-1.5 border-b-2 text-[13px] transition-colors",
                  active
                    ? "border-primary font-semibold text-primary"
                    : "border-transparent text-neutral hover:text-foreground",
                )}
              >
                {label}
                <span
                  className={cn(
                    "rounded-lg px-1.5 py-px text-[11px] font-semibold",
                    counter,
                  )}
                >
                  {count(key)}
                </span>
              </button>
            );
          })}
        </div>

        <Link
          href="/lancamento-de-notas"
          className="ml-auto flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline"
        >
          Ver todas
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="px-6 pt-4">
        <Table>
          <TableHeader className="[&_tr]:border-0">
            <TableRow className="hover:bg-transparent">
              {[
                ["ID", "w-14"],
                ["Professor", ""],
                ["Turma", "w-[150px]"],
                ["Disciplinas lançadas", "w-[190px]"],
                ["Estado", "w-[120px]"],
                ["", "w-10"],
              ].map(([label, width], i, all) => (
                <TableHead
                  key={label || i}
                  className={cn(
                    "h-11 bg-table-head text-[11px] font-medium text-muted-foreground uppercase",
                    i === 0 && "rounded-l-md pl-4",
                    i === all.length - 1 && "rounded-r-md pr-4",
                    width,
                  )}
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((item) => {
              const status = STATUS[item.status];
              return (
                <TableRow key={item.id} className="h-14 text-[13px]">
                  <TableCell className="pl-4 text-xs text-muted-foreground">
                    {item.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-[30px] items-center justify-center rounded-full bg-neutral-soft text-[11px] font-semibold text-neutral">
                        {getInitials(item.teacher)}
                      </span>
                      <span className="font-medium">{item.teacher}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.className}</TableCell>
                  <TableCell
                    className={cn(!item.launched && "text-muted-foreground")}
                  >
                    {item.launched
                      ? `${item.launched.done} / ${item.launched.total}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-sm px-2 py-[3px] text-xs font-medium",
                        status.className,
                      )}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell className="pr-4">
                    <ChevronRight
                      aria-label="Ver detalhes"
                      className="mx-auto size-4 text-primary"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex h-[52px] items-center border-t px-6 text-xs text-muted-foreground">
        A mostrar {rows.length} de {total} pendências
      </div>
    </section>
  );
}

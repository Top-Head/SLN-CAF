"use client";

import { useState } from "react";

import { ListHeader } from "@/components/shared/list-header";
import { ListPagination } from "@/components/shared/list-pagination";
import { ListTableHeader } from "@/components/shared/list-table-header";
import { ListTabs } from "@/components/shared/list-tabs";
import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import { SearchCard } from "@/components/shared/search-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getInitials } from "@/lib/utils/get-initials";
import { matchesSearch } from "@/lib/utils/matches-search";

import type { Teacher, TeacherStatus } from "../_lib/mock-data";

type TabKey = "all" | TeacherStatus;

const PAGE_SIZE = 9;

const COLUMNS = [
  { label: "Nome completo" },
  { label: "Curso", className: "w-[110px]" },
  { label: "Disciplina", className: "w-[150px]" },
  { label: "Turmas", className: "w-[190px]" },
  { label: "Estado", className: "w-24" },
  { label: "Registo", className: "w-24" },
  { label: "", className: "w-14" },
];

export function TeachersList({ teachers }: { teachers: Teacher[] }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabKey>("all");
  const [page, setPage] = useState(1);

  const searched = teachers.filter((t) =>
    matchesSearch(query, t.name, t.subject, t.course),
  );
  const filtered =
    tab === "all" ? searched : searched.filter((t) => t.status === tab);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const count = (status: TeacherStatus) =>
    searched.filter((t) => t.status === status).length;

  return (
    <div className="flex flex-col">
      <ListHeader
        title="Lista de professores"
        count={teachers.length}
        addLabel="Adicionar professor"
      />

      <div className="mt-8">
        <SearchCard
          placeholder="Pesquise por professores aqui!."
          onSearch={(q) => {
            setQuery(q);
            setPage(1);
          }}
        />
      </div>

      <section className="mt-[30px] overflow-hidden rounded-lg border bg-card">
        <ListTabs
          value={tab}
          onChange={(key) => {
            setTab(key);
            setPage(1);
          }}
          tabs={[
            { key: "all", label: "Todos", count: searched.length, tone: "primary" },
            { key: "active", label: "Activos", count: count("active"), tone: "positive" },
            { key: "inactive", label: "Inactivos", count: count("inactive"), tone: "primary" },
          ]}
        />

        <div className="px-6 pt-4">
          <Table>
            <ListTableHeader columns={COLUMNS} />
            <TableBody>
              {rows.map((teacher) => (
                <TableRow
                  key={teacher.id}
                  className="h-14 text-[13px] last:border-0"
                >
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-neutral-soft text-[11px] font-semibold text-neutral">
                        {getInitials(teacher.name)}
                      </span>
                      <span className="font-medium">{teacher.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{teacher.course}</TableCell>
                  <TableCell className="font-medium">{teacher.subject}</TableCell>
                  <TableCell>{teacher.classes}</TableCell>
                  <TableCell>
                    {teacher.status === "active" ? (
                      <StatusBadge tone="positive">Activo</StatusBadge>
                    ) : (
                      <StatusBadge tone="primary">Inactivo</StatusBadge>
                    )}
                  </TableCell>
                  <TableCell>{teacher.registeredAt}</TableCell>
                  <TableCell className="pr-4">
                    <div className="flex justify-center">
                      <RowActionsMenu label={teacher.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={COLUMNS.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhum professor encontrado.
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
          noun="professores"
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}

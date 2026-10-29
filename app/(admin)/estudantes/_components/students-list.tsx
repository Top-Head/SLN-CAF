"use client";

import { FileText } from "lucide-react";
import { useState } from "react";

import { ListHeader } from "@/components/shared/list-header";
import { ListPagination } from "@/components/shared/list-pagination";
import { ListTableHeader } from "@/components/shared/list-table-header";
import { ListTabs } from "@/components/shared/list-tabs";
import { SearchCard } from "@/components/shared/search-card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { matchesSearch } from "@/lib/utils/matches-search";

import type { Student } from "../_lib/mock-data";

type TabKey = "all" | "with-code" | "without-code";

const PAGE_SIZE = 9;

const COLUMNS = [
  { label: "N.º", className: "w-12" },
  { label: "Nome completo" },
  { label: "Processo", className: "w-[120px]" },
  { label: "Classe", className: "w-[90px]" },
  { label: "Turma", className: "w-[90px]" },
  { label: "Curso", className: "w-[130px]" },
  { label: "Acção", className: "w-[110px]" },
];

export function StudentsList({ students }: { students: Student[] }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabKey>("all");
  const [page, setPage] = useState(1);

  const searched = students.filter((s) =>
    matchesSearch(query, s.name, s.process),
  );
  const withCode = searched.filter((s) => s.hasAccessCode);
  const withoutCode = searched.filter((s) => !s.hasAccessCode);
  const filtered =
    tab === "with-code" ? withCode : tab === "without-code" ? withoutCode : searched;
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col">
      <ListHeader
        title="Lista de estudantes"
        count={students.length}
        addLabel="Adicionar estudante"
      />

      <div className="mt-8">
        <SearchCard
          placeholder="Pesquise por estudante aqui!."
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
            { key: "with-code", label: "Com código de acesso", count: withCode.length, tone: "positive" },
            { key: "without-code", label: "Sem código", count: withoutCode.length, tone: "pending" },
          ]}
        />

        <div className="px-6 pt-4">
          <Table>
            <ListTableHeader columns={COLUMNS} />
            <TableBody>
              {rows.map((student, i) => (
                <TableRow
                  key={student.id}
                  className="h-14 text-[13px] last:border-0"
                >
                  <TableCell className="pl-4 text-xs text-muted-foreground">
                    {String((page - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.process}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.className}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell className="pr-4">
                    <button
                      type="button"
                      className="flex h-8 items-center gap-1.5 rounded-md border bg-card pr-3 pl-2.5 text-xs font-medium transition-colors hover:bg-muted"
                    >
                      <FileText className="size-3.5 text-neutral" />
                      Boletim
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={COLUMNS.length}
                    className="h-24 text-center text-muted-foreground"
                  >
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
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}

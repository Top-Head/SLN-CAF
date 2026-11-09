"use client";

import { useState } from "react";

import { ListHeader } from "@/components/shared/list-header";
import { ListPagination } from "@/components/shared/list-pagination";
import { ListTableHeader } from "@/components/shared/list-table-header";
import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import { SearchCard } from "@/components/shared/search-card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useStudents } from "@/hooks/students/use-students";
import { deleteStudent } from "@/services/students";
import type { Student } from "@/services/students";
import { notify } from "@/lib/notify";
import { authStore } from "@/stores/use-auth.store";
import { studentsStore } from "@/stores/use-students.store";

import { StudentDialog } from "./student-dialog";

type DialogMode = "create" | "edit" | "view";

const PAGE_SIZE = 10;

const COLUMNS = [
  { label: "N.º", className: "w-12" },
  { label: "Nome completo" },
  { label: "N.º de processo", className: "w-[190px]" },
  { label: "Género", className: "w-[140px]" },
  { label: "Registo", className: "w-[150px]" },
  { label: "", className: "w-14" },
];

export function StudentsList() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const {
    students,
    count,
    listStatus,
    listError,
    refetch,
  } = useStudents({ page, search });

  function openDialog(mode: DialogMode, student?: Student) {
    setDialogMode(mode);
    setSelectedStudent(student ?? null);
    setDialogOpen(true);
  }

  async function handleDelete(student: Student) {
    if (!window.confirm(`Tem certeza que deseja eliminar ${student.nome}?`)) {
      return;
    }

    authStore.hydrate();
    setDeletingId(student.id);

    try {
      await deleteStudent(
        student.id,
        authStore.getState().accessToken ?? undefined,
      );
      studentsStore.clearStudent();
      notify.success(`Estudante ${student.nome} eliminado.`);

      if (students.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await refetch();
      }
    } catch (cause) {
      notify.error(cause, "Não foi possível eliminar o estudante.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col">
      <ListHeader
        title="Lista de estudantes"
        count={count}
        addLabel="Adicionar estudante"
        onAdd={() => openDialog("create")}
      />

      <div className="mt-8">
        <SearchCard
          placeholder="Pesquise por nome ou número de processo."
          onSearch={(value) => {
            setQuery(value);
            setSearch(value);
            setPage(1);
          }}
        />
      </div>

      {listStatus === "error" && (
        <p
          role="alert"
          className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {listError}
        </p>
      )}

      <section className="mt-[30px] overflow-hidden rounded-lg border bg-card">
        <div className="px-6 pt-4">
          <Table>
            <ListTableHeader columns={COLUMNS} />
            <TableBody>
              {listStatus === "loading" && students.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={COLUMNS.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    A carregar estudantes...
                  </TableCell>
                </TableRow>
              )}
              {listStatus !== "loading" &&
                students.map((student, index) => (
                  <TableRow
                    key={student.id}
                    className="h-14 text-[13px] last:border-0"
                  >
                    <TableCell className="pl-4 text-xs text-muted-foreground">
                      {String((page - 1) * PAGE_SIZE + index + 1).padStart(
                        2,
                        "0",
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{student.nome}</TableCell>
                    <TableCell>{student.numero_processo}</TableCell>
                    <TableCell>{formatGender(student.genero)}</TableCell>
                    <TableCell>{formatCreatedAt(student.created_at)}</TableCell>
                    <TableCell className="pr-4">
                      <div className="flex justify-center">
                        <RowActionsMenu
                          label={student.nome}
                          onView={() => openDialog("view", student)}
                          onEdit={() => openDialog("edit", student)}
                          onDelete={() => void handleDelete(student)}
                          triggerClassName={
                            deletingId === student.id
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              {listStatus !== "loading" &&
                students.length === 0 &&
                listStatus !== "error" && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={COLUMNS.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {query
                        ? "Nenhum estudante encontrado."
                        : "Ainda não existem estudantes cadastrados."}
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>

        <ListPagination
          page={page}
          pageSize={PAGE_SIZE}
          total={count}
          noun="estudantes"
          onPageChange={setPage}
        />
      </section>

      <StudentDialog
        key={`${dialogMode}-${selectedStudent?.id ?? "new"}-${dialogOpen ? "open" : "closed"}`}
        open={dialogOpen}
        mode={dialogMode}
        student={selectedStudent}
        onOpenChange={setDialogOpen}
        onSaved={() => {
          void refetch();
        }}
      />
    </div>
  );
}

function formatGender(gender: Student["genero"]) {
  return gender || "—";
}

function formatCreatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(date);
}

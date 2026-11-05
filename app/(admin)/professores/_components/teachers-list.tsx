"use client";

import { useMemo, useState } from "react";

import { ListHeader } from "@/components/shared/list-header";
import { ListPagination } from "@/components/shared/list-pagination";
import { ListTableHeader } from "@/components/shared/list-table-header";
import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import { SearchCard } from "@/components/shared/search-card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { getInitials } from "@/lib/utils/get-initials";
import { matchesSearch } from "@/lib/utils/matches-search";
import { useTeachers } from "@/hooks/teachers/use-teachers";
import { deleteTeacher } from "@/services/teachers";
import type { Teacher } from "@/services/teachers";
import { authStore } from "@/stores/use-auth.store";

import { TeacherDialog } from "./teacher-dialog";

type DialogMode = "create" | "edit" | "view";

const PAGE_SIZE = 10;

const COLUMNS = [
  { label: "Nome completo" },
  { label: "Email", className: "w-[220px]" },
  { label: "Telefone", className: "w-[130px]" },
  { label: "BI", className: "w-[150px]" },
  { label: "Género", className: "w-[120px]" },
  { label: "", className: "w-14" },
];

export function TeachersList() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const {
    teachers,
    count,
    listStatus,
    listError,
    refetch,
  } = useTeachers({ page });

  const visibleTeachers = useMemo(
    () =>
      teachers.filter((teacher) =>
        matchesSearch(
          query,
          teacher.nome,
          teacher.username,
          teacher.email,
          teacher.telefone,
          teacher.bi,
        ),
      ),
    [teachers, query],
  );

  function openDialog(mode: DialogMode, teacher?: Teacher) {
    setDialogMode(mode);
    setSelectedTeacher(teacher ?? null);
    setActionError(null);
    setDialogOpen(true);
  }

  async function handleDelete(teacher: Teacher) {
    if (!window.confirm(`Tem certeza que deseja eliminar ${teacher.nome}?`)) {
      return;
    }

    authStore.hydrate();
    setDeletingId(teacher.id);
    setActionError(null);

    try {
      await deleteTeacher(
        teacher.id,
        authStore.getState().accessToken ?? undefined,
      );

      if (teachers.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await refetch();
      }
    } catch (cause) {
      setActionError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível eliminar o professor.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col">
      <ListHeader
        title="Lista de professores"
        count={count}
        addLabel="Adicionar professor"
        onAdd={() => openDialog("create")}
      />

      <div className="mt-8">
        <SearchCard
          placeholder="Pesquise por nome, email, telefone ou BI."
          onSearch={(value) => setQuery(value)}
        />
      </div>

      {(actionError || listStatus === "error") && (
        <p
          role="alert"
          className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {actionError ?? listError}
        </p>
      )}

      <section className="mt-[30px] overflow-hidden rounded-lg border bg-card">
        <div className="px-6 pt-4">
          <Table>
            <ListTableHeader columns={COLUMNS} />
            <TableBody>
              {listStatus === "loading" && teachers.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={COLUMNS.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    A carregar professores...
                  </TableCell>
                </TableRow>
              )}
              {listStatus !== "loading" &&
                visibleTeachers.map((teacher) => (
                  <TableRow
                    key={teacher.id}
                    className="h-14 text-[13px] last:border-0"
                  >
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-neutral-soft text-[11px] font-semibold text-neutral">
                          {getInitials(teacher.nome)}
                        </span>
                        <span className="font-medium">{teacher.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.telefone}</TableCell>
                    <TableCell>{teacher.bi}</TableCell>
                    <TableCell>
                      {teacher.genero === "MASCULINO" ? "Masculino" : "Feminino"}
                    </TableCell>
                    <TableCell className="pr-4">
                      <div className="flex justify-center">
                        <RowActionsMenu
                          label={teacher.nome}
                          onView={() => openDialog("view", teacher)}
                          onEdit={() => openDialog("edit", teacher)}
                          onDelete={() => void handleDelete(teacher)}
                          triggerClassName={
                            deletingId === teacher.id ? "pointer-events-none opacity-50" : ""
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              {listStatus !== "loading" &&
                visibleTeachers.length === 0 &&
                listStatus !== "error" && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={COLUMNS.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {query
                        ? "Nenhum professor encontrado nesta página."
                        : "Ainda não existem professores cadastrados."}
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
          noun="professores"
          onPageChange={setPage}
        />
      </section>

      <TeacherDialog
        key={`${dialogMode}-${selectedTeacher?.id ?? "new"}-${dialogOpen ? "open" : "closed"}`}
        open={dialogOpen}
        mode={dialogMode}
        teacher={selectedTeacher}
        onOpenChange={setDialogOpen}
        onSaved={() => {
          setActionError(null);
          void refetch();
        }}
      />
    </div>
  );
}

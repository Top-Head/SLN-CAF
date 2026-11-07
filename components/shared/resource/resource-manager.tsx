"use client";

import type { LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { ListHeader } from "@/components/shared/list-header";
import { ListPagination } from "@/components/shared/list-pagination";
import { ListTableHeader } from "@/components/shared/list-table-header";
import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import { SearchCard } from "@/components/shared/search-card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useResourceAll } from "@/hooks/resources/use-resource";
import { notify } from "@/lib/notify";
import { matchesSearch } from "@/lib/utils/matches-search";
import type {
  ResourceListParams,
  ResourceStore,
} from "@/stores/create-resource-store";
import { authStore } from "@/stores/use-auth.store";

import {
  ResourceFormDialog,
  type DialogMode,
  type FieldDef,
  type FormValues,
} from "./resource-form-dialog";

export type ResourceColumn<T> = {
  label: string;
  className?: string;
  render: (item: T) => ReactNode;
};

export function currentAccessToken() {
  authStore.hydrate();
  return authStore.getState().accessToken ?? undefined;
}

type ResourceManagerProps<T extends { id: string }> = {
  title: string;
  noun: string;
  addLabel: string;
  icon: LucideIcon;
  searchPlaceholder: string;
  emptyMessage: string;
  store: ResourceStore<T, ResourceListParams>;
  columns: ResourceColumn<T>[];
  getLabel: (item: T) => string;
  searchText: (item: T) => string[];
  compare?: (a: T, b: T) => number;
  pageSize?: number;
  dialog: {
    titles: Record<DialogMode, string>;
    descriptions: Record<DialogMode, string>;
    submitLabel: string;
    fields: FieldDef[];
    emptyValues: FormValues;
    toValues: (item: T) => FormValues;
    validate?: (values: FormValues) => string | null;
    renderView?: (item: T) => ReactNode;
  };
  /** Textos dos toasts de sucesso; sem eles usa mensagens genéricas. */
  messages?: {
    created?: (values: FormValues) => string;
    updated?: (item: T, values: FormValues) => string;
    deleted?: (item: T) => string;
  };
  fetchOne?: (id: string, accessToken?: string) => Promise<T>;
  onCreate: (values: FormValues, accessToken?: string) => Promise<unknown>;
  /** Sem `onUpdate` a acção "Editar" não aparece. */
  onUpdate?: (
    item: T,
    values: FormValues,
    accessToken?: string,
  ) => Promise<unknown>;
  /** Sem `onDelete` a acção "Eliminar" não aparece. */
  onDelete?: (item: T, accessToken?: string) => Promise<unknown>;
};

/**
 * Lista CRUD para recursos pequenos (disciplinas, cursos, classes, anos letivos).
 * Carrega todas as páginas da API e faz pesquisa e paginação no cliente,
 * já que estes endpoints não suportam `?search=`.
 */
export function ResourceManager<T extends { id: string }>({
  title,
  noun,
  addLabel,
  icon,
  searchPlaceholder,
  emptyMessage,
  store,
  columns,
  getLabel,
  searchText,
  compare,
  pageSize = 10,
  dialog,
  messages,
  fetchOne,
  onCreate,
  onUpdate,
  onDelete,
}: ResourceManagerProps<T>) {
  const { items, status, error } = useResourceAll(store);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<T | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = items
    .filter((item) => matchesSearch(query, ...searchText(item)))
    .sort(compare ?? (() => 0));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const allColumns = [
    { label: "N.º", className: "w-12" },
    ...columns.map(({ label, className }) => ({ label, className })),
    { label: "", className: "w-14" },
  ];

  function openDialog(mode: DialogMode, item?: T) {
    setDialogMode(mode);
    setSelected(item ?? null);
    setDialogOpen(true);
  }

  async function handleDelete(item: T) {
    if (!onDelete) return;
    if (!window.confirm(`Tem certeza que deseja eliminar ${getLabel(item)}?`)) {
      return;
    }

    setDeletingId(item.id);

    try {
      await onDelete(item, currentAccessToken());
      notify.success(
        messages?.deleted?.(item) ?? `${getLabel(item)} eliminado com sucesso.`,
      );
      await store.invalidate();
    } catch (cause) {
      notify.error(cause, `Não foi possível eliminar ${getLabel(item)}.`);
    } finally {
      setDeletingId(null);
    }
  }

  const loadItem = fetchOne
    ? (id: string) => fetchOne(id, currentAccessToken())
    : undefined;

  return (
    <div className="flex flex-col">
      <ListHeader
        title={title}
        count={items.length}
        addLabel={addLabel}
        onAdd={() => openDialog("create")}
      />

      <div className="mt-8">
        <SearchCard
          placeholder={searchPlaceholder}
          onSearch={(value) => {
            setQuery(value);
            setPage(1);
          }}
        />
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {error}
        </p>
      )}

      <section className="mt-[30px] overflow-hidden rounded-lg border bg-card">
        <div className="px-6 pt-4">
          <Table>
            <ListTableHeader columns={allColumns} />
            <TableBody>
              {(status === "loading" || status === "idle") &&
                items.length === 0 && (
                  <MessageRow colSpan={allColumns.length}>
                    A carregar {noun}...
                  </MessageRow>
                )}
              {rows.map((item, index) => (
                <TableRow key={item.id} className="h-14 text-[13px] last:border-0">
                  <TableCell className="pl-4 text-xs text-muted-foreground">
                    {String((currentPage - 1) * pageSize + index + 1).padStart(
                      2,
                      "0",
                    )}
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.label} className={column.className}>
                      {column.render(item)}
                    </TableCell>
                  ))}
                  <TableCell className="pr-4">
                    <div className="flex justify-center">
                      <RowActionsMenu
                        label={getLabel(item)}
                        onView={() => openDialog("view", item)}
                        onEdit={onUpdate ? () => openDialog("edit", item) : undefined}
                        onDelete={onDelete ? () => void handleDelete(item) : undefined}
                        triggerClassName={
                          deletingId === item.id
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {status === "success" && rows.length === 0 && (
                <MessageRow colSpan={allColumns.length}>
                  {query ? `Nenhum resultado para "${query}".` : emptyMessage}
                </MessageRow>
              )}
            </TableBody>
          </Table>
        </div>

        <ListPagination
          page={currentPage}
          pageSize={pageSize}
          total={filtered.length}
          noun={noun}
          onPageChange={setPage}
        />
      </section>

      <ResourceFormDialog<T>
        key={`${dialogMode}-${selected?.id ?? "new"}-${dialogOpen ? "open" : "closed"}`}
        open={dialogOpen}
        mode={dialogMode}
        item={selected}
        icon={icon}
        {...dialog}
        getId={(item) => item.id}
        loadItem={loadItem}
        onOpenChange={setDialogOpen}
        onSubmit={async (values) => {
          const token = currentAccessToken();
          if (dialogMode === "create") {
            await onCreate(values, token);
            notify.success(
              messages?.created?.(values) ?? "Registo criado com sucesso.",
            );
          } else if (selected && onUpdate) {
            await onUpdate(selected, values, token);
            notify.success(
              messages?.updated?.(selected, values) ??
                `${getLabel(selected)} atualizado com sucesso.`,
            );
          }
          await store.invalidate();
        }}
      />
    </div>
  );
}

function MessageRow({
  colSpan,
  children,
}: {
  colSpan: number;
  children: ReactNode;
}) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell
        colSpan={colSpan}
        className="h-24 text-center text-muted-foreground"
      >
        {children}
      </TableCell>
    </TableRow>
  );
}

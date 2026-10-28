"use client";

import { Check, UserRound, UserRoundPlus } from "lucide-react";

import { CatalogBadge } from "@/components/shared/catalog/catalog-badge";
import { CatalogPagination } from "@/components/shared/catalog/catalog-pagination";
import {
  CatalogCell,
  CatalogTable,
  type CatalogColumn,
} from "@/components/shared/catalog/catalog-table";
import { CatalogViews } from "@/components/shared/catalog/catalog-views";
import { ListHeader } from "@/components/shared/list-header";
import { SearchCard } from "@/components/shared/search-card";
import { paginate, useCatalogState } from "@/hooks/use-catalog-state";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils/get-initials";
import { matchesSearch } from "@/lib/utils/matches-search";
import { shortName } from "@/lib/utils/short-name";

import {
  classLabel,
  isFull,
  missingTeachers,
  pendingCount,
  SHIFT_HOURS,
  type SchoolClass,
} from "../_lib/mock-data";

type View = "all" | "available" | "full";

const PAGE_SIZES = [6, 12, 24];

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

const COLUMNS: CatalogColumn<SchoolClass>[] = [
  {
    label: "Turma",
    className: "w-[120px]",
    render: (c, expanded) => (
      <span className="flex flex-col gap-1.5 whitespace-nowrap">
        <span
          className={cn(
            "text-sm font-semibold",
            expanded ? "text-primary" : "text-catalog-text",
          )}
        >
          {classLabel(c)}
        </span>
        <span className="text-[11px] text-catalog-muted">{c.room}</span>
      </span>
    ),
  },
  {
    label: "Curso",
    className: "w-[170px]",
    render: (c) => <CatalogCell primary={c.course} secondary={c.cycle} />,
  },
  {
    label: "Turno",
    className: "w-[118px]",
    render: (c) => (
      <CatalogCell
        primary={c.shift}
        secondary={SHIFT_HOURS[c.shift]}
        secondaryClassName="text-[10px]"
      />
    ),
  },
  {
    label: "Ocupação",
    className: "w-[166px]",
    render: (c) => {
      const free = c.capacity - c.enrolled;
      return (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs whitespace-nowrap text-catalog-muted">
            <span className="font-semibold text-catalog-text">{c.enrolled}</span>{" "}
            / {c.capacity}
            <span className="text-[10px]">
              {" · "}
              {isFull(c) ? "Lotada" : plural(free, "vaga", "vagas")}
            </span>
          </p>
          <div
            role="meter"
            aria-label={`Ocupação da ${classLabel(c)}`}
            aria-valuemin={0}
            aria-valuemax={c.capacity}
            aria-valuenow={c.enrolled}
            className="h-1 w-[116px] overflow-hidden rounded-[3px] bg-catalog-track"
          >
            <div
              className={cn(
                "h-full rounded-[3px]",
                isFull(c) ? "bg-primary" : "bg-catalog-track-fill",
              )}
              style={{ width: `${Math.min(100, (c.enrolled / c.capacity) * 100)}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    label: "Diretor de turma",
    className: "w-[200px]",
    render: (c) =>
      c.director ? (
        <div className="flex items-center gap-2">
          <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#edf0f2] text-[9px] text-catalog-muted">
            {getInitials(c.director)}
          </span>
          <span className="text-xs whitespace-nowrap text-catalog-text">
            {shortName(c.director)}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-attention-surface">
            <UserRound className="size-[13px] text-attention" strokeWidth={1.6} />
          </span>
          <span className="text-xs text-attention">Por atribuir</span>
        </div>
      ),
  },
  {
    label: "Organização",
    className: "w-[190px]",
    render: (c) => {
      if (!c.director) {
        return <CatalogBadge tone="attention" alert>Sem diretor</CatalogBadge>;
      }
      const missing = missingTeachers(c);
      if (missing > 0) {
        return (
          <CatalogBadge tone="attention" alert>
            {missing} prof. por atribuir
          </CatalogBadge>
        );
      }
      return (
        <span className="flex items-center gap-[5px] text-[11px] text-catalog-muted">
          <Check className="size-[13px] text-[#007352]" strokeWidth={1.6} />
          Sem pendências
        </span>
      );
    },
  },
];

function ClassDetails({ schoolClass: c }: { schoolClass: SchoolClass }) {
  const pending = pendingCount(c);

  return (
    <div className="flex flex-col gap-[13px] pt-[7px] pl-[42px]">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-catalog-text">
          Organização da {classLabel(c)}
        </span>
        <span
          className={cn(
            "text-[10px]",
            pending > 0 ? "text-attention" : "text-catalog-muted",
          )}
        >
          {pending > 0
            ? plural(pending, "pendência", "pendências")
            : "Sem pendências"}
        </span>
      </div>
      <div className="flex flex-wrap gap-8">
        <div className="flex w-[255px] flex-col gap-[7px]">
          <span className="text-[11px] text-catalog-muted">Diretor de turma</span>
          {c.director ? (
            <span className="text-xs text-catalog-text">{c.director}</span>
          ) : (
            <>
              <span className="text-xs text-catalog-text">
                Atribua um professor responsável.
              </span>
              <button
                type="button"
                className="flex w-fit items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <UserRoundPlus className="size-3.5" />
                Atribuir diretor de turma
              </button>
            </>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-[7px]">
          <span className="text-[11px] text-catalog-muted">
            Disciplinas e professores
          </span>
          <span className="text-xs text-catalog-text">
            {c.subjectsAssigned} de {c.subjectsTotal} disciplinas atribuídas
          </span>
          <button
            type="button"
            className="w-fit text-[11px] text-primary hover:underline"
          >
            Ver os {c.enrolled} estudantes →
          </button>
        </div>
      </div>
    </div>
  );
}

export function ClassesCatalog({ classes }: { classes: SchoolClass[] }) {
  const state = useCatalogState<View>("all", PAGE_SIZES[0]);

  const searched = classes
    .filter((c) =>
      matchesSearch(state.query, classLabel(c), c.course, c.room, c.director ?? ""),
    )
    .filter((c) => !state.pendingOnly || pendingCount(c) > 0)
    .sort((a, b) =>
      state.sortDirection
        ? classLabel(a).localeCompare(classLabel(b), "pt", { numeric: true }) *
          (state.sortDirection === "asc" ? 1 : -1)
        : 0,
    );
  const available = searched.filter((c) => !isFull(c));
  const full = searched.filter(isFull);
  const filtered =
    state.view === "available" ? available : state.view === "full" ? full : searched;
  const rows = paginate(filtered, state.page, state.pageSize);

  return (
    <div className="flex flex-col gap-6">
      <ListHeader
        title="Lista de turmas"
        count={classes.length}
        addLabel="Nova turma"
        onExport={() => {}}
      />

      <SearchCard
        placeholder="Pesquise por turma aqui!."
        onSearch={state.setQuery}
      />

      <div className="flex flex-col gap-4">
        <CatalogViews
          value={state.view}
          onChange={state.setView}
          pendingOnly={state.pendingOnly}
          onPendingOnlyChange={state.setPendingOnly}
          views={[
            { key: "all", label: "Todas as turmas", count: searched.length },
            { key: "available", label: "Com vagas", count: available.length },
            { key: "full", label: "Lotadas", count: full.length },
          ]}
        />

        <CatalogTable
          items={rows}
          getId={(c) => c.id}
          getLabel={classLabel}
          columns={COLUMNS}
          renderDetails={(c) => <ClassDetails schoolClass={c} />}
          expanded={state.expanded}
          onToggleExpanded={state.toggleExpanded}
          selected={state.selected}
          onSelectedChange={state.setSelected}
          sortDirection={state.sortDirection}
          onSortDirectionChange={state.setSortDirection}
          emptyMessage="Nenhuma turma encontrada."
          rowHeightClass="h-[70px]"
          selectionWidthClass="w-[42px]"
          footer={
            <CatalogPagination
              page={state.page}
              pageSize={state.pageSize}
              pageSizeOptions={PAGE_SIZES}
              total={filtered.length}
              noun="turmas"
              onPageChange={state.setPage}
              onPageSizeChange={state.setPageSize}
            />
          }
        />
      </div>
    </div>
  );
}

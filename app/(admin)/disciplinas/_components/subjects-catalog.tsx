"use client";

import { ArrowRight, CircleAlert, UserPlus } from "lucide-react";

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
import { matchesSearch } from "@/lib/utils/matches-search";

import {
  pendingAssignments,
  type Subject,
  type SubjectStatus,
} from "../_lib/mock-data";

type View = "all" | SubjectStatus;

const PAGE_SIZES = [6, 12, 24];

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

const COLUMNS: CatalogColumn<Subject>[] = [
  {
    label: "Disciplina",
    render: (subject, expanded) => (
      <span className="flex flex-col gap-[5px] whitespace-nowrap">
        <span
          className={cn(
            "text-[13px] font-semibold",
            expanded ? "text-primary" : "text-catalog-text",
          )}
        >
          {subject.name}
        </span>
        <span className="text-[11px] text-catalog-muted">
          {subject.code} · {subject.area}
        </span>
      </span>
    ),
  },
  {
    label: "Cursos",
    className: "w-[164px]",
    render: (subject) => (
      <span className="text-xs text-catalog-text">{subject.courses}</span>
    ),
  },
  {
    label: "Turmas",
    className: "w-[140px]",
    render: (subject) =>
      subject.classCount > 0 ? (
        <CatalogCell
          primary={
            <span className="font-medium">
              {plural(subject.classCount, "turma", "turmas")}
            </span>
          }
          secondary={subject.gradeRange}
        />
      ) : (
        <CatalogCell
          muted
          primary={<span className="font-medium">Sem turmas</span>}
          secondary="Sem vínculos neste ano"
        />
      ),
  },
  {
    label: "Professores",
    className: "w-[144px]",
    render: (subject) => {
      const pending = pendingAssignments(subject);
      if (subject.teacherCount === 0) {
        return <CatalogCell muted primary="Sem professor" secondary="—" />;
      }
      return (
        <CatalogCell
          primary={plural(subject.teacherCount, "professor", "professores")}
          secondary={
            pending > 0
              ? `${plural(pending, "turma", "turmas")} por atribuir`
              : "Todos atribuídos"
          }
          secondaryClassName={pending > 0 ? "text-attention" : undefined}
        />
      );
    },
  },
  {
    label: "Estado",
    className: "w-[102px]",
    render: (subject) =>
      subject.status === "active" ? (
        <CatalogBadge tone="active">Ativa</CatalogBadge>
      ) : (
        <CatalogBadge tone="inactive">Inativa</CatalogBadge>
      ),
  },
];

function SubjectDetails({ subject }: { subject: Subject }) {
  const pending = pendingAssignments(subject);

  return (
    <div className="flex flex-col gap-2.5 pt-[5px] pl-12">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-catalog-text">
          Professores por turma
        </span>
        {pending > 0 && (
          <CatalogBadge tone="attention">
            {plural(pending, "pendência", "pendências")}
          </CatalogBadge>
        )}
      </div>
      {subject.assignments.length === 0 ? (
        <p className="text-[11px] text-catalog-muted">
          Esta disciplina não tem turmas associadas neste ano lectivo.
        </p>
      ) : (
        subject.assignments.map(({ classes, teacher }) => (
          <div key={classes} className="flex items-center gap-5 text-[11px]">
            <span className="w-40 shrink-0 text-catalog-muted">{classes}</span>
            {teacher ? (
              <span className="text-catalog-text">{teacher}</span>
            ) : (
              <button
                type="button"
                className="flex items-center gap-1.5 font-semibold text-primary hover:underline"
              >
                <UserPlus className="size-3" />
                Atribuir professor
              </button>
            )}
          </div>
        ))
      )}
      {subject.classCount > 0 && (
        <button
          type="button"
          className="w-fit text-[10px] text-primary hover:underline"
        >
          Ver as {subject.classCount} turmas e gerir atribuições →
        </button>
      )}
    </div>
  );
}

export function SubjectsCatalog({ subjects }: { subjects: Subject[] }) {
  const state = useCatalogState<View>("all", PAGE_SIZES[0]);

  const withPending = subjects.filter((s) => pendingAssignments(s) > 0);

  const searched = subjects
    .filter((s) => matchesSearch(state.query, s.name, s.code, s.area))
    .filter((s) => !state.pendingOnly || pendingAssignments(s) > 0)
    .sort((a, b) =>
      state.sortDirection
        ? a.name.localeCompare(b.name, "pt") *
          (state.sortDirection === "asc" ? 1 : -1)
        : 0,
    );
  const countOf = (status: SubjectStatus) =>
    searched.filter((s) => s.status === status).length;
  const filtered =
    state.view === "all"
      ? searched
      : searched.filter((s) => s.status === state.view);
  const rows = paginate(filtered, state.page, state.pageSize);

  return (
    <div className="flex flex-col gap-6">
      {withPending.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-md border border-attention-border bg-attention-surface px-4 py-[13px]">
          <CircleAlert className="size-[18px] shrink-0 text-attention" strokeWidth={1.7} />
          <p className="flex-1 text-xs text-attention-strong">
            {plural(withPending.length, "disciplina tem", "disciplinas têm")}{" "}
            turmas sem professor. Complete as atribuições antes do lançamento de
            notas.
          </p>
          <button
            type="button"
            onClick={() => state.setPendingOnly(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-attention hover:underline"
          >
            Rever pendências
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      )}

      <ListHeader
        title="Lista de disciplinas"
        count={subjects.length}
        addLabel="Nova disciplina"
        onExport={() => {}}
      />

      <SearchCard
        placeholder="Pesquise por disciplina aqui!."
        onSearch={state.setQuery}
      />

      <div className="flex flex-col gap-4">
        <CatalogViews
          showFilterIcon
          value={state.view}
          onChange={state.setView}
          pendingOnly={state.pendingOnly}
          onPendingOnlyChange={state.setPendingOnly}
          views={[
            { key: "all", label: "Todas", count: searched.length },
            { key: "active", label: "Ativas", count: countOf("active") },
            { key: "inactive", label: "Inativas", count: countOf("inactive") },
          ]}
        />

        <CatalogTable
          items={rows}
          getId={(s) => s.id}
          getLabel={(s) => s.name}
          columns={COLUMNS}
          renderDetails={(s) => <SubjectDetails subject={s} />}
          expanded={state.expanded}
          onToggleExpanded={state.toggleExpanded}
          selected={state.selected}
          onSelectedChange={state.setSelected}
          sortDirection={state.sortDirection}
          onSortDirectionChange={state.setSortDirection}
          emptyMessage="Nenhuma disciplina encontrada."
          rowHeightClass="h-[68px]"
          selectionWidthClass="w-12"
          footer={
            <CatalogPagination
              page={state.page}
              pageSize={state.pageSize}
              pageSizeOptions={PAGE_SIZES}
              total={filtered.length}
              noun="disciplinas"
              onPageChange={state.setPage}
              onPageSizeChange={state.setPageSize}
            />
          }
        />
      </div>
    </div>
  );
}

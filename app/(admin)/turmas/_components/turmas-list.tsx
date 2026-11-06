"use client";

import {
  CalendarRange,
  GraduationCap,
  Layers,
  School,
  UserRound,
} from "lucide-react";
import { useState } from "react";

import { FilterSelect } from "@/components/shared/filter-select";
import { ListHeader } from "@/components/shared/list-header";
import { ListPagination } from "@/components/shared/list-pagination";
import { ListTableHeader } from "@/components/shared/list-table-header";
import {
  currentAccessToken,
} from "@/components/shared/resource/resource-manager";
import {
  ResourceFormDialog,
  type DialogMode,
  type FormValues,
} from "@/components/shared/resource/resource-form-dialog";
import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useAllCourses } from "@/hooks/academic/use-courses";
import { useAllSchoolClasses } from "@/hooks/academic/use-school-classes";
import { useAllSchoolYears } from "@/hooks/academic/use-school-years";
import { useTurmas } from "@/hooks/academic/use-turmas";
import { useTeacherOptions } from "@/hooks/teachers/use-teacher-options";
import type { Teacher } from "@/services/teachers";
import {
  createTurma,
  deleteTurma,
  getTurmaById,
  updateTurma,
  type Turma,
  type TurmaPayload,
} from "@/services/turmas";
import { turmasStore } from "@/stores/use-turmas.store";

import { schoolClassLabel, schoolYearLabel } from "./structure-managers";

const ALL = "Todos";
const FALLBACK_PAGE_SIZE = 10;

const COLUMNS = [
  { label: "N.º", className: "w-12" },
  { label: "Turma" },
  { label: "Curso", className: "w-[200px]" },
  { label: "Classe", className: "w-[130px]" },
  { label: "Ano letivo", className: "w-[130px]" },
  { label: "Diretor de turma", className: "w-[220px]" },
  { label: "", className: "w-14" },
];

const loadTurma = (id: string) => getTurmaById(id, currentAccessToken());

/** Encontra o professor pelo nome devolvido em `director_teacher`. */
function findDirector(teachers: Teacher[], name: string | null) {
  if (!name) return undefined;
  const target = name.trim().toLowerCase();
  return teachers.find(
    (t) =>
      t.nome.trim().toLowerCase() === target ||
      t.username.trim().toLowerCase() === target,
  );
}

export function TurmasList() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    course: "",
    school_class: "",
    school_year: "",
  });
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Turma | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const turmas = useTurmas({ page, ...filters });
  const courses = useAllCourses();
  const classes = useAllSchoolClasses();
  const years = useAllSchoolYears();
  const teachers = useTeacherOptions({ enabled: dialogOpen });

  const pageSize = turmas.pageSize ?? FALLBACK_PAGE_SIZE;

  const courseOptions = courses.items
    .map((c) => ({ value: c.id, label: c.nome }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt"));
  const classOptions = [...classes.items]
    .sort((a, b) => a.numero - b.numero)
    .map((c) => ({ value: c.id, label: schoolClassLabel(c) }));
  const yearOptions = [...years.items]
    .sort((a, b) => b.ano_inicio - a.ano_inicio)
    .map((y) => ({ value: y.id, label: schoolYearLabel(y) }));
  const teacherOptions = teachers.items
    .map((t) => ({ value: t.id, label: t.nome }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt"));

  function setFilter(key: keyof typeof filters, label: string, options: { value: string; label: string }[]) {
    const value = options.find((o) => o.label === label)?.value ?? "";
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  const labelOf = (options: { value: string; label: string }[], value: string) =>
    options.find((o) => o.value === value)?.label ?? ALL;

  function openDialog(mode: DialogMode, turma?: Turma) {
    setDialogMode(mode);
    setSelected(turma ?? null);
    setActionError(null);
    setDialogOpen(true);
  }

  async function handleDelete(turma: Turma) {
    if (!window.confirm(`Tem certeza que deseja eliminar a turma ${turma.nome}?`)) {
      return;
    }

    setDeletingId(turma.id);
    setActionError(null);

    try {
      await deleteTurma(turma.id, currentAccessToken());
      if (turmas.items.length === 1 && page > 1) setPage(page - 1);
      else await turmasStore.invalidate();
    } catch (cause) {
      setActionError(
        cause instanceof Error ? cause.message : "Não foi possível eliminar a turma.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSubmit(values: FormValues) {
    const payload: TurmaPayload = {
      nome: values.nome,
      course: values.course,
      school_class: values.school_class,
      school_year: values.school_year,
    };

    const director = values.director_teacher_id;
    const unresolvedDirector =
      !director &&
      selected?.director_teacher &&
      !findDirector(teachers.items, selected.director_teacher);

    // Se o diretor atual não foi identificado na lista, não o apaga sem querer.
    if (!unresolvedDirector) payload.director_teacher_id = director || null;

    const token = currentAccessToken();
    if (dialogMode === "create") await createTurma(payload, token);
    else if (selected) await updateTurma(selected.id, payload, token);

    setActionError(null);
    await turmasStore.invalidate();
  }

  return (
    <div className="flex flex-col">
      <ListHeader
        title="Lista de turmas"
        count={turmas.count}
        addLabel="Nova turma"
        onAdd={() => openDialog("create")}
      />

      <div className="mt-8 flex flex-wrap items-center gap-3 rounded-lg border bg-card px-6 py-4">
        <span className="text-xs font-medium text-[#1e1e1e]">Filtrar por</span>
        <FilterSelect
          label="Curso"
          value={labelOf(courseOptions, filters.course)}
          options={[ALL, ...courseOptions.map((o) => o.label)]}
          onChange={(label) => setFilter("course", label, courseOptions)}
        />
        <FilterSelect
          label="Classe"
          value={labelOf(classOptions, filters.school_class)}
          options={[ALL, ...classOptions.map((o) => o.label)]}
          onChange={(label) => setFilter("school_class", label, classOptions)}
        />
        <FilterSelect
          label="Ano letivo"
          value={labelOf(yearOptions, filters.school_year)}
          options={[ALL, ...yearOptions.map((o) => o.label)]}
          onChange={(label) => setFilter("school_year", label, yearOptions)}
        />
      </div>

      {(actionError || turmas.status === "error") && (
        <p
          role="alert"
          className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {actionError ?? turmas.error}
        </p>
      )}

      <section className="mt-[30px] overflow-hidden rounded-lg border bg-card">
        <div className="px-6 pt-4">
          <Table>
            <ListTableHeader columns={COLUMNS} />
            <TableBody>
              {turmas.status === "loading" && turmas.items.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={COLUMNS.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    A carregar turmas...
                  </TableCell>
                </TableRow>
              )}
              {turmas.items.map((turma, index) => (
                <TableRow key={turma.id} className="h-14 text-[13px] last:border-0">
                  <TableCell className="pl-4 text-xs text-muted-foreground">
                    {String((page - 1) * pageSize + index + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell className="font-medium">{turma.nome}</TableCell>
                  <TableCell>{turma.course_nome || "—"}</TableCell>
                  <TableCell>{formatClassName(turma.school_class_nome)}</TableCell>
                  <TableCell>{turma.school_year_label || "—"}</TableCell>
                  <TableCell>
                    {turma.director_teacher ? (
                      turma.director_teacher
                    ) : (
                      <span className="text-xs text-attention">Por atribuir</span>
                    )}
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex justify-center">
                      <RowActionsMenu
                        label={turma.nome}
                        onView={() => openDialog("view", turma)}
                        onEdit={() => openDialog("edit", turma)}
                        onDelete={() => void handleDelete(turma)}
                        triggerClassName={
                          deletingId === turma.id
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {turmas.status === "success" && turmas.items.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={COLUMNS.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {filters.course || filters.school_class || filters.school_year
                      ? "Nenhuma turma corresponde aos filtros."
                      : "Ainda não existem turmas cadastradas."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <ListPagination
          page={page}
          pageSize={pageSize}
          total={turmas.count}
          noun="turmas"
          onPageChange={setPage}
        />
      </section>

      <ResourceFormDialog<Turma>
        key={`${dialogMode}-${selected?.id ?? "new"}-${dialogOpen ? "open" : "closed"}`}
        open={dialogOpen}
        mode={dialogMode}
        item={selected}
        icon={School}
        titles={{
          create: "Nova turma",
          edit: "Editar turma",
          view: "Dados da turma",
        }}
        descriptions={{
          create: "Defina o nome, o curso, a classe e o ano letivo da turma.",
          edit: "Atualize os dados da turma ou o diretor de turma.",
          view: "Consulte os dados registados para esta turma.",
        }}
        submitLabel="Cadastrar turma"
        fields={[
          {
            name: "nome",
            label: "Nome da turma",
            icon: School,
            maxLength: 20,
            required: true,
            placeholder: "Ex.: 10.ª IA",
          },
          {
            name: "course",
            label: "Curso",
            type: "select",
            icon: GraduationCap,
            required: true,
            options: courseOptions,
            optionsLoading: courses.status === "loading",
            placeholder: courseOptions.length ? "Selecione o curso" : "Sem cursos",
          },
          {
            name: "school_class",
            label: "Classe",
            type: "select",
            icon: Layers,
            required: true,
            options: classOptions,
            optionsLoading: classes.status === "loading",
            placeholder: classOptions.length ? "Selecione a classe" : "Sem classes",
          },
          {
            name: "school_year",
            label: "Ano letivo",
            type: "select",
            icon: CalendarRange,
            required: true,
            options: yearOptions,
            optionsLoading: years.status === "loading",
            placeholder: yearOptions.length ? "Selecione o ano" : "Sem anos letivos",
          },
          {
            name: "director_teacher_id",
            label: "Diretor de turma",
            type: "select",
            icon: UserRound,
            wide: true,
            options: teacherOptions,
            optionsLoading: teachers.status === "loading",
            noneLabel: "Sem diretor de turma",
          },
        ]}
        emptyValues={{
          nome: "",
          course: "",
          school_class: "",
          school_year: "",
          director_teacher_id: "",
        }}
        toValues={(turma) => ({
          nome: turma.nome,
          course: turma.course,
          school_class: turma.school_class,
          school_year: turma.school_year,
          director_teacher_id:
            findDirector(teachers.items, turma.director_teacher)?.id ?? "",
        })}
        getId={(turma) => turma.id}
        loadItem={loadTurma}
        renderView={(turma) =>
          turma.director_teacher &&
          !findDirector(teachers.items, turma.director_teacher) ? (
            <p className="text-xs text-muted-foreground">
              Diretor de turma registado: {turma.director_teacher}
            </p>
          ) : null
        }
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

/** A API devolve a classe como "10"; mostra "10.ª classe". */
function formatClassName(value: string) {
  if (!value) return "—";
  return /^\d+$/.test(value.trim()) ? `${value.trim()}.ª classe` : value;
}

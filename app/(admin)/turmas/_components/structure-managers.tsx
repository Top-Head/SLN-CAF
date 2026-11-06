"use client";

import { CalendarRange, GraduationCap, Layers } from "lucide-react";

import { ResourceManager } from "@/components/shared/resource/resource-manager";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  patchCourse,
  type Course,
} from "@/services/courses";
import {
  createSchoolClass,
  deleteSchoolClass,
  getSchoolClassById,
  patchSchoolClass,
  type SchoolClass,
} from "@/services/school-classes";
import {
  createSchoolYear,
  getSchoolYearById,
  type SchoolYear,
} from "@/services/school-years";
import { coursesStore } from "@/stores/use-courses.store";
import { schoolClassesStore } from "@/stores/use-school-classes.store";
import { schoolYearsStore } from "@/stores/use-school-years.store";

export const schoolClassLabel = (c: Pick<SchoolClass, "numero">) =>
  `${c.numero}.ª classe`;

export const schoolYearLabel = (y: Pick<SchoolYear, "ano_inicio" | "ano_fim">) =>
  `${y.ano_inicio}/${y.ano_fim}`;

export function CoursesManager() {
  return (
    <ResourceManager<Course>
      title="Lista de cursos"
      noun="cursos"
      addLabel="Novo curso"
      icon={GraduationCap}
      searchPlaceholder="Pesquise por curso aqui!"
      emptyMessage="Ainda não existem cursos cadastrados."
      store={coursesStore}
      columns={[
        {
          label: "Curso",
          render: (course) => <span className="font-medium">{course.nome}</span>,
        },
      ]}
      getLabel={(course) => course.nome}
      searchText={(course) => [course.nome]}
      compare={(a, b) => a.nome.localeCompare(b.nome, "pt")}
      dialog={{
        titles: {
          create: "Novo curso",
          edit: "Editar curso",
          view: "Dados do curso",
        },
        descriptions: {
          create: "Indique o nome do novo curso.",
          edit: "Atualize o nome do curso.",
          view: "Consulte o curso registado.",
        },
        submitLabel: "Cadastrar curso",
        fields: [
          {
            name: "nome",
            label: "Nome do curso",
            icon: GraduationCap,
            maxLength: 100,
            required: true,
            wide: true,
            placeholder: "Ex.: Informática",
          },
        ],
        emptyValues: { nome: "" },
        toValues: (course) => ({ nome: course.nome }),
      }}
      fetchOne={getCourseById}
      onCreate={(values, token) => createCourse({ nome: values.nome }, token)}
      onUpdate={(course, values, token) =>
        patchCourse(course.id, { nome: values.nome }, token)
      }
      onDelete={(course, token) => deleteCourse(course.id, token)}
    />
  );
}

function parseClassNumber(value: string) {
  const numero = Number(value);
  return Number.isInteger(numero) && numero >= 1 && numero <= 13
    ? numero
    : null;
}

export function SchoolClassesManager() {
  return (
    <ResourceManager<SchoolClass>
      title="Lista de classes"
      noun="classes"
      addLabel="Nova classe"
      icon={Layers}
      searchPlaceholder="Pesquise por classe, ex.: 10"
      emptyMessage="Ainda não existem classes cadastradas."
      store={schoolClassesStore}
      columns={[
        {
          label: "Classe",
          render: (c) => (
            <span className="font-medium">{schoolClassLabel(c)}</span>
          ),
        },
      ]}
      getLabel={schoolClassLabel}
      searchText={(c) => [String(c.numero), schoolClassLabel(c)]}
      compare={(a, b) => a.numero - b.numero}
      dialog={{
        titles: {
          create: "Nova classe",
          edit: "Editar classe",
          view: "Dados da classe",
        },
        descriptions: {
          create: "Indique o número da classe (1 a 13).",
          edit: "Atualize o número da classe.",
          view: "Consulte a classe registada.",
        },
        submitLabel: "Cadastrar classe",
        fields: [
          {
            name: "numero",
            label: "Número da classe",
            type: "number",
            icon: Layers,
            min: 1,
            max: 13,
            required: true,
            wide: true,
            placeholder: "Ex.: 10",
          },
        ],
        emptyValues: { numero: "" },
        toValues: (c) => ({ numero: String(c.numero) }),
        validate: (values) =>
          parseClassNumber(values.numero) === null
            ? "O número da classe deve ser um inteiro entre 1 e 13."
            : null,
      }}
      fetchOne={getSchoolClassById}
      onCreate={(values, token) =>
        createSchoolClass({ numero: parseClassNumber(values.numero)! }, token)
      }
      onUpdate={(c, values, token) =>
        patchSchoolClass(
          c.id,
          { numero: parseClassNumber(values.numero)! },
          token,
        )
      }
      onDelete={(c, token) => deleteSchoolClass(c.id, token)}
    />
  );
}

function parseYear(value: string) {
  const year = Number(value);
  return Number.isInteger(year) && year >= 2000 && year <= 2100 ? year : null;
}

/** A API só permite listar, detalhar e criar anos letivos. */
export function SchoolYearsManager() {
  return (
    <ResourceManager<SchoolYear>
      title="Lista de anos letivos"
      noun="anos letivos"
      addLabel="Novo ano letivo"
      icon={CalendarRange}
      searchPlaceholder="Pesquise por ano, ex.: 2026"
      emptyMessage="Ainda não existem anos letivos cadastrados."
      store={schoolYearsStore}
      columns={[
        {
          label: "Ano letivo",
          render: (y) => <span className="font-medium">{schoolYearLabel(y)}</span>,
        },
        {
          label: "Início",
          className: "w-[140px]",
          render: (y) => y.ano_inicio,
        },
        {
          label: "Fim",
          className: "w-[140px]",
          render: (y) => y.ano_fim,
        },
      ]}
      getLabel={schoolYearLabel}
      searchText={(y) => [schoolYearLabel(y)]}
      compare={(a, b) => b.ano_inicio - a.ano_inicio}
      dialog={{
        titles: {
          create: "Novo ano letivo",
          edit: "Editar ano letivo",
          view: "Dados do ano letivo",
        },
        descriptions: {
          create: "Indique o ano de início e de fim do ano letivo.",
          edit: "",
          view: "Consulte o ano letivo registado.",
        },
        submitLabel: "Cadastrar ano letivo",
        fields: [
          {
            name: "ano_inicio",
            label: "Ano de início",
            type: "number",
            icon: CalendarRange,
            min: 2000,
            max: 2100,
            required: true,
            placeholder: "Ex.: 2026",
          },
          {
            name: "ano_fim",
            label: "Ano de fim",
            type: "number",
            icon: CalendarRange,
            min: 2000,
            max: 2100,
            required: true,
            placeholder: "Ex.: 2027",
          },
        ],
        emptyValues: { ano_inicio: "", ano_fim: "" },
        toValues: (y) => ({
          ano_inicio: String(y.ano_inicio),
          ano_fim: String(y.ano_fim),
        }),
        validate: (values) => {
          const inicio = parseYear(values.ano_inicio);
          const fim = parseYear(values.ano_fim);
          if (inicio === null || fim === null) {
            return "Indique anos válidos entre 2000 e 2100.";
          }
          if (fim <= inicio) {
            return "O ano de fim deve ser posterior ao ano de início.";
          }
          return null;
        },
      }}
      fetchOne={getSchoolYearById}
      onCreate={(values, token) =>
        createSchoolYear(
          {
            ano_inicio: parseYear(values.ano_inicio)!,
            ano_fim: parseYear(values.ano_fim)!,
          },
          token,
        )
      }
    />
  );
}

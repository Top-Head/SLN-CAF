"use client";

import { useSearchParams } from "next/navigation";

import { PageTabs } from "@/components/shared/page-tabs";

import {
  CurriculumManager,
  EnrollmentsManager,
  TurmaDisciplinasManager,
} from "./flow-managers";
import {
  CoursesManager,
  SchoolClassesManager,
  SchoolYearsManager,
} from "./structure-managers";
import { TurmasList } from "./turmas-list";

const TABS = [
  { key: "turmas", label: "Turmas", render: () => <TurmasList /> },
  { key: "matriculas", label: "Matrículas", render: () => <EnrollmentsManager /> },
  { key: "disciplinas", label: "Disciplinas por turma", render: () => <TurmaDisciplinasManager /> },
  { key: "plano", label: "Plano curricular", render: () => <CurriculumManager /> },
  { key: "cursos", label: "Cursos", render: () => <CoursesManager /> },
  { key: "classes", label: "Classes", render: () => <SchoolClassesManager /> },
  { key: "anos", label: "Anos letivos", render: () => <SchoolYearsManager /> },
];

/**
 * Turmas e o que delas depende no fluxo académico: matrículas, disciplinas
 * por turma (professor) e plano curricular, mais a estrutura (cursos, classes,
 * anos letivos). `?tab=` abre um separador (usado pela página Fluxo académico).
 */
export function AcademicStructure() {
  const tab = useSearchParams().get("tab") ?? undefined;
  return (
    <PageTabs
      key={tab}
      label="Estrutura académica"
      tabs={TABS}
      defaultTab={TABS.some((t) => t.key === tab) ? tab : "turmas"}
    />
  );
}

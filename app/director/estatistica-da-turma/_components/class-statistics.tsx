"use client";

import { Calendar, Download } from "lucide-react";
import { useState } from "react";

import { summarizeReport } from "@/components/shared/class-report/report";
import { FilterSelect } from "@/components/shared/filter-select";
import { PageContext } from "@/components/shared/page-context";
import { ApprovalDonut } from "@/components/shared/statistics/approval-donut";
import { PerformanceTable } from "@/components/shared/statistics/performance-table";
import { SubjectAverageChart } from "@/components/shared/statistics/subject-average-chart";
import { SummaryCards } from "@/components/shared/summary-cards";
import { formatGrade } from "@/lib/utils/format-grade";

import { CLASS_INFO, CLASS_SIZE, CLASS_STUDENTS, CLASS_SUBJECTS } from "../../_lib/class-data";

const YEARS = ["2025/2026", "2024/2025"];
const TRIMESTERS = ["1.º Trimestre", "2.º Trimestre", "3.º Trimestre"];
const ALL_SUBJECTS = "Todas as disciplinas";

/** Só as disciplinas que já têm notas lançadas entram no gráfico e na tabela. */
const graded = CLASS_SUBJECTS.filter(
  (s): s is typeof s & { average: number } => s.average !== null,
);

export function ClassStatistics() {
  const [year, setYear] = useState(YEARS[0]);
  const [trimester, setTrimester] = useState(TRIMESTERS[0]);
  const [subject, setSubject] = useState(ALL_SUBJECTS);

  const subjects = subject === ALL_SUBJECTS ? graded : graded.filter((s) => s.name === subject);
  const { counts } = summarizeReport(CLASS_STUDENTS);

  return (
    <div className="flex flex-col gap-6">
      <SummaryCards
        className="gap-[30px]"
        stats={[
          { label: "Estudantes", value: CLASS_SIZE, icon: "/images/teacher-avatar.png", avatar: true },
          {
            label: "Desempenho geral",
            value: formatGrade(CLASS_INFO.average),
            icon: "/icons/evaluations.svg",
            tone: "positive",
          },
          {
            label: "Notas positivas",
            value: CLASS_INFO.positiveGrades,
            icon: "/icons/thumbs-up.svg",
            tone: "positive",
            iconSize: 24,
          },
          {
            label: "Notas negativas",
            value: CLASS_INFO.negativeGrades,
            icon: "/icons/thumbs-down.svg",
            iconSize: 24,
          },
        ]}
      />

      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <PageContext
          title={`${CLASS_INFO.name} · ${CLASS_INFO.course}`}
          subtitle={`${trimester.replace("Trimestre", "trimestre")} · consulta só de leitura`}
        />
        <FilterSelect label="Ano lectivo" icon={Calendar} value={year} options={YEARS} onChange={setYear} />
        <FilterSelect label="Trimestre" value={trimester} options={TRIMESTERS} onChange={setTrimester} />
        <FilterSelect
          label="Disciplina"
          value={subject}
          options={[ALL_SUBJECTS, ...graded.map((s) => s.name)]}
          onChange={setSubject}
        />
        <button
          type="button"
          onClick={() => window.print()}
          className="flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Download className="size-4" />
          Exportar relatório
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
        <SubjectAverageChart
          data={subjects.map(({ name, average }) => ({ subject: name, average }))}
        />
        <ApprovalDonut
          approval={{ passed: counts.passed, failed: counts.failed, other: counts.pending }}
          subtitle={`Situação provisória dos ${CLASS_STUDENTS.length} estudantes da turma`}
          otherLabel="Pendentes"
        />
      </div>

      <PerformanceTable
        title="Desempenho por disciplina"
        description={`Média, positivas e negativas de cada disciplina no ${trimester.toLowerCase()}`}
        rows={subjects.map((s) => ({
          name: s.name,
          detail: `Prof. ${s.teacher}`,
          students: CLASS_SIZE,
          average: s.average,
          passed: s.passed,
          failed: s.failed,
        }))}
        labels={{
          name: "Disciplina",
          average: "Média",
          passed: "Positivas",
          failed: "Negativas",
          rate: "Taxa de positivas",
        }}
        link={{ href: "/director/pauta-trimestral", label: "Ver pauta trimestral" }}
        thresholds={{ good: 50, warning: 40 }}
      />
    </div>
  );
}

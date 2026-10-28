import { Clock, ThumbsDown, ThumbsUp, UsersRound } from "lucide-react";

import { CLASS_INFO, CLASS_SIZE, CLASS_SUBJECTS, subjectStatus } from "../_lib/class-data";
import { AttentionStudents } from "./_components/attention-students";
import { ClassHighlight } from "./_components/class-highlight";
import { ClassIndicators } from "./_components/class-indicators";
import { QuickAccess } from "./_components/quick-access";
import { SubjectLaunchTable } from "./_components/subject-launch-table";
import { ATTENTION_STUDENTS } from "./_lib/mock-data";

const percentOf = (part: number, total: number) =>
  `${total === 0 ? 0 : Math.round((part / total) * 100)}%`;

export default function DirectorDashboardPage() {
  const unfinished = CLASS_SUBJECTS.filter((s) => subjectStatus(s) !== "done");
  const { positiveGrades, negativeGrades } = CLASS_INFO;
  const launchedGrades = positiveGrades + negativeGrades;

  return (
    <div className="flex flex-col gap-6">
      <ClassHighlight
        name={CLASS_INFO.name}
        course={CLASS_INFO.course}
        students={CLASS_SIZE}
        subjects={CLASS_SUBJECTS.length}
        doneSubjects={CLASS_SUBJECTS.length - unfinished.length}
        average={CLASS_INFO.average}
      />

      <ClassIndicators
        items={[
          {
            label: "Estudantes",
            value: CLASS_SIZE,
            hint: `${CLASS_INFO.female} F · ${CLASS_INFO.male} M`,
            icon: UsersRound,
            tone: "primary",
          },
          {
            label: "Notas positivas",
            value: positiveGrades,
            hint: `${percentOf(positiveGrades, launchedGrades)} das notas lançadas`,
            icon: ThumbsUp,
            tone: "positive",
          },
          {
            label: "Notas negativas",
            value: negativeGrades,
            hint: `${percentOf(negativeGrades, launchedGrades)} das notas lançadas`,
            icon: ThumbsDown,
            tone: "primary",
          },
          {
            label: "Disciplinas por concluir",
            value: `${unfinished.length} / ${CLASS_SUBJECTS.length}`,
            hint: unfinished.map((s) => s.name).join(", ") || "Todas concluídas",
            icon: Clock,
            tone: "pending",
          },
        ]}
      />

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <SubjectLaunchTable subjects={CLASS_SUBJECTS} />
        <div className="flex w-full flex-col gap-6 xl:w-[340px] xl:shrink-0">
          <AttentionStudents rule={CLASS_INFO.transitionRule} students={ATTENTION_STUDENTS} />
          <QuickAccess />
        </div>
      </div>
    </div>
  );
}

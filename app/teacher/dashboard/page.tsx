import { SummaryCards } from "@/components/shared/summary-cards";
import { WelcomeBanner } from "./_components/banner";
import { TEACHER_DASHBOARD_MOCK, TEACHER_SUMMARY_STATS } from "./_lib/mock-data";

export default function TeacherDashboardPage() {
  const { name, pendingStudents, pendingReports, nextDeadline, continueHref, classesHref } = TEACHER_DASHBOARD_MOCK;

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner
        name={name}
        pendingStudents={pendingStudents}
        pendingReports={pendingReports}
        nextDeadline={nextDeadline}
        continueHref={continueHref}
        classesHref={classesHref}
      />

      <SummaryCards stats={TEACHER_SUMMARY_STATS} />
    </div>
  );
}
import { ClassReport } from "./_components/class-report";
import { REPORT_STUDENTS } from "./_lib/mock-data";

export default function ReportsPage() {
  return <ClassReport students={REPORT_STUDENTS} />;
}

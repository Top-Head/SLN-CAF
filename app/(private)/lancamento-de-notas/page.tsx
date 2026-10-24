import { GradeEntry } from "./_components/grade-entry";
import { STUDENTS } from "./_lib/mock-data";

export default function GradeEntryPage() {
  return <GradeEntry students={STUDENTS} />;
}

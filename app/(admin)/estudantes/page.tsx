import { StudentsList } from "./_components/students-list";
import { STUDENTS } from "./_lib/mock-data";

export default function StudentsPage() {
  return <StudentsList students={STUDENTS} />;
}

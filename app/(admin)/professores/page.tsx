import { TeachersList } from "./_components/teachers-list";
import { TEACHERS } from "./_lib/mock-data";

export default function TeachersPage() {
  return <TeachersList teachers={TEACHERS} />;
}

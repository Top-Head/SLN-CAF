import { SubjectsCatalog } from "./_components/subjects-catalog";
import { SUBJECTS } from "./_lib/mock-data";

export default function SubjectsPage() {
  return <SubjectsCatalog subjects={SUBJECTS} />;
}

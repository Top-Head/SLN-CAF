import { ClassesCatalog } from "@/app/(private)/turmas/_components/classes-catalog";
import { CLASSES } from "@/app/(private)/turmas/_lib/mock-data";

export default function TeacherTurmasPage() {
  return <ClassesCatalog classes={CLASSES} />;
}

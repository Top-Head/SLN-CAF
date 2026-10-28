import { ClassesCatalog } from "@/app/(admin)/turmas/_components/classes-catalog";
import { CLASSES } from "@/app/(admin)/turmas/_lib/mock-data";

export default function TeacherTurmasPage() {
  return <ClassesCatalog classes={CLASSES} />;
}

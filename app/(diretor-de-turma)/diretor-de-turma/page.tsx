import { redirect } from "next/navigation";

export const instant = false;

export default function DirectorPage() {
  redirect("/diretor-de-turma/dashboard");
}

import { redirect } from "next/navigation";

export const instant = false;

export default function TeacherPage() {
  redirect("/teacher/dashboard");
}

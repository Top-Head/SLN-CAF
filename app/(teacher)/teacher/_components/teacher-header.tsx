"use client";

import { Header } from "@/components/shared/header";
import { useAuth } from "@/hooks/auth/use-auth";

export function TeacherHeader() {
  const { user } = useAuth();

  const name = user?.name ?? user?.email ?? "Professor";
  const email = user?.email ?? "";

  return <Header user={{ name, email }} hasNotifications role="teacher" />;
}

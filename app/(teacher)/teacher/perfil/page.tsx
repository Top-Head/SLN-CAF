"use client";

import { PersonalInfoCard } from "@/components/shared/profile/personal-info-card";
import { ProfileOverview } from "@/components/shared/profile/profile-overview";
import { SecurityCard } from "@/components/shared/profile/security-card";
import { SignOutCard } from "@/components/shared/profile/sign-out-card";
import { useAuth } from "@/hooks/auth/use-auth";
import type { Profile } from "@/types/profile.types";

import { PERSONAL_INFO, PROFILE, SECURITY, SESSIONS } from "./_lib/mock-data";

export default function TeacherPerfilPage() {
  const { user } = useAuth();

  const displayName = user?.name ?? user?.email ?? "Professor";
  const email = user?.email ?? "";

  const profile: Profile = {
    ...PROFILE,
    displayName,
    email,
  };

  const personalInfo = PERSONAL_INFO.map((field) =>
    field.label === "Nome completo" ? { ...field, value: displayName } : field,
  );

  return (
    <div className="flex flex-col gap-6">
      <ProfileOverview profile={profile} />
      <div className="grid gap-6 lg:grid-cols-2">
        <PersonalInfoCard
          fields={personalInfo}
          description="Dados usados em mini-pautas, pautas e boletins"
        />
        <SecurityCard security={SECURITY} sessions={SESSIONS} />
      </div>
      <SignOutCard />
    </div>
  );
}

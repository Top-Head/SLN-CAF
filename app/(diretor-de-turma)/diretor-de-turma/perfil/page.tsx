import { PersonalInfoCard } from "@/components/shared/profile/personal-info-card";
import { ProfileOverview } from "@/components/shared/profile/profile-overview";
import { SecurityCard } from "@/components/shared/profile/security-card";
import { SignOutCard } from "@/components/shared/profile/sign-out-card";

import { PERSONAL_INFO, PROFILE, SECURITY, SESSIONS } from "./_lib/mock-data";

export default function DirectorProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <ProfileOverview profile={PROFILE} />
      <div className="grid gap-6 lg:grid-cols-2">
        <PersonalInfoCard
          fields={PERSONAL_INFO}
          description="Dados usados em pautas e boletins da turma"
        />
        <SecurityCard security={SECURITY} sessions={SESSIONS} />
      </div>
      <SignOutCard />
    </div>
  );
}

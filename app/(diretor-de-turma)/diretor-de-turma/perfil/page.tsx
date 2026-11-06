import { ProfileView } from "@/components/shared/profile/profile-view";

import { PERSONAL_INFO, PROFILE, SECURITY, SESSIONS } from "./_lib/mock-data";

export default function DirectorProfilePage() {
  return (
    <ProfileView
      description="Dados usados em pautas e boletins da turma"
      fallback={{
        profile: PROFILE,
        personalInfo: PERSONAL_INFO,
        security: SECURITY,
        sessions: SESSIONS,
      }}
    />
  );
}

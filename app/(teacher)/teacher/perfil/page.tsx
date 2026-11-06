import { ProfileView } from "@/components/shared/profile/profile-view";

import { PERSONAL_INFO, PROFILE, SECURITY, SESSIONS } from "./_lib/mock-data";

export default function TeacherPerfilPage() {
  return (
    <ProfileView
      description="Dados usados em mini-pautas, pautas e boletins"
      fallback={{
        profile: PROFILE,
        personalInfo: PERSONAL_INFO,
        security: SECURITY,
        sessions: SESSIONS,
      }}
    />
  );
}

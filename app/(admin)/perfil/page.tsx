import { ProfileView } from "@/components/shared/profile/profile-view";

import { PERSONAL_INFO, PROFILE, SECURITY, SESSIONS } from "./_lib/mock-data";

export default function ProfilePage() {
  return (
    <ProfileView
      fallback={{
        profile: PROFILE,
        personalInfo: PERSONAL_INFO,
        security: SECURITY,
        sessions: SESSIONS,
      }}
    />
  );
}

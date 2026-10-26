import { PersonalInfoCard } from "./_components/personal-info-card";
import { ProfileOverview } from "./_components/profile-overview";
import { SecurityCard } from "./_components/security-card";
import { SignOutCard } from "./_components/sign-out-card";
import { PERSONAL_INFO, PROFILE, SECURITY, SESSIONS } from "./_lib/mock-data";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <ProfileOverview profile={PROFILE} />
      <div className="grid gap-6 lg:grid-cols-2">
        <PersonalInfoCard fields={PERSONAL_INFO} />
        <SecurityCard security={SECURITY} sessions={SESSIONS} />
      </div>
      <SignOutCard />
    </div>
  );
}

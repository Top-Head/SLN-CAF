import { Header } from "@/components/shared/header";
import { Sidebar } from "@/components/shared/sidebar";
import type { User } from "@/types/user";

import { LaunchStatusCard } from "./_components/launch-status-card";

const currentUser: User = {
  name: "Paulo Sanguli",
  email: "paulo.sanguli@slmcaf.edu.ao",
};

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar role="teacher" footer={<LaunchStatusCard />} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={currentUser} hasNotifications role="teacher" />
        <main className="flex-1 px-6 py-7 lg:px-12">{children}</main>
      </div>
    </div>
  );
}

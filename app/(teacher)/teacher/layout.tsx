import { Sidebar } from "@/components/shared/sidebar";

import { LaunchStatusCard } from "./_components/launch-status-card";
import { TeacherHeader } from "./_components/teacher-header";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar role="teacher" footer={<LaunchStatusCard />} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TeacherHeader />
        <main className="flex-1 px-6 py-7 lg:px-12">{children}</main>
      </div>
    </div>
  );
}

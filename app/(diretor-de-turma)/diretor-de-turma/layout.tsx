import { Header } from "@/components/shared/header";
import { Sidebar } from "@/components/shared/sidebar";
import type { User } from "@/types/user";

import { ReadOnlyCard } from "./_components/read-only-card";

const currentUser: User = {
  name: "Paulo Sanguli",
  email: "paulo.sanguli@caf.ao",
};

export default function DirectorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar role="director" footer={<ReadOnlyCard />} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={currentUser} hasNotifications role="director" />
        <main className="flex-1 px-6 py-7 lg:px-12">{children}</main>
      </div>
    </div>
  );
}

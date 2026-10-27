import { Header } from "@/components/shared/header";
import { Sidebar } from "@/components/shared/sidebar";
import type { User } from "@/types/user";

const currentUser: User = {
  name: "Edilson Capa",
  email: "edilsoncapo@gmail.com",
};

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={currentUser} hasNotifications />
        <main className="flex-1 px-6 py-7 lg:px-12">{children}</main>
      </div>
    </div>
  );
}

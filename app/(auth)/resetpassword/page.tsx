import { Suspense } from "react";

import ResetPassword from "@/components/_components/reset-password";
import { BrandLogo } from "@/components/shared/brand-logo";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  return (
    <main className="relative flex min-h-screen flex-col bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[68px] bg-repeat-x"
        style={{
          backgroundImage: 'url("/auth/plus-pattern.svg")',
          backgroundSize: "auto 100%",
        }}
      />

      <header className="relative z-10 px-25 pt-3">
        <BrandLogo />
      </header>

      <section className="relative z-10 flex flex-1 items-center justify-center px-6 pb-24">
        <Suspense fallback={<p role="status">A carregar o formulário...</p>}>
          <ResetPasswordForm searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}

async function ResetPasswordForm({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return <ResetPassword token={typeof token === "string" ? token : ""} />;
}
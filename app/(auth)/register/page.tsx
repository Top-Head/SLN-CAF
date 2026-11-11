import { RegisterForm } from "@/components/_components/register-form";
import { BrandLogo } from "@/components/shared/brand-logo";

export default function RegisterPage() {
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

      <header className="relative z-10 px-[100px] pt-3">
        <BrandLogo />
      </header>

      <section className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <RegisterForm />
      </section>
    </main>
  );
}

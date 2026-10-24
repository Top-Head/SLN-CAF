import ForgotPasswordForm from "@/components/_components/forgot-password-form";
import { LoginForm } from "@/components/_components/login-form";
import { BrandLogo } from "@/components/shared/brand-logo";

export default function ForgotPasswordPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[68px] bg-repeat-x"
        style={{
          backgroundImage: 'url("/auth/Plus%20Pattern.png")',
          backgroundSize: "auto 100%",
        }}
      />

      <header className="relative z-10 px-[100px] pt-3">
        <BrandLogo />
      </header>

      <section className="relative z-10 flex flex-1 items-center justify-center px-6 pb-24">
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
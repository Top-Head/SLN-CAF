import Link from "next/link";

import { BrandLogo } from "@/components/shared/brand-logo";
import { ValidateCodeForm } from "@/components/shared/report-card/validate-code-form";

export const metadata = {
  title: "Consultar boletim",
};

/** Página pública: o encarregado consulta o boletim com o código de acesso. */
export default function ReportCardPage() {
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

      <header className="relative z-10 px-6 pt-3 lg:px-[100px]">
        <BrandLogo />
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 pt-16 pb-24">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-[#1C1C1C]">Consultar boletim</h1>
          <p className="text-sm text-[#999999]">
            Introduza o código de acesso partilhado pela escola para ver as notas do
            estudante. Cada código é válido durante 2 dias.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <ValidateCodeForm autoFocus />
        </div>

        <Link href="/login" className="text-sm text-primary hover:underline">
          Sou funcionário da escola — iniciar sessão
        </Link>
      </section>
    </main>
  );
}

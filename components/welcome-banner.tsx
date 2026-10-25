import Link from "next/link";

type WelcomeBannerProps = {
  name: string;
  pendingStudents: number;
  pendingReports: number;
  nextDeadline: {
    subject: string;
    label: string;
    date: Date | string;
  };
  continueHref?: string;
  classesHref?: string;
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 19) return "Boa tarde";
  return "Boa noite";
}

export function WelcomeBanner({
  name = "Paulo",
  pendingStudents = 55,
  pendingReports = 3,
  nextDeadline = {
    subject: "Física · 10.ª IB",
    label: "Física · 08 Dez, 23:59",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  continueHref = "/teacher/lancamento-de-notas",
  classesHref = "/teacher/turmas",
}: WelcomeBannerProps) {
  return (
    <section className="relative isolate overflow-hidden rounded-2xl bg-[#E8395B] px-6 py-8 text-white shadow-sm sm:px-8 md:py-9">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-36 right-28 -z-10 h-[300px] w-[300px] rounded-full bg-[#FFC43D] md:right-44"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -right-20 -z-10 h-[260px] w-[260px] rounded-full bg-[#FF8159]"
      />

      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight">
            {greeting()}, {name}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-white/90">
            Faltam {pendingStudents} estudantes por completar em {pendingReports} mini-pautas. O prazo mais próximo é {nextDeadline.subject}, que fecha a 8 de Dezembro.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={continueHref}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#E8395B] transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Continuar lançamento
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={classesHref}
              className="inline-flex items-center rounded-lg border border-white/50 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Ver minhas turmas
            </Link>
          </div>
        </div>

        <aside
          aria-label="Próximo prazo"
          className="w-full rounded-xl bg-white px-6 py-5 text-center shadow-lg md:w-52 md:shrink-0"
        >
          <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
            Próximo prazo
          </p>
          <p className="mt-2 text-neutral-900">
            <span className="text-5xl font-bold leading-none">2</span>
            <span className="ml-1 text-sm text-neutral-500">dias</span>
          </p>
          <p className="mt-3 text-xs font-medium text-[#E8395B]">
            {nextDeadline.label}
          </p>
        </aside>
      </div>
    </section>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

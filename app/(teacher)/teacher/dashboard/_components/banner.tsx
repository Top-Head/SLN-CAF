import Link from "next/link";
import { connection } from "next/server";

import { ArrowRight } from "./arrow-right";
import { daysUntil, formatDeadlineDay, greeting } from "../_lib/utils";

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

export async function WelcomeBanner({
  name,
  pendingStudents,
  pendingReports,
  nextDeadline,
  continueHref = "/teacher/lancamento-de-notas",
  classesHref = "/teacher/turmas",
}: WelcomeBannerProps) {
  await connection();
  const days = daysUntil(nextDeadline.date);
  const deadlineDay = formatDeadlineDay(nextDeadline.date);

  return (
    <section className="relative h-[181px] isolate overflow-hidden rounded-xl bg-[#E8395B] px-8 py-7 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute right-11 top-15.5 -z-10 h-62.5 w-62.5 rounded-full bg-[#FF8159]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[106px] top-[10px] -z-10 h-[300px] w-[300px] rounded-full bg-[#FFC43D]"
      />

      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-lg">
          <h2 className="text-[22px] font-bold leading-7 tracking-tight">
            {greeting()}, {name}
          </h2>

          <p className="mt-2 text-[13px] leading-4 text-white/90">
            Faltam {pendingStudents} estudantes por completar em {pendingReports} mini-pautas. O prazo mais próximo é {nextDeadline.subject}, que fecha a {deadlineDay}.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link
              href={continueHref}
              className="inline-flex h-10 items-center gap-2.5 rounded-lg bg-white px-4 text-sm font-medium text-[#E8395B] transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Continuar lançamento
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={classesHref}
              className="inline-flex h-10 items-center rounded-lg border border-white/40 bg-transparent px-4 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Ver minhas turmas
            </Link>
          </div>
        </div>

        <aside
          aria-label="Próximo prazo"
          className="w-full rounded-xl bg-white px-5 py-4 text-center shadow-[0_8px_20px_rgba(0,0,0,0.12)] md:w-40 md:shrink-0"
        >
          <p className="text-[10px] font-medium uppercase leading-3 text-neutral-500">
            Próximo prazo
          </p>
          <p className="mt-1 flex items-baseline justify-center gap-1.5 text-neutral-900">
            <span className="text-4xl font-bold leading-none">{days}</span>
            <span className="text-[13px] font-medium text-neutral-500">
              {days === 1 ? "dia" : "dias"}
            </span>
          </p>
          <p className="mt-1.5 text-[11px] font-medium leading-3.5 text-[#E8395B]">
            {nextDeadline.label}
          </p>
        </aside>
      </div>
    </section>
  );
}
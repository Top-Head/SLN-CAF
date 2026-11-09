"use client";

import { BookOpenCheck } from "lucide-react";
import Link from "next/link";

import { ArrowRight } from "./arrow-right";
import { greeting } from "../_lib/utils";

type WelcomeBannerProps = {
  name: string;
  pendingStudents?: number;
  pendingReports?: number;
  trimester?: number;
  continueHref?: string;
  classesHref?: string;
};

export function WelcomeBanner({
  name,
  pendingStudents,
  pendingReports,
  trimester,
  continueHref = "/teacher/lancamento-de-notas",
  classesHref = "/teacher/turmas",
}: WelcomeBannerProps) {
  return (
    <section className="relative isolate min-h-[181px] overflow-hidden rounded-xl bg-[#E8395B] px-6 py-6 text-white sm:px-8 sm:py-7">
      <div
        aria-hidden
        className="pointer-events-none absolute right-11 top-15.5 -z-10 h-62.5 w-62.5 rounded-full bg-[#FF8159]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[106px] top-[10px] -z-10 h-[300px] w-[300px] rounded-full bg-[#FFC43D]"
      />

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2
            suppressHydrationWarning
            className="text-[22px] font-bold leading-7 tracking-tight"
          >
            {greeting()}, {name}
          </h2>

          <p className="mt-2 text-[13px] leading-5 text-white/90">
            {pendingStudents !== undefined
              ? pendingStudents === 0
                ? `Não há estudantes com notas em falta nas ${pendingReports ?? 0} mini-pautas. Consulte as suas turmas para acompanhar os lançamentos.`
                : `${pendingStudents} ${pendingStudents === 1 ? "estudante tem" : "estudantes têm"} notas por completar em ${pendingReports ?? 0} mini-pautas.`
              : "Consulte as suas turmas, acompanhe as mini-pautas e mantenha os lançamentos organizados."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
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

        <aside className="flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-neutral-900 shadow-[0_8px_20px_rgba(0,0,0,0.12)] sm:px-5 md:w-56 md:shrink-0">
          {trimester !== undefined ? (
            <>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#E8395B]">
                <BookOpenCheck aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                  Trimestre em curso
                </span>
                <span className="mt-0.5 block text-xl font-bold leading-tight">
                  {trimester}.º trimestre
                </span>
                <span className="mt-1 block text-[11px] text-[#E8395B]">
                  Lançamento de notas
                </span>
              </span>
            </>
          ) : (
            <>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#E8395B]">
                <BookOpenCheck aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                  Área do professor
                </span>
                <span className="mt-0.5 block text-sm font-bold leading-snug">
                  Turmas e avaliações
                </span>
                <span className="mt-1 block text-[11px] leading-snug text-neutral-500">
                  Tudo o que precisa para gerir os seus lançamentos.
                </span>
              </span>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}

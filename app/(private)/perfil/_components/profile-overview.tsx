import { Pencil } from "lucide-react";
import Image from "next/image";

import type { PROFILE } from "../_lib/mock-data";

function ContactItem({
  label,
  icon,
  value,
  href,
}: {
  label: string;
  icon: string;
  value: string;
  href: string;
}) {
  return (
    <div className="flex flex-col gap-7">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <a href={href} className="flex items-center gap-4 hover:underline">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary">
          <Image src={icon} alt="" width={24} height={24} />
        </span>
        <span className="text-[15px] font-medium">{value}</span>
      </a>
    </div>
  );
}

export function ProfileOverview({ profile }: { profile: typeof PROFILE }) {
  return (
    <section className="relative overflow-hidden rounded-[20px] border border-black/[0.07] bg-card">
      {/* Capa com os dois círculos decorativos do Figma */}
      <div aria-hidden className="relative h-[140px] overflow-hidden bg-primary shadow-card">
        <span className="absolute top-[77px] left-[58.6%] size-[274px] rounded-full bg-[#fb7d5b]" />
        <span className="absolute top-[31.6px] left-[70.1%] size-[274px] rounded-full bg-warning" />
      </div>

      <div className="absolute top-8 left-[33px] size-[164px] overflow-hidden rounded-full border-8 border-white bg-muted">
        <Image
          src={profile.avatar}
          alt={`Fotografia de ${profile.displayName}`}
          fill
          sizes="164px"
          className="object-cover"
          priority
        />
      </div>

      <button
        type="button"
        className="absolute top-[136px] right-6 flex h-[38px] items-center gap-2 rounded-md border bg-card pr-4 pl-3.5 text-[13px] font-medium transition-colors hover:bg-muted md:right-[83px]"
      >
        <Pencil className="size-4 text-neutral" />
        Editar perfil
      </button>

      <div className="grid gap-x-6 gap-y-8 px-[33px] pt-[72px] pb-9 md:grid-cols-[284px_minmax(0,283px)_1fr]">
        <div className="flex flex-col">
          <h2 className="font-sans text-[28px] font-bold">{profile.displayName}</h2>
          <p className="mt-1.5 text-sm font-medium text-neutral">{profile.role}</p>
          <p className="mt-3.5 flex items-center gap-2 text-sm text-muted-foreground">
            <Image src="/icons/location.svg" alt="" width={24} height={24} />
            {profile.location}
          </p>
        </div>
        <div className="md:pt-7">
          <ContactItem
            label="Telefone"
            icon="/icons/call-white.svg"
            value={profile.phone}
            href={`tel:${profile.phone.replace(/\s/g, "")}`}
          />
        </div>
        <div className="md:pt-7">
          <ContactItem
            label="Email"
            icon="/icons/email-white.svg"
            value={profile.email}
            href={`mailto:${profile.email}`}
          />
        </div>
      </div>
    </section>
  );
}

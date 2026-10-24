import Image from "next/image";
import Link from "next/link";

export function BrandLogo() {
  return (
    <Link
      href="/"
      aria-label="Ir para a página inicial"
      className="flex w-fit items-center gap-2"
    >
      <Image
        src="/logo/Easy Meal Logo.png"
        alt="Easy Meal"
        width={36}
        height={36}
        priority
        className="block shrink-0"
      />
      <span className="pt-2 text-[20px] font-bold">SLN CAF</span>
    </Link>
  );
}
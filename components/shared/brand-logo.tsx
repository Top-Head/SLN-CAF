import Image from "next/image";

export function BrandLogo() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo/colegio-arvore-da-felicidade.png"
        alt="Colégio Árvore da Felicidade"
        width={44}
        height={44}
        priority
        className="block shrink-0"
      />
      <span className="text-[20px] font-bold pt-2">SLN CAF</span>
    </div>
  );
}
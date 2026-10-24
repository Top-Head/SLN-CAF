import Image from "next/image";

export function BrandLogo() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo/Easy Meal Logo.png"
        alt="Easy Meal"
        width={36}
        height={36}
        priority
        className="block shrink-0"
      />
      <span className="text-[20px] font-bold pt-2">SLN CAF</span>
    </div>
  );
}
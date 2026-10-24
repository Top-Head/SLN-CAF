import { Plus } from "lucide-react";
import Image from "next/image";

type ListHeaderProps = {
  title: string;
  count: number;
  addLabel: string;
  onAdd?: () => void;
  onFilter?: () => void;
};

export function ListHeader({
  title,
  count,
  addLabel,
  onAdd,
  onFilter,
}: ListHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h2 className="font-sans text-base font-medium tracking-[0.32px] text-[#1c1d26]">
        {title} ({count.toLocaleString("pt-PT")})
      </h2>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onFilter}
          className="flex h-[39px] items-center gap-2 rounded-md border-2 border-[#e0e0e0] px-4 text-sm font-medium text-[#6b6b6b] transition-colors hover:bg-muted"
        >
          <Image src="/icons/filter.svg" alt="" width={16} height={16} />
          Filtrar
        </button>
        <button
          type="button"
          onClick={onAdd}
          className="flex h-[39px] items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {addLabel}
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

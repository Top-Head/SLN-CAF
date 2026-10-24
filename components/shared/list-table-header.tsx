import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type ListColumn = {
  label: string;
  className?: string;
};

export function ListTableHeader({ columns }: { columns: ListColumn[] }) {
  return (
    <TableHeader className="[&_tr]:border-0">
      <TableRow className="hover:bg-transparent">
        {columns.map(({ label, className }, i) => (
          <TableHead
            key={label || i}
            className={cn(
              "h-11 bg-table-head text-[11px] font-medium text-muted-foreground uppercase",
              i === 0 && "rounded-l-md pl-4",
              i === columns.length - 1 && "rounded-r-md pr-4",
              className,
            )}
          >
            {label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

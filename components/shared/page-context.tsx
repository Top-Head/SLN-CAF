export function PageContext({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <h2 className="font-sans text-lg font-semibold">{title}</h2>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

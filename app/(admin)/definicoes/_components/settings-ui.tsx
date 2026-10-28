"use client";

import { Check, ChevronDown, Lock, type LucideIcon } from "lucide-react";
import { useId } from "react";

import { ToggleSwitch } from "@/components/shared/toggle-switch";
import { cn } from "@/lib/utils";

export function SettingsSection({
  id,
  title,
  description,
  danger,
  children,
}: {
  id?: string;
  title: string;
  description: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  const titleId = useId();
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn(
        "flex scroll-mt-24 flex-col gap-5 rounded-lg border p-6",
        danger ? "border-accent bg-[#fef6f7]" : "bg-card",
      )}
    >
      <div className="flex flex-col gap-1">
        <h2
          id={titleId}
          className={cn("font-sans text-[15px] font-semibold", danger && "text-primary")}
        >
          {title}
        </h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

/** Etiqueta pequena em maiúsculas que separa grupos dentro de uma secção. */
export function SettingsGroupLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[11px] font-medium text-muted-foreground uppercase">{children}</h3>;
}

export function Divider() {
  return <hr className="border-border" />;
}

export function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div className={cn("flex min-w-0 flex-1 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-xs font-medium text-neutral">
        {label}
      </label>
      {children(id)}
    </div>
  );
}

const inputBox =
  "flex h-10 w-full items-center gap-2 rounded-md border bg-card px-3 text-[13px] transition-colors focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/15";

export function TextInput({
  id,
  value,
  onChange,
  icon: Icon,
  suffix,
  type = "text",
  className,
  invalid,
  ...props
}: Omit<React.ComponentProps<"input">, "onChange" | "value"> & {
  value: string | number;
  onChange: (value: string) => void;
  icon?: LucideIcon;
  suffix?: string;
  invalid?: boolean;
}) {
  return (
    <div className={cn(inputBox, invalid && "border-destructive", className)}>
      {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
      <input
        id={id}
        type={type}
        value={value}
        aria-invalid={invalid || undefined}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent outline-none"
        {...props}
      />
      {suffix && <span className="shrink-0 text-xs text-muted-foreground">{suffix}</span>}
    </div>
  );
}

export function SelectInput<T extends string>({
  id,
  value,
  onChange,
  options,
  className,
  ...props
}: Omit<React.ComponentProps<"select">, "onChange" | "value"> & {
  value: T;
  onChange: (value: T) => void;
  options: (T | { value: T; label: string })[];
}) {
  return (
    <div className={cn(inputBox, "relative p-0", className)}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-full w-full cursor-pointer appearance-none bg-transparent pr-9 pl-3 outline-none"
        {...props}
      >
        {options.map((option) => {
          const { value: v, label } = typeof option === "string" ? { value: option, label: option } : option;
          return (
            <option key={v} value={v}>
              {label}
            </option>
          );
        })}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted-foreground" />
    </div>
  );
}

/** Linha com título e descrição à esquerda e um controlo à direita. */
export function OptionRow({
  title,
  description,
  children,
  labelFor,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  labelFor?: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        {labelFor ? (
          <label htmlFor={labelFor} className="cursor-pointer text-[13px] font-medium">
            {title}
          </label>
        ) : (
          <span className="text-[13px] font-medium">{title}</span>
        )}
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      {children}
    </div>
  );
}

/** Opção com interruptor; `locked` mostra um cadeado e impede desligar. */
export function ToggleOption({
  title,
  description,
  checked,
  onChange,
  locked,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  locked?: boolean;
}) {
  const id = useId();
  return (
    <OptionRow title={title} description={description} labelFor={id}>
      {locked && (
        <Lock aria-label="Obrigatório, não pode ser desligado" className="size-3.5 text-muted-foreground" />
      )}
      <ToggleSwitch id={id} checked={checked} onCheckedChange={onChange} disabled={locked} />
    </OptionRow>
  );
}

/** Chips arredondados que se ligam e desligam (canais, formatos). */
export function ChipGroup({
  label,
  options,
  value,
  onChange,
  offIcon: OffIcon,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  offIcon?: LucideIcon;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2.5">
      <span className="text-xs font-medium text-neutral">{label}:</span>
      {options.map((option) => {
        const on = value.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={on}
            onClick={() =>
              onChange(on ? value.filter((v) => v !== option.value) : [...value, option.value])
            }
            className={cn(
              "flex h-[30px] items-center gap-1.5 rounded-2xl border px-3 text-xs font-medium transition-colors",
              on ? "border-primary bg-accent text-primary" : "bg-card text-neutral hover:bg-muted",
            )}
          >
            {on ? <Check className="size-3.5" /> : OffIcon && <OffIcon className="size-3.5" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export const outlineButton =
  "flex h-[38px] shrink-0 items-center gap-2 rounded-md border bg-card px-3.5 text-[13px] font-medium transition-colors hover:bg-muted";

/** Tabela simples com bordas, usada nas secções académicas. */
export function SettingsTable({
  columns,
  children,
}: {
  columns: { label: string; className?: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
        <thead>
          <tr className="bg-table-head">
            {columns.map(({ label, className }) => (
              <th
                key={label}
                scope="col"
                className={cn("px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase first:pl-4", className)}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_td]:px-4 [&_td]:py-3 [&_tr]:border-t">{children}</tbody>
      </table>
    </div>
  );
}

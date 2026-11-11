"use client";

import { CircleAlert, type LucideIcon } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type DialogMode = "create" | "edit" | "view";

export type FormValues = Record<string, string>;

export type SelectOption = { value: string; label: string };

/** Valor usado no Select para "nenhum" (o Radix não aceita string vazia). */
export const NONE_VALUE = "__none__";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "number" | "select";
  icon?: LucideIcon;
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  required?: boolean;
  /** Ocupa as duas colunas da grelha. */
  wide?: boolean;
  options?: SelectOption[];
  optionsLoading?: boolean;
  /** Mostra a opção "nenhum" num select opcional. */
  noneLabel?: string;
};

type ResourceFormDialogProps<T> = {
  open: boolean;
  mode: DialogMode;
  item: T | null;
  icon: LucideIcon;
  titles: Record<DialogMode, string>;
  descriptions: Record<DialogMode, string>;
  submitLabel: string;
  fields: FieldDef[];
  emptyValues: FormValues;
  toValues: (item: T) => FormValues;
  /** Devolve uma mensagem de erro ou `null` se o formulário for válido. */
  validate?: (values: FormValues) => string | null;
  /** Lança erro para mostrar a mensagem no diálogo. */
  onSubmit: (values: FormValues) => Promise<void>;
  /** Carrega o detalhe atualizado (GET /{id}/) ao ver/editar. */
  loadItem?: (id: string) => Promise<T>;
  getId?: (item: T) => string;
  renderView?: (item: T) => ReactNode;
  onOpenChange: (open: boolean) => void;
};

export function ResourceFormDialog<T>({
  open,
  mode,
  item,
  icon: Icon,
  titles,
  descriptions,
  submitLabel,
  fields,
  emptyValues,
  toValues,
  validate,
  onSubmit,
  loadItem,
  getId,
  renderView,
  onOpenChange,
}: ResourceFormDialogProps<T>) {
  const [detail, setDetail] = useState<T | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [edits, setEdits] = useState<FormValues>({});
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemId = mode !== "create" && item && getId ? getId(item) : null;
  const loadItemRef = useRef(loadItem);

  useEffect(() => {
    loadItemRef.current = loadItem;
  });

  useEffect(() => {
    const load = loadItemRef.current;
    if (!open || !itemId || !load) return;
    let active = true;

    load(itemId)
      .then((fresh) => {
        if (active) setDetail(fresh);
      })
      .catch((cause: unknown) => {
        if (active) {
          setDetailError(
            cause instanceof Error ? cause.message : "Falha ao carregar.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [open, itemId]);

  const current = detail ?? item;
  const values: FormValues = {
    ...(mode === "create" || !current ? emptyValues : toValues(current)),
    ...edits,
  };
  const isReadOnly = mode === "view";

  function updateField(name: string, value: string) {
    setEdits((prev) => ({ ...prev, [name]: value }));
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()]),
    );
    const missing = fields.find((f) => f.required && !trimmed[f.name]);
    if (missing) {
      setError(`Preencha o campo "${missing.label}".`);
      return;
    }

    const invalid = validate?.(trimmed);
    if (invalid) {
      setError(invalid);
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      await onSubmit(trimmed);
      onOpenChange(false);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Não foi possível guardar.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader className="gap-3 text-left">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
              <Icon className="size-5" />
            </span>
            <div className="space-y-1">
              <DialogTitle className="text-lg font-bold text-[#1C1C1C]">
                {titles[mode]}
              </DialogTitle>
              <DialogDescription className="text-sm text-[#999999]">
                {descriptions[mode]}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {detailError && (
            <Alert tone="warning">
              Não foi possível atualizar os detalhes do servidor: {detailError}
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <Field
                key={field.name}
                field={field}
                value={values[field.name] ?? ""}
                disabled={isReadOnly || isPending}
                onChange={(value) => updateField(field.name, value)}
              />
            ))}
          </div>

          {isReadOnly && current && renderView?.(current)}

          {error && <Alert tone="error">{error}</Alert>}

          {!isReadOnly && (
            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => onOpenChange(false)}
                className="rounded-lg"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-primary px-5 text-white hover:bg-primary/90"
              >
                {isPending
                  ? "A guardar..."
                  : mode === "create"
                    ? submitLabel
                    : "Guardar alterações"}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  field,
  value,
  disabled,
  onChange,
}: {
  field: FieldDef;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const id = `resource-field-${field.name}`;
  const Icon = field.icon;

  return (
    <div className={cn("space-y-2", field.wide && "sm:col-span-2")}>
      <Label htmlFor={id} className="text-xs font-semibold text-[#373737]">
        {field.label}
      </Label>
      {field.type === "select" ? (
        <Select
          value={value || (field.noneLabel ? NONE_VALUE : undefined)}
          onValueChange={(next) => onChange(next === NONE_VALUE ? "" : next)}
          disabled={disabled || field.optionsLoading}
        >
          <SelectTrigger
            id={id}
            icon={Icon ? <Icon className="size-4" /> : undefined}
          >
            <SelectValue
              placeholder={
                field.optionsLoading
                  ? "A carregar..."
                  : (field.placeholder ?? "Selecione")
              }
            />
          </SelectTrigger>
          <SelectContent>
            {field.noneLabel && (
              <SelectItem value={NONE_VALUE}>{field.noneLabel}</SelectItem>
            )}
            {(field.options ?? []).map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="relative">
          {Icon && (
            <Icon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#A098AE]" />
          )}
          <Input
            id={id}
            type={field.type === "number" ? "number" : "text"}
            inputMode={field.type === "number" ? "numeric" : undefined}
            value={value}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            min={field.min}
            max={field.max}
            required={field.required}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            className={cn(
              "h-11 w-full rounded-[8px] border-[#DEDEE6] text-sm text-[#1C1C1C] placeholder:text-[#999999] focus-visible:border-primary focus-visible:ring-primary/15 disabled:bg-[#F6F6F6]",
              Icon && "pl-9",
            )}
          />
        </div>
      )}
    </div>
  );
}

function Alert({
  tone,
  children,
}: {
  tone: "error" | "warning";
  children: ReactNode;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm",
        tone === "error"
          ? "border-red-100 bg-red-50 text-red-600"
          : "border-amber-100 bg-amber-50 text-amber-800",
      )}
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

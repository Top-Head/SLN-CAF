import type { LucideIcon } from "lucide-react";

import type {
  FieldDef,
  SelectOption,
} from "@/components/shared/resource/resource-form-dialog";

/**
 * Campo para um identificador da API (matrícula, disciplina da turma).
 * Usa um select quando há opções conhecidas; senão pede o UUID à mão,
 * porque a API ainda não tem endpoint para listar estes registos.
 */
export function idField(
  name: string,
  label: string,
  icon: LucideIcon,
  options: SelectOption[],
  loading: boolean,
): FieldDef {
  return options.length > 0 || loading
    ? {
        name,
        label,
        type: "select",
        icon,
        required: true,
        wide: true,
        options,
        optionsLoading: loading,
      }
    : {
        name,
        label: `${label} (ID)`,
        icon,
        required: true,
        wide: true,
        maxLength: 36,
        placeholder: "Identificador (UUID) do registo",
      };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value: string) => UUID.test(value.trim());

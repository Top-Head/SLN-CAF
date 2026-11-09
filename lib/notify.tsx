import { Info, TriangleAlert } from "lucide-react";
import toast from "react-hot-toast";

/** Mensagem legível de um erro desconhecido (ApiError, Error ou outro). */
export function errorMessage(cause: unknown, fallback: string) {
  return cause instanceof Error && cause.message ? cause.message : fallback;
}

/**
 * Toasts da aplicação (react-hot-toast) com o mesmo estilo em todo o lado.
 * - `success`: ação concluída.
 * - `error`: ação falhou; aceita o erro apanhado e uma mensagem de recurso.
 * - `info` / `warning`: informação sobre uma ação (sem sucesso nem erro).
 */
export const notify = {
  success(message: string) {
    return toast.success(message);
  },
  error(cause: unknown, fallback = "Ocorreu um erro inesperado.") {
    const message = typeof cause === "string" ? cause : errorMessage(cause, fallback);
    return toast.error(message);
  },
  info(message: string) {
    return toast(message, {
      icon: <Info className="size-5 shrink-0 text-sky-600" aria-hidden />,
    });
  },
  warning(message: string) {
    return toast(message, {
      duration: 5000,
      icon: <TriangleAlert className="size-5 shrink-0 text-amber-500" aria-hidden />,
    });
  },
  loading(message: string) {
    return toast.loading(message);
  },
  dismiss(id?: string) {
    toast.dismiss(id);
  },
};

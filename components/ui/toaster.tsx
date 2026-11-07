"use client";

import { Toaster as HotToaster } from "react-hot-toast";

/** Contentor global dos toasts (react-hot-toast), montado no layout raiz. */
export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      gutter={10}
      containerStyle={{ top: 20, right: 20 }}
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--card)",
          color: "var(--card-foreground)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          fontSize: "13px",
          padding: "10px 14px",
          maxWidth: "380px",
          boxShadow: "0 8px 24px rgb(0 0 0 / 0.08)",
        },
        success: {
          iconTheme: { primary: "var(--success)", secondary: "#fff" },
        },
        error: {
          duration: 6000,
          iconTheme: { primary: "var(--destructive)", secondary: "#fff" },
        },
      }}
    />
  );
}

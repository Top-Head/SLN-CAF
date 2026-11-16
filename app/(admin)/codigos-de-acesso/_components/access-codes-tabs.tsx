"use client";

import { PageTabs } from "@/components/shared/page-tabs";

import { AccessCodesWorkspace } from "./access-codes-workspace";
import { IssuedCodesManager } from "./issued-codes-manager";

/** Gerar códigos (por turma/aluno) e gerir os já emitidos (revogar). */
export function AccessCodesTabs() {
  return (
    <PageTabs
      label="Códigos de acesso"
      tabs={[
        { key: "gerar", label: "Gerar códigos", render: () => <AccessCodesWorkspace /> },
        { key: "emitidos", label: "Códigos emitidos", render: () => <IssuedCodesManager /> },
      ]}
    />
  );
}

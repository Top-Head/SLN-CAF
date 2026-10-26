"use client";

import { Info, RotateCcw, Save } from "lucide-react";
import { useState } from "react";

import { PageContext } from "@/components/shared/page-context";

import { DEFAULT_SETTINGS, SECTIONS, type Settings, type SettingsKey } from "../_lib/settings";
import { CodesSection, NotificationsSection, SecuritySection, UsersSection } from "./access-sections";
import { ApprovalSection, FormulasSection, RoundingSection, ScalesSection } from "./grading-sections";
import { IdentitySection, YearSection } from "./institution-sections";
import { SettingsNav } from "./settings-nav";
import { outlineButton } from "./settings-ui";
import { AuditSection, DangerZone, DataSection } from "./system-sections";

// TODO: substituir pelo utilizador da sessão e pelos dados guardados quando houver API.
const CURRENT_USER = "Edilson Capa";

const sectionLabel = (key: SettingsKey) => SECTIONS.find((s) => s.key === key)?.label ?? key;

/** Campos alterados em relação ao que está guardado, agrupados por secção. */
function diff(current: Settings, saved: Settings) {
  const changes: { key: SettingsKey; count: number }[] = [];
  for (const key of Object.keys(current) as SettingsKey[]) {
    const a = current[key] as Record<string, unknown>;
    const b = saved[key] as Record<string, unknown>;
    const count = Object.keys(a).filter((field) => JSON.stringify(a[field]) !== JSON.stringify(b[field])).length;
    if (count > 0) changes.push({ key, count });
  }
  return changes;
}

const now = () => new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });

export function SettingsWorkspace() {
  const [saved, setSaved] = useState(DEFAULT_SETTINGS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [lastSaved, setLastSaved] = useState("hoje às 09:12");

  const update =
    <K extends SettingsKey>(key: K) =>
    (patch: Partial<Settings[K]>) =>
      setSettings((current) => ({ ...current, [key]: { ...current[key], ...patch } }));

  const changes = diff(settings, saved);
  const changeCount = changes.reduce((total, c) => total + c.count, 0);
  const weightsValid = settings.formulas.mfdWeight + settings.formulas.examWeight === 100;
  const canSave = changeCount > 0 && weightsValid;

  const save = () => {
    if (!canSave) return;
    setSaved(settings);
    setLastSaved(`hoje às ${now()}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <PageContext
          title="Definições do sistema"
          subtitle={`Instituição, calendário, regras de cálculo, acessos e dados · última alteração por ${CURRENT_USER}, ${lastSaved}`}
        />
        <button type="button" onClick={() => setSettings(DEFAULT_SETTINGS)} className={outlineButton}>
          <RotateCcw className="size-4 text-neutral" />
          Repor padrão
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!canSave}
          className="flex h-[38px] items-center gap-2 rounded-md bg-primary px-3.5 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="size-4" />
          Guardar alterações
        </button>
      </div>

      <div className="flex items-start gap-6">
        <SettingsNav />

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <IdentitySection value={settings.identity} onChange={update("identity")} />
          <YearSection value={settings.year} onChange={update("year")} />
          <ScalesSection />
          <FormulasSection value={settings.formulas} onChange={update("formulas")} />
          <RoundingSection value={settings.rounding} onChange={update("rounding")} />
          <ApprovalSection value={settings.approval} onChange={update("approval")} />
          <UsersSection />
          <SecuritySection value={settings.security} onChange={update("security")} />
          <CodesSection value={settings.codes} onChange={update("codes")} />
          <NotificationsSection value={settings.notifications} onChange={update("notifications")} />
          <DataSection value={settings.data} onChange={update("data")} />
          <AuditSection value={settings.audit} onChange={update("audit")} />
          <DangerZone year={settings.year.active} onFactoryReset={() => setSettings(DEFAULT_SETTINGS)} />

          {changeCount > 0 && (
            <div
              role="status"
              className="sticky bottom-4 z-20 flex flex-wrap items-center gap-3 rounded-[10px] bg-foreground px-5 py-3.5 text-background shadow-lg"
            >
              <Info className="size-[18px] shrink-0" />
              <p className="min-w-0 flex-1 text-[13px] font-medium">
                {changeCount} {changeCount === 1 ? "alteração" : "alterações"} por guardar ·{" "}
                {changes.map((c) => sectionLabel(c.key)).join(", ")}
                {!weightsValid && " · os pesos das fórmulas têm de somar 100%"}
              </p>
              <button
                type="button"
                onClick={() => setSettings(saved)}
                className="h-[38px] px-3.5 text-[13px] font-medium text-[#ccccd1] transition-colors hover:text-background"
              >
                Descartar
              </button>
              <button
                type="button"
                onClick={save}
                disabled={!canSave}
                className="flex h-[38px] items-center gap-2 rounded-md bg-primary px-3.5 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                <Save className="size-4" />
                Guardar alterações
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

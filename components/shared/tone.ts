export const TONES = {
  primary: "bg-accent text-primary",
  positive: "bg-positive-soft text-positive",
  pending: "bg-pending-soft text-pending",
  neutral: "bg-neutral-soft text-neutral",
  info: "bg-info-soft text-info",
} as const;

export type Tone = keyof typeof TONES;

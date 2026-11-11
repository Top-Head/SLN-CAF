"use client";

export type ActivityItem = {
  id: string;
  type: keyof typeof ICONS;
  title: string;
  subtitle: string;
};

const ICONS = {
  pencil: { Icon: Pencil, className: "text-primary bg-accent" },
  eye: { Icon: Eye, className: "text-blue-500 bg-blue-50" },
  check: { Icon: CheckCircle2, className: "text-emerald-500 bg-emerald-50" },
  lock: { Icon: Lock, className: "text-amber-500 bg-amber-50" },
} as const;

export function ActivityCard({
  items,
  emptyMessage = "Sem actividade recente.",
}: {
  items: ActivityItem[];
  emptyMessage?: string;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900">Actividade recente</h3>

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-xs text-gray-400">{emptyMessage}</p>
        )}
        {items.map((activity) => {
          const { Icon, className } = ICONS[activity.type];

            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div
                  className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${className}`}
                >
                  <Icon className="size-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-snug text-gray-800">
                    {activity.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">
                    {activity.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { SHUTTLES } from "@/lib/mock-data";

/** Transportation status panel. */
export function TransportPanel() {
  return (
    <section
      aria-labelledby="transport-heading"
      className="rounded-xl border bg-card p-4 shadow-sm"
    >
      <header className="mb-3">
        <h2 id="transport-heading" className="text-base font-semibold">
          Transportation
        </h2>
        <p className="text-xs text-muted-foreground">Shuttles, parking, and transit</p>
      </header>
      <ul className="divide-y" role="list">
        {SHUTTLES.map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="font-medium">{s.line}</p>
              {s.note && (
                <p className="text-xs text-muted-foreground">
                  <span className="sr-only">Notice: </span>
                  {s.note}
                </p>
              )}
            </div>
            <div className="text-right">
              <StatusBadge status={s.status} />
              {s.status !== "cancelled" && (
                <p className="mt-1 text-xs text-muted-foreground">
                  ETA {s.etaMinutes} min
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StatusBadge({ status }: { status: "on_time" | "delayed" | "cancelled" }) {
  const map = {
    on_time: { label: "On time", cls: "bg-density-low text-foreground", glyph: "●" },
    delayed: { label: "Delayed", cls: "bg-density-high text-white", glyph: "▲" },
    cancelled: { label: "Cancelled", cls: "bg-destructive text-destructive-foreground", glyph: "✕" },
  } as const;
  const cfg = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.cls}`}>
      <span aria-hidden="true">{cfg.glyph}</span>
      {cfg.label}
    </span>
  );
}

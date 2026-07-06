import { useMemo } from "react";
import { densityColorClass, densityGlyph, densityLabel, densityLevel, summarizeCrowd } from "@/lib/crowd";
import type { Zone } from "@/types";

interface Props {
  zones: readonly Zone[];
}

/** Crowd density dashboard with AI-generated alerts. */
export function CrowdDashboard({ zones }: Props) {
  const summary = useMemo(() => summarizeCrowd(zones), [zones]);
  const alerts = useMemo(() => generateAlerts(zones), [zones]);

  return (
    <section
      aria-labelledby="crowd-heading"
      className="space-y-4 rounded-xl border bg-card p-4 shadow-sm"
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 id="crowd-heading" className="text-base font-semibold">
            Crowd Management
          </h2>
          <p className="text-xs text-muted-foreground">Simulated live density · updates every 5s</p>
        </div>
        <div className="flex gap-2 text-xs">
          {(["low", "moderate", "high", "critical"] as const).map((l) => (
            <span key={l} className={`rounded-full px-2 py-1 font-medium ${densityColorClass(l)}`}>
              <span aria-hidden="true" className="mr-1">
                {densityGlyph(l)}
              </span>
              {densityLabel(l)} · {summary[l]}
            </span>
          ))}
        </div>
      </header>

      <div
        role="region"
        aria-live="polite"
        aria-label="Crowd alerts"
        className="space-y-2"
      >
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No critical alerts. Operations nominal.</p>
        ) : (
          alerts.map((a) => (
            <div
              key={a.id}
              role="alert"
              className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm"
            >
              <span aria-hidden="true" className="mt-0.5 font-bold text-destructive">
                !
              </span>
              <div>
                <p className="font-semibold">{a.title}</p>
                <p className="text-muted-foreground">{a.recommendation}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <table className="w-full text-sm">
        <caption className="sr-only">Zone occupancy</caption>
        <thead>
          <tr className="text-left text-xs uppercase text-muted-foreground">
            <th scope="col" className="py-2">Zone</th>
            <th scope="col">Density</th>
            <th scope="col">Occupancy</th>
            <th scope="col" className="text-right">Load</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((z) => {
            const level = densityLevel(z);
            const pct = Math.round((z.occupancy / z.capacity) * 100);
            return (
              <tr key={z.id} className="border-t">
                <th scope="row" className="py-2 text-left font-medium">
                  {z.name}
                </th>
                <td>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${densityColorClass(level)}`}>
                    <span aria-hidden="true">{densityGlyph(level)}</span>
                    {densityLabel(level)}
                  </span>
                </td>
                <td className="text-muted-foreground">
                  {z.occupancy.toLocaleString()} / {z.capacity.toLocaleString()}
                </td>
                <td className="text-right font-mono">{pct}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

interface CrowdAlert {
  id: string;
  title: string;
  recommendation: string;
}

/** Rule-based alert generator (deterministic, testable proxy for the AI layer). */
export function generateAlerts(zones: readonly Zone[]): CrowdAlert[] {
  const alerts: CrowdAlert[] = [];
  const gates = zones.filter((z) => z.type === "gate");
  for (const z of zones) {
    if (densityLevel(z) === "critical") {
      const alt = gates
        .filter((g) => g.id !== z.id)
        .sort((a, b) => a.occupancy / a.capacity - b.occupancy / b.capacity)[0];
      alerts.push({
        id: `alert-${z.id}`,
        title: `${z.name} at critical density`,
        recommendation:
          z.type === "gate" && alt
            ? `Reroute inbound traffic from ${z.name} to ${alt.name} (currently ${Math.round((alt.occupancy / alt.capacity) * 100)}% full).`
            : `Deploy staff to ${z.name} and open overflow zones.`,
      });
    }
  }
  return alerts;
}

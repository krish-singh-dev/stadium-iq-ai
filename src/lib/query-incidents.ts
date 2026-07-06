import type { Incident, Zone } from "@/types";

export interface IncidentFilter {
  readonly zoneId?: string;
  readonly since?: number; // epoch ms
  readonly severity?: Incident["severity"];
  readonly status?: Incident["status"];
}

/** Naive natural-language → filter parser for the ops query box. */
export function parseIncidentQuery(text: string, zones: readonly Zone[]): IncidentFilter {
  const q = text.toLowerCase();
  const f: {
    zoneId?: string;
    since?: number;
    severity?: Incident["severity"];
    status?: Incident["status"];
  } = {};
  for (const z of zones) {
    if (q.includes(z.name.toLowerCase()) || q.includes(z.id)) {
      f.zoneId = z.id;
      break;
    }
  }
  const hourMatch = /(last|past)\s+(\d+)\s*hour/.exec(q);
  const minMatch = /(last|past)\s+(\d+)\s*min/.exec(q);
  if (hourMatch) f.since = Date.now() - Number(hourMatch[2]) * 3_600_000;
  else if (minMatch) f.since = Date.now() - Number(minMatch[2]) * 60_000;
  if (q.includes("high")) f.severity = "high";
  else if (q.includes("medium")) f.severity = "medium";
  else if (q.includes("low")) f.severity = "low";
  if (q.includes("open")) f.status = "open";
  else if (q.includes("resolved")) f.status = "resolved";
  else if (q.includes("progress")) f.status = "in_progress";
  return f;
}

export function applyIncidentFilter(
  incidents: readonly Incident[],
  filter: IncidentFilter,
): readonly Incident[] {
  return incidents.filter((i) => {
    if (filter.zoneId && i.zoneId !== filter.zoneId) return false;
    if (filter.since && i.reportedAt < filter.since) return false;
    if (filter.severity && i.severity !== filter.severity) return false;
    if (filter.status && i.status !== filter.status) return false;
    return true;
  });
}

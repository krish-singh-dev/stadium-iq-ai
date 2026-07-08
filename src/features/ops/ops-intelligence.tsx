import { useMemo, useState } from "react";
import { applyIncidentFilter, parseIncidentQuery } from "@/lib/query-incidents";
import { sanitizeUserText } from "@/lib/sanitize";
import type { Incident, Zone } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  incidents: readonly Incident[];
  zones: readonly Zone[];
}

const PAGE_SIZE = 6;

/** Operational Intelligence: natural-language incident search + paginated log. */
export function OpsIntelligence({ incidents, zones }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const filter = useMemo(() => parseIncidentQuery(sanitizeUserText(query, 200), zones), [query, zones]);
  const filtered = useMemo(() => applyIncidentFilter(incidents, filter), [incidents, filter]);
  const pageItems = useMemo(
    () => filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [filtered, page],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const zoneById = useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);

  const shiftSummary = useMemo(() => summarize(incidents), [incidents]);

  return (
    <section
      aria-labelledby="ops-heading"
      className="space-y-4 rounded-xl border bg-card p-4 shadow-sm"
    >
      <header>
        <h2 id="ops-heading" className="text-base font-semibold">
          Operational Intelligence
        </h2>
        <p className="text-xs text-muted-foreground">AI-summarized shift + natural-language search</p>
      </header>
      <div className="rounded-md border bg-background p-3 text-sm">
        <p className="mb-1 font-semibold">Shift summary</p>
        <p className="text-muted-foreground">{shiftSummary}</p>
      </div>
      <div>
        <Label htmlFor="ops-query">Ask about incidents</Label>
        <Input
          id="ops-query"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value.slice(0, 200));
            setPage(0);
          }}
          placeholder='e.g. "high severity in Zone B in the last hour"'
          aria-describedby="ops-query-help"
        />
        <p id="ops-query-help" className="mt-1 text-xs text-muted-foreground">
          Matched filters: {formatFilter(filter, zoneById) || "none"}
        </p>
      </div>
      <ul className="divide-y" role="list" aria-label="Incident log">
        {pageItems.length === 0 && (
          <li className="py-4 text-sm text-muted-foreground">No matching incidents.</li>
        )}
        {pageItems.map((i) => (
          <li key={i.id} className="flex items-start justify-between gap-3 py-3">
            <div>
              <p className="font-medium">{i.summary}</p>
              <p className="text-xs text-muted-foreground">
                {zoneById.get(i.zoneId)?.name ?? i.zoneId} ·{" "}
                <span className="capitalize">{i.type.replace("_", " ")}</span> ·{" "}
                {formatTimeUTC(i.reportedAt)}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${severityClass(i.severity)}`}
            >
              {i.severity}
            </span>
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <nav aria-label="Log pagination" className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="min-h-11 rounded-md border px-3 py-1 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="min-h-11 rounded-md border px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}

function severityClass(sev: Incident["severity"]): string {
  if (sev === "high") return "bg-destructive text-destructive-foreground";
  if (sev === "medium") return "bg-density-high text-white";
  return "bg-density-low text-foreground";
}

function summarize(incidents: readonly Incident[]): string {
  const open = incidents.filter((i) => i.status !== "resolved").length;
  const high = incidents.filter((i) => i.severity === "high").length;
  const byType = new Map<string, number>();
  for (const i of incidents) byType.set(i.type, (byType.get(i.type) ?? 0) + 1);
  const top = [...byType.entries()].sort((a, b) => b[1] - a[1])[0];
  return `${incidents.length} incidents logged, ${open} still open, ${high} high severity. Most common type: ${top?.[0].replace("_", " ") ?? "n/a"}.`;
}

function formatFilter(
  f: ReturnType<typeof parseIncidentQuery>,
  zoneById: Map<string, Zone>,
): string {
  const parts: string[] = [];
  if (f.zoneId) parts.push(`zone=${zoneById.get(f.zoneId)?.name ?? f.zoneId}`);
  if (f.severity) parts.push(`severity=${f.severity}`);
  if (f.status) parts.push(`status=${f.status}`);
  if (f.since) parts.push(`since=${new Date(f.since).toLocaleTimeString()}`);
  return parts.join(", ");
}

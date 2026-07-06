import { createFileRoute, Link } from "@tanstack/react-router";
import { useSession } from "@/features/session/session-context";
import type { Role } from "@/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StadiumIQ — Smart Stadium Assistant · FIFA World Cup 2026" },
      {
        name: "description",
        content:
          "GenAI-powered smart stadium and tournament operations assistant for the FIFA World Cup 2026 — navigation, crowd, accessibility, transport, multilingual chat.",
      },
      { property: "og:title", content: "StadiumIQ — FIFA World Cup 2026" },
      {
        property: "og:description",
        content: "Fan, volunteer, organizer, and staff views for smart stadium operations.",
      },
    ],
  }),
  component: Landing,
});

const ROLES: readonly {
  role: Role;
  to: "/fan" | "/volunteer" | "/organizer" | "/staff";
  title: string;
  blurb: string;
  glyph: string;
}[] = [
  { role: "fan", to: "/fan", title: "Fan", blurb: "Wayfinding, transport, and a multilingual AI concierge.", glyph: "🎟️" },
  { role: "volunteer", to: "/volunteer", title: "Volunteer", blurb: "Assistance queue, accessibility flows, guest support.", glyph: "🤝" },
  { role: "organizer", to: "/organizer", title: "Organizer", blurb: "Crowd dashboard, incident log, decision support.", glyph: "🎛️" },
  { role: "staff", to: "/staff", title: "Venue Staff", blurb: "Shift summary, ops intelligence, real-time actions.", glyph: "🛠️" },
];

function Landing() {
  const { setRole } = useSession();
  return (
    <div className="min-h-dvh bg-gradient-to-br from-background via-secondary to-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            FIFA World Cup 2026 · Smart Stadium Operations
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            StadiumIQ
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
            A GenAI-enabled operations assistant for fans, volunteers, organizers, and venue
            staff. Pick a role to begin — the demo ships with simulated live data.
          </p>
        </header>
        <ul role="list" className="grid gap-4 sm:grid-cols-2">
          {ROLES.map((r) => (
            <li key={r.role}>
              <Link
                to={r.to}
                onClick={() => setRole(r.role)}
                className="group flex h-full flex-col rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  aria-hidden="true"
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl"
                >
                  {r.glyph}
                </span>
                <h2 className="text-xl font-semibold">{r.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{r.blurb}</p>
                <span className="mt-4 text-sm font-medium text-primary">
                  Enter {r.title} view →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center text-xs text-muted-foreground">
          Independent demo. Not affiliated with FIFA or any tournament sponsor.
        </p>
      </div>
    </div>
  );
}

import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useSession } from "@/features/session/session-context";
import { LANGUAGES } from "@/lib/language";
import type { Language, Role } from "@/types";

const NAV: readonly { to: string; label: string; role: Role }[] = [
  { to: "/fan", label: "Fan", role: "fan" },
  { to: "/volunteer", label: "Volunteer", role: "volunteer" },
  { to: "/organizer", label: "Organizer", role: "organizer" },
  { to: "/staff", label: "Staff", role: "staff" },
];

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const { language, setLanguage } = useSession();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-sm"
            >
              ⚽
            </span>
            <span className="text-lg tracking-tight">
              StadiumIQ
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                · World Cup 2026
              </span>
            </span>
          </Link>
          <nav aria-label="Primary" className="hidden gap-1 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`min-h-11 rounded-md px-3 py-2 text-sm font-medium transition ${
                  pathname === n.to
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                aria-current={pathname === n.to ? "page" : undefined}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <label className="text-sm">
            <span className="sr-only">Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="min-h-11 rounded-md border bg-background px-2 py-1"
            >
              {Object.entries(LANGUAGES).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <nav aria-label="Primary mobile" className="flex gap-1 overflow-x-auto border-t px-2 py-2 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              aria-current={pathname === n.to ? "page" : undefined}
              className={`min-h-11 shrink-0 rounded-md px-3 py-2 text-sm font-medium ${
                pathname === n.to ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main id="main" className="mx-auto max-w-7xl px-4 py-6">
        <p className="mb-4 rounded-md border border-dashed bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
          Demo mode · all realtime data is simulated. Structured for websocket/API swap-in.
        </p>
        {children}
      </main>
    </div>
  );
}

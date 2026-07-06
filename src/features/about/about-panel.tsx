const MAP = {
  navigation: "Smart Navigation → AI-guided wayfinding across zones, gates, and services.",
  crowd: "Crowd Management → Live density heatmap with AI alerts and reroute suggestions.",
  accessibility: "Accessibility Assistance → Wheelchair routes, sensory info, and staff request flow.",
  transport: "Transportation → Shuttle, parking, and transit status with delay notes.",
  assistant: "Multilingual Assistant → Chat AI in EN/ES/FR/AR with auto-detection.",
  ops: "Operational Intelligence → NL incident query + AI shift summary (organizer/staff).",
  decision: "Real-Time Decision Support → Prioritized AI action checklists for incidents.",
} as const;

/** In-app requirement map (problem-statement alignment). */
export function AboutPanel() {
  return (
    <section
      aria-labelledby="about-heading"
      className="rounded-xl border bg-card p-4 shadow-sm"
    >
      <h2 id="about-heading" className="text-base font-semibold">
        About StadiumIQ
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        GenAI-powered smart-stadium assistant for the FIFA World Cup 2026. Each feature below
        maps to a specific challenge requirement.
      </p>
      <ul className="mt-3 space-y-1 text-sm">
        {Object.entries(MAP).map(([k, v]) => (
          <li key={k} className="flex gap-2">
            <span aria-hidden="true" className="text-primary">
              ◆
            </span>
            <span>{v}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Live data is simulated. Architecture is designed so a real API/websocket layer can be
        swapped in without UI changes.
      </p>
    </section>
  );
}

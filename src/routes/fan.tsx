import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { AssistantChat } from "@/features/assistant/assistant-chat";
import { Wayfinder } from "@/features/navigation/wayfinder";
import { TransportPanel } from "@/features/transport/transport-panel";
import { AccessibilityPanel } from "@/features/accessibility/accessibility-panel";
import { AboutPanel } from "@/features/about/about-panel";
import { useLiveStadium } from "@/features/stadium/use-live-stadium";
import { useSession } from "@/features/session/session-context";

export const Route = createFileRoute("/fan")({
  head: () => ({
    meta: [
      { title: "Fan View — StadiumIQ" },
      { name: "description", content: "Multilingual assistant, wayfinding, transport, and accessibility for stadium fans." },
    ],
  }),
  component: FanView,
});

function FanView() {
  const { role, setRole } = useSession();
  const { zones } = useLiveStadium();
  useEffect(() => {
    if (role !== "fan") setRole("fan");
  }, [role, setRole]);

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Wayfinder zones={zones} />
          <div className="grid gap-6 md:grid-cols-2">
            <TransportPanel />
            <AccessibilityPanel zones={zones} />
          </div>
          <AboutPanel />
        </div>
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <AssistantChat zones={zones} />
        </div>
      </div>
    </AppShell>
  );
}

// unused import guard for tree-shakers
export const _guard = Navigate;

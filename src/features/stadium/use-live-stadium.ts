import { useEffect, useState } from "react";
import { INITIAL_INCIDENTS, ZONES } from "@/lib/mock-data";
import type { Incident, Zone } from "@/types";

/**
 * Simulated realtime state — clearly labeled in the UI as simulated.
 * Structure this way so a websocket/API can drop in later.
 */
export function useLiveStadium(): {
  zones: readonly Zone[];
  incidents: readonly Incident[];
  reportIncident: (i: Incident) => void;
} {
  const [zones, setZones] = useState<readonly Zone[]>(ZONES);
  const [incidents, setIncidents] = useState<readonly Incident[]>(INITIAL_INCIDENTS);

  useEffect(() => {
    if (typeof document === "undefined") return;
    let id: ReturnType<typeof setInterval> | undefined;

    const tick = () => {
      setZones((current) =>
        current.map((z) => {
          const drift = Math.round((Math.random() - 0.45) * z.capacity * 0.04);
          const next = Math.max(0, Math.min(z.capacity, z.occupancy + drift));
          return next === z.occupancy ? z : { ...z, occupancy: next };
        }),
      );
    };

    const start = () => {
      if (id === undefined) id = setInterval(tick, 5000);
    };
    const stop = () => {
      if (id !== undefined) {
        clearInterval(id);
        id = undefined;
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };

    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, []);

  return {
    zones,
    incidents,
    reportIncident: (i) => setIncidents((prev) => [i, ...prev]),
  };
}

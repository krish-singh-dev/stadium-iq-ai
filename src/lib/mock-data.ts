import type { Incident, ShuttleStatus, Zone } from "@/types";

/** Deterministic seed for demo/test reproducibility. */
export const ZONES: readonly Zone[] = [
  { id: "gate-a", name: "Gate A", type: "gate", capacity: 5000, occupancy: 4200, x: 10, y: 50, accessible: true },
  { id: "gate-b", name: "Gate B", type: "gate", capacity: 5000, occupancy: 2100, x: 90, y: 50, accessible: true },
  { id: "gate-c", name: "Gate C", type: "gate", capacity: 5000, occupancy: 4800, x: 50, y: 10, accessible: false },
  { id: "gate-d", name: "Gate D", type: "gate", capacity: 5000, occupancy: 1500, x: 50, y: 90, accessible: true },
  { id: "sec-north", name: "North Stand", type: "seating", capacity: 15000, occupancy: 11000, x: 50, y: 25, accessible: true },
  { id: "sec-south", name: "South Stand", type: "seating", capacity: 15000, occupancy: 9500, x: 50, y: 75, accessible: true },
  { id: "sec-east", name: "East Stand", type: "seating", capacity: 12000, occupancy: 7800, x: 75, y: 50, accessible: true },
  { id: "sec-west", name: "West Stand", type: "seating", capacity: 12000, occupancy: 6200, x: 25, y: 50, accessible: true },
  { id: "food-1", name: "Concession Plaza", type: "concession", capacity: 800, occupancy: 640, x: 35, y: 35, accessible: true },
  { id: "food-2", name: "Fan Zone Grill", type: "concession", capacity: 600, occupancy: 210, x: 65, y: 65, accessible: true },
  { id: "rest-1", name: "Restrooms North", type: "restroom", capacity: 200, occupancy: 90, x: 40, y: 20, accessible: true },
  { id: "rest-2", name: "Restrooms South", type: "restroom", capacity: 200, occupancy: 175, x: 60, y: 80, accessible: true },
  { id: "med-1", name: "Medical Bay", type: "medical", capacity: 50, occupancy: 8, x: 20, y: 70, accessible: true },
  { id: "fanzone", name: "Fan Zone", type: "fanzone", capacity: 3000, occupancy: 2200, x: 80, y: 20, accessible: true },
];

// Fixed epoch timestamps so SSR HTML matches client hydration.
const SEED_EPOCH = 1_700_000_000_000;
export const INITIAL_INCIDENTS: readonly Incident[] = [
  { id: "inc-1", zoneId: "gate-c", type: "security", severity: "medium", summary: "Bag check backlog at Gate C", reportedAt: SEED_EPOCH - 1000 * 60 * 12, status: "in_progress" },
  { id: "inc-2", zoneId: "rest-2", type: "maintenance", severity: "low", summary: "Sink leaking in South restrooms", reportedAt: SEED_EPOCH - 1000 * 60 * 45, status: "open" },
  { id: "inc-3", zoneId: "med-1", type: "medical", severity: "high", summary: "Heat exhaustion patient stable", reportedAt: SEED_EPOCH - 1000 * 60 * 5, status: "in_progress" },
  { id: "inc-4", zoneId: "sec-north", type: "lost_person", severity: "medium", summary: "Lost child reunited with family", reportedAt: SEED_EPOCH - 1000 * 60 * 90, status: "resolved" },
];

export const SHUTTLES: readonly ShuttleStatus[] = [
  { id: "s1", line: "Downtown Express", etaMinutes: 6, status: "on_time" },
  { id: "s2", line: "Airport Shuttle", etaMinutes: 22, status: "delayed", note: "Traffic on I-80 westbound" },
  { id: "s3", line: "Metro Line 3", etaMinutes: 4, status: "on_time" },
  { id: "s4", line: "West Parking Loop", etaMinutes: 0, status: "cancelled", note: "Rerouted — use East Parking Loop" },
  { id: "s5", line: "East Parking Loop", etaMinutes: 3, status: "on_time" },
];

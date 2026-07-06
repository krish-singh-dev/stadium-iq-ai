/** Shared domain types for StadiumIQ. */

export type Role = "fan" | "volunteer" | "organizer" | "staff";

export type Language = "en" | "es" | "fr" | "ar";

export type DensityLevel = "low" | "moderate" | "high" | "critical";

export interface Zone {
  readonly id: string;
  readonly name: string;
  readonly type: "gate" | "seating" | "concession" | "restroom" | "exit" | "medical" | "fanzone";
  readonly capacity: number;
  readonly occupancy: number;
  readonly x: number; // 0-100 % coords on stadium map
  readonly y: number;
  readonly accessible: boolean;
}

export interface Incident {
  readonly id: string;
  readonly zoneId: string;
  readonly type: "medical" | "security" | "maintenance" | "lost_person" | "weather";
  readonly severity: "low" | "medium" | "high";
  readonly summary: string;
  readonly reportedAt: number; // epoch ms
  readonly status: "open" | "in_progress" | "resolved";
}

export interface ShuttleStatus {
  readonly id: string;
  readonly line: string;
  readonly etaMinutes: number;
  readonly status: "on_time" | "delayed" | "cancelled";
  readonly note?: string;
}

export interface AssistanceRequest {
  readonly id: string;
  readonly zoneId: string;
  readonly kind: "wheelchair" | "sensory" | "translation" | "medical" | "other";
  readonly note: string;
  readonly createdAt: number;
  readonly status: "pending" | "assigned" | "completed";
}

export interface ChatMessage {
  readonly id: string;
  readonly role: "user" | "assistant";
  readonly content: string;
  readonly createdAt: number;
}

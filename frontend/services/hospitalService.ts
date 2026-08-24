"use client";

import type { Hospital, DataSource } from "@/types/emergency";

/**
 * Client-side hospital lookup. Calls our own /api/hospitals route rather
 * than a provider directly, so the API key (if a paid provider is swapped
 * in later — see the route's comment) never reaches the browser, and the
 * UI here never has to change.
 */
export async function findNearbyHospitals(
  latitude: number,
  longitude: number
): Promise<{ hospitals: Hospital[]; source: DataSource; reason?: string }> {
  try {
    const response = await fetch(`/api/hospitals?lat=${latitude}&lng=${longitude}`);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    return {
      hospitals: Array.isArray(data.hospitals) ? data.hospitals : [],
      source: data.source === "live" ? "live" : "unavailable",
      reason: data.reason,
    };
  } catch (err) {
    console.error("[hospitalService] Lookup failed:", err);
    return {
      hospitals: [],
      source: "unavailable",
      reason: "We couldn't reach the hospital data provider right now.",
    };
  }
}

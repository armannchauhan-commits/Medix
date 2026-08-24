import { haversineKm, destinationPoint } from "@/lib/geo";
import type { AmbulanceState } from "@/types/emergency";

/**
 * DEMO ambulance simulation — there is no real ambulance dispatch provider
 * connected. Every AmbulanceState this module produces has source: "demo",
 * and the UI (components/emergency/AmbulanceTracker.tsx) must always label
 * it as simulated. See the module comment for how a real provider's GPS
 * feed would slot in here later (same AmbulanceState shape, source: "live").
 *
 * Average speed assumption for ETA math is a rough constant, not telemetry.
 */

const ASSUMED_SPEED_KMH = 30;
const ARRIVAL_THRESHOLD_KM = 0.15;
const APPROACH_FRACTION = 0.18; // fraction of remaining distance closed per tick

function generateId(): string {
  return `amb-demo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function spawnDemoAmbulance(user: { latitude: number; longitude: number }): AmbulanceState {
  const bearing = Math.random() * 360;
  const distanceKm = 2 + Math.random() * 2.5; // starts 2–4.5km out
  const start = destinationPoint(user.latitude, user.longitude, bearing, distanceKm);

  return {
    id: generateId(),
    latitude: start.lat,
    longitude: start.lon,
    status: "searching",
    etaMinutes: null,
    distanceKm: Math.round(distanceKm * 10) / 10,
    updatedAt: new Date().toISOString(),
    source: "demo",
  };
}

/** Advances the simulation by one tick. Call on an interval from a hook, not in a loop. */
export function stepDemoAmbulance(
  ambulance: AmbulanceState,
  user: { latitude: number; longitude: number }
): AmbulanceState {
  const now = new Date().toISOString();

  if (ambulance.status === "searching") {
    return { ...ambulance, status: "assigned", updatedAt: now };
  }

  if (ambulance.status === "assigned") {
    return { ...ambulance, status: "en-route", updatedAt: now };
  }

  if (ambulance.status === "en-route") {
    const remainingKm = haversineKm(ambulance.latitude, ambulance.longitude, user.latitude, user.longitude);

    if (remainingKm <= ARRIVAL_THRESHOLD_KM) {
      return {
        ...ambulance,
        status: "arrived",
        distanceKm: 0,
        etaMinutes: 0,
        updatedAt: now,
      };
    }

    const bearingToUser =
      (Math.atan2(
        Math.sin(((user.longitude - ambulance.longitude) * Math.PI) / 180) * Math.cos((user.latitude * Math.PI) / 180),
        Math.cos((ambulance.latitude * Math.PI) / 180) * Math.sin((user.latitude * Math.PI) / 180) -
          Math.sin((ambulance.latitude * Math.PI) / 180) *
            Math.cos((user.latitude * Math.PI) / 180) *
            Math.cos(((user.longitude - ambulance.longitude) * Math.PI) / 180)
      ) *
        180) /
      Math.PI;

    const stepDistanceKm = remainingKm * APPROACH_FRACTION;
    const next = destinationPoint(ambulance.latitude, ambulance.longitude, bearingToUser, stepDistanceKm);
    const newRemainingKm = remainingKm - stepDistanceKm;

    return {
      ...ambulance,
      latitude: next.lat,
      longitude: next.lon,
      distanceKm: Math.round(newRemainingKm * 10) / 10,
      etaMinutes: Math.max(1, Math.round((newRemainingKm / ASSUMED_SPEED_KMH) * 60)),
      updatedAt: now,
    };
  }

  return ambulance;
}

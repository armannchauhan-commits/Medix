/**
 * Step 4 — Emergency Response types.
 *
 * `source` appears throughout and is load-bearing for safety: the UI must
 * never present "demo" or "unavailable" data as if it were "live". See
 * components/emergency/DataSourceBadge.tsx for how this is surfaced.
 */

export type DataSource = "live" | "demo" | "unavailable";

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number; // meters
  timestamp: number; // epoch ms
}

export type LocationPermissionState = "idle" | "requesting" | "granted" | "denied" | "unsupported" | "error";

export interface Hospital {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  phone: string | null;
  distanceKm: number | null;
  rating: number | null;
  openingHours: string | null;
  emergencyStatus: string | null;
  bedStatus: string | null;
  icuStatus: string | null;
  source: DataSource;
  updatedAt: string; // ISO
}

export type AmbulanceStatus = "searching" | "assigned" | "en-route" | "arrived" | "cancelled";

export interface AmbulanceState {
  id: string;
  latitude: number;
  longitude: number;
  status: AmbulanceStatus;
  etaMinutes: number | null;
  distanceKm: number | null;
  updatedAt: string; // ISO
  source: DataSource;
}

export interface VitalsReading {
  patientId: string;
  heartRate: number; // BPM
  spo2: number; // %
  temperatureC: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  timestamp: string; // ISO
  source: DataSource;
}

export interface MonitoringAlert {
  id: string;
  message: string;
  urgent: boolean;
  timestamp: string; // ISO
}

export type TimelineStepStatus = "pending" | "active" | "done";

export interface TimelineStep {
  id: string;
  label: string;
  status: TimelineStepStatus;
}

export type EmergencySessionStatus = "idle" | "confirming" | "active" | "ended";

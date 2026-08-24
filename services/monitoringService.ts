import type { VitalsReading, MonitoringAlert } from "@/types/emergency";

/**
 * DEMO patient monitoring — browsers cannot measure real vital signs.
 * Every VitalsReading here has source: "demo". See the module comment for
 * how a real wearable/Bluetooth/health-API feed would slot in later (same
 * VitalsReading shape, source: "live").
 */

const BASELINE = {
  heartRate: 82,
  spo2: 98,
  temperatureC: 37.1,
  systolic: 120,
  diastolic: 80,
};

export interface VitalsRange {
  min: number;
  max: number;
}

export interface MonitoringRanges {
  heartRate: VitalsRange;
  spo2: VitalsRange;
  temperatureC: VitalsRange;
  systolic: VitalsRange;
  diastolic: VitalsRange;
}

/** Configurable monitoring thresholds — adjust here, not inline in components. */
export const DEFAULT_MONITORING_RANGES: MonitoringRanges = {
  heartRate: { min: 60, max: 100 },
  spo2: { min: 94, max: 100 },
  temperatureC: { min: 36.1, max: 37.8 },
  systolic: { min: 90, max: 130 },
  diastolic: { min: 60, max: 85 },
};

function jitter(value: number, amount: number): number {
  return value + (Math.random() * 2 - 1) * amount;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function generateDemoVitals(patientId: string): VitalsReading {
  return {
    patientId,
    heartRate: Math.round(clamp(jitter(BASELINE.heartRate, 4), 55, 130)),
    spo2: Math.round(clamp(jitter(BASELINE.spo2, 1.5), 88, 100)),
    temperatureC: Math.round(clamp(jitter(BASELINE.temperatureC, 0.3), 35.5, 39) * 10) / 10,
    bloodPressureSystolic: Math.round(clamp(jitter(BASELINE.systolic, 6), 85, 160)),
    bloodPressureDiastolic: Math.round(clamp(jitter(BASELINE.diastolic, 4), 55, 100)),
    timestamp: new Date().toISOString(),
    source: "demo",
  };
}

/** Small random walk from the previous reading — keeps the demo feeling live without wild jumps. */
export function stepDemoVitals(previous: VitalsReading): VitalsReading {
  return {
    ...previous,
    heartRate: Math.round(clamp(jitter(previous.heartRate, 2.5), 55, 135)),
    spo2: Math.round(clamp(jitter(previous.spo2, 0.8), 88, 100)),
    temperatureC: Math.round(clamp(jitter(previous.temperatureC, 0.15), 35.5, 39) * 10) / 10,
    bloodPressureSystolic: Math.round(clamp(jitter(previous.bloodPressureSystolic, 3), 85, 165)),
    bloodPressureDiastolic: Math.round(clamp(jitter(previous.bloodPressureDiastolic, 2), 55, 105)),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Used only by the "Start Emergency Demo" flow to reliably show what a
 * monitoring alert looks like within a short demo window — nudges one
 * reading outside the configured range. Still clearly labeled DEMO.
 */
export function nudgeVitalsOutOfRange(previous: VitalsReading): VitalsReading {
  return { ...previous, heartRate: 128, spo2: 91, timestamp: new Date().toISOString() };
}

/**
 * Checks a reading against configured ranges. Never diagnoses — only flags
 * that a number is outside the configured range and that it needs
 * professional evaluation.
 */
export function checkVitalsAlert(vitals: VitalsReading, ranges: MonitoringRanges = DEFAULT_MONITORING_RANGES): MonitoringAlert | null {
  const outOfRange: string[] = [];
  let urgent = false;

  if (vitals.heartRate < ranges.heartRate.min || vitals.heartRate > ranges.heartRate.max) {
    outOfRange.push("heart rate");
    if (vitals.heartRate < 45 || vitals.heartRate > 130) urgent = true;
  }
  if (vitals.spo2 < ranges.spo2.min) {
    outOfRange.push("SpO₂");
    if (vitals.spo2 < 90) urgent = true;
  }
  if (vitals.temperatureC < ranges.temperatureC.min || vitals.temperatureC > ranges.temperatureC.max) {
    outOfRange.push("temperature");
  }
  if (vitals.bloodPressureSystolic < ranges.systolic.min || vitals.bloodPressureSystolic > ranges.systolic.max) {
    outOfRange.push("blood pressure");
  }

  if (outOfRange.length === 0) return null;

  return {
    id: `alert-${Date.now()}`,
    message: urgent
      ? "One or more readings are significantly outside the configured monitoring range."
      : `Reading is outside the configured monitoring range (${outOfRange.join(", ")}).`,
    urgent,
    timestamp: new Date().toISOString(),
  };
}

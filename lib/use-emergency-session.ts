"use client";

import * as React from "react";
import { useGeolocation } from "@/lib/use-geolocation";
import { findNearbyHospitals } from "@/services/hospitalService";
import { spawnDemoAmbulance, stepDemoAmbulance } from "@/services/ambulanceService";
import {
  generateDemoVitals,
  stepDemoVitals,
  nudgeVitalsOutOfRange,
  checkVitalsAlert,
} from "@/services/monitoringService";
import { RealtimeChannel, createDemoTicker } from "@/lib/realtime";
import type {
  Hospital,
  AmbulanceState,
  VitalsReading,
  MonitoringAlert,
  TimelineStep,
  DataSource,
  EmergencySessionStatus,
} from "@/types/emergency";

const CONFIRM_COUNTDOWN_SECONDS = 5;
const AMBULANCE_TICK_MS = 3000;
const VITALS_TICK_MS = 4000;
const DEMO_ALERT_DELAY_MS = 9000;

function buildTimeline(opts: {
  active: boolean;
  hasLocation: boolean;
  hospitalsChecked: boolean;
  ambulanceEnRoute: boolean;
  monitoringStarted: boolean;
}): TimelineStep[] {
  const { active, hasLocation, hospitalsChecked, ambulanceEnRoute, monitoringStarted } = opts;
  return [
    { id: "sos", label: "SOS Initiated", status: active ? "done" : "pending" },
    { id: "location", label: "Location Detected", status: hasLocation ? "done" : active ? "active" : "pending" },
    {
      id: "hospitals",
      label: "Nearby Hospitals Found",
      status: hospitalsChecked ? "done" : hasLocation ? "active" : "pending",
    },
    {
      id: "assistance",
      label: "Emergency Assistance",
      status: ambulanceEnRoute ? "active" : hospitalsChecked ? "active" : "pending",
    },
    { id: "monitoring", label: "Patient Monitoring", status: monitoringStarted ? "active" : "pending" },
  ];
}

export function useEmergencySession() {
  const geolocation = useGeolocation();

  const [status, setStatus] = React.useState<EmergencySessionStatus>("idle");
  const [countdown, setCountdown] = React.useState(CONFIRM_COUNTDOWN_SECONDS);
  const [isDemoRun, setIsDemoRun] = React.useState(false);

  const [hospitals, setHospitals] = React.useState<Hospital[]>([]);
  const [hospitalsSource, setHospitalsSource] = React.useState<DataSource>("unavailable");
  const [hospitalsChecked, setHospitalsChecked] = React.useState(false);
  const [hospitalsLoading, setHospitalsLoading] = React.useState(false);

  const [ambulance, setAmbulance] = React.useState<AmbulanceState | null>(null);
  const [vitals, setVitals] = React.useState<VitalsReading | null>(null);
  const [alert, setAlert] = React.useState<MonitoringAlert | null>(null);

  const stopFnsRef = React.useRef<Array<() => void>>([]);
  const countdownIntervalRef = React.useRef<number | null>(null);

  const registerCleanup = React.useCallback((fn: () => void) => {
    stopFnsRef.current.push(fn);
  }, []);

  const stopAllTickers = React.useCallback(() => {
    stopFnsRef.current.forEach((fn) => fn());
    stopFnsRef.current = [];
  }, []);

  // --- Confirmation countdown -------------------------------------------------
  const beginConfirmation = React.useCallback(() => {
    setStatus("confirming");
    setCountdown(CONFIRM_COUNTDOWN_SECONDS);
  }, []);

  const cancelConfirmation = React.useCallback(() => {
    if (countdownIntervalRef.current !== null) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setStatus("idle");
  }, []);

  React.useEffect(() => {
    if (status !== "confirming") return;
    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current !== null) window.clearInterval(countdownIntervalRef.current);
          startSession(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (countdownIntervalRef.current !== null) window.clearInterval(countdownIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // --- Session lifecycle -------------------------------------------------
  const startSession = React.useCallback((demo: boolean) => {
    setIsDemoRun(demo);
    setStatus("active");
    geolocation.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activate = React.useCallback(() => {
    beginConfirmation();
  }, [beginConfirmation]);

  const activateDemo = React.useCallback(() => {
    startSession(true);
  }, [startSession]);

  const endEmergency = React.useCallback(() => {
    stopAllTickers();
    geolocation.stop();
    setStatus("ended");
    setHospitals([]);
    setHospitalsChecked(false);
    setAmbulance(null);
    setVitals(null);
    setAlert(null);
    setIsDemoRun(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopAllTickers]);

  const returnToIdle = React.useCallback(() => setStatus("idle"), []);

  // --- Once location is available: fetch hospitals + spawn demo ambulance & vitals ---
  React.useEffect(() => {
    if (status !== "active" || !geolocation.location || hospitalsChecked || hospitalsLoading) return;
    const loc = geolocation.location;
    setHospitalsLoading(true);

    findNearbyHospitals(loc.latitude, loc.longitude).then((result) => {
      setHospitals(result.hospitals);
      setHospitalsSource(result.source);
      setHospitalsChecked(true);
      setHospitalsLoading(false);
    });

    // Ambulance — demo simulation ticker.
    const ambulanceChannel = new RealtimeChannel<AmbulanceState>();
    const initialAmbulance = spawnDemoAmbulance(loc);
    setAmbulance(initialAmbulance);
    const unsubAmbulance = ambulanceChannel.subscribe(setAmbulance);
    const stopAmbulanceTicker = createDemoTicker(
      ambulanceChannel,
      initialAmbulance,
      (prev) => stepDemoAmbulance(prev, loc),
      AMBULANCE_TICK_MS
    );
    registerCleanup(() => {
      stopAmbulanceTicker();
      unsubAmbulance();
    });

    // Vitals — demo simulation ticker.
    const vitalsChannel = new RealtimeChannel<VitalsReading>();
    const initialVitals = generateDemoVitals("demo-patient");
    setVitals(initialVitals);
    const unsubVitals = vitalsChannel.subscribe((reading) => {
      setVitals(reading);
      setAlert(checkVitalsAlert(reading));
    });
    const stopVitalsTicker = createDemoTicker(vitalsChannel, initialVitals, stepDemoVitals, VITALS_TICK_MS);
    registerCleanup(() => {
      stopVitalsTicker();
      unsubVitals();
    });

    // Demo-mode only: guarantee a monitoring alert appears within the demo window.
    if (isDemoRun) {
      const timeoutId = window.setTimeout(() => {
        setVitals((prev) => {
          if (!prev) return prev;
          const nudged = nudgeVitalsOutOfRange(prev);
          setAlert(checkVitalsAlert(nudged));
          return nudged;
        });
      }, DEMO_ALERT_DELAY_MS);
      registerCleanup(() => window.clearTimeout(timeoutId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, geolocation.location, hospitalsChecked, hospitalsLoading]);

  // Safety net: stop everything on unmount.
  React.useEffect(() => stopAllTickers, [stopAllTickers]);

  const timeline = buildTimeline({
    active: status === "active",
    hasLocation: Boolean(geolocation.location),
    hospitalsChecked,
    ambulanceEnRoute: ambulance?.status === "en-route" || ambulance?.status === "assigned",
    monitoringStarted: Boolean(vitals),
  });

  return {
    status,
    countdown,
    isDemoRun,
    geolocation,
    hospitals,
    hospitalsSource,
    hospitalsLoading,
    ambulance,
    vitals,
    alert,
    timeline,
    activate,
    activateDemo,
    cancelConfirmation,
    endEmergency,
    returnToIdle,
  };
}

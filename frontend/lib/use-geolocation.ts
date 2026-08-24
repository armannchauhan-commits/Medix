"use client";

import * as React from "react";
import type { LocationPermissionState, UserLocation } from "@/types/emergency";

/**
 * Wraps the browser Geolocation API. Location is only ever requested when
 * the caller explicitly starts tracking (SOS activation) — never on mount,
 * never in the background — and watchPosition is always cleared by stop(),
 * including on unmount, so nothing keeps tracking after the emergency ends.
 */
export function useGeolocation() {
  const [location, setLocation] = React.useState<UserLocation | null>(null);
  const [permission, setPermission] = React.useState<LocationPermissionState>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const watchIdRef = React.useRef<number | null>(null);

  const clearWatch = React.useCallback(() => {
    if (watchIdRef.current !== null && typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const start = React.useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setPermission("unsupported");
      setError("Geolocation isn't supported in this browser.");
      return;
    }

    setPermission("requesting");
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPermission("granted");
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        });
      },
      (err) => {
        setPermission(err.code === err.PERMISSION_DENIED ? "denied" : "error");
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location access is unavailable."
            : "We couldn't determine your location right now."
        );
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
  }, []);

  const stop = React.useCallback(() => {
    clearWatch();
    setPermission("idle");
  }, [clearWatch]);

  const refresh = React.useCallback(() => {
    start();
  }, [start]);

  // Safety net: always stop tracking if the component using this unmounts.
  React.useEffect(() => clearWatch, [clearWatch]);

  return { location, permission, error, start, stop, refresh };
}

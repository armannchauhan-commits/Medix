"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Maximize2 } from "lucide-react";
import type { UserLocation, Hospital, AmbulanceState } from "@/types/emergency";

/**
 * Client-only Leaflet map over OpenStreetMap tiles — no API key required.
 * Always render this via next/dynamic with { ssr: false }; Leaflet needs
 * `window` and will crash during server rendering otherwise.
 */

function divIcon(html: string, size: number) {
  return L.divIcon({ html, className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
}

const userIcon = divIcon(
  `<div class="relative flex h-8 w-8 items-center justify-center">
     <span class="absolute inset-0 rounded-full bg-primary/40 animate-ping"></span>
     <span class="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm shadow-md ring-2 ring-white">📍</span>
   </div>`,
  32
);

const hospitalIcon = divIcon(
  `<div class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm shadow-md ring-2 ring-critical">🏥</div>`,
  28
);

const ambulanceIcon = divIcon(
  `<div class="flex h-8 w-8 items-center justify-center rounded-full bg-critical text-white text-sm shadow-md ring-2 ring-white">🚑</div>`,
  32
);

function RecenterController({ center, signal }: { center: [number, number]; signal: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, map.getZoom() < 13 ? 14 : map.getZoom());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signal]);
  return null;
}

interface EmergencyMapProps {
  userLocation: UserLocation;
  hospitals: Hospital[];
  ambulance: AmbulanceState | null;
}

export function EmergencyMap({ userLocation, hospitals, ambulance }: EmergencyMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [recenterSignal, setRecenterSignal] = React.useState(0);
  const center: [number, number] = [userLocation.latitude, userLocation.longitude];

  function handleFullscreen() {
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen().catch(() => {
        // Fullscreen can be blocked by the browser — fail silently, it's a nice-to-have.
      });
    }
  }

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden rounded-2xl">
      <MapContainer center={center} zoom={14} scrollWheelZoom className="h-full w-full" style={{ minHeight: 280 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterController center={center} signal={recenterSignal} />

        <Marker position={center} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>

        {hospitals.map((h) => (
          <Marker key={h.id} position={[h.latitude, h.longitude]} icon={hospitalIcon}>
            <Popup>
              <span className="font-semibold">{h.name}</span>
              {h.distanceKm !== null && <><br />{h.distanceKm} km away</>}
            </Popup>
          </Marker>
        ))}

        {ambulance && ambulance.status !== "cancelled" && (
          <Marker position={[ambulance.latitude, ambulance.longitude]} icon={ambulanceIcon}>
            <Popup>Ambulance — {ambulance.status.replace("-", " ")} (demo)</Popup>
          </Marker>
        )}
      </MapContainer>

      <div className="absolute right-3 top-3 z-[1000] flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setRecenterSignal((s) => s + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-card text-foreground shadow-card hover:bg-muted"
          aria-label="Recenter map on your location"
        >
          📍
        </button>
        <button
          type="button"
          onClick={handleFullscreen}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-card text-foreground shadow-card hover:bg-muted"
          aria-label="Fullscreen map"
        >
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

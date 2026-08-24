import { config } from "../config/index.js";
import { Hospital } from "../models/types.js";

const SEARCH_RADIUS_METERS = 8000;
const REQUEST_TIMEOUT_MS = 12000;
const MAX_RESULTS = 12;

interface OverpassTags {
  name?: string;
  phone?: string;
  "contact:phone"?: string;
  "addr:full"?: string;
  "addr:housenumber"?: string;
  "addr:street"?: string;
  "addr:city"?: string;
  opening_hours?: string;
  emergency?: string;
}

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: OverpassTags;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function buildAddress(tags: OverpassTags): string | null {
  if (tags["addr:full"]) return tags["addr:full"];
  const parts = [tags["addr:housenumber"], tags["addr:street"], tags["addr:city"]].filter(Boolean);
  return parts.length ? parts.join(" ") : null;
}

export async function findNearbyHospitals(lat: number, lng: number): Promise<{ hospitals: Hospital[]; source: "live" | "unavailable"; reason?: string }> {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { hospitals: [], source: "unavailable", reason: "Missing or invalid coordinates." };
  }

  const query = `[out:json][timeout:10];(node["amenity"="hospital"](around:${SEARCH_RADIUS_METERS},${lat},${lng});way["amenity"="hospital"](around:${SEARCH_RADIUS_METERS},${lat},${lng});relation["amenity"="hospital"](around:${SEARCH_RADIUS_METERS},${lat},${lng}););out center ${MAX_RESULTS * 2};`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(config.hospitalApiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: query,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Overpass responded with status ${response.status}`);
    }

    const data = (await response.json()) as { elements: OverpassElement[] };
    const now = new Date().toISOString();

    const hospitals: Hospital[] = (data.elements || [])
      .map((el): Hospital | null => {
        const hLat = el.lat ?? el.center?.lat;
        const hLon = el.lon ?? el.center?.lon;
        const tags = el.tags || {};
        if (hLat === undefined || hLon === undefined || !tags.name) return null;

        return {
          id: `${el.type}-${el.id}`,
          name: tags.name,
          latitude: hLat,
          longitude: hLon,
          address: buildAddress(tags),
          phone: tags.phone || tags["contact:phone"] || null,
          distanceKm: Math.round(haversineKm(lat, lng, hLat, hLon) * 10) / 10,
          rating: null,
          openingHours: tags.opening_hours || null,
          emergencyStatus: tags.emergency === "yes" ? "Emergency department present" : null,
          bedStatus: null,
          icuStatus: null,
          source: "live",
          updatedAt: now,
        };
      })
      .filter((h): h is Hospital => h !== null)
      .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
      .slice(0, MAX_RESULTS);

    return { hospitals, source: "live" };
  } catch (err) {
    console.error("[hospitals] Overpass lookup failed:", err instanceof Error ? err.message : err);
    return {
      hospitals: [],
      source: "unavailable",
      reason: "We couldn't reach the hospital data provider right now.",
    };
  } finally {
    clearTimeout(timeout);
  }
}

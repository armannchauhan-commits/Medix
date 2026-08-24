"use client";

/**
 * Minimal real-time abstraction. Nothing here talks to a network — it's the
 * seam a later step swaps for Supabase Realtime (`supabase.channel(...)`)
 * without touching any component that consumes it. For now,
 * createDemoTicker drives updates locally on an interval, which is exactly
 * what "demo simulation" means per the Step 4 spec: the shape of a live
 * subscription, backed by a local generator instead of a network feed.
 */

type Listener<T> = (payload: T) => void;

export class RealtimeChannel<T> {
  private listeners = new Set<Listener<T>>();

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  publish(payload: T): void {
    this.listeners.forEach((listener) => listener(payload));
  }
}

/**
 * Ticks `producer(previous)` on an interval and publishes each result to
 * `channel`. Returns a stop function — always call it when the emergency
 * session ends so nothing keeps updating in the background.
 */
export function createDemoTicker<T>(
  channel: RealtimeChannel<T>,
  initial: T,
  producer: (previous: T) => T,
  intervalMs: number
): () => void {
  let current = initial;
  const id = window.setInterval(() => {
    current = producer(current);
    channel.publish(current);
  }, intervalMs);
  return () => window.clearInterval(id);
}

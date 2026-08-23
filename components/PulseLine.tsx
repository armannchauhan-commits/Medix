import { cn } from "@/lib/utils";

/**
 * Medix's signature mark: a single EKG-style pulse line. Used sparingly —
 * in the hero and as a quiet motif behind the SOS button — as the one
 * recurring visual idea that ties "vitals" back to the brand.
 */
export function PulseLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 48"
      fill="none"
      className={cn("w-full", className)}
      aria-hidden="true"
    >
      <path
        d="M0 24 H70 L82 6 L96 42 L108 24 L118 24 L126 12 L134 24 H240"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="240"
        className="animate-pulseline"
      />
    </svg>
  );
}

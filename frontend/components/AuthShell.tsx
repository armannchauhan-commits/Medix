import Link from "next/link";
import { HeartPulse, ShieldCheck, Sparkles, Siren } from "lucide-react";
import { PulseLine } from "@/components/PulseLine";

const points = [
  { icon: Sparkles, text: "AI-guided symptom understanding" },
  { icon: ShieldCheck, text: "Your health history, organized and private" },
  { icon: Siren, text: "One tap away from emergency support" },
];

/**
 * Shared split-screen shell for /login and /signup: a brand panel on the
 * left (desktop only) and the auth form on the right.
 */
export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
            <HeartPulse className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">MEDIX</span>
        </Link>

        <div className="max-w-sm">
          <p className="font-display text-3xl font-bold leading-tight">
            Your AI Health &amp; Wellness Companion
          </p>
          <p className="mt-4 text-primary-foreground/80">
            Understand your health, get the right guidance, and respond
            faster when it matters.
          </p>
          <div className="mt-8 text-primary-foreground/70">
            <PulseLine className="h-10" />
          </div>
          <ul className="mt-8 flex flex-col gap-3">
            {points.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-primary-foreground/90">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} Medix. For informational support only.
        </p>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              MEDIX
            </span>
          </Link>

          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

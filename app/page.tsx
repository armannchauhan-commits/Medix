import Link from "next/link";
import {
  ArrowRight,
  Brain,
  HeartPulse,
  Siren,
  PlayCircle,
  Activity,
  Droplet,
  Pill,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { PulseLine } from "@/components/PulseLine";

const philosophy = [
  {
    step: "01",
    label: "UNDERSTAND",
    icon: Brain,
    description: "AI-powered symptom assessment and health insights.",
  },
  {
    step: "02",
    label: "CARE",
    icon: HeartPulse,
    description: "Immediate guidance, wellness support and personal health tracking.",
  },
  {
    step: "03",
    label: "RESPOND",
    icon: Siren,
    description: "Emergency assistance, SOS and location-based healthcare support.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              MEDIX
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="container grid gap-14 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-10 lg:py-28">
          <div className="animate-fade-up">
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-secondary">
              Understand
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
              Care
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
              Respond
            </p>
            <h1 className="font-display text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              MEDIX
            </h1>
            <p className="mt-3 font-display text-xl font-semibold text-primary sm:text-2xl">
              Your AI Health &amp; Wellness Companion
            </p>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Understand your health. Get the right guidance. Respond faster
              when it matters.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">
                  <PlayCircle className="h-4 w-4" aria-hidden="true" />
                  Try Demo
                </Link>
              </Button>
            </div>

            <MedicalDisclaimer className="mt-10 max-w-lg" />
          </div>

          {/* Vitals mockup card — signature visual */}
          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent/60 blur-2xl" aria-hidden="true" />
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card-hover sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Today&apos;s vitals
                  </p>
                  <p className="font-display text-lg font-semibold text-foreground">
                    Looking steady
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                  <Activity className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>

              <div className="mt-6 text-primary">
                <PulseLine className="h-12" />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/70 p-4">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Droplet className="h-3.5 w-3.5" aria-hidden="true" />
                    Blood Group
                  </p>
                  <p className="mt-1.5 font-display text-lg font-semibold text-foreground">O+</p>
                </div>
                <div className="rounded-xl bg-muted/70 p-4">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Pill className="h-3.5 w-3.5" aria-hidden="true" />
                    Medications
                  </p>
                  <p className="mt-1.5 font-display text-lg font-semibold text-foreground">2 active</p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-secondary" aria-hidden="true" />
                <p className="text-xs text-muted-foreground">
                  Sample data shown in demo mode
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy / features */}
        <section className="border-t border-border bg-muted/40 py-16 sm:py-20">
          <div className="container">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                One companion, three moments of care
              </h2>
              <p className="mt-3 text-muted-foreground sm:text-lg">
                Medix follows you through the full arc of a health concern —
                from the first symptom to the moment you need real help.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {philosophy.map(({ step, label, icon: Icon, description }) => (
                <div
                  key={label}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-sm font-semibold text-muted-foreground/60">
                      {step}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold tracking-wide text-foreground">
                      {label}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="py-16 sm:py-20">
          <div className="container">
            <div className="flex flex-col items-start gap-5 rounded-2xl border border-border bg-primary px-8 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-12">
              <div>
                <h2 className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl">
                  Ready to get started?
                </h2>
                <p className="mt-2 max-w-md text-primary-foreground/85">
                  Create your account, or explore Medix instantly in demo mode
                  — no signup required.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-white/10"
                  asChild
                >
                  <Link href="/dashboard">Try Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="font-display text-sm font-bold text-foreground">MEDIX</span>
            <span className="text-sm text-muted-foreground">
              — Your AI Health &amp; Wellness Companion
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Medix. For informational support only.
          </p>
        </div>
      </footer>
    </div>
  );
}

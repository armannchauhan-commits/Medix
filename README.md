# Medix — Step 1: Frontend Foundation

**Your AI Health & Wellness Companion.** This is Step 1 of Medix: the frontend
foundation, routing, responsive UI, and main dashboard. No AI, SOS, hospital/
ambulance APIs, or medical report analysis are implemented yet — those are
later steps.

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · shadcn/ui-style
components · Lucide React icons.

## Getting started

This project's dependencies were **not** installed in the environment that
generated it (no network access there), so the first run needs to install
them yourself:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build   # production build — run this to catch any TypeScript/lint issues
npm run start   # serve the production build
```

## What's implemented

- **Landing page** (`/`) — hero, Understand → Care → Respond philosophy,
  feature cards, CTA band, medical disclaimer.
- **Login / Signup** (`/login`, `/signup`) — client-side validation, a
  "Continue as Demo User" path straight into the dashboard, and a structure
  ready for Supabase auth.
- **Dashboard** (`/dashboard`) — the only fully functional module: symptom
  input, SOS button, 8 quick-action cards, health snapshot, recent activity,
  emergency contact card, all backed by fictional demo data.
- **12 placeholder modules** (`/symptoms`, `/instant-relief`, `/sos`,
  `/health-history`, `/emergency-card`, `/reports`, `/medications`, `/diet`,
  `/mental-wellness`, `/fitness`, `/specialists`, `/settings`) — each a
  polished "Coming Soon" page explaining what that module will provide.
  `/sos` gets a bespoke critical-themed version since it's the one module
  the brief calls out for its own UI foundation.
- **Responsive shell** — a fixed sidebar + top bar on desktop, a drawer menu
  with a persistent compact SOS button on mobile.
- **Demo mode** — all dashboard data comes from `lib/demo-data.ts`, clearly
  fictional, with a "Demo mode" badge shown in the shell.

## Project structure

```
app/
  page.tsx                 Landing page
  login/, signup/           Auth pages
  (app)/                    Route group sharing the sidebar/topbar shell
    layout.tsx
    dashboard/               Fully functional
    symptoms/, instant-relief/, sos/, health-history/, emergency-card/,
    reports/, medications/, diet/, mental-wellness/, fitness/,
    specialists/, settings/  Coming Soon placeholders
components/
  ui/                       Button, Card, Input, Label, Sheet, etc.
  Navbar, Sidebar, MobileNav, SOSButton, HealthSnapshot, QuickActionCard,
  RecentActivity, EmergencyContact, PageHeader, MedicalDisclaimer,
  ComingSoon, AuthShell, DemoModeBadge, PulseLine
lib/
  demo-data.ts              Fictional demo user/health data
  routes.ts                 Shared nav config
  supabase/client.ts         Placeholder for the next step's Supabase wiring
  utils.ts                  `cn()` class-merge helper
types/index.ts               Shared TypeScript types
```

## Design tokens

Defined as CSS variables in `app/globals.css` and mapped in
`tailwind.config.ts`: `primary` (deep teal), `secondary` (blue), `background`/
`card`/`border`, `muted`, `warning` (amber), and `critical` (red — SOS only).
Type: **Plus Jakarta Sans** for headings, **Inter** for body text, loaded via
`next/font/google`. The one recurring visual motif is `components/PulseLine.tsx`,
a small EKG-style line used in the hero and auth panel — kept deliberately rare.

## Ready for what's next

- `.env.local.example` lists the env vars later steps will need (Supabase,
  AI provider, emergency services, maps) — copy it to `.env.local` when
  those are wired up.
- `lib/supabase/client.ts` is a placeholder import site for real Supabase auth.
- Login/signup forms validate and navigate to `/dashboard`, with an inline
  note that real authentication isn't connected yet.

The next step adds the Patient Health Profile, Health History, Emergency
Contacts, and Emergency Health Card.
"# Medix" 

# Medix — AI Health & Emergency Response System

**Medix** is an intelligent AI health companion and emergency response platform built with a strictly separated Frontend and Backend architecture.

---

## Project Structure

```
medix/
├── frontend/                     # Next.js 14 App Router, React 18, Tailwind CSS
│   ├── app/                      # Application routes & layouts
│   │   ├── (app)/                # App shell routes (Dashboard, SOS, Health History, etc.)
│   │   ├── emergency/[id]/       # Public First-Responder Emergency Card view (from QR Code)
│   │   ├── login/, signup/       # Auth pages
│   │   └── ...
│   ├── components/               # React components (SOSButton, EmergencyHealthCard, etc.)
│   ├── lib/                      # Geolocation, emergency session hook, toast, context
│   ├── services/                 # API client (calls backend REST APIs)
│   ├── types/                    # TypeScript interfaces
│   ├── public/                   # Static assets
│   ├── package.json              # Frontend dependencies
│   └── .env.local.example        # NEXT_PUBLIC_API_URL, NEXT_PUBLIC_APP_URL
│
├── backend/                      # Node.js, Express, TypeScript REST API
│   ├── src/
│   │   ├── config/               # Environment configuration
│   │   ├── controllers/          # Request handlers (emergency, contacts, hospitals, assessment)
│   │   ├── middleware/           # CORS, validation, error handler
│   │   ├── models/               # DataStore & TypeScript schemas
│   │   ├── routes/               # Express routes (/api/emergency, /api/contacts, /api/hospitals)
│   │   ├── services/             # Emergency dispatch, Twilio SMS service, Overpass query
│   │   └── server.ts             # Express server entry point
│   ├── package.json              # Backend dependencies (express, cors, dotenv, zod, etc.)
│   ├── tsconfig.json
│   └── .env.example              # PORT, CORS_ORIGIN, TWILIO credentials, etc.
│
├── package.json                  # Root workspace script runner
└── README.md
```

---

## Getting Started

### 1. Prerequisites
- **Node.js** >= 18.17 (v20+ recommended)
- **npm** >= 9.0

---

### 2. Quick Start

#### Start Backend (Port 5000):
```bash
cd backend
npm install
npm run dev
```

#### Start Frontend (Port 3000):
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

### Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
APP_URL=http://localhost:3000

# Optional Twilio SMS Service:
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Hospital Search Service:
HOSPITAL_API_URL=https://overpass-api.de/api/interpreter
```

---

## Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend health check & status |
| `GET` | `/api/contacts` | Retrieve all saved emergency contacts |
| `POST` | `/api/contacts` | Add a new emergency contact (with phone validation) |
| `PUT` | `/api/contacts/:id` | Update an existing emergency contact |
| `DELETE` | `/api/contacts/:id` | Delete an emergency contact |
| `POST` | `/api/emergency/sos` | Trigger emergency SOS alert & dispatch contact notifications |
| `GET` | `/api/emergency/card/:id`| Public emergency profile for QR code scans |
| `GET` | `/api/emergency/logs` | Emergency session and alert logs |
| `GET` | `/api/emergency/status` | Current SMS provider status (live vs demo) |
| `GET` | `/api/hospitals` | Query nearby hospitals from OpenStreetMap Overpass |
| `POST` | `/api/symptom-assessment` | Clinical risk engine and symptom evaluation |

---

## Important Safety Rule

> **Truthful Emergency Messaging**: If an SMS provider (Twilio) is not configured in `backend/.env`, the backend explicitly reports `status: "unconfigured"` and logs the alert in Demo Mode. Medix **never** fakes successful cellular delivery.

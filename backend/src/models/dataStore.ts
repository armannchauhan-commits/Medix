import fs from "fs";
import path from "path";
import { EmergencyContact, EmergencyCardPublicData } from "./types.js";

const DATA_DIR = path.resolve(process.cwd(), "data");
const STORAGE_FILE = path.join(DATA_DIR, "storage.json");

interface StorageSchema {
  contacts: EmergencyContact[];
  emergencyLogs: any[];
  healthProfiles: Record<string, any>;
}

// Initial demo data matching Step 2 / Step 4 specs
const initialContacts: EmergencyContact[] = [
  {
    id: "contact-1",
    name: "Priya Sharma",
    relationship: "Spouse",
    phone: "+91 98765 43210",
    isPrimary: true,
    createdAt: new Date().toISOString(),
  },
];

const initialProfile: EmergencyCardPublicData = {
  id: "demo-user",
  personalInfo: {
    name: "Aarav Sharma",
    age: 29,
    gender: "Male",
  },
  medicalInfo: {
    bloodGroup: "O+",
    allergies: ["Penicillin", "Dust Mites"],
    conditions: ["Asthma (mild)", "Hypertension"],
    notes: "Carries inhaler in bag.",
    lastCheckup: "12 Aug 2026",
  },
  medications: [
    {
      id: "med-1",
      name: "Salbutamol Inhaler",
      dosage: "100 mcg",
      frequency: "As needed",
    },
    {
      id: "med-2",
      name: "Amlodipine",
      dosage: "5 mg",
      frequency: "Once daily (morning)",
    },
  ],
  emergencyContacts: [
    {
      name: "Priya Sharma",
      relationship: "Spouse",
      phone: "+91 98765 43210",
    },
  ],
  sharingPreferences: {
    bloodGroup: true,
    allergies: true,
    medications: true,
    conditions: true,
    emergencyContacts: true,
  },
  updatedAt: new Date().toISOString(),
};

class DataStore {
  private contacts: Map<string, EmergencyContact> = new Map();
  private emergencyLogs: any[] = [];
  private healthProfiles: Map<string, any> = new Map();

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(STORAGE_FILE)) {
        const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
        const data: StorageSchema = JSON.parse(raw);
        data.contacts.forEach((c) => this.contacts.set(c.id, c));
        this.emergencyLogs = data.emergencyLogs || [];
        Object.entries(data.healthProfiles || {}).forEach(([k, v]) => this.healthProfiles.set(k, v));
      } else {
        initialContacts.forEach((c) => this.contacts.set(c.id, c));
        this.healthProfiles.set("demo-user", initialProfile);
        this.saveToDisk();
      }
    } catch (err) {
      console.warn("[DataStore] Failed to load from disk, using in-memory defaults:", err);
      initialContacts.forEach((c) => this.contacts.set(c.id, c));
      this.healthProfiles.set("demo-user", initialProfile);
    }
  }

  private saveToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data: StorageSchema = {
        contacts: Array.from(this.contacts.values()),
        emergencyLogs: this.emergencyLogs,
        healthProfiles: Object.fromEntries(this.healthProfiles.entries()),
      };
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("[DataStore] Failed to save to disk:", err);
    }
  }

  // --- Contacts CRUD ---
  public getContacts(): EmergencyContact[] {
    return Array.from(this.contacts.values());
  }

  public getContactById(id: string): EmergencyContact | null {
    return this.contacts.get(id) || null;
  }

  public createContact(data: Omit<EmergencyContact, "id" | "createdAt" | "updatedAt">): EmergencyContact {
    const id = `contact-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();
    const contact: EmergencyContact = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.contacts.set(id, contact);
    this.saveToDisk();
    return contact;
  }

  public updateContact(id: string, data: Partial<Omit<EmergencyContact, "id" | "createdAt">>): EmergencyContact | null {
    const existing = this.contacts.get(id);
    if (!existing) return null;

    const updated: EmergencyContact = {
      ...existing,
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    this.contacts.set(id, updated);
    this.saveToDisk();
    return updated;
  }

  public deleteContact(id: string): boolean {
    const existed = this.contacts.delete(id);
    if (existed) {
      this.saveToDisk();
    }
    return existed;
  }

  // --- Emergency Logs ---
  public recordEmergencyAlert(alert: any) {
    this.emergencyLogs.unshift(alert);
    // Keep last 100 alerts
    if (this.emergencyLogs.length > 100) {
      this.emergencyLogs = this.emergencyLogs.slice(0, 100);
    }
    this.saveToDisk();
  }

  public getEmergencyLogs(): any[] {
    return this.emergencyLogs;
  }

  // --- Health Profile & Emergency Card ---
  public getHealthProfile(userId: string = "demo-user"): EmergencyCardPublicData | null {
    const profile = this.healthProfiles.get(userId) || this.healthProfiles.get("demo-user");
    if (!profile) return null;

    // Sync latest contacts into the emergency card
    profile.emergencyContacts = this.getContacts().map((c) => ({
      name: c.name,
      relationship: c.relationship,
      phone: c.phone,
    }));
    return profile;
  }

  public saveHealthProfile(userId: string, data: any) {
    this.healthProfiles.set(userId, { ...data, id: userId, updatedAt: new Date().toISOString() });
    this.saveToDisk();
  }
}

export const dataStore = new DataStore();

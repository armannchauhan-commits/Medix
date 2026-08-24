"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataStore = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DATA_DIR = path_1.default.resolve(process.cwd(), "data");
const STORAGE_FILE = path_1.default.join(DATA_DIR, "storage.json");
// Initial demo data matching Step 2 / Step 4 specs
const initialContacts = [
    {
        id: "contact-1",
        name: "Priya Sharma",
        relationship: "Spouse",
        phone: "+91 98765 43210",
        isPrimary: true,
        createdAt: new Date().toISOString(),
    },
];
const initialProfile = {
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
    contacts = new Map();
    emergencyLogs = [];
    healthProfiles = new Map();
    constructor() {
        this.loadFromDisk();
    }
    loadFromDisk() {
        try {
            if (!fs_1.default.existsSync(DATA_DIR)) {
                fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
            }
            if (fs_1.default.existsSync(STORAGE_FILE)) {
                const raw = fs_1.default.readFileSync(STORAGE_FILE, "utf-8");
                const data = JSON.parse(raw);
                data.contacts.forEach((c) => this.contacts.set(c.id, c));
                this.emergencyLogs = data.emergencyLogs || [];
                Object.entries(data.healthProfiles || {}).forEach(([k, v]) => this.healthProfiles.set(k, v));
            }
            else {
                initialContacts.forEach((c) => this.contacts.set(c.id, c));
                this.healthProfiles.set("demo-user", initialProfile);
                this.saveToDisk();
            }
        }
        catch (err) {
            console.warn("[DataStore] Failed to load from disk, using in-memory defaults:", err);
            initialContacts.forEach((c) => this.contacts.set(c.id, c));
            this.healthProfiles.set("demo-user", initialProfile);
        }
    }
    saveToDisk() {
        try {
            if (!fs_1.default.existsSync(DATA_DIR)) {
                fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
            }
            const data = {
                contacts: Array.from(this.contacts.values()),
                emergencyLogs: this.emergencyLogs,
                healthProfiles: Object.fromEntries(this.healthProfiles.entries()),
            };
            fs_1.default.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), "utf-8");
        }
        catch (err) {
            console.error("[DataStore] Failed to save to disk:", err);
        }
    }
    // --- Contacts CRUD ---
    getContacts() {
        return Array.from(this.contacts.values());
    }
    getContactById(id) {
        return this.contacts.get(id) || null;
    }
    createContact(data) {
        const id = `contact-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        const now = new Date().toISOString();
        const contact = {
            ...data,
            id,
            createdAt: now,
            updatedAt: now,
        };
        this.contacts.set(id, contact);
        this.saveToDisk();
        return contact;
    }
    updateContact(id, data) {
        const existing = this.contacts.get(id);
        if (!existing)
            return null;
        const updated = {
            ...existing,
            ...data,
            id,
            updatedAt: new Date().toISOString(),
        };
        this.contacts.set(id, updated);
        this.saveToDisk();
        return updated;
    }
    deleteContact(id) {
        const existed = this.contacts.delete(id);
        if (existed) {
            this.saveToDisk();
        }
        return existed;
    }
    // --- Emergency Logs ---
    recordEmergencyAlert(alert) {
        this.emergencyLogs.unshift(alert);
        // Keep last 100 alerts
        if (this.emergencyLogs.length > 100) {
            this.emergencyLogs = this.emergencyLogs.slice(0, 100);
        }
        this.saveToDisk();
    }
    getEmergencyLogs() {
        return this.emergencyLogs;
    }
    // --- Health Profile & Emergency Card ---
    getHealthProfile(userId = "demo-user") {
        const profile = this.healthProfiles.get(userId) || this.healthProfiles.get("demo-user");
        if (!profile)
            return null;
        // Sync latest contacts into the emergency card
        profile.emergencyContacts = this.getContacts().map((c) => ({
            name: c.name,
            relationship: c.relationship,
            phone: c.phone,
        }));
        return profile;
    }
    saveHealthProfile(userId, data) {
        this.healthProfiles.set(userId, { ...data, id: userId, updatedAt: new Date().toISOString() });
        this.saveToDisk();
    }
}
exports.dataStore = new DataStore();

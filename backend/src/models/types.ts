export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string | null;
  timestamp?: number;
}

export interface SOSRequestPayload {
  userId?: string;
  userName?: string;
  userPhone?: string;
  location?: UserLocation | null;
  message?: string;
  timestamp?: string;
}

export interface ContactNotificationResult {
  contactId: string;
  name: string;
  phone: string;
  relationship: string;
  status: "delivered" | "failed" | "unconfigured";
  messageId?: string;
  error?: string;
}

export interface SOSResponse {
  success: boolean;
  alertId: string;
  timestamp: string;
  status: "dispatched" | "partial" | "unconfigured" | "failed";
  message: string;
  userName: string;
  location: UserLocation | null;
  mapsUrl: string | null;
  contactsNotified: ContactNotificationResult[];
  smsProviderConfigured: boolean;
  emergencyCardUrl: string;
}

export interface EmergencyCardPublicData {
  id: string;
  personalInfo: {
    name: string;
    age: number | null;
    gender: string;
  };
  medicalInfo: {
    bloodGroup: string;
    allergies: string[];
    conditions: string[];
    lastCheckup?: string;
    notes?: string;
  };
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
  }>;
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
  }>;
  sharingPreferences: {
    bloodGroup: boolean;
    allergies: boolean;
    medications: boolean;
    conditions: boolean;
    emergencyContacts: boolean;
  };
  updatedAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  phone: string | null;
  distanceKm: number | null;
  rating: number | null;
  openingHours: string | null;
  emergencyStatus: string | null;
  bedStatus: string | null;
  icuStatus: string | null;
  source: "live" | "demo" | "unavailable";
  updatedAt: string;
}

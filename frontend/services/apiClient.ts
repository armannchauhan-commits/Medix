/**
 * Frontend API client communicating with Medix backend server.
 * Points to NEXT_PUBLIC_API_URL (default http://localhost:5000).
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ApiEmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary?: boolean;
}

export interface ApiSOSPayload {
  userId?: string;
  userName?: string;
  userPhone?: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    address?: string | null;
  } | null;
  message?: string;
  timestamp?: string;
}

export interface ApiSOSResponse {
  success: boolean;
  alertId: string;
  timestamp: string;
  status: "dispatched" | "partial" | "unconfigured" | "failed";
  message: string;
  userName: string;
  location: any;
  mapsUrl: string | null;
  contactsNotified: Array<{
    contactId: string;
    name: string;
    phone: string;
    relationship: string;
    status: "delivered" | "failed" | "unconfigured";
    error?: string;
  }>;
  smsProviderConfigured: boolean;
  emergencyCardUrl: string;
}

export interface ApiEmergencyCardData {
  id: string;
  personalInfo: {
    name: string;
    age: number | null;
    gender: string;
  };
  bloodGroup: string | null;
  allergies: string[];
  conditions: string[];
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
  notes?: string;
  lastCheckup?: string;
  sharingPreferences: {
    bloodGroup: boolean;
    allergies: boolean;
    medications: boolean;
    conditions: boolean;
    emergencyContacts: boolean;
  };
  updatedAt: string;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `HTTP error ${res.status}`);
  }
  return data;
}

export const apiClient = {
  // --- Contacts API ---
  getContacts: async (): Promise<ApiEmergencyContact[]> => {
    try {
      const res = await request<{ success: boolean; data: ApiEmergencyContact[] }>("/api/contacts");
      return res.data || [];
    } catch (err) {
      console.warn("[apiClient] Failed to fetch contacts from backend:", err);
      throw err;
    }
  },

  createContact: async (contact: Omit<ApiEmergencyContact, "id">): Promise<ApiEmergencyContact> => {
    const res = await request<{ success: boolean; data: ApiEmergencyContact }>("/api/contacts", {
      method: "POST",
      body: JSON.stringify(contact),
    });
    return res.data;
  },

  updateContact: async (id: string, contact: Partial<ApiEmergencyContact>): Promise<ApiEmergencyContact> => {
    const res = await request<{ success: boolean; data: ApiEmergencyContact }>(`/api/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify(contact),
    });
    return res.data;
  },

  deleteContact: async (id: string): Promise<boolean> => {
    const res = await request<{ success: boolean }>(`/api/contacts/${id}`, {
      method: "DELETE",
    });
    return res.success;
  },

  // --- Emergency / SOS API ---
  triggerSOS: async (payload: ApiSOSPayload): Promise<ApiSOSResponse> => {
    return await request<ApiSOSResponse>("/api/emergency/sos", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getEmergencyCard: async (id: string = "demo-user"): Promise<ApiEmergencyCardData> => {
    const res = await request<{ success: boolean; data: ApiEmergencyCardData }>(`/api/emergency/card/${id}`);
    return res.data;
  },

  getBackendStatus: async () => {
    return await request<{
      success: boolean;
      smsConfigured: boolean;
      mode: "live" | "demo";
      message: string;
    }>("/api/emergency/status");
  },
};

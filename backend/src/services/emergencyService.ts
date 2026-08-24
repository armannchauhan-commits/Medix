import { config } from "../config/index.js";
import { dataStore } from "../models/dataStore.js";
import {
  SOSRequestPayload,
  SOSResponse,
  ContactNotificationResult,
} from "../models/types.js";
import { sendEmergencySMS } from "./smsService.js";

/**
 * Generates human-readable maps link from coordinates.
 */
export function generateMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

/**
 * Builds the text content of the emergency SMS/message.
 */
export function buildEmergencyAlertMessage(opts: {
  userName: string;
  timestamp: string;
  mapsUrl: string | null;
  locationAddress?: string | null;
  emergencyCardUrl: string;
}): string {
  const { userName, timestamp, mapsUrl, locationAddress, emergencyCardUrl } = opts;
  const timeFormatted = new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const locationText = mapsUrl
    ? `Location: ${mapsUrl}${locationAddress ? ` (${locationAddress})` : ""}`
    : "Location: Not available";

  return `🚨 MEDIX EMERGENCY ALERT 🚨\n\n${userName} has triggered an SOS Emergency Alert at ${timeFormatted}.\n\n${locationText}\n\nView Medical Info & Emergency Card:\n${emergencyCardUrl}\n\nPlease check on them or contact emergency services immediately.`;
}

/**
 * Processes an incoming SOS activation from the user.
 */
export async function processSOSAlert(payload: SOSRequestPayload): Promise<SOSResponse> {
  const now = new Date().toISOString();
  const alertId = `sos-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const userName = payload.userName?.trim() || "Medix User";
  const userId = payload.userId || "demo-user";

  const contacts = dataStore.getContacts();

  const mapsUrl = payload.location?.latitude && payload.location?.longitude
    ? generateMapsUrl(payload.location.latitude, payload.location.longitude)
    : null;

  const emergencyCardUrl = `${config.appUrl}/emergency/${userId}`;

  const alertMessage = buildEmergencyAlertMessage({
    userName,
    timestamp: now,
    mapsUrl,
    locationAddress: payload.location?.address,
    emergencyCardUrl,
  });

  const contactsNotified: ContactNotificationResult[] = [];

  // Attempt to notify all saved emergency contacts
  for (const contact of contacts) {
    const result = await sendEmergencySMS({
      to: contact.phone,
      message: alertMessage,
    });

    contactsNotified.push({
      contactId: contact.id,
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      status: result.status,
      messageId: result.messageId,
      error: result.error,
    });
  }

  // Determine overall dispatch status
  let overallStatus: SOSResponse["status"] = "unconfigured";
  if (contacts.length === 0) {
    overallStatus = "unconfigured";
  } else if (contactsNotified.every((c) => c.status === "delivered")) {
    overallStatus = "dispatched";
  } else if (contactsNotified.some((c) => c.status === "delivered")) {
    overallStatus = "partial";
  } else if (contactsNotified.every((c) => c.status === "unconfigured")) {
    overallStatus = "unconfigured";
  } else {
    overallStatus = "failed";
  }

  const sosRecord: SOSResponse = {
    success: true,
    alertId,
    timestamp: now,
    status: overallStatus,
    message:
      overallStatus === "dispatched"
        ? `Emergency alerts sent to ${contactsNotified.length} contact(s).`
        : overallStatus === "unconfigured"
        ? `SOS activated and logged. SMS gateway is not configured (demo mode active).`
        : `SOS processed with status: ${overallStatus}.`,
    userName,
    location: payload.location || null,
    mapsUrl,
    contactsNotified,
    smsProviderConfigured: config.twilio.isConfigured,
    emergencyCardUrl,
  };

  // Record in backend data store log
  dataStore.recordEmergencyAlert(sosRecord);

  return sosRecord;
}

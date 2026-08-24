"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmergencySMS = sendEmergencySMS;
const index_js_1 = require("../config/index.js");
/**
 * SMS service for dispatching emergency alerts to saved emergency contacts.
 *
 * SAFETY RULE (Step 6):
 * If Twilio or another SMS gateway is not configured via environment variables,
 * we MUST return status: "unconfigured" with an explicit message. We NEVER pretend
 * an SMS was successfully delivered to a mobile carrier when credentials are missing.
 */
async function sendEmergencySMS(params) {
    const { to, message } = params;
    if (!index_js_1.config.twilio.isConfigured) {
        console.warn(`[smsService] SMS provider not configured. Simulated dispatch to ${to}: "${message.slice(0, 60)}..."`);
        return {
            sent: false,
            status: "unconfigured",
            error: "SMS provider is not configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to backend/.env to enable live cellular dispatch.",
        };
    }
    try {
        const authString = Buffer.from(`${index_js_1.config.twilio.accountSid}:${index_js_1.config.twilio.authToken}`).toString("base64");
        const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${index_js_1.config.twilio.accountSid}/Messages.json`;
        const formParams = new URLSearchParams();
        formParams.append("To", to);
        formParams.append("From", index_js_1.config.twilio.phoneNumber);
        formParams.append("Body", message);
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                Authorization: `Basic ${authString}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formParams.toString(),
        });
        const data = (await response.json());
        if (!response.ok) {
            console.error("[smsService] Twilio API error:", data);
            return {
                sent: false,
                status: "failed",
                error: data.message || `Twilio error ${response.status}`,
            };
        }
        console.info(`[smsService] SMS successfully dispatched to ${to}. Message SID: ${data.sid}`);
        return {
            sent: true,
            status: "delivered",
            messageId: data.sid,
        };
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("[smsService] Network/dispatch error:", errorMessage);
        return {
            sent: false,
            status: "failed",
            error: errorMessage,
        };
    }
}

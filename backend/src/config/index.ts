import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  appUrl: process.env.APP_URL || "http://localhost:3000",
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || "",
    isConfigured: Boolean(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
    ),
  },
  hospitalApiUrl: process.env.HOSPITAL_API_URL || "https://overpass-api.de/api/interpreter",
  aiProvider: {
    apiKey: process.env.AI_PROVIDER_API_KEY || "",
    apiUrl: process.env.AI_PROVIDER_API_URL || "https://api.anthropic.com/v1/messages",
    model: process.env.AI_PROVIDER_MODEL || "claude-3-5-sonnet-20241022",
    isConfigured: Boolean(process.env.AI_PROVIDER_API_KEY),
  },
};

import { Request, Response, NextFunction } from "express";
import { config } from "../config/index.js";
import { dataStore } from "../models/dataStore.js";
import { processSOSAlert } from "../services/emergencyService.js";

export const emergencyController = {
  triggerSOS: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, userName, userPhone, location, message, timestamp } = req.body;

      const result = await processSOSAlert({
        userId,
        userName,
        userPhone,
        location,
        message,
        timestamp,
      });

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  getEmergencyCard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const profile = dataStore.getHealthProfile(id || "demo-user");

      if (!profile) {
        return res.status(404).json({ success: false, error: "Emergency card profile not found" });
      }

      // Filter fields according to user's sharing preferences for first responders
      const filteredCard = {
        id: profile.id,
        personalInfo: profile.personalInfo,
        bloodGroup: profile.sharingPreferences.bloodGroup ? profile.medicalInfo.bloodGroup : null,
        allergies: profile.sharingPreferences.allergies ? profile.medicalInfo.allergies : [],
        conditions: profile.sharingPreferences.conditions ? profile.medicalInfo.conditions : [],
        medications: profile.sharingPreferences.medications ? profile.medications : [],
        emergencyContacts: profile.sharingPreferences.emergencyContacts ? profile.emergencyContacts : [],
        notes: profile.medicalInfo.notes,
        lastCheckup: profile.medicalInfo.lastCheckup,
        sharingPreferences: profile.sharingPreferences,
        updatedAt: profile.updatedAt,
      };

      res.json({ success: true, data: filteredCard });
    } catch (err) {
      next(err);
    }
  },

  getEmergencyLogs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = dataStore.getEmergencyLogs();
      res.json({ success: true, count: logs.length, data: logs });
    } catch (err) {
      next(err);
    }
  },

  getStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        success: true,
        smsConfigured: config.twilio.isConfigured,
        appUrl: config.appUrl,
        mode: config.twilio.isConfigured ? "live" : "demo",
        message: config.twilio.isConfigured
          ? "Cellular SMS emergency service is live."
          : "SMS provider not configured. Emergency alerts will log and run in demo mode.",
      });
    } catch (err) {
      next(err);
    }
  },
};

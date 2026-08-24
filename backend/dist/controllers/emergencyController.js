"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emergencyController = void 0;
const index_js_1 = require("../config/index.js");
const dataStore_js_1 = require("../models/dataStore.js");
const emergencyService_js_1 = require("../services/emergencyService.js");
exports.emergencyController = {
    triggerSOS: async (req, res, next) => {
        try {
            const { userId, userName, userPhone, location, message, timestamp } = req.body;
            const result = await (0, emergencyService_js_1.processSOSAlert)({
                userId,
                userName,
                userPhone,
                location,
                message,
                timestamp,
            });
            res.status(200).json(result);
        }
        catch (err) {
            next(err);
        }
    },
    getEmergencyCard: async (req, res, next) => {
        try {
            const { id } = req.params;
            const profile = dataStore_js_1.dataStore.getHealthProfile(id || "demo-user");
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
        }
        catch (err) {
            next(err);
        }
    },
    getEmergencyLogs: async (req, res, next) => {
        try {
            const logs = dataStore_js_1.dataStore.getEmergencyLogs();
            res.json({ success: true, count: logs.length, data: logs });
        }
        catch (err) {
            next(err);
        }
    },
    getStatus: async (req, res, next) => {
        try {
            res.json({
                success: true,
                smsConfigured: index_js_1.config.twilio.isConfigured,
                appUrl: index_js_1.config.appUrl,
                mode: index_js_1.config.twilio.isConfigured ? "live" : "demo",
                message: index_js_1.config.twilio.isConfigured
                    ? "Cellular SMS emergency service is live."
                    : "SMS provider not configured. Emergency alerts will log and run in demo mode.",
            });
        }
        catch (err) {
            next(err);
        }
    },
};

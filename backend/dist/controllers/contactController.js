"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactController = void 0;
exports.validatePhone = validatePhone;
const dataStore_js_1 = require("../models/dataStore.js");
// Flexible international / local phone number validation
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
function validatePhone(phone) {
    const cleaned = phone.replace(/[\s\-()]/g, "");
    return PHONE_REGEX.test(phone) && cleaned.length >= 7 && cleaned.length <= 16;
}
exports.contactController = {
    getContacts: async (req, res, next) => {
        try {
            const contacts = dataStore_js_1.dataStore.getContacts();
            res.json({ success: true, count: contacts.length, data: contacts });
        }
        catch (err) {
            next(err);
        }
    },
    getContactById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const contact = dataStore_js_1.dataStore.getContactById(id);
            if (!contact) {
                return res.status(404).json({ success: false, error: "Contact not found" });
            }
            res.json({ success: true, data: contact });
        }
        catch (err) {
            next(err);
        }
    },
    createContact: async (req, res, next) => {
        try {
            const { name, relationship, phone, isPrimary } = req.body;
            if (!name || typeof name !== "string" || !name.trim()) {
                return res.status(400).json({ success: false, error: "Contact name is required." });
            }
            if (!relationship || typeof relationship !== "string" || !relationship.trim()) {
                return res.status(400).json({ success: false, error: "Relationship is required." });
            }
            if (!phone || typeof phone !== "string" || !phone.trim()) {
                return res.status(400).json({ success: false, error: "Phone number is required." });
            }
            if (!validatePhone(phone.trim())) {
                return res.status(400).json({
                    success: false,
                    error: "Please enter a valid phone number (e.g. +91 98765 43210 or 10-15 digits).",
                });
            }
            const newContact = dataStore_js_1.dataStore.createContact({
                name: name.trim(),
                relationship: relationship.trim(),
                phone: phone.trim(),
                isPrimary: Boolean(isPrimary),
            });
            res.status(201).json({ success: true, message: "Contact added successfully", data: newContact });
        }
        catch (err) {
            next(err);
        }
    },
    updateContact: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, relationship, phone, isPrimary } = req.body;
            const updates = {};
            if (name !== undefined) {
                if (!name.trim()) {
                    return res.status(400).json({ success: false, error: "Contact name cannot be empty." });
                }
                updates.name = name.trim();
            }
            if (relationship !== undefined) {
                if (!relationship.trim()) {
                    return res.status(400).json({ success: false, error: "Relationship cannot be empty." });
                }
                updates.relationship = relationship.trim();
            }
            if (phone !== undefined) {
                if (!phone.trim()) {
                    return res.status(400).json({ success: false, error: "Phone number cannot be empty." });
                }
                if (!validatePhone(phone.trim())) {
                    return res.status(400).json({
                        success: false,
                        error: "Please enter a valid phone number.",
                    });
                }
                updates.phone = phone.trim();
            }
            if (isPrimary !== undefined) {
                updates.isPrimary = Boolean(isPrimary);
            }
            const updated = dataStore_js_1.dataStore.updateContact(id, updates);
            if (!updated) {
                return res.status(404).json({ success: false, error: "Contact not found" });
            }
            res.json({ success: true, message: "Contact updated successfully", data: updated });
        }
        catch (err) {
            next(err);
        }
    },
    deleteContact: async (req, res, next) => {
        try {
            const { id } = req.params;
            const deleted = dataStore_js_1.dataStore.deleteContact(id);
            if (!deleted) {
                return res.status(404).json({ success: false, error: "Contact not found" });
            }
            res.json({ success: true, message: "Contact deleted successfully", id });
        }
        catch (err) {
            next(err);
        }
    },
};

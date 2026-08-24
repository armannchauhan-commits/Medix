import { Request, Response, NextFunction } from "express";
import { dataStore } from "../models/dataStore.js";

// Flexible international / local phone number validation
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return PHONE_REGEX.test(phone) && cleaned.length >= 7 && cleaned.length <= 16;
}

export const contactController = {
  getContacts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contacts = dataStore.getContacts();
      res.json({ success: true, count: contacts.length, data: contacts });
    } catch (err) {
      next(err);
    }
  },

  getContactById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const contact = dataStore.getContactById(id);
      if (!contact) {
        return res.status(404).json({ success: false, error: "Contact not found" });
      }
      res.json({ success: true, data: contact });
    } catch (err) {
      next(err);
    }
  },

  createContact: async (req: Request, res: Response, next: NextFunction) => {
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

      const newContact = dataStore.createContact({
        name: name.trim(),
        relationship: relationship.trim(),
        phone: phone.trim(),
        isPrimary: Boolean(isPrimary),
      });

      res.status(201).json({ success: true, message: "Contact added successfully", data: newContact });
    } catch (err) {
      next(err);
    }
  },

  updateContact: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, relationship, phone, isPrimary } = req.body;

      const updates: any = {};
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

      const updated = dataStore.updateContact(id, updates);
      if (!updated) {
        return res.status(404).json({ success: false, error: "Contact not found" });
      }

      res.json({ success: true, message: "Contact updated successfully", data: updated });
    } catch (err) {
      next(err);
    }
  },

  deleteContact: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleted = dataStore.deleteContact(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: "Contact not found" });
      }
      res.json({ success: true, message: "Contact deleted successfully", id });
    } catch (err) {
      next(err);
    }
  },
};
